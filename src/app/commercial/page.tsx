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
    title: "Work staged around your tenants",
    body: "Sections, entrances and stall rows can be sequenced so the lot keeps operating. Curing times are part of the schedule we give you, not a surprise afterwards.",
  },
  {
    title: "One contractor for the whole lot",
    body: "Where a section needs more than maintenance — excavation, replacement, work outside our own crews — we bring in contractors we have worked with and stand behind.",
  },
  {
    title: "Runoff and surroundings considered",
    body: "Drainage routes, adjacent surfaces, landscaping and weather windows are checked before anything is applied.",
  },
];

export default function CommercialPage() {
  return (
    <>
      {/* Fills the viewport, so the fold lands on the header rather than on the
          top edge of the bone section below it. svh rather than vh: on mobile
          Safari, vh is the height with the browser chrome hidden, which leaves
          a strip of the next section showing until the toolbar collapses. */}
      <header className="on-dark relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink pt-28 pb-20 md:min-h-screen md:pt-32 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="lot" alt="" sizes="100vw" />
          {/* An even scrim, not the side-weighted wash these used when the type
              sat on the left. Centred type needs the whole frame darkened by
              the same amount, or the headline reads as lit from one side. */}
          <div className="absolute inset-0 bg-ink/38" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-ink/10" />
          {/* The nav sits on the photograph with no bar of its own. Lifting
              the scrim brightened the top of the frame enough to swallow it,
              so the band behind it is darkened on its own. */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/85 via-ink/45 to-transparent" />
        </div>

        <div className="hero-type shell text-center">
          <Eyebrow>Commercial</Eyebrow>
          <h1 className="display-lg mt-4">Parking Lot Maintenance</h1>
          <p className="lede mx-auto mt-5 text-bone/80">
            Preventative maintenance for Calgary parking lots, planned around what the pavement
            needs.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
