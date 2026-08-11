import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * The Content Security Policy is the part that actually stops injected
 * pop-ups, ads and third-party content: the browser refuses to load anything
 * from an origin not listed here. Because the site self-hosts its fonts and
 * images and loads no third-party scripts, the allow-list can be almost
 * entirely 'self'.
 *
 * What this does NOT do: it is a browser-side control, not a server firewall.
 * Network-level protection — WAF rules, DDoS absorption, bot filtering — comes
 * from the host (Vercel, Cloudflare) and should be enabled there too.
 */

const csp = [
  // Nothing loads from anywhere unless a directive below says otherwise.
  "default-src 'self'",

  // Next.js inlines its hydration payload, so 'unsafe-inline' is required
  // without switching every page to per-request nonces (which would forfeit
  // static rendering). External script origins remain blocked, which is the
  // control that stops injected ad and pop-up scripts. Safe here because no
  // user-supplied HTML is ever rendered — React escapes all of it, and the
  // only dangerouslySetInnerHTML on the site is developer-authored JSON-LD.
  "script-src 'self' 'unsafe-inline'",

  // Tailwind and Next emit inline style attributes.
  "style-src 'self' 'unsafe-inline'",

  "img-src 'self' data: blob:",
  "font-src 'self'",
  // The browser talks to this origin and nothing else. With no database and
  // no auth provider called from the client, there is no third party to allow.
  "connect-src 'self'",

  // No plugins, no embedded frames: removes the injected-iframe pop-up vector.
  "object-src 'none'",
  "frame-src 'none'",
  "child-src 'none'",

  // Nobody may frame this site — clickjacking and UI-redress protection.
  "frame-ancestors 'none'",

  // An injected form cannot post a customer's details to an attacker's server.
  "base-uri 'none'",
  "form-action 'self'",

  // Silently upgrade any stray http:// subresource.
  "upgrade-insecure-requests",
].join("; ");

/** Features this site never uses are switched off outright. */
const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: permissionsPolicy },
          // Pin to HTTPS for two years, including subdomains. Only meaningful
          // once the production domain is served over TLS.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Keep this origin out of other sites' browsing contexts.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
};

export default nextConfig;
