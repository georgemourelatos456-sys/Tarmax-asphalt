import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/config/content";
import { Surface } from "@/components/ui/Surface";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { AlligatorCracks } from "@/components/ui/AlligatorCracks";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Asphalt Maintenance Services in Calgary",
  description:
    "Sealcoating, hot rubber crack sealing, infrared asphalt repair, commercial parking lot maintenance and residential driveway maintenance across Calgary and surrounding communities.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <header className="on-dark relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink pt-28 pb-16 md:min-h-screen md:pt-32 md:pb-24">
        {/* This is the one header with no photograph behind it, so at full
            height it would otherwise be a screen of flat black. The cracking
            fills it and ties the page to the hero. */}
        <AlligatorCracks variant="hero" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="shell text-center">
          <Eyebrow>Services</Eyebrow>
          <h1 className="display-lg mt-4">Complete asphalt maintenance</h1>
          <p className="lede mx-auto mt-5 text-bone/75">
            Five services, one approach: look at the pavement first, then recommend only what it
            needs.
          </p>
        </div>
      </header>

      <div className="bg-bone text-ink">
        {SERVICES.map((service, i) => (
          <section
            key={service.id}
            id={service.id}
            className={i === 0 ? "section-tight" : "section-tight border-t border-ink/12"}
          >
            <Reveal>
              <div className="shell grid gap-8 md:grid-cols-2 md:gap-16">
                <div
                  className={`zoom-frame relative aspect-4/3 ${i % 2 === 0 ? "md:order-1" : "md:order-2"}`}
                >
                  <Surface
                    name={service.surface}
                    alt={service.imageAlt}
                    sizes="(min-width: 768px) 46vw, 100vw"
                  />
                </div>

                <div className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
                  <h2 className="display-md">{service.name}</h2>
                  <p className="mt-5 max-w-[52ch] text-ink/70">{service.detail}</p>

                  <h3 className="label mt-9 text-[0.625rem] text-ink/65">Best suited to</h3>
                  <ul className="mt-4 flex flex-col gap-2">
                    {service.bestFor.map((item) => (
                      <li key={item} className="flex items-baseline gap-3 text-sm text-ink/75">
                        <span aria-hidden="true" className="h-px w-4 shrink-0 bg-red" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link href="/free-quote" className="link-action mt-8 text-ink">
                    Get a quote for this
                    <Arrow />
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <Seam tone="dark" />
      <FinalCta />
    </>
  );
}
