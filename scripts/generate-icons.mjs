/**
 * Builds the browser and home-screen icons.
 *
 * The full wordmark is illegible at 32px, so the icon is just the T from it —
 * same oblique geometry, same red — sitting on the brand's ink. That keeps the
 * tab recognisable at favicon size while still reading as TARMAX.
 *
 *   node scripts/generate-icons.mjs                 # writes icon.svg
 *   CHROMIUM_PATH=... node scripts/generate-icons.mjs --png   # + apple-icon
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app");

const INK = "#0B0B0C";
const RED = "#C8171E";

// The T from scripts/generate-logo.mjs, in the same 0-100 cap-height space.
const T = [
  [0, 0],
  [78, 0],
  [78, 30],
  [54, 30],
  [54, 100],
  [24, 100],
  [24, 30],
  [0, 30],
];
const SHEAR = 0.22;
const CAP = 100;

/** Shears the glyph, then fits it into a padded square canvas. */
function glyphPath(size, padding) {
  const sheared = T.map(([x, y]) => [x + SHEAR * (CAP - y), y]);
  const xs = sheared.map((p) => p[0]);
  const w = Math.max(...xs) - Math.min(...xs);
  const minX = Math.min(...xs);

  const inner = size - padding * 2;
  const scale = Math.min(inner / w, inner / CAP);
  const offsetX = padding + (inner - w * scale) / 2;
  const offsetY = padding + (inner - CAP * scale) / 2;

  return sheared
    .map(([x, y], i) => {
      const px = (offsetX + (x - minX) * scale).toFixed(2);
      const py = (offsetY + y * scale).toFixed(2);
      return `${i === 0 ? "M" : "L"}${px},${py}`;
    })
    .join(" ")
    .concat(" Z");
}

function icon(size, padding) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${INK}"/>
  <path d="${glyphPath(size, padding)}" fill="${RED}"/>
</svg>
`;
}

mkdirSync(APP, { recursive: true });
writeFileSync(join(APP, "icon.svg"), icon(64, 9), "utf8");
console.log("wrote src/app/icon.svg");

if (process.argv.includes("--png")) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  const size = 180;
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}</style>${icon(size, 26)}`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: join(APP, "apple-icon.png"), type: "png" });
  await browser.close();
  console.log("wrote src/app/apple-icon.png");
}
