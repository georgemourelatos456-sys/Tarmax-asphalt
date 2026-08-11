import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    // Every page is public. There is no dashboard and no signed-in area.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
