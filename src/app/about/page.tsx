import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, DIRECTORS, mailtoHref, telHref } from "@/config/business";
import { Surface } from "@/components/ui/Surface";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Why We Started TARMAX",
  description:
    "TARMAX was started by two Albertans who were tired of watching rushed asphalt work sold at premium prices. Our approach: assess honestly, prepare properly, and stand behind the product.",
  alternates: { canonical: "/about" },
};

/** The founding story is George's, so it is signed by him. */
const GEORGE = DIRECTORS.find((d) => d.firstName === "George") ?? DIRECTORS[1];


export default function AboutPage() {
  return (
    <>
      <header className="on-dark relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink pt-28 pb-20 md:min-h-screen md:pt-32 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="driveway" alt="" sizes="100vw" />
          {/* An even scrim, not the side-weighted wash this used when the type
              sat on the left. Centred type needs the whole frame darkened by
              the same amount, or the headline reads as lit from one side. */}
          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20" />
        </div>

        <div className="shell max-w-3xl text-center">
          <Eyebrow>About TARMAX</Eyebrow>
          <h1 className="display-lg mt-4">Why we started this.</h1>
        </div>
      </header>

      <section className="section bg-bone text-ink">
        <div className="shell grid gap-12 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
          <div>
            {/* This column holds nothing else, so a 10px label left it looking
                empty and the heading looked like a caption that had come
                adrift. At display size it reads as the section title it is. */}
            <h2 className="display-md sticky top-28 max-w-[8ch] text-ink">The why</h2>
          </div>

          {/* Attributed rather than an unsigned "I" — on a page that goes on to
              introduce two directors, an unattributed first person reads as a
              mistake. The signature is the point: someone is standing behind it. */}
          <Reveal>
            <figure>
              <blockquote className="flex max-w-[58ch] flex-col gap-6 text-lg leading-relaxed text-ink/80">
              <p className="display-sm text-ink">
                I had a personal objection to how this industry operates.
              </p>
              <p>
                Working under another company, I watched rushed work go out the door — the product
                and the application treated as the least important part of the job. That did not sit
                right with me.
              </p>
              <p>
                I was born and raised in Alberta. I understand what the winter months do to a
                surface, and I have no interest in pandering about it. What I did not want to see
                was cheap work sold at the price of an expensive product.
              </p>
              <p>
                The first conversation my business partner and I had was that this would not be a
                side hustle. That decision is what gives the mission its clarity: we want to build a
                service that does substantial, honest, good work.
              </p>
              </blockquote>

              <figcaption className="mt-8 flex max-w-[58ch] items-center gap-4 border-t border-ink/15 pt-6">
                <span aria-hidden="true" className="h-px w-8 shrink-0 bg-red" />
                <span>
                  <span className="display-sm block">{GEORGE.name}</span>
                  <span className="label mt-1 block text-[0.625rem] text-ink/65">
                    {GEORGE.role}, {BUSINESS.shortName}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">The directors</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[16ch]">You deal with us directly.</h2>
          <p className="mt-5 max-w-[52ch] text-ink/70">
            There is no call centre and no sales team. The people who quote the work are the people
            who run the company.
          </p>

          <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2">
            {DIRECTORS.map((d) => (
              <div key={d.name} className="bg-bone p-7 md:p-10">
                <p className="display-sm">{d.name}</p>
                <p className="label mt-1 text-[0.625rem] text-ink/65">{d.role}</p>
              </div>
            ))}
          </div>

          {/* One line and one address for both of them, rather than a pair of
              buttons per person asking the visitor to pick. */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={telHref()} className="btn btn-solid-dark sm:flex-none sm:px-10">
              Call {BUSINESS.phone}
            </a>
            <a
              href={mailtoHref(BUSINESS.generalEmail, "Asphalt enquiry")}
              className="btn btn-outline sm:flex-none sm:px-10"
            >
              Email TARMAX
            </a>
          </div>

          <Link href="/driveway-sealcoating" className="link-action mt-12 text-ink">
            Read how our sealer works
            <Arrow />
          </Link>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
