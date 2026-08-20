import Link from "next/link";
import { FREEZE_THAW } from "@/config/content";
import { Arrow, Eyebrow } from "@/components/ui/Labels";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Builds the widening crack.
 *
 * The seam starts as a hairline at "water enters" and opens to a gaping void
 * by "damage can grow" — the section's argument, drawn rather than described.
 * The track is 80px wide on a desktop, where X is rendered 1:1 so only the
 * vertical axis stretches and the crack never fattens on tall viewports. On a
 * phone the same path is squeezed into a 36px track — the seam reads narrower
 * but still opens from hairline to void, which is the whole argument.
 */
const VIEW_W = 80;
const VIEW_H = 1200;

function buildCrack() {
  let seed = 88;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 0x100000000);

  const steps = 40;
  const left: string[] = [];
  const right: string[] = [];
  let center = VIEW_W / 2;

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const y = t * VIEW_H;
    center += (rand() - 0.5) * 7;
    center = Math.max(24, Math.min(VIEW_W - 24, center));
    // Eased widening: barely open for the first stage, then accelerating.
    const width = 1.2 + Math.pow(t, 1.9) * 30;
    const wobble = (rand() - 0.5) * width * 0.35;
    left.push(`${(center - width / 2 + wobble).toFixed(1)},${y.toFixed(1)}`);
    right.push(`${(center + width / 2 + wobble).toFixed(1)},${y.toFixed(1)}`);
  }

  return `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
}

const CRACK_PATH = buildCrack();

export function FreezeThaw() {
  // No overflow-hidden on the section: it would break the sticky heading
  // column. The crack is confined to its own fixed-width track regardless.
  return (
    <section id="freeze-thaw" className="on-dark relative bg-ink">
      <div className="section shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* The heading holds the left rail while the sequence scrolls past it,
            so the wide viewport has something on both sides. */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Why maintenance matters</Eyebrow>
          <h2 className="display-lg mt-4">Alberta&rsquo;s freeze-thaw cycle</h2>
          <p className="lede mt-5 text-bone/75">
            Every asphalt surface in Calgary is exposed to it.
          </p>
        </div>

        <div className="grid grid-cols-[36px_1fr] gap-x-4 gap-y-8 md:grid-cols-[80px_1fr] md:gap-x-12 md:gap-y-12">
          {/* The crack. Decorative — every stage it marks is stated in text. */}
          <div className="relative" aria-hidden="true">
            <svg
              className="h-full w-full"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              focusable="false"
            >
              <defs>
                <linearGradient id="crack-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F4F2ED" stopOpacity="0.22" />
                  <stop offset="0.45" stopColor="#F4F2ED" stopOpacity="0.1" />
                  <stop offset="0.75" stopColor="#7B1418" stopOpacity="0.85" />
                  <stop offset="1" stopColor="#B51F24" />
                </linearGradient>
              </defs>
              <path d={CRACK_PATH} fill="url(#crack-fill)" />
            </svg>
          </div>

          <ol className="flex flex-col gap-12 md:gap-20">
            {FREEZE_THAW.map((stage, i) => (
              <Reveal as="li" key={stage.step} delay={i * 80}>
                <span className="label block text-[0.6875rem] text-alert">{stage.step}</span>
                <h3 className="display-md mt-3">{stage.title}</h3>
                <p className="mt-3 max-w-[42ch] text-bone/70">{stage.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <div className="shell pb-20 md:pb-28">
        <Reveal className="border-t border-white/12 pt-12">
          <p className="display-md max-w-[24ch]">
            You can&rsquo;t control Alberta&rsquo;s weather.
            <span className="mt-2 block text-muted">
              You can maintain the asphalt exposed to it.
            </span>
          </p>
          <Link href="/free-quote" className="btn btn-primary mt-9">
            Get your asphalt assessed
            <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
