"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DIRECTORS, telHref } from "@/config/business";

/**
 * Fixed bottom bar on phones: the two things a visitor on a driveway with a
 * cracked surface actually wants. CALL expands to the two directors rather
 * than guessing which one to dial.
 *
 * Body padding for this bar is applied in the root layout via --action-bar, so
 * it never covers the end of a page.
 */
export function MobileActionBar() {
  const [callOpen, setCallOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!callOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCallOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setCallOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [callOpen]);

  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-50 md:hidden">
      {callOpen && (
        <div
          ref={sheetRef}
          id="call-sheet"
          className="border-t border-white/12 bg-asphalt px-4 pt-4 pb-3"
        >
          <p className="label mb-3 text-muted">Call a director</p>
          <ul className="flex flex-col gap-2">
            {DIRECTORS.map((d) => (
              <li key={d.email}>
                <a
                  href={telHref(d)}
                  className="flex min-h-[3.25rem] items-center justify-between border border-white/14 px-4"
                >
                  <span>
                    <span className="block text-sm font-semibold text-bone">{d.name}</span>
                    <span className="label text-[0.625rem] text-muted">{d.role}</span>
                  </span>
                  <span className="font-display text-base font-bold text-bone">{d.phone}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="grid grid-cols-2 border-t border-white/12 bg-ink"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setCallOpen((v) => !v)}
          aria-expanded={callOpen}
          aria-controls="call-sheet"
          className="label flex min-h-[4.25rem] items-center justify-center border-r border-white/12 text-bone"
        >
          Call
        </button>
        <Link
          href="/free-quote"
          className="label flex min-h-[4.25rem] items-center justify-center bg-red text-white"
        >
          Free Quote
        </Link>
      </div>
    </div>
  );
}
