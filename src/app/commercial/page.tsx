import type { Metadata } from "next";
import Link from "next/link";

import { Surface } from "@/components/ui/Surface";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { CallButton } from "@/components/ui/CallButton";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Commercial Parking Lot Maintenance in Calgary",
  description:
    "Sealcoating, crack sealing, pothole and infrared repair for Calgary parking lots. For property managers, condo boards, retail, office and church properties. Free assessment.",
  alternates: { canonical: "/commercial" },
};

const AUDIENCES = [
  "Property managers",
  "Condo boards",
  "Retail properties",
  "Office buildings",
  "Churches",
  "Managed parking areas",
];

const SCOPE = [
  {
    title: "Pavement condition assessment",
    body: "We walk the lot and record what we find: crack type and extent, surface oxidation, localized failures, drainage, and any section that needs rebuilding rather than maintaining.",
  },
  {
    title: "Priced to the property, not a flat rate",
    body: "The quote comes from what is actually on your lot rather than a rate card, so you are not paying for square footage that does not need the work — or being quoted short for a surface that needs more. You see what each part of the job costs and why it is on the list.",
  },
  {
    title: "The whole lot, in the right order",
    body: "We set out everything the surface needs and what each part costs. Where that is more than one season allows, we sequence it so the work that protects the pavement goes first — the order is driven by what the lot is doing, not by what is easiest to schedule.",
  },
  {
    title: "Work staged around your tenants",
    body: "Sections, entrances and stall rows can be sequenced so the lot keeps operating. Curing times are part of the schedule we give you, not a surprise afterwards.",
  },
  {
    title: "One contractor for the whole lot",
    body: "Where a section needs more than maintenance — excavation, replacement, work outside our own crews — we bring in contractors we have worked with and stand behind, and we manage it. You are not left chasing a second company for the part we could not do.",
  },
  {
    title: "Runoff and surroundings considered",
    body: "Drainage routes, adjacent surfaces, landscaping and weather windows are checked before anything is applied.",
  },
];

export default function CommercialPage() {
  return (
    <>
      <header className="on-dark relative isolate overflow-hidden bg-ink pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="lot" alt="" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="shell max-w-3xl">
          <Eyebrow>Commercial</Eyebrow>
          <h1 className="display-lg mt-4">Parking lot maintenance</h1>
          <p className="lede mt-5 text-bone/80">
            Preventative maintenance for Calgary parking lots, planned around what the pavement
            needs.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/free-quote?property=commercial" className="btn btn-primary">
              Get a commercial quote
              <Arrow />
            </Link>
            <CallButton />
          </div>
        </div>
      </header>

      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">Who we work with</Eyebrow>
          <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {AUDIENCES.map((a) => (
              <li key={a} className="display-sm text-ink/80">
                {a}
              </li>
            ))}
          </ul>

          <h2 className="display-lg mt-20 max-w-[16ch]">How a commercial job runs</h2>
          <ul className="mt-12 border-t border-ink/15">
            {SCOPE.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 60}>
                <div className="grid gap-3 border-b border-ink/15 py-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
                  <h3 className="display-sm">{item.title}</h3>
                  <p className="max-w-[58ch] text-ink/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
