"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";

/**
 * A drag-to-reveal comparison of the same surface before and after work.
 *
 * The two photographs are stacked and the top one is clipped to the handle
 * position, so dragging wipes the finished surface across the damaged one. It
 * is the one claim on this site a customer can verify with their own eyes, so
 * it is worth more than any paragraph describing the result.
 *
 * Three things make it usable rather than merely clever:
 *
 *   - A real range input sits over the whole frame at zero opacity. That is
 *     what gives keyboard control, arrow keys, and a value a screen reader can
 *     announce, without reimplementing any of it.
 *   - Pointer events cover mouse, touch and pen in one path, with capture set
 *     so a fast drag that leaves the frame keeps tracking instead of sticking.
 *   - The position is written to a CSS custom property. Clipping happens in
 *     the compositor, so dragging never triggers a React re-render per frame.
 *
 * Both images load eagerly. A comparison with one half missing is worse than
 * no comparison at all.
 */

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);
  const id = useId();

  /** Pointer x -> percentage across the frame. */
  const positionFrom = useCallback((clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box || box.width === 0) return null;
    const ratio = (clientX - box.left) / box.width;
    return Math.min(100, Math.max(0, ratio * 100));
  }, []);

  function moveTo(clientX: number) {
    const next = positionFrom(clientX);
    if (next !== null) setPosition(next);
  }

  return (
    <figure className={`m-0 ${className}`}>
      <div
        ref={frame}
        className="ba-frame group relative aspect-4/3 w-full touch-pan-y select-none overflow-hidden bg-ink"
        style={{ ["--ba" as string]: `${position}%` }}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) moveTo(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        {/* Damaged surface: the full-frame base layer. */}
        <Image src={before} alt={beforeAlt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" priority />

        {/* Finished surface, clipped to the handle. */}
        <div className="ba-reveal absolute inset-0">
          <Image src={after} alt={afterAlt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" priority />
        </div>

        {/* Labels follow the layers, not reading order: the finished surface is
            the one being wiped in from the left, so it is labelled on the left
            and the damaged surface stays named on the right. */}
        <span className="ba-tag ba-tag-after left-4">{afterLabel}</span>
        <span className="ba-tag right-4">{beforeLabel}</span>

        {/* The seam. Purely decorative — the input below carries the semantics. */}
        <div aria-hidden="true" className="ba-seam">
          <span className="ba-grip">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
            </svg>
          </span>
        </div>

        {/* The actual control: invisible, but focusable and announced. */}
        <label htmlFor={id} className="sr-only">
          Reveal the finished surface
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(position)}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-valuetext={`${Math.round(position)}% revealed`}
          className="ba-range"
        />
      </div>

      {/* Colour is inherited so the caption reads correctly on either ground. */}
      <figcaption className="mt-4 flex items-center gap-2 text-sm opacity-60">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
        </svg>
        Drag to compare
      </figcaption>
    </figure>
  );
}
