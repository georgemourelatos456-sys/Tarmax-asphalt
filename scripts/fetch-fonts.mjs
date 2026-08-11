/**
 * Downloads the two brand typefaces into the repo.
 *
 * The fonts are self-hosted rather than pulled through next/font/google so
 * that `next build` has no network dependency and visitors make no
 * third-party request. Run this only when changing weights or updating a face:
 *
 *   node scripts/fetch-fonts.mjs
 *
 * Both families are SIL Open Font License 1.1, which permits redistribution.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "fonts");

// A browser UA gets the woff2 variable builds rather than legacy formats.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FAMILIES = [
  { file: "Manrope-Variable.woff2", query: "Manrope:wght@500..800" },
  { file: "Inter-Variable.woff2", query: "Inter:wght@400..700" },
];

/** Pulls the URL from the `latin` block — the only subset this site needs. */
function latinUrl(css) {
  const blocks = css.split("@font-face").slice(1);
  for (const block of blocks) {
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1] ?? "";
    // The latin block is the one containing U+0000-00FF and not marked -ext.
    if (range.includes("U+0000-00FF")) {
      const url = block.match(/src:\s*url\(([^)]+)\)/)?.[1];
      if (url) return url;
    }
  }
  throw new Error("No latin subset found in the stylesheet.");
}

mkdirSync(OUT, { recursive: true });

for (const { file, query } of FAMILIES) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(query)}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": UA } }).then((r) => {
    if (!r.ok) throw new Error(`${cssUrl} -> ${r.status}`);
    return r.text();
  });

  const url = latinUrl(css);
  const buffer = await fetch(url, { headers: { "User-Agent": UA } }).then((r) => {
    if (!r.ok) throw new Error(`${url} -> ${r.status}`);
    return r.arrayBuffer();
  });

  writeFileSync(join(OUT, file), Buffer.from(buffer));
  console.log(`${file}  ${(buffer.byteLength / 1024).toFixed(1)} KB`);
}
