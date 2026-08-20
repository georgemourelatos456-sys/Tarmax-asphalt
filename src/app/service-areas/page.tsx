import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { LOCATIONS } from "@/config/locations";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Service Areas — Asphalt Maintenance Across Calgary and Alberta",
  description:
    "TARMAX Asphalt works across Calgary, Airdrie, Cochrane, Okotoks, Chestermere and Strathmore, and travels further across Alberta for larger commercial contracts.",
  alternates: { canonical: "/service-areas" },
};

/**
 * The service-area index.
 *
 * It also carries the honest version of "how far do you go?", which matters
 * more than it looks: routine residential work is a Calgary-region business,
 * while a large commercial contract can justify travelling much further. Those
 * are two different answers and running them together would mislead somebody
 * in Edmonton into expecting a driveway quote.
 */
export default function ServiceAreasPage() {
  return (
    <>
      <header className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink pt-28 pb-20 md:min-h-screen md:pt-32 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-ink" />
        <div className="shell max-w-3xl">
          <Eyebrow>Where we work</Eyebrow>
          <h1 className="display-lg mt-4">Calgary, the towns around it, and further for the right job.</h1>
          <p className="lede mt-5 text-bone/80">
            {BUSINESS.name} is based in {BUSINESS.city}. Driveways and parking lots across the city
            and the communities around it, with larger commercial contracts taking us further across
            Alberta.
          </p>
          <Link href="/free-quote" className="btn btn-primary mt-9">
            Get a free quote
            <Arrow />
          </Link>
        </div>
      </header>

      {/* --- The towns --- */}
      <section className="section bg-bone text-ink">
        <div className="shell">
          <Eyebrow tone="light">Regular service area</Eyebrow>
          <h2 className="display-lg mt-4 max-w-[20ch]">Where the truck goes most weeks.</h2>
          <p className="mt-6 max-w-[58ch] text-ink/70">
            Residential and commercial work in all of these, quoted on the same terms as Calgary.
            The drive does not change the price.
          </p>

          <ul className="mt-14 border-t border-ink/15">
            {LOCATIONS.map((location, i) => (
              <Reveal as="li" key={location.slug} delay={i * 60}>
                <Link
                  href={`/service-areas/${location.slug}`}
                  className="grid gap-3 border-b border-ink/15 py-8 md:grid-cols-[1fr_1.6fr] md:gap-14"
                >
                  <div>
                    <h3 className="display-sm">{location.name}</h3>
                    <p className="label mt-2 text-[0.625rem] text-ink/55">{location.proximity}</p>
                  </div>
                  <div>
                    <p className="max-w-[58ch] text-ink/70">{location.lede}</p>
                    <span className="link-action mt-3 text-ink">
                      Asphalt maintenance in {location.name}
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --- The rest of the province --- */}
      <section className="on-dark bg-ink">
        <Seam />
        <div className="section shell grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div className="max-w-[54ch]">
            <Eyebrow>Further afield</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[18ch]">The rest of Alberta, honestly.</h2>
            <p className="mt-6 text-bone/75">
              For a large enough commercial contract — a parking lot, a multi-site property
              portfolio, a managed complex — the travel is worth it and we will quote work well
              outside the Calgary region. Red Deer, Lethbridge, Edmonton and the communities around
              them are all reachable for that kind of job.
            </p>
            <p className="mt-6 text-bone/75">
              What we will not do is pretend a single driveway three hours away makes sense for
              either of us. If you are outside the towns listed above and you want a residential
              quote, call and ask — the answer depends on what else we have booked in that
              direction, and we would rather tell you straight than take the booking and let you
              down.
            </p>
          </div>

          <Reveal className="border-l-2 border-red pl-6 md:self-center">
            <p className="display-sm">
              Ask. A commercial lot anywhere in Alberta is a conversation worth having.
            </p>
            <Link href="/commercial" className="link-action mt-6 text-bone">
              Commercial and parking lots
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
