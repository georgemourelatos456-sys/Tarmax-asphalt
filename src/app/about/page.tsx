import type { Metadata } from "next";
import Link from "next/link";
import { DIRECTORS, mailtoHref, telHref } from "@/config/business";
import { Surface } from "@/components/ui/Surface";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Why We Started TARMAX",
  description:
    "TARMAX was started by two Albertans who were tired of watching rushed asphalt work sold at premium prices. Our approach: assess honestly, prepare properly, and stand behind the product.",
  alternates: { canonical: "/about" },
};

const COMMITMENTS = [
  {
    title: "Not a side hustle",
    body: "This is the business, not something run off the side of a truck between other jobs. That distinction decides how much care a job gets, and it was the first thing the two of us agreed on.",
  },
  {
    title: "The product matters as much as the price",
    body: "An expensive product applied carelessly is still careless work. We would rather explain why a surface needs preparation than skip it and hope the customer never finds out.",
  },
  {
    title: "Honest assessment, including “no”",
    body: "If maintenance is not the right answer for a surface, we say so. Selling sealcoating for pavement that needs replacement is how the industry earned its reputation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="on-dark relative isolate overflow-hidden bg-ink pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="driveway" alt="" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="shell max-w-3xl">
          <Eyebrow>About TARMAX</Eyebrow>
          <h1 className="display-lg mt-4">Why we started this.</h1>
        </div>
      </header>

      <section className="section bg-bone text-ink">
        <div className="shell grid gap-12 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
          <div>
            <h2 className="label text-[0.625rem] text-ink/50">The why</h2>
          </div>

          <Reveal>
            <div className="flex max-w-[58ch] flex-col gap-6 text-lg leading-relaxed text-ink/80">
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
            </div>
          </Reveal>
        </div>
      </section>

      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>What that means in practice</Eyebrow>
          <ul className="mt-12 border-t border-white/12">
            {COMMITMENTS.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 70}>
                <div className="grid gap-3 border-b border-white/12 py-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
                  <h3 className="display-sm">{c.title}</h3>
                  <p className="max-w-[58ch] text-bone/70">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
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
              <div key={d.email} className="bg-bone p-7 md:p-10">
                <p className="display-sm">{d.name}</p>
                <p className="label mt-1 text-[0.625rem] text-ink/50">{d.role}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href={telHref(d)} className="btn btn-solid-dark flex-1">
                    Call {d.firstName}
                  </a>
                  <a href={mailtoHref(d.email, "Asphalt enquiry")} className="btn btn-outline flex-1">
                    Email {d.firstName}
                  </a>
                </div>
              </div>
            ))}
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
