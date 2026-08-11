import Link from "next/link";
import { PROBLEMS } from "@/config/content";
import { Surface } from "@/components/ui/Surface";
import { Arrow, DataLabel, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Three editorial bands rather than three matching cards. The image side
 * alternates, and each band opens with the assessment reading for that
 * condition so the reader is oriented before the prose starts.
 */
export function Problems() {
  return (
    <section id="problems" className="section bg-bone text-ink">
      <div className="shell">
        <Eyebrow tone="light">Condition assessment</Eyebrow>
        <h2 className="display-lg mt-4 max-w-[18ch]">What&rsquo;s happening to your asphalt?</h2>
      </div>

      <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-32">
        {PROBLEMS.map((problem, i) => {
          const imageFirst = i % 2 === 0;
          return (
            <Reveal key={problem.id} as="article">
              <div className="shell grid items-center gap-8 md:grid-cols-2 md:gap-16">
                <div
                  className={`zoom-frame relative aspect-4/3 md:aspect-square ${
                    imageFirst ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <Surface
                    name={problem.surface}
                    alt={problem.imageAlt}
                    sizes="(min-width: 768px) 44vw, 100vw"
                  />
                </div>

                <div className={imageFirst ? "md:order-2" : "md:order-1"}>
                  <DataLabel field={problem.field} value={problem.reading} tone="light" />

                  <h3 className="display-md mt-7">{problem.title}</h3>
                  <p className="mt-5 max-w-[46ch] text-ink/70">{problem.body}</p>

                  <ul className="mt-7 flex flex-col gap-2.5">
                    {problem.signs.map((sign) => (
                      <li key={sign} className="flex items-baseline gap-3 text-sm text-ink/75">
                        {/* Marker is decorative; the text alone carries the meaning. */}
                        <span aria-hidden="true" className="h-px w-4 shrink-0 bg-red" />
                        {sign}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9 border-t border-ink/15 pt-6">
                    <p className="label text-[0.625rem] text-ink/50">TARMAX solution</p>
                    <p className="display-sm mt-2">{problem.solution}</p>
                    <Link href={problem.solutionHref} className="link-action mt-2 text-ink">
                      {problem.cta}
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
