import Link from "next/link";
import { DIRECTORS, telHref } from "@/config/business";
import { Surface } from "@/components/ui/Surface";
import { Arrow } from "@/components/ui/Labels";

export function FinalCta() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10">
        <Surface name="hero" alt="" sizes="100vw" className="opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </div>

      <div className="section shell text-center">
        <h2 className="display-lg mx-auto max-w-[14ch]">Need an asphalt quote?</h2>
        <p className="lede mx-auto mt-6 text-bone/75">
          Send us the property address and a way to contact you. TARMAX will handle the rest.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/free-quote" className="btn btn-primary">
            Get a Free Quote
            <Arrow />
          </Link>
          <a href={telHref(DIRECTORS[0])} className="btn btn-ghost">
            Call TARMAX
          </a>
        </div>
      </div>
    </section>
  );
}
