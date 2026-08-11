/**
 * Bakes the generated SVG textures to JPEG.
 *
 * The SVGs lean on feTurbulence and feDiffuseLighting, which are expensive to
 * rasterize on every paint — especially on phones. Shipping flattened JPEGs
 * keeps the imagery identical while moving that cost to build time. The SVGs
 * in public/textures remain the editable source.
 *
 * Requires Playwright, which is intentionally not a project dependency — this
 * is a one-off asset step, not part of `next build`:
 *
 *   npm i -D playwright && node scripts/rasterize-textures.mjs
 */

import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "textures");
const OUT = join(ROOT, "public", "textures");

/** Output widths, keeping each source's own aspect ratio. */
const MAX_WIDTH = 1600;
const QUALITY = 82;

// Honour a preinstalled Chromium when the local Playwright build differs from
// the one on the machine.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(SRC).filter((f) => f.endsWith(".svg"))) {
  const markup = readFileSync(join(SRC, file), "utf8");
  const w = Number(markup.match(/width="(\d+)"/)[1]);
  const h = Number(markup.match(/height="(\d+)"/)[1]);
  const scale = Math.min(1, MAX_WIDTH / w);
  const outW = Math.round(w * scale);
  const outH = Math.round(h * scale);

  const page = await browser.newPage({ viewport: { width: outW, height: outH } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;overflow:hidden;background:#000}svg{display:block;width:${outW}px;height:${outH}px}</style>${markup}`,
    { waitUntil: "load" },
  );
  const name = `${basename(file, ".svg")}.jpg`;
  await page.screenshot({ path: join(OUT, name), type: "jpeg", quality: QUALITY });
  await page.close();
  console.log(`${file} -> ${name} (${outW}x${outH})`);
}

await browser.close();
