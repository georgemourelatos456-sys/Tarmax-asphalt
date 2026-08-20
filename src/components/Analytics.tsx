import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_ID is set, so a build without a
 * measurement ID ships no third-party script and makes no external request.
 * That keeps local development and preview builds out of the reporting, and
 * means the site is never quietly loading a tracker nobody configured.
 *
 * `afterInteractive` is deliberate. Analytics must not compete with the quote
 * form for main-thread time during load — a measurement that costs a
 * submission has cost more than it is worth.
 *
 * Two settings are pinned rather than left to the account defaults:
 *
 *   anonymize_ip      Truncates the visitor's address before it is stored.
 *   ads_data_redaction / url_passthrough are NOT enabled, because no ad
 *                     products are connected; adding them would imply a
 *                     relationship with Google Ads that does not exist.
 *
 * Note on consent: this loads on first visit without asking. That is common
 * practice for a Canadian small business site and PIPEDA does not require a
 * blocking banner for basic first-party measurement, but it is a decision
 * rather than an oversight — if TARMAX later runs ads or retargeting, this
 * needs a consent gate in front of it.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
