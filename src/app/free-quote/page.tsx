import type { Metadata } from "next";
import { Suspense } from "react";
import { BUSINESS, DIRECTORS, mailtoHref, telHref } from "@/config/business";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Eyebrow } from "@/components/ui/Labels";

export const metadata: Metadata = {
  title: "Get a Free Asphalt Quote in Calgary",
  description:
    "Send TARMAX the property address and a way to contact you. Free estimates for sealcoating, crack sealing and infrared asphalt repair across Calgary.",
  alternates: { canonical: "/free-quote" },
};

const EMAIL_SUBJECT = "Asphalt quote request";

export default function FreeQuotePage() {
  return (
    <div className="on-dark bg-ink">
      <div className="section shell pt-32 md:pt-40">
        <div className="max-w-2xl">
          <Eyebrow>Free quote</Eyebrow>
          <h1 className="display-lg mt-4">Get a free asphalt quote</h1>
          <p className="lede mt-5 text-bone/75">
            Send us the property address and a way to contact you. We&rsquo;ll take it from there.
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          {/* Call and email first — plenty of people will never touch the form. */}
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="label text-[0.6875rem] text-muted">Call</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {DIRECTORS.map((d) => (
                  <li key={d.email} className="border border-white/14 p-5">
                    <p className="font-semibold">{d.name}</p>
                    <a
                      href={telHref(d)}
                      className="font-display mt-1 block text-xl font-bold hover:text-red"
                    >
                      {d.phone}
                    </a>
                    <a href={telHref(d)} className="btn btn-ghost mt-4 w-full">
                      Call {d.firstName}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="label text-[0.6875rem] text-muted">Email</h2>
              <ul className="mt-5 flex flex-col gap-2.5">
                {[...DIRECTORS.map((d) => d.email), BUSINESS.generalEmail].map((address) => (
                  <li key={address}>
                    <a
                      href={mailtoHref(address, EMAIL_SUBJECT)}
                      className="break-all text-bone/85 underline decoration-white/25 underline-offset-4 transition-colors hover:text-red"
                    >
                      {address}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h2 className="label text-[0.6875rem] text-muted">Send your address</h2>
            <div className="mt-5">
              <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
                <QuoteForm />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
