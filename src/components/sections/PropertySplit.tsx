import Link from "next/link";
import { Surface, type SurfaceName } from "@/components/ui/Surface";
import { Arrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

const SIDES = [
  {
    kind: "Residential",
    subject: "Driveways",
    services: ["Sealcoating", "Crack sealing", "Infrared repair", "Preventative maintenance"],
    cta: "Get a driveway quote",
    href: "/free-quote?property=residential",
    surface: "driveway" as SurfaceName,
    alt: "A freshly sealed residential asphalt driveway",
  },
  {
    kind: "Commercial",
    subject: "Parking lots",
    services: [
      "Sealcoating",
      "Crack sealing",
      "Infrared repair",
      "Pothole repair",
      "Preventative maintenance",
    ],
    cta: "Get a commercial quote",
    href: "/free-quote?property=commercial",
    surface: "lot" as SurfaceName,
    alt: "Line-striping equipment on a freshly sealed and marked commercial parking lot",
  },
];

export function PropertySplit() {
  return (
    <section className="on-dark grid md:grid-cols-2">
      {/* The panels themselves are never animated. Fading a 30rem image block
          in as one lump is what reads as a glitch mid-scroll, so only the copy
          inside each panel moves. */}
      {SIDES.map((side) => (
        <article
          key={side.kind}
          className="relative isolate flex min-h-[30rem] flex-col justify-end"
        >
          <div className="absolute inset-0 -z-10">
            <Surface name={side.surface} alt={side.alt} sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30" />
          </div>

          <Reveal className="p-8 md:p-12 lg:p-16">
            <p className="label text-[0.625rem] text-alert">{side.kind}</p>
            <h2 className="display-md mt-3 text-bone">{side.subject}</h2>

            <ul className="mt-7 flex flex-col gap-2">
              {side.services.map((s) => (
                <li key={s} className="flex items-baseline gap-3 text-sm text-bone/75">
                  <span aria-hidden="true" className="h-px w-4 shrink-0 bg-white/35" />
                  {s}
                </li>
              ))}
            </ul>

            <Link href={side.href} className="btn btn-ghost mt-9">
              {side.cta}
              <Arrow />
            </Link>
          </Reveal>
        </article>
      ))}
    </section>
  );
}
