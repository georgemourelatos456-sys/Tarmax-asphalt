import Link from "next/link";
import { BUSINESS, DIRECTORS, mailtoHref, telHref } from "@/config/business";
import { Wordmark } from "@/components/layout/Wordmark";
import { Seam } from "@/components/ui/Seam";

const SERVICE_LINKS = [
  { label: "Sealcoating", href: "/services#sealcoating" },
  { label: "Hot Rubber Crack Sealing", href: "/crack-sealing" },
  { label: "Infrared Asphalt Repair", href: "/infrared-repair" },
  { label: "Parking Lot Maintenance", href: "/commercial" },
  { label: "Residential Driveways", href: "/services#residential" },
];

const COMPANY_LINKS = [
  { label: "Driveway Sealcoating Guide", href: "/driveway-sealcoating" },
  { label: "Why We Started TARMAX", href: "/about" },
  { label: "Get a Free Quote", href: "/free-quote" },
];

export function Footer() {
  return (
    <footer className="on-dark bg-ink">
      <Seam />
      <div className="shell section-tight">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1.3fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-xs text-sm text-muted">{BUSINESS.tagline}</p>
            <p className="label mt-6 text-[0.625rem] text-muted">
              {BUSINESS.city}, {BUSINESS.regionName}
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="label mb-4 text-[0.625rem] text-muted">Services</h2>
            <ul className="flex flex-col gap-2.5">
              {SERVICE_LINKS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-bone/80 transition-colors hover:text-bone">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="label mb-4 text-[0.625rem] text-muted">Company</h2>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-bone/80 transition-colors hover:text-bone">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label mb-4 text-[0.625rem] text-muted">Contact</h2>
            <ul className="flex flex-col gap-4">
              {DIRECTORS.map((d) => (
                <li key={d.name}>
                  <p className="text-sm font-semibold text-bone">
                    {d.name}
                    <span className="ml-2 font-normal text-muted">{d.role}</span>
                  </p>
                  <p className="mt-1 text-sm">
                    <a href={telHref(d)} className="text-bone/85 transition-colors hover:text-alert">
                      {d.phone}
                    </a>
                  </p>
                </li>
              ))}
              <li>
                <p className="label text-[0.625rem] text-muted">General</p>
                <a
                  href={mailtoHref(BUSINESS.generalEmail)}
                  className="mt-1 block break-all text-sm text-bone/85 transition-colors hover:text-alert"
                >
                  {BUSINESS.generalEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {BUSINESS.name}. Serving {BUSINESS.serviceArea}.
          </p>
          <Link href="/free-quote" className="label text-[0.625rem] text-bone hover:text-alert">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </footer>
  );
}
