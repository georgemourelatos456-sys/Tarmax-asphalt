/**
 * Builds the TARMAX wordmark as a vector asset.
 *
 * The supplied logo is a heavy oblique grotesque — the motorsport register the
 * brief asks for. Rather than embed a raster, the letterforms are constructed
 * parametrically from polygons and sheared, so the mark stays sharp at any
 * size, weighs about 4KB, and can be recoloured through currentColor.
 *
 *   node scripts/generate-logo.mjs
 *
 * Letters are drawn upright with the baseline at y=100, then sheared. Shapes
 * are unions of simple quads under the nonzero fill rule; counters (the holes
 * in A, R, P) fall out of the geometry rather than being cut.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "brand");

const CAP = 100;
const SHEAR = 0.22; // ~12deg lean

/** Glyphs as { width, parts: polygon[] }, each polygon a list of [x, y]. */
const GLYPHS = {
  T: {
    width: 78,
    parts: [[[0, 0], [78, 0], [78, 30], [54, 30], [54, 100], [24, 100], [24, 30], [0, 30]]],
  },
  A: {
    width: 86,
    parts: [
      [[28, 0], [43, 0], [26, 100], [0, 100]],
      [[43, 0], [58, 0], [86, 100], [60, 100]],
      [[17, 68], [69, 68], [64, 90], [22, 90]],
    ],
  },
  R: {
    width: 88,
    parts: [
      [[0, 0], [30, 0], [30, 100], [0, 100]],
      [[30, 0], [82, 0], [82, 24], [30, 24]],
      [[30, 38], [82, 38], [82, 58], [30, 58]],
      [[56, 0], [82, 0], [82, 58], [56, 58]],
      [[46, 50], [74, 50], [88, 100], [58, 100]],
    ],
  },
  M: {
    width: 118,
    parts: [
      [[0, 0], [30, 0], [30, 100], [0, 100]],
      [[88, 0], [118, 0], [118, 100], [88, 100]],
      [[20, 0], [46, 0], [68, 72], [50, 72]],
      [[72, 0], [98, 0], [68, 72], [50, 72]],
    ],
  },
  X: {
    width: 92,
    parts: [
      [[0, 0], [30, 0], [92, 100], [62, 100]],
      [[62, 0], [92, 0], [30, 100], [0, 100]],
    ],
  },
  S: {
    width: 82,
    parts: [
      [[10, 0], [82, 0], [82, 24], [10, 24]],
      [[0, 10], [26, 10], [26, 52], [0, 52]],
      [[0, 38], [82, 38], [82, 60], [0, 60]],
      [[56, 50], [82, 50], [82, 92], [56, 92]],
      [[0, 76], [72, 76], [72, 100], [0, 100]],
    ],
  },
  P: {
    width: 84,
    parts: [
      [[0, 0], [30, 0], [30, 100], [0, 100]],
      [[30, 0], [84, 0], [84, 24], [30, 24]],
      [[30, 40], [84, 40], [84, 62], [30, 62]],
      [[58, 0], [84, 0], [84, 62], [58, 62]],
    ],
  },
  H: {
    width: 100,
    parts: [
      [[0, 0], [30, 0], [30, 100], [0, 100]],
      [[70, 0], [100, 0], [100, 100], [70, 100]],
      [[24, 38], [76, 38], [76, 62], [24, 62]],
    ],
  },
  L: {
    width: 76,
    parts: [
      [[0, 0], [30, 0], [30, 100], [0, 100]],
      [[24, 76], [76, 76], [76, 100], [24, 100]],
    ],
  },
};

const TRACKING = 7;

/** Renders a word into a single path string, sheared and positioned. */
function word(text, { scale, originX, baselineY }) {
  let cursor = 0;
  const segments = [];

  for (const char of text) {
    const glyph = GLYPHS[char];
    if (!glyph) throw new Error(`No glyph for "${char}"`);

    for (const poly of glyph.parts) {
      const pts = poly.map(([x, y]) => {
        // Shear about the baseline so the lean grows toward the cap line.
        const sheared = x + SHEAR * (CAP - y);
        return [
          (originX + (cursor + sheared) * scale).toFixed(2),
          (baselineY - (CAP - y) * scale).toFixed(2),
        ];
      });
      segments.push(`M${pts.map((p) => p.join(",")).join(" L")} Z`);
    }
    cursor += glyph.width + TRACKING;
  }

  return { path: segments.join(" "), advance: cursor - TRACKING };
}

/** A flanking dash: a sheared bar matching the oblique of the letters. */
function dash(x, y, length, thickness) {
  const lean = SHEAR * thickness;
  return `M${x + lean},${y} L${x + lean + length},${y} L${x + length},${y + thickness} L${x},${y + thickness} Z`;
}

function build() {
  const primaryScale = 1;
  const primary = word("TARMAX", { scale: primaryScale, originX: 0, baselineY: 100 });

  // "ASPHALT" is set smaller and tracked out to the width of TARMAX.
  const subScale = 0.4;
  const sub = word("ASPHALT", { scale: subScale, originX: 0, baselineY: 168 });
  const subWidth = sub.advance * subScale;

  // Centre the lower lockup, then flank it with dashes out to the full width.
  const totalWidth = primary.advance + SHEAR * CAP;
  const subOffset = (totalWidth - subWidth) / 2;
  const subCentred = word("ASPHALT", { scale: subScale, originX: subOffset, baselineY: 168 });

  const dashThickness = 40 * subScale;
  const dashY = 168 - 40 * subScale - 4;
  const gap = 22;
  const leftDashLength = Math.max(0, subOffset - gap);
  const rightDashStart = subOffset + subWidth + gap;
  const rightDashLength = Math.max(0, totalWidth - rightDashStart);

  const paths = [
    primary.path,
    subCentred.path,
    dash(0, dashY, leftDashLength, dashThickness),
    dash(rightDashStart, dashY, rightDashLength, dashThickness),
  ].join(" ");

  const height = 176;
  // Referenced through <img>, where currentColor has nothing to inherit from,
  // so each variant carries an explicit fill.
  const render = (fill) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth.toFixed(1)} ${height}" fill="${fill}" role="img">
  <title>TARMAX Asphalt</title>
  <path d="${paths}"/>
</svg>
`;

  return { render, width: totalWidth, height };
}

mkdirSync(OUT, { recursive: true });
const { render, width, height } = build();

const VARIANTS = {
  "tarmax-logo.svg": "#C8171E",
  "tarmax-logo-mono.svg": "#F4F2ED",
};

for (const [name, fill] of Object.entries(VARIANTS)) {
  writeFileSync(join(OUT, name), render(fill), "utf8");
  console.log(`wrote ${name}`);
}
console.log(`intrinsic size: ${width.toFixed(0)} x ${height}`);
