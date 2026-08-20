import type { Metadata } from "next";
import Link from "next/link";
import { Surface } from "@/components/ui/Surface";
import { Arrow, DataLabel, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Hot Rubber Crack Sealing in Calgary — Done Properly, Not Poured From a Bottle",
  description:
    "Why cracks are where asphalt fails first, how hot-applied rubberized crack sealing works, and the preparation that decides whether it lasts. Free estimates from TARMAX Asphalt.",
  alternates: { canonical: "/crack-sealing" },
};

/**
 * Crack sealing detail page.
 *
 * The homepage sends visitors here from the "Large cracks" band, where the
 * link previously landed on a services anchor that repeated the same image and
 * a quote button. Anyone following a "learn about crack sealing" link has a
 * crack they are worried about; this page answers what happens to it and what
 * doing the job properly involves.
 *
 * Claims are about method, which TARMAX controls, rather than about outcomes
 * it cannot promise. A sealed crack is not permanently watertight and the copy
 * does not say it is.
 */

/** The sequence, and why each step exists. The argument is in step order. */
const PROCESS = [
  {
    step: "01",
    title: "Assess before quoting",
    body: "Different cracks need different work. A crack with broken, crumbling edges needs those edges cut back first; a surface that has gone to alligator cracking needs rebuilding rather than sealing. We tell you which one you have, quote the work that suits it, and handle it either way.",
  },
  {
    step: "02",
    title: "Clean the crack out",
    body: "A crack full of dirt, gravel and vegetation gives sealant nothing to bond to. It gets cut back and blown clean, wall to wall, so the sealant meets asphalt rather than debris. This is the step that gets skipped, and it is the step that decides whether the work lasts.",
  },
  {
    step: "03",
    title: "Dry it",
    body: "Hot rubber will not bond to a damp crack. Sealing over moisture buys a repair that lifts within a season, so if the crack is wet it gets dried or the work waits for the weather.",
  },
  {
    step: "04",
    title: "Seal at pour temperature",
    body: "Rubberized sealant is melted to its working temperature and poured into the crack while it is hot, so it flows to the bottom and bonds to both walls. Too cool and it sits on top as a bead that traffic peels away.",
  },
  {
    step: "05",
    title: "Finish flush",
    body: "The bead is struck flat to the surface. A proud bead catches plough blades and tyres; a starved one leaves a channel for water. Flush is what survives a Calgary winter.",
  },
];


export default function CrackSealingPage() {
  return (
    <>
      <header className="on-dark relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink pt-28 pb-20 md:min-h-screen md:pt-32 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="crackedLot" alt="" sizes="100vw" priority />
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
          <Eyebrow>Hot rubber crack sealing</Eyebrow>
          <h1 className="display-lg mt-4">Cracks are where the water gets in.</h1>
          <p className="lede mx-auto mt-5 text-bone/80">
            Everything that destroys asphalt in Alberta starts with water reaching the layers
            underneath. A crack is the door. Sealing it properly is the smallest job on the list —
            and the one that stops the expensive ones happening.
          </p>
          <Link href="/free-quote" className="btn btn-primary mt-9">
            Get a crack sealing quote
            <Arrow />
          </Link>
        </div>
      </header>

      {/* --- Why it matters --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">What an open crack does</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[18ch]">Water in, winter does the rest.</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Reveal>
              <DataLabel field="Water enters" value="Through the crack" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                Rain and melt run into the opening and soak the gravel base the asphalt is resting
                on.
              </p>
            </Reveal>
            <Reveal delay={70}>
              <DataLabel field="It freezes" value="Expands ~9%" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                Freezing water expands and levers the crack wider. Calgary swings across zero far
                more often than a single winter freeze, and each cycle takes another bite.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <DataLabel field="The base softens" value="Then it fails" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                A saturated base loses its load-bearing strength. Traffic then breaks the
                unsupported surface — which is how a crack becomes a pothole.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-14 max-w-[60ch] border-l-2 border-red pl-6">
            <p className="text-ink/80">
              Sealing a crack is not a permanent fix and nobody should tell you it is. Pavement
              keeps moving, and a sealed crack is maintained rather than cured. What it does is
              keep water out through the seasons that would otherwise turn a five-minute job into a
              patch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --- Equipment --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>The equipment</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[20ch]">Hot-applied, not poured from a bottle.</h2>

          <div className="mt-10 grid items-start gap-10 md:mt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div className="max-w-[54ch]">
              <p className="lede text-bone/75">
                We run an Asphalt Kingdom RY10 Pro — a self-contained melter and applicator for
                hot-pour rubberized sealant.
              </p>
              <p className="mt-6 text-bone/75">
                The melter brings the sealant up to pour temperature and holds it there, so it goes
                into the crack as a liquid and flows to the bottom rather than bridging across the
                top. It is applied through a wand directly into the crack, which is what lets a
                bead be laid at a controlled width instead of smeared over the surface.
              </p>
              <p className="mt-6 text-bone/75">
                That is the entire difference between crack sealing and crack filling. Filling puts
                something in the gap. Sealing bonds to both walls of the crack and stays flexible
                while the pavement moves underneath it.
              </p>
            </div>

            <Reveal className="border border-white/12 p-7 md:p-9">
              <p className="label text-[0.625rem] text-muted">Why it matters on a driveway</p>
              <ul className="mt-6 flex flex-col gap-5">
                {[
                  ["Melted properly", "Sealant held at working temperature flows into the crack instead of sitting on it."],
                  ["Applied hot", "A hot bead bonds to the crack walls. A cold one is a plug waiting to lift."],
                  ["Stays flexible", "Rubberized sealant moves with the pavement through freeze-thaw rather than cracking beside it."],
                  ["Controlled bead", "Poured through a wand at a set width, finished flush, so ploughs and tyres pass over it."],
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
          <h2 className="display-lg mt-4 max-w-[16ch]">Sealing done without shortcuts.</h2>
          <p className="mt-5 max-w-[52ch] text-ink/70">
            Most crack sealing that fails did not fail because of the sealant. It failed because of
            what happened — or did not happen — in the ten minutes before the sealant went in.
          </p>

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

          <Reveal className="mt-12">
            <Link href="/services" className="link-action text-ink">
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
