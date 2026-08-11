import type { ReactNode } from "react";

/** Small uppercase kicker above a headline. */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p className={`label ${tone === "dark" ? "text-muted" : "text-ink/65"} ${className}`}>
      {children}
    </p>
  );
}

/**
 * A pavement-assessment readout: the field name above the observed value.
 *
 * This is the vocabulary an inspector actually uses on a condition report, and
 * it does the work a generic icon would otherwise be doing — naming what the
 * reader is looking at, in the trade's own terms.
 */
export function DataLabel({
  field,
  value,
  tone = "dark",
}: {
  field: string;
  value: string;
  tone?: "dark" | "light";
}) {
  const line = tone === "dark" ? "border-white/15" : "border-ink/15";
  const fieldTone = tone === "dark" ? "text-muted" : "text-ink/65";
  const valueTone = tone === "dark" ? "text-bone" : "text-ink";

  return (
    <div className={`border-l pl-4 ${line}`}>
      <span className={`label block text-[0.6875rem] ${fieldTone}`}>{field}</span>
      <span className={`label mt-1 block ${valueTone}`}>{value}</span>
    </div>
  );
}

/** Arrow glyph for action links. Decorative — the link text carries meaning. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`arrow ${className}`}
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 5h12M8.5 1 12.5 5l-4 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
