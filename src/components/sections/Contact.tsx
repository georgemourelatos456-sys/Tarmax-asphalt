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
            <Reveal key={d.email} className="bg-bone p-7 md:p-10">
              <p className="display-sm">{d.name}</p>
              <p className="label mt-1 text-[0.625rem] text-ink/50">{d.role}</p>

              <dl className="mt-7 flex flex-col gap-3 text-sm">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <dt className="label text-[0.625rem] text-ink/45">Phone</dt>
                  <dd>
                    <a href={telHref(d)} className="font-display text-lg font-bold hover:text-red">
                      {d.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <dt className="label text-[0.625rem] text-ink/45">Email</dt>
                  <dd>
                    <a
                      href={mailtoHref(d.email, EMAIL_SUBJECT)}
                      className="break-all hover:text-red"
                    >
                      {d.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={telHref(d)} className="btn btn-solid-dark flex-1">
                  Call {d.firstName}
                </a>
                <a href={mailtoHref(d.email, EMAIL_SUBJECT)} className="btn btn-outline flex-1">
                  Email {d.firstName}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 flex flex-col gap-5 border border-ink/15 p-7 sm:flex-row sm:items-center sm:justify-between md:p-10">
          <div>
            <p className="label text-[0.625rem] text-ink/50">General enquiries</p>
            <a
              href={mailtoHref(BUSINESS.generalEmail, EMAIL_SUBJECT)}
              className="display-sm mt-2 block break-all hover:text-red"
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
