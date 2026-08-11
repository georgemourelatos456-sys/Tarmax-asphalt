/**
 * The seam — TARMAX's signature motif.
 *
 * A crack is the single thing every service on this site exists to fight, so
 * it doubles as the structural device that joins sections. Deliberately almost
 * invisible: it should register as a texture in the page, not a decoration.
 */

/** Deterministic wander, generated once and frozen so it never reflows. */
const SEAM_PATH =
  "M0,6 L24,4.37 L48,2.73 L72,2.87 L96,3.33 L120,4.73 L144,3.41 L168,3.39 L192,3.56 L216,3.88 L240,4.85 L264,3.28 L288,4.11 L312,5.70 L336,4.25 L360,4.93 L384,4.79 L408,4.44 L432,6.00 L456,5.68 L480,7.22 L504,8.90 L528,9.46 L552,9.19 L576,9.19 L600,8.47 L624,8.21 L648,8.81 L672,7.63 L696,6.24 L720,7.44 L744,6.79 L768,5.12 L792,4.99 L816,4.28 L840,4.53 L864,6.10 L888,4.46 L912,5.41 L936,4.73 L960,4.13 L984,5.67 L1008,5.83 L1032,6.40 L1056,6.93 L1080,7.35 L1104,6.20 L1128,7.66 L1152,8.57 L1176,8.42 L1200,9.19 L1224,8.62 L1248,9.34 L1272,9.60 L1296,10.40 L1320,10.21 L1344,9.21 L1368,9.06 L1392,9.64 L1416,9.71 L1440,10.40";

export function Seam({
  tone = "dark",
  accent = false,
}: {
  /** `dark` for black sections, `light` for bone sections. */
  tone?: "dark" | "light";
  /** Tint the seam red where a section needs one deliberate highlight. */
  accent?: boolean;
}) {
  const stroke = accent ? "#B51F24" : tone === "dark" ? "#F4F2ED" : "#0B0B0C";
  const opacity = accent ? 0.5 : tone === "dark" ? 0.16 : 0.14;

  return (
    <svg
      className="block h-3 w-full"
      viewBox="0 0 1440 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={SEAM_PATH} fill="none" stroke={stroke} strokeOpacity={opacity} strokeWidth={1.25} />
    </svg>
  );
}
