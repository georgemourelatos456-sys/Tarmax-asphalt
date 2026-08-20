import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, SEALER, SITE_URL, mailtoHref } from "@/config/business";
import { Surface } from "@/components/ui/Surface";
import { Arrow, DataLabel, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { AlligatorCracks } from "@/components/ui/AlligatorCracks";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Driveway Sealcoating in Calgary — How It Works and What It Costs You Not To",
  description:
    "Why Calgary driveways fail early, what sealcoating actually does, and how a water-based asphalt emulsion compares with coal tar, acrylic and solvent sealers. Free estimates from TARMAX Asphalt.",
  alternates: { canonical: "/driveway-sealcoating" },
};

/**
 * Homeowner education page.
 *
 * Figures here are the ranges TARMAX works with, written as expectations
 * rather than promises — no surface is guaranteed a lifespan, and the copy
 * says so where it matters.
 */

/**
 * The four things a Calgary driveway actually gets sealed with.
 *
 * Written as behaviour rather than chemistry, because a homeowner is choosing
 * between outcomes. Each row says what the material does on a surface that
 * freezes and thaws forty times a winter, which is the only test that matters
 * here.
 */
const COMPARISON = [
  {
    product: "Coal tar",
    behaviour:
      "Forms a hard, brittle film on the surface. That film cracks under freeze-thaw movement. High in polycyclic aromatic hydrocarbons (PAHs), which is why a growing number of jurisdictions restrict or ban it outright.",
  },
  {
    product: "Acrylic",
    behaviour:
      "Water-based and low in odour, and it holds colour well. But it is a thin decorative film with limited fuel and oil resistance, and it is the most expensive option per square foot — so on a working driveway it tends to need redoing sooner than its price suggests.",
  },
  {
    product: "Oil-based / solvent",
    behaviour:
      "Cuts asphalt with a petroleum solvent so it penetrates. It also carries a strong odour for days, a long cure, real handling hazards while wet, and VOC limits that restrict where and when it can be used at all.",
  },
  {
    product: "Blackmac Emulsion Sealer (what we use)",
    behaviour:
      "A water-based asphalt emulsion made in Canada by McAsphalt Industries. No coal tar and no petroleum solvent carrier, so there is no solvent odour and no VOC problem — the water flashes off and asphalt is what stays on the driveway. It cures to a matte black finish that stands up to Alberta freeze-thaw, oil, gasoline and road salt.",
    highlight: true,
  },
];

const BENEFITS = [
  {
    title: "Flexibility in extreme temperatures",
    body: "The composition helps asphalt tolerate contraction in deep cold and expansion in summer heat. Brittle films crack; a flexible surface moves with the ground.",
  },
  {
    title: "Seals the surface against water",
    body: "It closes the micro-voids that open as asphalt ages, which is exactly where freeze-thaw damage starts — water gets in, freezes, and levers the surface apart. Keeping water out is most of the job.",
  },
  {
    title: "Long-lasting coverage",
    body: "One application typically lasts three to five years under residential traffic, so the driveway needs sealing less often.",
  },
  {
    title: "The look of new asphalt",
    body: "It brings back the rich black of fresh pavement. The surface stays glossy for about a week, then settles into a durable matte finish.",
  },
  {
    title: "No coal tar, no solvent carrier",
    body: "Coal-tar sealers are high in polycyclic aromatic hydrocarbons and increasingly restricted. Solvent-based sealers bring VOCs and days of odour. This is asphalt carried in water, so neither applies.",
  },
];

/**
 * The technical detail lives here rather than in the marketing sections above.
 * Anyone who wants the chemistry can find it; nobody has to read past it to
 * reach a quote.
 */
const EXPECTATIONS = [
  {
    question: "What exactly is in the sealer?",
    answer:
      "Blackmac Emulsion Sealer, manufactured in Canada by McAsphalt Industries. It is an asphalt emulsion — asphalt carried in water rather than in a petroleum solvent. The water evaporates as the sealer cures and the asphalt is what stays on the driveway. There is no coal tar in it.",
  },
  {
    question: "Can I see the safety data sheet?",
    /** Rendered with a real link below; this plain text is for FAQ schema. */
    answer:
      "Yes. Ask us and we will send you McAsphalt's current safety data sheet for it. We would rather hand you the live document than host a copy here that quietly goes out of date.",
    sdsLink: true,
  },
  {
    question: "Is the sealer safe once it has cured?",
    answer:
      "Once cured, the surface is a normal sealed driveway. Handling precautions apply to the wet product, as they do with any coating, which is one reason application is our job rather than a DIY one.",
  },
  {
    question: "How long before I can use the driveway?",
    answer:
      "About 24 hours. Keep vehicles and foot traffic off the surface while it cures, and keep ignition sources away from it while it is still wet.",
  },
  {
    question: "What about the smell?",
    answer:
      "Mild, and nothing like a solvent-based sealer. There is a faint asphaltic smell while it is wet that goes off as it dries. Nobody needs to leave the house for it.",
  },
  {
    question: "What if it gets somewhere it shouldn't?",
    answer:
      "Once it has cured it is asphalt, and it does not come off a garage door or a paving stone easily. Masking and preparation are part of the job for that reason rather than being an afterthought.",
  },
];

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/driveway-sealcoating#faq`,
    mainEntity: EXPECTATIONS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export default function DrivewaySealcoatingPage() {
  return (
    <>
      <header className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink pt-28 pb-20 md:min-h-screen md:pt-32 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="sealerEdge" alt="" sizes="100vw" priority />
          {/* Lighter on the right than the other page heroes: the point of this
              photograph is the sealed/unsealed split, and the usual wash flattens
              it into one dark texture. */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="shell max-w-3xl">
          <Eyebrow>Driveway sealcoating</Eyebrow>
          <h1 className="display-lg mt-4">
            The first thing you drive off every day.
          </h1>
          <p className="lede mt-5 text-bone/80">
            A cracked driveway raises a question about the whole property. Here is what actually
            happens to Calgary asphalt, and what sealing it does about that.
          </p>
          <Link href="/free-quote?property=residential" className="btn btn-primary mt-9">
            Get a driveway quote
            <Arrow />
          </Link>
        </div>
      </header>

      {/* --- Proof ---
          Placed before any argument about cost or chemistry, because this is
          the only claim on the page a visitor can check for themselves. */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <Reveal>
            <Eyebrow>Before and after</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[14ch]">The same surface, same week.</h2>
            <div className="mt-6 flex max-w-[46ch] flex-col gap-5 text-bone/75">
              <p>
                One of ours, photographed from the same spot before we started and after we
                finished. Drag the handle across to see it.
              </p>
              <p>
                The cracking you can see in the first frame is where water was getting in. Sealing
                closes the surface back up and puts the colour back, so the pavement stops taking
                damage every time the temperature crosses zero.
              </p>
              <p className="text-bone">
                Worth being straight about what this is: a sealed surface is a protected surface,
                not a rebuilt one. Sealing keeps sound asphalt sound. It is not a substitute for
                repair where the pavement has already broken up.
              </p>
            </div>
          </Reveal>
          <Reveal delay={70}>
            <BeforeAfter
              before="/photos/lot-before.jpg"
              after="/photos/lot-after.jpg"
              beforeAlt="A parking stall with cracking spread across the surface and a faded line"
              afterAlt="The same stall after sealing, an even black surface edge to edge"
            />
          </Reveal>
        </div>
      </section>

      {/* --- Economics --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">The arithmetic</Eyebrow>
          {/* Not "the cheap decision". The numbers below already make the cost
              argument; saying it in the headline attaches "cheap" to the work
              itself, which is the opposite of how TARMAX sells. */}
          <h2 className="display-lg mt-4 max-w-[18ch]">Maintenance is the right decision.</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Reveal>
              <DataLabel field="Unmaintained" value="15–20 years" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                Typical service life for asphalt in Alberta with no maintenance plan.
              </p>
            </Reveal>
            <Reveal delay={70}>
              <DataLabel field="Maintained every 2–3 years" value="30 years or more" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                Achievable where inspection shows the surface is still sound. Every driveway is
                different, which is why we look before we quote.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <DataLabel field="Full replacement" value="~$8 per sq ft" tone="light" />
              <p className="mt-4 max-w-[34ch] text-sm text-ink/70">
                Average cost of replacing asphalt — around twenty times what it costs to seal the
                same area.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-14 max-w-[60ch] border-l-2 border-red pl-6">
            <p className="text-lg text-ink/80">
              Sealing is often dismissed as cosmetic, or as an expensive luxury with no real
              benefit. The comparison that matters is not sealing versus nothing — it is sealing
              versus replacing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --- Climate --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <div>
            <Eyebrow>Calgary conditions</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[12ch]">Dried in summer. Split in winter.</h2>
          </div>
          <Reveal>
            <div className="flex max-w-[54ch] flex-col gap-5 text-lg text-bone/75">
              <p>
                Calgary gets hot, dry summers and bitterly cold winters, with frequent freeze-thaw
                cycles in between.
              </p>
              <p>
                Summer dries the asphalt out and opens cracks. Winter fills those cracks with water,
                freezes it, and expands them. The two seasons work on the same defect from opposite
                directions.
              </p>
              <p className="text-bone">
                UV exposure and freeze-thaw are not separate problems. They are the same problem,
                six months apart.
              </p>
            </div>
            <Link href="/#freeze-thaw" className="link-action mt-8 text-bone">
              See the freeze-thaw cycle
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- Curb appeal --- */}
      <section className="section bg-bone text-ink">
        <div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="zoom-frame relative aspect-4/3 md:order-2">
            <Surface
              name="driveway"
              alt="A freshly sealed driveway with a deep black matte finish"
              sizes="(min-width: 768px) 46vw, 100vw"
            />
          </Reveal>
          <Reveal className="md:order-1">
            <Eyebrow tone="light">Curb appeal</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[14ch]">It sets the standard on the street.</h2>
            <div className="mt-6 flex max-w-[50ch] flex-col gap-5 text-ink/75">
              <p>
                A good home is more than a cut lawn and a tidy patio. The driveway is the first
                thing you cross every morning and the first thing a visitor sees.
              </p>
              <p>
                Everyone knows what happens when a neighbour cuts their lawn — it lifts the standard
                for the whole block. Sealcoating does the same thing, except it lasts all year and
                it protects the surface underneath.
              </p>
              <p>
                And when it comes time to sell, people put a value on walking up to a jet black
                driveway.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Product --- */}
      <section className="on-dark relative isolate overflow-hidden bg-ink">
        <Seam />
        {/* Cracking runs the full width of the section behind everything,
            fading out towards the copy on the left. */}
        <AlligatorCracks className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
        <div className="section shell">
          <Eyebrow>The product</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[16ch]">Stitches, not a bandaid.</h2>

          {/* The copy previously ran full width with a 3.5rem hole between the
              lede and the detail, which read as a mistake rather than a pause.
              One column of prose at a comfortable measure, the cracking figure
              filling the space beside it, and an even rhythm between
              paragraphs. */}
          <div className="mt-10 md:mt-12">
            <div className="max-w-[54ch]">
              <p className="lede text-bone/75">
                Coal tar and acrylic put a different material over the top of your driveway and
                hope it holds. We reseal asphalt with asphalt.
              </p>
              <p className="mt-6 text-bone/75">
                Blackmac Emulsion Sealer is made in Canada by McAsphalt Industries. It is an asphalt
                emulsion — asphalt carried in water instead of a petroleum solvent. The water
                evaporates as it cures and what stays on the driveway is the same material the
                surface is already made of, which is why it moves with the pavement instead of
                cracking off it.
              </p>
              <p className="mt-6 text-bone/75">
                We source it locally rather than buying buckets off a hardware store shelf, because
                a product built for freeze-thaw is the entire point.
              </p>
            </div>
          </div>

          <h3 className="display-sm mt-16">How it compares</h3>
          <ul className="mt-8 border-t border-white/12">
            {COMPARISON.map((row, i) => (
              <Reveal as="li" key={row.product} delay={i * 70}>
                {/* The highlighted row is pulled left by exactly the padding
                    the red rule adds, so the rule sits out in the gutter and
                    the text still lines up with every other row in the table.
                    Padding alone would indent the whole row and read as a
                    mistake. */}
                <div
                  className={`grid gap-3 border-b border-white/12 py-7 md:grid-cols-[1fr_1.8fr] md:gap-12 ${
                    row.highlight ? "-ml-5 border-l-2 border-l-red pl-5 md:-ml-6 md:pl-6" : ""
                  }`}
                >
                  <h4 className={`display-sm ${row.highlight ? "text-bone" : "text-muted"}`}>
                    {row.product}
                  </h4>
                  <p
                    className={`max-w-[58ch] ${
                      row.highlight ? "font-semibold text-bone" : "text-bone/70"
                    }`}
                  >
                    {row.behaviour}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Benefits --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">What you get</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[16ch]">Five things it actually does.</h2>
          <ul className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 60}>
                <div className="border-t border-ink/20 pt-6">
                  <h3 className="display-sm">{b.title}</h3>
                  <p className="mt-3 max-w-[46ch] text-ink/70">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Expectations --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>Before you book</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[16ch]">Straight answers.</h2>
          <dl className="mt-12 border-t border-white/12">
            {EXPECTATIONS.map((item, i) => (
              <Reveal key={item.question} delay={i * 60}>
                <div className="grid gap-3 border-b border-white/12 py-7 md:grid-cols-[1fr_1.5fr] md:gap-12">
                  <dt className="display-sm">{item.question}</dt>
                  <dd className="max-w-[58ch] text-bone/70">
                    {item.answer}
                    {/* Links to the manufacturer's sheet when one is configured;
                        offers it by email until then. Never links a guess. */}
                    {"sdsLink" in item &&
                      (SEALER.sdsUrl ? (
                        <a
                          href={SEALER.sdsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-action mt-2 flex text-bone"
                        >
                          {SEALER.product} safety data sheet (PDF)
                          <Arrow />
                          <span className="sr-only">
                            {" "}
                            — opens on the {SEALER.manufacturer} website
                          </span>
                        </a>
                      ) : (
                        <a
                          href={mailtoHref(BUSINESS.generalEmail, `${SEALER.product} safety data sheet`)}
                          className="link-action mt-2 flex text-bone"
                        >
                          Request the safety data sheet
                          <Arrow />
                        </a>
                      ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <FinalCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
