import { Suspense } from "react";
import { DIRECTORS, telHref } from "@/config/business";
import { Surface } from "@/components/ui/Surface";
import { Eyebrow } from "@/components/ui/Labels";
import { QuoteForm } from "@/components/forms/QuoteForm";

/**
 * The homepage conversion point.
 *
 * Previously this was a button pointing at /free-quote. The form is now here,
 * so the fastest path from "my driveway is cracking" to a submitted request is
 * three fields and no page load. Phone stays alongside it — plenty of people
 * would rather call than type.
 */
export function QuoteCta() {
  return (
    <section id="quote" className="on-dark relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10">
        <Surface name="hero" alt="" sizes="100vw" className="opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
      </div>

      <div className="section shell grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <Eyebrow>Free estimate</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[13ch]">Need an asphalt quote?</h2>
          <p className="lede mt-6 text-bone/75">
            Send the property address and a way to reach you. That is the whole form — we measure
            the property ourselves and come back to you.
          </p>

          <dl className="mt-10 flex flex-col gap-5 border-t border-white/12 pt-8">
            <div>
              <dt className="label text-[0.625rem] text-muted">No measuring required</dt>
              <dd className="mt-1 text-sm text-bone/70">
                No photos, square footage or account. We size it from the map or on site.
              </dd>
            </div>
            <div>
              <dt className="label text-[0.625rem] text-muted">Rather talk to someone?</dt>
              <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                {DIRECTORS.map((d) => (
                  <a
                    key={d.email}
                    href={telHref(d)}
                    className="font-display inline-flex min-h-11 items-center text-lg font-bold text-bone hover:text-alert"
                  >
                    {d.phone}
                    <span className="label ml-2 text-[0.625rem] font-semibold text-muted">
                      {d.firstName}
                    </span>
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-white/12 bg-ink/60 p-6 backdrop-blur-sm md:p-9">
          <Suspense fallback={<div className="h-80" aria-hidden="true" />}>
            <QuoteForm compact />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
