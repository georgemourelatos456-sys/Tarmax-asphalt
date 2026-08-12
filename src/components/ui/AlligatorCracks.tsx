import { CRACK_CELLS, CRACK_VIEWBOX } from "./cracks.generated";

/**
 * Alligator cracking as a full-bleed section background.
 *
 * Two colours only: the section's own black shows through the cells, and the
 * cracks between them are the brand red. Nothing is filled, so this adds
 * texture to the background rather than sitting on it as a panel.
 *
 * It fades out from right to left, so the cracking is at full strength in the
 * open half of the section and has thinned to nothing by the time it reaches
 * the copy — texture behind the words, not competition with them.
 *
 * The fade is a CSS mask (`.crack-fade` in globals.css) rather than an SVG one,
 * for two reasons. `slice` scales the viewBox up and crops whichever axis
 * overflows, so a gradient defined inside the viewBox is cropped with it and
 * arrives as a roughly even wash; a CSS mask always spans exactly what the
 * visitor sees. And it needs a media query — on a phone the copy runs the full
 * width, so the texture has to retreat to the far edge to stay out of the way.
 *
 * Decorative: hidden from assistive technology, and the copy carries the
 * meaning.
 */

export function AlligatorCracks({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={CRACK_VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      className={`crack-fade ${className}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="var(--color-red)"
        strokeWidth={1.2}
        strokeLinejoin="round"
        /* Texture, not diagram. Full-strength red would compete with the
           headline even where the mask has thinned it out. */
        opacity={0.68}
      >
        {CRACK_CELLS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
