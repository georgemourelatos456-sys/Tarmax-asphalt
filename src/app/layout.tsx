import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { BUSINESS, SITE_URL } from "@/config/business";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { localBusinessSchema } from "@/lib/schema";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TARMAX Asphalt — Calgary Asphalt Maintenance, Sealcoating & Crack Sealing",
    template: "%s | TARMAX Asphalt",
  },
  description:
    "Preventative asphalt maintenance in Calgary. Sealcoating, hot rubber crack sealing and infrared asphalt repair for residential driveways and commercial parking lots. Free estimates.",
  keywords: [
    "Calgary asphalt maintenance",
    "Calgary driveway sealing",
    "Calgary parking lot sealcoating",
    "Calgary crack sealing",
    "Calgary pothole repair",
    "Calgary asphalt repair",
    "infrared asphalt repair Calgary",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: "TARMAX Asphalt — Calgary Asphalt Maintenance",
    description:
      "Sealcoating, hot rubber crack sealing and infrared asphalt repair for Calgary driveways and parking lots.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: BUSINESS.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TARMAX Asphalt — Calgary Asphalt Maintenance",
    description:
      "Sealcoating, hot rubber crack sealing and infrared asphalt repair for Calgary driveways and parking lots.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-bone focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <Nav />
        {/* Bottom padding clears the fixed mobile action bar. */}
        <main id="main" style={{ paddingBottom: "var(--action-bar)" }}>
          {children}
        </main>
        <div style={{ paddingBottom: "var(--action-bar)" }}>
          <Footer />
        </div>
        <MobileActionBar />
        <script
          type="application/ld+json"
          // Static, developer-authored schema built from src/config/business.ts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
      </body>
    </html>
  );
}
