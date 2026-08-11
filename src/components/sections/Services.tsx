import Link from "next/link";
import { SERVICES } from "@/config/content";
import { Surface } from "@/components/ui/Surface";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

/**
 * An index, not a card grid: the first service spans the full width, the rest
 * sit in a tighter row beneath. Photography does the work that icons would
 * otherwise be doing.
 */
export function Services() {
  const [lead, ...rest] = SERVICES;

  return (
    <section id="services" className="section bg-bone text-ink">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone="light">What we do</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[16ch]">Complete asphalt maintenance</h2>
          </div>
          <Link href="/services" className="link-action text-ink">
            All services
            <Arrow />
          </Link>
        </div>

        <Reveal className="mt-14 md:mt-20">
          <Link
            href={`/services#${lead.id}`}
            className="zoom-frame group relative block aspect-16/10 md:aspect-[21/8]"
          >
            <Surface name={lead.surface} alt={lead.imageAlt} sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
            <div className="on-dark absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="label text-[0.625rem] text-muted">Most requested</p>
              <h3 className="display-md mt-2 text-bone">{lead.name}</h3>
              <p className="mt-3 max-w-[52ch] text-sm text-bone/75">{lead.summary}</p>
            </div>
          </Link>
        </Reveal>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((service, i) => (
            <Reveal as="li" key={service.id} delay={i * 70}>
              <Link href={`/services#${service.id}`} className="zoom-frame group block">
                <div className="relative aspect-4/3">
                  <Surface
                    name={service.surface}
                    alt={service.imageAlt}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <h3 className="display-sm mt-5">{service.name}</h3>
                <p className="mt-2 text-sm text-ink/65">{service.summary}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
