import { BUSINESS, DIRECTORS, mailtoHref, telHref } from "@/config/business";
import { Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

const EMAIL_SUBJECT = "Asphalt quote request";

/**
 * Direct lines to the two people who run the company. Deliberately not a
 * contact form — the form lives on /free-quote, and this section is the
 * alternative for anyone who would rather just phone.
 */
export function Contact() {
  return (
    <section id="contact" className="section bg-bone text-ink">
      <div className="shell">
        <Eyebrow tone="light">Contact</Eyebrow>
        <h2 className="display-lg mt-4 max-w-[16ch]">Talk directly with TARMAX</h2>

        <div className="mt-14 grid gap-px border border-ink/15 bg-ink/15 md:mt-20 md:grid-cols-2">
          {DIRECTORS.map((d) => (
            <Reveal key={d.name} className="bg-bone p-7 md:p-10">
              <p className="display-sm">{d.name}</p>
              <p className="label mt-1 text-[0.625rem] text-ink/65">{d.role}</p>

              {/* Links carry their own 44px tap height — they are real targets
                  on a phone, not prose. */}
              <dl className="mt-7 flex flex-col gap-1 text-sm">
                <div className="flex flex-wrap items-center gap-x-3">
                  <dt className="label text-[0.625rem] text-ink/65">Phone</dt>
                  <dd>
                    <a
                      href={telHref(d)}
                      className="font-display inline-flex min-h-11 items-center text-lg font-bold hover:text-red"
                    >
                      {d.phone}
                    </a>
                  </dd>
                </div>
              </dl>

              {/* Directors are reachable by phone. Email goes to the single
                  published address below, so a customer never has to choose
                  which of two people to write to. */}
              <div className="mt-8">
                <a href={telHref(d)} className="btn btn-solid-dark w-full">
                  Call {d.firstName}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 flex flex-col gap-5 border border-ink/15 p-7 sm:flex-row sm:items-center sm:justify-between md:p-10">
          <div>
            <p className="label text-[0.625rem] text-ink/65">Email</p>
            <a
              href={mailtoHref(BUSINESS.generalEmail, EMAIL_SUBJECT)}
              className="display-sm mt-2 inline-flex min-h-11 items-center break-all hover:text-red"
            >
              {BUSINESS.generalEmail}
            </a>
          </div>
          <a
            href={mailtoHref(BUSINESS.generalEmail, EMAIL_SUBJECT)}
            className="btn btn-outline shrink-0"
          >
            Email TARMAX
          </a>
        </Reveal>
      </div>
    </section>
  );
}
