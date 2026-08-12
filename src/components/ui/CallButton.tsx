import { BUSINESS, telHref } from "@/config/business";

/**
 * The call action, which has to behave differently depending on the device.
 *
 * On a phone, `tel:` dials and "Call TARMAX" is the right instruction.
 *
 * On a desktop most visitors have no dialler registered, so activating a
 * `tel:` link either does nothing or gets handed to whatever the operating
 * system guesses — which reads to the visitor as the site being broken. There
 * the label is the number itself, so the useful information is on screen
 * without anyone having to click at all. The link is left intact, because
 * FaceTime, Skype and Teams users can still place the call.
 *
 * The swap is CSS-only. Both labels are in the server-rendered HTML and the
 * viewport decides which is shown, so there is no JavaScript, no hydration
 * mismatch, and the number is present in the markup either way.
 *
 * The breakpoint matches the mobile action bar, so a visitor never sees the
 * bottom call bar and the desktop treatment at the same time.
 */
export function CallButton({ className = "btn btn-ghost" }: { className?: string }) {
  return (
    <a
      href={telHref()}
      className={className}
      // One accessible name for both layouts, containing each visible label so
      // speech control still matches what is on screen (WCAG 2.5.3).
      aria-label={`Call TARMAX at ${BUSINESS.phone}`}
    >
      <span className="md:hidden">Call TARMAX</span>
      <span className="hidden md:inline">{BUSINESS.phone}</span>
    </a>
  );
}
