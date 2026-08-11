import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    // Every page is public. /api is the configuration check, not content.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
