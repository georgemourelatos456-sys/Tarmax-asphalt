/**
 * Generates the site's asphalt imagery as SVG.
 *
 * TARMAX has no photo library, and stock construction photography is exactly
 * the look the brand is trying to avoid. Instead the imagery is the material
 * itself: layered fractal noise run through a diffuse-lighting filter, which
 * produces genuine aggregate relief rather than flat grain. Each surface state
 * the business sells against — sealed, oxidized, cracked, potholed — gets its
 * own tuned variant.
 *
 * Output is deterministic (every turbulence node is seeded), so regenerating
 * never produces a spurious diff.
 *
 *   node scripts/generate-textures.mjs
 *
 * The SVGs are the source of truth. `scripts/rasterize-textures.mjs` bakes
 * them to JPEG for production so browsers never pay filter cost at paint time.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "textures");

/** Deterministic PRNG so crack geometry is stable across runs. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * The core asphalt surface: fractal noise treated as a height field and lit
 * from a fixed angle, blended with a coarse blotch pass for the uneven
 * patchiness real pavement has.
 */
function surfaceFilter({
  id,
  grainFreq,
  grainOctaves,
  grainSeed,
  surfaceScale,
  lightColor,
  blotchFreq,
  blotchSeed,
  blotchStrength,
  contrast = 1,
  brightness = 0,
}) {
  return `
  <filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${grainFreq}" numOctaves="${grainOctaves}" seed="${grainSeed}" result="grain"/>
    <feDiffuseLighting in="grain" lighting-color="${lightColor}" surfaceScale="${surfaceScale}" diffuseConstant="1" result="lit">
      <feDistantLight azimuth="228" elevation="52"/>
    </feDiffuseLighting>
    <feTurbulence type="fractalNoise" baseFrequency="${blotchFreq}" numOctaves="3" seed="${blotchSeed}" result="blotchRaw"/>
    <feColorMatrix in="blotchRaw" type="saturate" values="0" result="blotchGray"/>
    <feComponentTransfer in="blotchGray" result="blotch">
      <feFuncR type="linear" slope="${blotchStrength}" intercept="${1 - blotchStrength / 2}"/>
      <feFuncG type="linear" slope="${blotchStrength}" intercept="${1 - blotchStrength / 2}"/>
      <feFuncB type="linear" slope="${blotchStrength}" intercept="${1 - blotchStrength / 2}"/>
    </feComponentTransfer>
    <feBlend in="lit" in2="blotch" mode="multiply" result="mixed"/>
    <feComponentTransfer in="mixed" result="graded">
      <feFuncR type="linear" slope="${contrast}" intercept="${brightness}"/>
      <feFuncG type="linear" slope="${contrast}" intercept="${brightness}"/>
      <feFuncB type="linear" slope="${contrast}" intercept="${brightness}"/>
    </feComponentTransfer>
    <feComposite in="graded" in2="SourceGraphic" operator="in"/>
  </filter>`;
}

/** Roughens crack edges so they read as fractured, not drawn. */
function roughenFilter(id, seed, scale) {
  return `
  <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="${seed}" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
  </filter>`;
}

/**
 * A crack path that wanders down (or across) the surface, occasionally
 * throwing off a short branch — the way real thermal cracking propagates.
 */
function crackPath(seed, { length, drift, steps, start }) {
  const rand = rng(seed);
  const pts = [start];
  let [x, y] = start;
  for (let i = 0; i < steps; i += 1) {
    y += length / steps;
    x += (rand() - 0.5) * drift;
    pts.push([x, y]);
  }
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  const branches = [];
  for (let i = 2; i < pts.length - 2; i += 1) {
    if (rand() > 0.72) {
      const [bx, by] = pts[i];
      const dir = rand() > 0.5 ? 1 : -1;
      const len = 18 + rand() * 55;
      branches.push(
        `M${bx.toFixed(1)},${by.toFixed(1)} L${(bx + dir * len * 0.7).toFixed(1)},${(by + len * 0.5).toFixed(1)}`,
      );
    }
  }
  return { main: d, branches, points: pts };
}

/**
 * Closed Catmull-Rom spline through polar samples. Potholes are rounded and
 * irregular, not spiky — sampling sparsely and interpolating smoothly gives
 * an organic outline, and the displacement filter supplies the broken edge.
 */
function blobPath(cx, cy, radius, { samples, jitter, squash, rand }) {
  const pts = [];
  for (let i = 0; i < samples; i += 1) {
    const a = (i / samples) * Math.PI * 2;
    const r = radius * (1 + (rand() - 0.5) * jitter);
    pts.push([cx + Math.cos(a) * r * squash, cy + Math.sin(a) * r]);
  }
  const at = (i) => pts[(i + pts.length) % pts.length];
  let d = `M${at(0)[0].toFixed(1)},${at(0)[1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

function svg(width, height, body, defs) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="presentation">
  <defs>${defs}</defs>
${body}
</svg>
`;
}

/** Soft directional darkening so flat texture reads as a photographed plane. */
function vignette(id, from, to, opacity) {
  return `
  <linearGradient id="${id}" x1="0" y1="0" x2="0.35" y2="1">
    <stop offset="0" stop-color="${from}" stop-opacity="0"/>
    <stop offset="1" stop-color="${to}" stop-opacity="${opacity}"/>
  </linearGradient>`;
}

// --- Surfaces --------------------------------------------------------------

// Frequency governs aggregate size: at these crops ~0.10 puts individual
// stones in the 5-15px range, which is what reads as pavement rather than
// grain or stucco. Tuned against rendered comparisons, not guessed.
const SEALED = {
  grainFreq: "0.10",
  grainOctaves: 6,
  grainSeed: 11,
  surfaceScale: 3.3,
  lightColor: "#2A2C30",
  blotchFreq: "0.005",
  blotchSeed: 4,
  blotchStrength: 0.45,
  contrast: 1,
  brightness: 0,
};

// The same surface under more light, for images that stand alone on a
// warm-white section instead of sitting behind a dark scrim.
const SEALED_LIT = {
  ...SEALED,
  lightColor: "#43464C",
  surfaceScale: 3.6,
};

// Weathered but not yet bleached: the mid grey that failing pavement actually
// is. Dark cracks and a pothole only read against a surface this tone — on
// fresh-sealed asphalt they vanish.
const AGED = {
  ...SEALED,
  lightColor: "#75777A",
  surfaceScale: 4.0,
  blotchStrength: 0.55,
};

// Sun-bleached and oxidized: binder has burned off, so the aggregate stands
// prouder (higher surfaceScale) and the whole surface lifts toward gray.
const OXIDIZED = {
  grainFreq: "0.11",
  grainOctaves: 6,
  grainSeed: 23,
  surfaceScale: 4.4,
  lightColor: "#8E8F8A",
  blotchFreq: "0.006",
  blotchSeed: 9,
  blotchStrength: 0.5,
  contrast: 1.02,
  brightness: 0.005,
};

const textures = {
  /** Hero: freshly sealed asphalt, wide crop. */
  "asphalt-hero": () => {
    const w = 1800;
    const h = 1150;
    return svg(
      w,
      h,
      `  <rect width="${w}" height="${h}" fill="#141518" filter="url(#s)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#sheen)"/>`,
      surfaceFilter({ id: "s", ...SEALED }) +
        vignette("vig", "#000000", "#000000", 0.55) +
        `<linearGradient id="sheen" x1="0.1" y1="0" x2="0.9" y2="0.6">
      <stop offset="0" stop-color="#6E7178" stop-opacity="0.10"/>
      <stop offset="0.55" stop-color="#6E7178" stop-opacity="0.02"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.18"/>
    </linearGradient>`,
    );
  },

  /**
   * Problem A: dried, oxidized, sun-faded pavement.
   *
   * Weathered asphalt does not crack in one clean line — it develops a
   * wandering primary crack that throws off finer ones, which is what makes a
   * surface read as "aged" rather than "damaged". Several seeded paths at
   * different weights give that.
   */
  "asphalt-oxidized": () => {
    const w = 1400;
    const h = 1000;
    const runs = [
      { seed: 91, start: [w * 0.58, -30], length: h * 1.2, drift: 90, steps: 20, width: 7 },
      { seed: 143, start: [w * 0.24, -20], length: h * 1.15, drift: 70, steps: 18, width: 4.5 },
      { seed: 207, start: [w * 0.86, h * 0.1], length: h * 0.8, drift: 55, steps: 14, width: 3.4 },
    ].map((r) => ({ width: r.width, ...crackPath(r.seed, r) }));

    return svg(
      w,
      h,
      `  <rect width="${w}" height="${h}" fill="#8E8F8B" filter="url(#s)"/>
  <g filter="url(#rough)">
    ${runs
      .map(
        (r) => `<path d="${r.main}" stroke="#2B2C2D" stroke-width="${r.width}" fill="none" stroke-linecap="round" opacity="0.8"/>
    ${r.branches
      .map(
        (b) =>
          `<path d="${b}" stroke="#3A3B3C" stroke-width="${(r.width * 0.6).toFixed(1)}" fill="none" stroke-linecap="round" opacity="0.65"/>`,
      )
      .join("\n    ")}`,
      )
      .join("\n    ")}
  </g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>`,
      surfaceFilter({ id: "s", ...OXIDIZED }) +
        roughenFilter("rough", 31, 6) +
        vignette("vig", "#3A3A38", "#3A3A38", 0.34),
    );
  },

  /** Problem B: a wide linear crack, the water entry point. */
  "asphalt-crack": () => {
    const w = 1400;
    const h = 1000;
    const { main, branches } = crackPath(57, { length: h * 1.15, drift: 115, steps: 20, start: [w * 0.44, -40] });
    return svg(
      w,
      h,
      `  <rect width="${w}" height="${h}" fill="#191A1D" filter="url(#s)"/>
  <g filter="url(#rough)">
    <path d="${main}" stroke="#4A4B4F" stroke-width="26" fill="none" stroke-linecap="round" opacity="0.55"/>
    <path d="${main}" stroke="#0A0A0C" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="${main}" stroke="#000000" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${branches
      .map(
        (b) =>
          `<path d="${b}" stroke="#3E3F43" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="${b}" stroke="#08080A" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      )
      .join("\n    ")}
  </g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>`,
      surfaceFilter({ id: "s", ...SEALED, brightness: 0.008 }) +
        roughenFilter("rough", 17, 14) +
        vignette("vig", "#000000", "#000000", 0.45),
    );
  },

  /** Problem C: a spalled pothole with a deteriorating rim. */
  "asphalt-pothole": () => {
    const w = 1400;
    const h = 1000;
    const rand = rng(203);
    const cx = w * 0.47;
    const cy = h * 0.53;
    // Three nested outlines: the spalled halo where the surface is going, the
    // broken rim, and the void itself.
    const halo = blobPath(cx, cy, 250, { samples: 11, jitter: 0.3, squash: 1.3, rand });
    const rim = blobPath(cx, cy, 178, { samples: 10, jitter: 0.26, squash: 1.28, rand });
    const void_ = blobPath(cx, cy, 132, { samples: 9, jitter: 0.22, squash: 1.25, rand });
    // Water sits in a pothole and is the giveaway that it is holding moisture
    // — the reason it keeps getting worse. Slightly smaller than the void, so
    // a rim of wet asphalt shows around it.
    const water = blobPath(cx, cy + 16, 98, { samples: 12, jitter: 0.34, squash: 1.3, rand });

    // Interlaced cracking radiating outward: a pothole rarely appears in sound
    // pavement, it appears in the middle of a failing patch.
    const web = [
      { seed: 77, start: [cx + 205, cy - 195], length: h * 0.45, drift: 70, steps: 10, width: 5 },
      { seed: 311, start: [cx - 250, cy - 230], length: h * 0.55, drift: 85, steps: 12, width: 4 },
      { seed: 419, start: [cx + 60, cy + 200], length: h * 0.4, drift: 95, steps: 10, width: 3.5 },
      { seed: 523, start: [cx - 120, cy - 260], length: h * 0.3, drift: 110, steps: 8, width: 3 },
    ].map((r) => ({ width: r.width, ...crackPath(r.seed, r) }));

    return svg(
      w,
      h,
      `  <rect width="${w}" height="${h}" fill="#6E7073" filter="url(#s)"/>
  <g filter="url(#rough)" opacity="0.85">
    ${web
      .map(
        (r) => `<path d="${r.main}" stroke="#08090A" stroke-width="${r.width}" fill="none" stroke-linecap="round"/>
    ${r.branches
      .map(
        (b) =>
          `<path d="${b}" stroke="#0A0B0C" stroke-width="${(r.width * 0.6).toFixed(1)}" fill="none" stroke-linecap="round"/>`,
      )
      .join("\n    ")}`,
      )
      .join("\n    ")}
  </g>
  <g filter="url(#rough)">
    <path d="${halo}" fill="#101113" opacity="0.55"/>
    <path d="${rim}" fill="#0B0C0E"/>
    <path d="${rim}" fill="none" stroke="#5E6064" stroke-width="2.5" opacity="0.32"/>
    <path d="${void_}" fill="url(#depth)"/>
    <path d="${water}" fill="url(#water)"/>
  </g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>`,
      surfaceFilter({ id: "s", ...AGED }) +
        roughenFilter("rough", 63, 16) +
        // Light falls off into the hole rather than hitting a flat black fill.
        `<radialGradient id="depth" cx="0.42" cy="0.34" r="0.78">
      <stop offset="0" stop-color="#1B1C1F"/>
      <stop offset="0.45" stop-color="#0A0B0C"/>
      <stop offset="1" stop-color="#000000"/>
    </radialGradient>
    <!-- Standing water: a cold sky reflection, brightest where the light is. -->
    <linearGradient id="water" x1="0.15" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#9AA5AC" stop-opacity="0.85"/>
      <stop offset="0.45" stop-color="#6E777E" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#3A4045" stop-opacity="0.75"/>
    </linearGradient>` +
        vignette("vig", "#000000", "#000000", 0.48),
    );
  },

  /** Commercial page: a broad sealed lot with a fresh line marking. */
  "asphalt-lot": () => {
    const w = 1800;
    const h = 1000;
    return svg(
      w,
      h,
      // Yellow stall markings on freshly sealed asphalt: the finished look of a
      // maintained commercial lot. Lines converge slightly toward the top so
      // the surface reads as receding rather than flat-on.
      `  <rect width="${w}" height="${h}" fill="#141518" filter="url(#s)"/>
  <g filter="url(#rough)">
    ${Array.from({ length: 7 }, (_, i) => {
      const t = i / 6;
      const topY = h * 0.3;
      const botY = h * 0.98;
      // Perspective: spacing widens toward the viewer.
      const topX = w * (0.12 + t * 0.78);
      const botX = w * (-0.05 + t * 1.12);
      const width = 9;
      return `<path d="M${topX.toFixed(0)},${topY} L${(topX + width * 0.7).toFixed(0)},${topY} L${(botX + width).toFixed(0)},${botY} L${botX.toFixed(0)},${botY} Z" fill="#E3B31C" opacity="${(0.62 + t * 0.06).toFixed(2)}"/>`;
    }).join("\n    ")}
    <path d="M${w * 0.06},${h * 0.3} L${w * 0.94},${h * 0.3} L${w * 0.94},${h * 0.3 + 8} L${w * 0.06},${h * 0.3 + 8} Z" fill="#E3B31C" opacity="0.5"/>
  </g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>`,
      // Lifted above the hero's exposure: these two appear as standalone
      // images on warm-white sections, where a near-black frame reads as an
      // empty box rather than a photograph.
      surfaceFilter({ id: "s", ...SEALED_LIT }) +
        roughenFilter("rough", 88, 4) +
        vignette("vig", "#000000", "#000000", 0.42),
    );
  },

  /** Residential: sealed driveway strip, tighter crop. */
  "asphalt-driveway": () => {
    const w = 1400;
    const h = 1000;
    return svg(
      w,
      h,
      `  <rect width="${w}" height="${h}" fill="#141518" filter="url(#s)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#sheen)"/>`,
      surfaceFilter({ id: "s", ...SEALED_LIT, blotchSeed: 15 }) +
        vignette("vig", "#000000", "#000000", 0.3) +
        `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="#8A8D95" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.08"/>
    </linearGradient>`,
    );
  },
};

mkdirSync(OUT, { recursive: true });
for (const [name, build] of Object.entries(textures)) {
  const file = join(OUT, `${name}.svg`);
  writeFileSync(file, build(), "utf8");
  console.log(`wrote ${file}`);
}
