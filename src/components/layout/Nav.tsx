"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/config/business";
import { Wordmark } from "@/components/layout/Wordmark";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the panel when navigating, including to a hash on the current page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Stop the page scrolling behind the open panel.
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // The bar is solid once scrolled rather than blurred: backdrop-filter makes
  // the compositor re-sample the page behind it on every frame, which is the
  // biggest single cause of scroll stutter on phones.
  return (
    <header
      className={`on-dark fixed inset-x-0 top-0 z-50 border-b transition-[height,background-color,border-color] duration-300 ${
        scrolled || open
          ? "h-16 border-white/10 bg-ink md:h-[4.5rem]"
          : "h-20 border-transparent bg-transparent md:h-24"
      }`}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center"
          aria-label="TARMAX Asphalt — home"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label whitespace-nowrap text-[0.6875rem] text-muted transition-colors hover:text-bone"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/free-quote" className="btn btn-primary hidden md:inline-flex">
            Get a Free Quote
          </Link>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex h-12 w-12 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-bone transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-6 bg-bone transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-bone transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="on-dark absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/10 bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex flex-col py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="display-sm border-b border-white/8 py-4 text-bone last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/free-quote" className="btn btn-primary mt-5 mb-2 w-full">
            Get a Free Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
