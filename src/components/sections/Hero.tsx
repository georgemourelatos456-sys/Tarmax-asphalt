import Link from "next/link";
import { Surface } from "@/components/ui/Surface";
import { Arrow } from "@/components/ui/Labels";
import { CallButton } from "@/components/ui/CallButton";
import { AlligatorCracks } from "@/components/ui/AlligatorCracks";

const TRUST = ["Calgary based", "Residential", "Commercial", "Free estimates"];

export function Hero() {
  return (
    <section className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink pt-28 md:min-h-[100svh] md:pt-32">
      {/* Full-bleed sealed asphalt. The scrim is weighted to the lower-left,
          where the copy sits, so the right side stays visibly material. */}
      <div className="absolute inset-0 -z-10">
        <Surface name="hero" alt="" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/35 to-transparent md:via-ink/15" />
        {/* Above the scrim, so the red is not dimmed by it, and masked on the
            diagonal so it stays out of the headline's corner. */}
        <AlligatorCracks variant="hero" className="absolute inset-0 h-full w-full" />
      </div>

      <div className="shell w-full pb-14 md:pb-20">
        <p className="label reveal text-muted" data-visible="true">
          Calgary asphalt maintenance
        </p>

        <h1 className="display-xl reveal mt-5 max-w-[16ch]" data-visible="true">
          Protect your asphalt before damage gets worse.
        </h1>

        <p className="lede reveal mt-6 text-bone/80" data-visible="true">
          Professional sealcoating, hot-rubber crack sealing and infrared asphalt repair for Calgary
          driveways and parking lots.
        </p>

        <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" data-visible="true">
          <Link href="/free-quote" className="btn btn-primary">
            Get a Free Quote
            <Arrow />
          </Link>
          <CallButton />
        </div>

        <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/12 pt-6">
          {TRUST.map((item) => (
            <li key={item} className="label text-[0.625rem] text-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
