"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content up once as it enters the viewport.
 *
 * The homepage uses this around twenty times, so the implementation is
 * deliberately cheap:
 *
 *   - One IntersectionObserver for the whole document, not one per element.
 *   - The visible flag is written straight to the DOM node, so revealing does
 *     not trigger a React re-render. React never renders `data-visible`, so it
 *     has no reason to reconcile it away.
 *   - Only opacity and transform animate, both composited on the GPU, so a
 *     reveal never causes layout or paint mid-scroll.
 *
 * Under prefers-reduced-motion the CSS drops the transform entirely and the
 * content is simply present.
 */

let observer: IntersectionObserver | null = null;

function sharedObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer?.unobserve(entry.target);
      }
    },
    // Bottom margin, not top: scrolling down, elements enter from below, so
    // growing the root box downwards is what starts the reveal before the
    // element is actually on screen. It has then settled by the time a
    // scrolling reader can see it — triggering late is what looks like content
    // popping in.
    { rootMargin: "0px 0px 200px 0px", threshold: 0 },
  );
  return observer;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Stagger in milliseconds, for small groups only. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = sharedObserver();
    // No observer support: show the content rather than hiding it forever.
    if (!io) {
      node.dataset.visible = "true";
      return;
    }

    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
