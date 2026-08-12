import type { Metadata } from "next";
import Link from "next/link";
import { SEALER, SITE_URL } from "@/config/business";
import { Surface } from "@/components/ui/Surface";
import { Arrow, DataLabel, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Driveway Sealcoating in Calgary — How It Works and What It Costs You Not To",
  description:
    "Why Calgary driveways fail early, what sealcoating actually does, and how a penetrating sealer differs from coal tar and surface emulsions. Free estimates from TARMAX Asphalt.",
  alternates: { canonical: "/driveway-sealcoating" },
};

/**
 * Homeowner education page.
 *
 * Figures here are the ranges TARMAX works with, written as expectations
 * rather than promises — no surface is guaranteed a lifespan, and the copy
 * says so where it matters.
 */

const COMPARISON = [
  {
    product: "Coal tar",
    behaviour:
      "Forms a hard, brittle film on the surface. That film cracks under freeze-thaw movement. High in polycyclic aromatic hydrocarbons (PAHs) and increasingly restricted for environmental reasons.",
  },
  {
    product: "Water-based emulsion",
    behaviour:
      "Better suited to cold climates than coal tar, and the option most bucket products off a hardware store shelf fall into. It still sits on top of the pavement and wears off comparatively quickly.",
  },
  {
    product: "Blackmac (what we use)",
    behaviour:
      "Soaks into the asphalt instead of forming a film, reconditioning oxidized binder so the surface regains flexibility. Contains no coal tar. Cures to a matte black finish that resists oil, gasoline and salt.",
    highlight: true,
  },
];

const BENEFITS = [
  {
    title: "Flexibility in extreme temperatures",
    body: "The composition helps asphalt tolerate contraction in deep cold and expansion in summer heat. Brittle films crack; a flexible surface moves with the ground.",
  },
  {
    title: "Protection that penetrates",
    body: "Because it soaks in, it strengthens the top layer rather than covering it. That slows raveling and keeps water out of micro-voids, which is where freeze-thaw damage starts.",
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
    title: "No coal tar",
    body: "Coal-tar sealers are high in polycyclic aromatic hydrocarbons and increasingly restricted. Blackmac contains none.",
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
      "Blackmac, manufactured in Canada by McAsphalt Industries. Its safety data sheet lists asphalt/bitumen (40–70%) carried in hydrotreated heavy naphtha (30–60%). The carrier is what lets it soak into the surface instead of forming a film; it flashes off as the sealer cures and the bitumen stays in the pavement. There is no coal tar in it.",
  },
  {
    question: "Can I see the safety data sheet?",
    /** Rendered with a real link below; this plain text is for FAQ schema. */
    answer:
      "Yes. McAsphalt publishes the Blackmac safety data sheet and we link to their copy directly, so you are always reading the current revision rather than one we saved.",
    sdsLink: true,
  },
  {
    question: "Is the sealer safe once it has cured?",
    answer:
      "The handling precautions apply to the wet product, which is why application is our job and not a DIY one. Our crews are trained in handling it. Once cured, the surface is a normal sealed driveway.",
  },
  {
    question: "How long before I can use the driveway?",
    answer:
      "About 24 hours. Keep vehicles and foot traffic off the surface while it cures, and keep ignition sources away from it while it is still wet.",
  },
  {
    question: "What about the smell?",
    answer:
      "There is a distinct asphaltic odour during application and while it cures. It dissipates within a day or two.",
  },
  {
    question: "What if it gets somewhere it shouldn't?",
    answer:
      "The product is not water-soluble, so overspray does not simply wash off. That is exactly why masking and preparation are part of the job rather than an afterthought.",
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
      <header className="on-dark relative isolate overflow-hidden bg-ink pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="driveway" alt="" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
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
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>The product</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[16ch]">Stitches, not a bandaid.</h2>
          <p className="lede mt-6 text-bone/75">
            A sealer that sits on top of the pavement is a waterproof layer over a problem. Black
            Mac soaks in and reconditions the binder, so the asphalt can move the way it is supposed
            to.
          </p>

          <div className="mt-14 max-w-[62ch]">
            <p className="text-bone/75">
              Blackmac is a penetrating sealer manufactured in Canada by McAsphalt Industries. It
              soaks into the surface and re-moisturizes the asphalt rather than sitting on top of
              it, so the pavement regains flexibility and can withstand ground movement.
            </p>
            <p className="mt-5 text-bone/75">
              We source it locally rather than buying buckets off a hardware store shelf, because a
              chemically balanced product built for freeze-thaw is the entire point.
            </p>
          </div>

          <h3 className="display-sm mt-16">How it compares</h3>
          <ul className="mt-8 border-t border-white/12">
            {COMPARISON.map((row, i) => (
              <Reveal as="li" key={row.product} delay={i * 70}>
                <div
                  className={`grid gap-3 border-b border-white/12 py-7 md:grid-cols-[1fr_1.8fr] md:gap-12 ${
                    row.highlight ? "border-l-2 border-l-red pl-5 md:pl-6" : ""
                  }`}
                >
                  <h4 className={`display-sm ${row.highlight ? "text-bone" : "text-muted"}`}>
                    {row.product}
                  </h4>
                  <p className="max-w-[58ch] text-bone/70">{row.behaviour}</p>
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
                    {"sdsLink" in item && (
                      <a
                        href={SEALER.sdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-action mt-2 flex text-bone"
                      >
                        {SEALER.product} safety data sheet (PDF)
                        <Arrow />
                        <span className="sr-only"> — opens on the {SEALER.manufacturer} website</span>
                      </a>
                    )}
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
