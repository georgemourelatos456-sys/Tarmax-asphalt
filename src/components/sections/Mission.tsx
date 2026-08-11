import Link from "next/link";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";

export function Mission() {
  return (
    <section id="mission" className="on-dark bg-ink">
      <Seam />
      <div className="section shell">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div>
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="display-lg mt-4 max-w-[12ch]">Maintenance before replacement.</h2>
          </div>

          <Reveal>
            <div className="flex flex-col gap-6 text-lg text-bone/75">
              <p>Asphalt does not fail overnight.</p>
              <p>
                Weather, traffic, moisture, ultraviolet exposure and seasonal temperature changes
                gradually deteriorate pavement.
              </p>
              <p>
                TARMAX focuses on identifying problems early and recommending appropriate
                preventative maintenance before deterioration becomes significantly more expensive
                to address.
              </p>
            </div>
            <Link href="/free-quote" className="btn btn-primary mt-10">
              Get a Free Quote
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
