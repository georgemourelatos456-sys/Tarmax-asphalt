import Link from "next/link";
import { Arrow } from "@/components/ui/Labels";
import { CallButton } from "@/components/ui/CallButton";
import { AlligatorCracks } from "@/components/ui/AlligatorCracks";

const TRUST = ["Calgary based", "Residential", "Commercial", "Free estimates"];

export function Hero() {
  return (
    <section className="on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink pt-28 md:min-h-[100svh] md:pt-32">
      {/* Flat ink and the cracking, nothing else. No photograph behind it, so
          the red is the only colour in the frame and the hero paints from a few
          kilobytes of inline SVG rather than waiting on a full-bleed image. */}
      <div className="absolute inset-0 -z-10">
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
