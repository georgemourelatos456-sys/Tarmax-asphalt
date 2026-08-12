import { BUSINESS, mailtoHref, telHref } from "@/config/business";
import { Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

const EMAIL_SUBJECT = "Asphalt quote request";

/**
 * The two ways to reach TARMAX without filling anything in. Deliberately not a
 * contact form — the form lives on /free-quote, and this section is the
 * alternative for anyone who would rather just phone or write.
 */
export function Contact() {
  return (
    <section id="contact" className="section bg-bone text-ink">
      <div className="shell">
        <Eyebrow tone="light">Contact</Eyebrow>
        <h2 className="display-lg mt-4 max-w-[16ch]">Talk directly with TARMAX</h2>

        {/* One number and one address. Two director cards made a visitor pick
            a person before they could ask a question. */}
        <div className="mt-14 grid gap-px border border-ink/15 bg-ink/15 md:mt-20 md:grid-cols-2">
          <Reveal className="bg-bone p-7 md:p-10">
            <p className="label text-[0.625rem] text-ink/65">Phone</p>
            <a
              href={telHref()}
              className="font-display mt-3 inline-flex min-h-11 items-center text-2xl font-bold hover:text-red md:text-3xl"
            >
              {BUSINESS.phone}
            </a>
            <div className="mt-8">
              <a href={telHref()} className="btn btn-solid-dark w-full">
                Call TARMAX
              </a>
            </div>
          </Reveal>

          <Reveal className="bg-bone p-7 md:p-10">
            <p className="label text-[0.625rem] text-ink/65">Email</p>
            <a
              href={mailtoHref(BUSINESS.generalEmail, EMAIL_SUBJECT)}
              className="font-display mt-3 inline-flex min-h-11 items-center break-all text-lg font-bold hover:text-red md:text-xl"
            >
              {BUSINESS.generalEmail}
            </a>
            <div className="mt-8">
              <a
                href={mailtoHref(BUSINESS.generalEmail, EMAIL_SUBJECT)}
                className="btn btn-outline w-full"
              >
                Email TARMAX
              </a>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
