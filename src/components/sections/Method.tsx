import Link from "next/link";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Why the choices behind the work matter.
 *
 * Replaces a generic list of virtues. Anyone can say "quality workmanship";
 * these are the two decisions a customer can actually check — what goes on the
 * surface, and what applies it — plus the assessment that comes before both.
 */
const DECISIONS = [
  {
    kicker: "The material",
    title: "The sealer is the job.",
    body: "Coal tar and acrylic put a different material over the top of your driveway and hope it holds. We use Blackmac Emulsion Sealer, made in Canada by McAsphalt — asphalt carried in water, not in a petroleum solvent. No coal tar, no solvent odour. Resealing asphalt with asphalt is the difference between stitches and a bandaid.",
    link: { label: "How the sealer works", href: "/driveway-sealcoating" },
  },
  {
    kicker: "The equipment",
    title: "Industrial gear, not buckets.",
    body: "Hot-applied rubberized crack sealing needs a proper melter and wand to get material into the crack at temperature. Infrared repair needs a heater that brings existing asphalt back to a workable state. Neither job can be done properly off a hardware store shelf, and we do not pretend otherwise.",
    link: { label: "See the services", href: "/services" },
  },
  {
    kicker: "The order of operations",
    title: "Assess first, quote second.",
    body: "We look at the pavement before recommending anything, and preparation is part of the job rather than an afterthought. Weather, drainage, curing conditions and runoff routes are all considered before work begins. If a surface needs more than maintenance we say so, and we take care of that too.",
    link: null,
  },
];

export function Method() {
  return (
    <section className="section bg-bone text-ink">
      <div className="shell">
        <Eyebrow tone="light">Why it matters what we use</Eyebrow>
        <h2 className="display-lg mt-4 max-w-[18ch]">Maintenance done properly.</h2>

        <ul className="mt-14 border-t border-ink/15 md:mt-20">
          {DECISIONS.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <div className="grid gap-4 border-b border-ink/15 py-9 md:grid-cols-[1fr_1.6fr] md:gap-14">
                <div>
                  <p className="label text-[0.625rem] text-ink/65">{item.kicker}</p>
                  <h3 className="display-sm mt-3">{item.title}</h3>
                </div>
                <div>
                  <p className="max-w-[58ch] text-ink/70">{item.body}</p>
                  {item.link && (
                    <Link href={item.link.href} className="link-action mt-3 text-ink">
                      {item.link.label}
                      <Arrow />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
