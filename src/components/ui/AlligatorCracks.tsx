import { CRACK_PLATES, CRACK_VIEWBOX } from "./cracks.generated";

/**
 * Alligator cracking, drawn in the brand red.
 *
 * The plates are filled dark and separated by a red stroke, so the cracks —
 * not the plates — are what the eye follows. That is the point being made in
 * the copy beside it: the failure is in the gaps, and a sealer that only coats
 * the top leaves them there.
 *
 * Decorative, so it is hidden from assistive technology. The paragraph next to
 * it carries the meaning.
 *
 * Two details that keep it from looking like a pasted-in rectangle: the whole
 * figure fades out through a radial mask, and the strokes sit on `paint-order:
 * stroke` so plate fills never clip the crack lines at shared edges.
 */
export function AlligatorCracks({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={CRACK_VIEWBOX}
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Strongest through the middle, gone by the edges, so the figure sits
            in the section rather than on top of it. */}
        <radialGradient id="crack-fade" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="62%" stopColor="white" stopOpacity="0.92" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="crack-mask">
          <rect width="100%" height="100%" fill="url(#crack-fade)" />
        </mask>
      </defs>

      <g mask="url(#crack-mask)" style={{ paintOrder: "stroke" }}>
        {CRACK_PLATES.map((plate, i) => (
          <path
            key={i}
            d={plate.d}
            fill={plate.fill}
            stroke="var(--color-red)"
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}
