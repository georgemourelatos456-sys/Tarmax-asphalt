import type { Metadata } from "next";
import Link from "next/link";
import { Surface } from "@/components/ui/Surface";
import { Arrow, DataLabel, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Infrared Pothole Repair in Calgary — A Repair With No Seam to Fail",
  description:
    "How infrared asphalt repair works, why a seamless thermal bond outlasts a cut-and-fill patch, and when it is the wrong method. Free estimates from TARMAX Asphalt.",
  alternates: { canonical: "/infrared-repair" },
};

/**
 * Infrared repair detail page.
 *
 * The homepage "Potholes + depressions" band linked to a services anchor that
 * showed the same photograph and a quote button. Someone following that link
 * has a hole in their driveway and wants to know what will be done about it.
 *
 * The honest limit is stated plainly rather than buried: infrared reworks the
 * surface layer. Where the base underneath has failed, it is the wrong method,
 * and the page says so in its own section instead of a footnote.
 */

const PROCESS = [
  {
    step: "01",
    title: "Check what actually failed",
    body: "A pothole is a symptom. If the surface broke up but the gravel base under it is sound, infrared is the right repair. If the base has washed out or lost its strength, reheating the top will produce a repair that looks perfect and sinks again — so that area needs excavation instead, and we will tell you that before quoting.",
  },
  {
    step: "02",
    title: "Heat the existing asphalt in place",
    body: "The heater sits over the damaged area and warms it through without an open flame touching the surface. It takes several minutes. Done properly the asphalt softens all the way down through the surface layer rather than scorching on top.",
  },
  {
    step: "03",
    title: "Rake out and rejuvenate",
    body: "The softened area is raked open, the failed material broken up, and rejuvenator worked in to restore the binder that oxidation has dried out. Fresh hot mix is added where material is missing.",
  },
  {
    step: "04",
    title: "Compact into the surrounding surface",
    body: "The area is levelled and compacted while it is still hot, so the new material fuses to the old at the edges instead of merely sitting against it.",
  },
  {
    step: "05",
    title: "Leave no joint",
    body: "That fusion is the entire point. The repair cools as one continuous piece of asphalt with the surface around it, so there is no perimeter seam for water to enter through.",
  },
];

export default function InfraredRepairPage() {
  return (
    <>
      <header className="on-dark relative isolate overflow-hidden bg-ink pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="pothole" alt="" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="shell max-w-3xl">
          <Eyebrow>Infrared asphalt repair</Eyebrow>
          <h1 className="display-lg mt-4">A repair with no seam to fail.</h1>
          <p className="lede mt-5 text-bone/80">
            Cut a square out of a driveway and drop new asphalt into it and you have not removed the
            problem — you have drawn a new edge around it. Infrared repair reheats the asphalt
            already there and blends the repair into it.
          </p>
          <Link href="/free-quote" className="btn btn-primary mt-9">
            Get a repair quote
            <Arrow />
          </Link>
        </div>
      </header>

      {/* --- Why the seam matters --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">Why patches fail</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[18ch]">The edge is the weak point.</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Reveal>
              <DataLabel field="Cut-and-fill patch" value="A cold joint" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                New asphalt laid against cold asphalt does not bond to it. The two press together;
                they do not become one surface.
              </p>
            </Reveal>
            <Reveal delay={70}>
              <DataLabel field="Water finds it" value="First freeze" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                That joint is a crack the day it is finished. Water runs into it, freezes, and
                starts levering the patch away from the pavement around it.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <DataLabel field="Infrared repair" value="No joint at all" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                Because the surrounding asphalt is heated and reworked together with the repair, the
                area cools as one continuous piece. There is no perimeter for water to exploit.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Equipment --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>The equipment</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[20ch]">Heat that goes down, not just across.</h2>

          <div className="mt-10 grid items-start gap-10 md:mt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div className="max-w-[54ch]">
              <p className="lede text-bone/75">
                We run an Asphalt Kingdom R2 infrared asphalt heater.
              </p>
              <p className="mt-6 text-bone/75">
                It radiates heat down into the pavement rather than burning the surface with a
                flame. That distinction decides whether a repair works: an open torch chars the top
                few millimetres and leaves the asphalt below it cold and unworkable, while radiant
                heat brings the whole surface layer up to a temperature where it can be raked,
                rejuvenated and recompacted.
              </p>
              <p className="mt-6 text-bone/75">
                It is also why the repair can be finished the same visit. There is no saw cutting,
                no excavation, and no waiting on a load of hot mix for a patch the size of a
                dustbin lid.
              </p>
            </div>

            <Reveal className="border border-white/12 p-7 md:p-9">
              <p className="label text-[0.625rem] text-muted">What that gets you</p>
              <ul className="mt-6 flex flex-col gap-5">
                {[
                  ["No seam", "The repair fuses to the asphalt around it instead of butting against it."],
                  ["Reuses your asphalt", "The existing material is restored and reused rather than broken out and thrown away."],
                  ["Same-visit finish", "No saw cutting or excavation, so a localized repair is done and driveable quickly."],
                  ["Neat footprint", "Only the failed area is heated. The rest of the surface is untouched."],
                ].map(([title, body]) => (
                  <li key={title}>
                    <p className="font-semibold text-bone">{title}</p>
                    <p className="mt-1 text-sm text-bone/70">{body}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Process --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">The process</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[16ch]">How the repair is made.</h2>

          <ol className="mt-12 border-t border-ink/15">
            {PROCESS.map((item, i) => (
              <Reveal as="li" key={item.step} delay={i * 60}>
                <div className="grid gap-3 border-b border-ink/15 py-8 md:grid-cols-[auto_1fr_1.6fr] md:gap-10">
                  <p className="font-display text-sm font-bold text-red">{item.step}</p>
                  <h3 className="display-sm">{item.title}</h3>
                  <p className="max-w-[58ch] text-ink/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* --- The honest limit --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>When it is the wrong method</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[20ch]">Infrared does not fix everything.</h2>

          <div className="mt-10 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div className="max-w-[54ch]">
              <p className="text-bone/75">
                Infrared reworks the asphalt surface. It does not rebuild what is underneath it. If
                the gravel base has washed out, lost drainage or gone soft, a heated repair will
                look right on the day and settle again within a year or two, because nothing has
                been done about the reason it failed.
              </p>
              <p className="mt-6 text-bone/75">
                Widespread alligator cracking is the same story — that is a surface reporting a
                base problem across a whole area, not a localized failure to be patched.
              </p>
              <p className="mt-6 text-bone/75">
                We look at the area before quoting and tell you which one you have. If it needs
                rebuilding rather than reheating, we arrange that too — through contractors we work
                with and stand behind. Being told the right method is not the same as being sent
                somewhere else.
              </p>
            </div>

            <Reveal className="border-l-2 border-red pl-6">
              <p className="display-sm">
                Being told a repair is not the right answer is worth more than a repair that fails
                quietly two winters from now.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <Link href="/services" className="link-action text-bone">
              See every service
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
