import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS, SITE_URL } from "@/config/business";
import { LOCATIONS, locationBySlug } from "@/config/locations";
import { Surface } from "@/components/ui/Surface";
import { Arrow, DataLabel, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { CallButton } from "@/components/ui/CallButton";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * One page per community TARMAX routinely works in.
 *
 * These exist to answer a real question — "do they come out here, and do they
 * know what the pavement is like?" — not to catch a search term. Every page is
 * built from that town's own conditions and property mix, because a set of
 * pages that differ only in the place name is a doorway page, and Google
 * penalises the site rather than just the page.
 *
 * The services themselves are described once, on the service pages, and linked
 * to from here. Restating them per town would be the duplication this file is
 * structured to avoid.
 */

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ city: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const location = locationBySlug(city);
  if (!location) return {};

  return {
    title: `Asphalt Sealcoating & Repair in ${location.name}, AB — TARMAX Asphalt`,
    description: `Sealcoating, hot rubber crack sealing and infrared pothole repair for driveways and parking lots in ${location.name}. ${location.proximity}. Free estimates from TARMAX Asphalt.`,
    alternates: { canonical: `/service-areas/${location.slug}` },
  };
}

/** Ties the service catalogue to this specific town for local search. */
function areaSchema(name: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/service-areas/${slug}#service`,
    serviceType: "Asphalt maintenance",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name, containedInPlace: { "@type": "State", name: "Alberta" } },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Asphalt maintenance in ${name}`,
      itemListElement: [
        "Driveway sealcoating",
        "Hot rubber crack sealing",
        "Infrared asphalt repair",
        "Parking lot maintenance",
      ].map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `${service} in ${name}`, areaServed: name },
      })),
    },
  };
}

const SERVICES = [
  {
    name: "Sealcoating",
    href: "/driveway-sealcoating",
    body: "Blackmac Emulsion Sealer — asphalt carried in water, not in a petroleum solvent. Closes the surface against water and brings the colour back.",
  },
  {
    name: "Hot rubber crack sealing",
    href: "/crack-sealing",
    body: "Rubberised material applied hot with a proper melter and wand, so it reaches the bottom of the crack rather than bridging the top of it.",
  },
  {
    name: "Infrared pothole repair",
    href: "/infrared-repair",
    body: "The existing asphalt is heated, reworked and recompacted, so the repair fuses to the surface around it instead of sitting in a cut-out square.",
  },
  {
    name: "Parking lot maintenance",
    href: "/commercial",
    body: "The whole lot in the right order, for property managers, condo boards, retail and managed parking.",
  },
];

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const location = locationBySlug(city);
  if (!location) notFound();

  const others = LOCATIONS.filter((l) => l.slug !== location.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaSchema(location.name, location.slug)) }}
      />

      <header className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink pt-28 pb-20 md:min-h-screen md:pt-32 md:pb-28">
        <div className="absolute inset-0 -z-10">
          <Surface name="sealerEdge" alt="" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="shell max-w-3xl">
          <Eyebrow>Asphalt maintenance in {location.name}</Eyebrow>
          <h1 className="display-lg mt-4">{location.lede}</h1>
          <p className="lede mt-5 text-bone/80">
            {location.proximity}. Sealcoating, crack sealing and pothole repair for driveways and
            parking lots, quoted the same way we quote them in Calgary.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/free-quote" className="btn btn-primary">
              Get a free quote
              <Arrow />
            </Link>
            <CallButton className="btn btn-ghost" />
          </div>
        </div>
      </header>

      {/* --- What is different here --- */}
      <section className="section bg-bone text-ink">
        <div className="shell grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div>
            <Eyebrow tone="light">Local conditions</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[16ch]">What the pavement is up against.</h2>
          </div>
          <Reveal>
            <p className="lede text-ink/75">{location.conditions}</p>
            <p className="mt-6 max-w-[58ch] text-ink/70">{location.properties}</p>
            <Link href="/#freeze-thaw" className="link-action mt-8 text-ink">
              How freeze-thaw damage works
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- Worth knowing --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell">
          <Eyebrow>Before you call</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[18ch]">
            Three things worth knowing in {location.name}.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {location.notes.map((note, i) => (
              <Reveal key={note} delay={i * 70}>
                <DataLabel field={`0${i + 1}`} value={location.name} />
                <p className="mt-4 max-w-[34ch] text-sm text-bone/70">{note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Services --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">What we do here</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[20ch]">
            The same equipment that goes out in Calgary.
          </h2>

          <ul className="mt-12 border-t border-ink/15">
            {SERVICES.map((service, i) => (
              <Reveal as="li" key={service.name} delay={i * 60}>
                <Link
                  href={service.href}
                  className="group grid gap-3 border-b border-ink/15 py-8 md:grid-cols-[1fr_1.6fr] md:gap-14"
                >
                  <h3 className="display-sm">
                    {service.name} in {location.name}
                  </h3>
                  <div>
                    <p className="max-w-[58ch] text-ink/70">{service.body}</p>
                    <span className="link-action mt-3 text-ink">
                      Read more
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Other areas --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section-tight shell">
          <Eyebrow>Also working in</Eyebrow>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {others.map((other) => (
              <li key={other.slug}>
                <Link href={`/service-areas/${other.slug}`} className="link-action text-bone">
                  {other.name}
                  <Arrow />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/service-areas" className="link-action text-bone">
                Every area
                <Arrow />
              </Link>
            </li>
          </ul>
          <p className="mt-8 max-w-[58ch] text-sm text-bone/60">
            {BUSINESS.name} is based in {BUSINESS.city}. For larger commercial contracts we travel
            further across Alberta — if you are outside this list, call and ask.
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
