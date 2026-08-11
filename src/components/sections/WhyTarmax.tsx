import { PILLARS } from "@/config/content";
import { Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Five statements about how the work is done. Laid out as a rule-separated
 * list rather than icon cards — there is no icon that means "we assess first",
 * and inventing one would be decoration.
 */
export function WhyTarmax() {
  return (
    <section className="section bg-bone text-ink">
      <div className="shell">
        <Eyebrow tone="light">Why TARMAX</Eyebrow>
        <h2 className="display-lg mt-4 max-w-[14ch]">Maintenance done properly.</h2>

        <ul className="mt-14 border-t border-ink/15 md:mt-20">
          {PILLARS.map((pillar, i) => (
            <Reveal as="li" key={pillar.title} delay={i * 60}>
              <div className="grid items-baseline gap-2 border-b border-ink/15 py-7 md:grid-cols-[1fr_1.6fr] md:gap-10 md:py-9">
                <h3 className="display-sm">{pillar.title}</h3>
                <p className="max-w-[58ch] text-ink/70">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
