import Link from "next/link";
import { BUSINESS, telHref } from "@/config/business";

/**
 * Fixed bottom bar on phones: the two things a visitor standing on a cracked
 * driveway actually wants.
 *
 * CALL used to open a sheet so the visitor could choose which director to
 * ring. With one business line there is nothing to choose, so it is a plain
 * tel: link — one tap to dial instead of two, and no client state, refs,
 * outside-click handling or Escape key wiring to go wrong.
 *
 * Body padding for this bar is applied in the root layout via --action-bar, so
 * it never covers the end of a page.
 */
export function MobileActionBar() {
  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div
        className="grid grid-cols-2 border-t border-white/12 bg-ink"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={telHref()}
          aria-label={`Call TARMAX at ${BUSINESS.phone}`}
          className="label flex min-h-[4.25rem] items-center justify-center border-r border-white/12 text-bone"
        >
          Call
        </a>
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
