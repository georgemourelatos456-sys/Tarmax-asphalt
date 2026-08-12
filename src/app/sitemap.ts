import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/business";

/** Every page on the site. There is no private area to exclude. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: Array<{ path: string; priority: number; changeFrequency: "monthly" | "yearly" }> = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/free-quote", priority: 0.9, changeFrequency: "yearly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/driveway-sealcoating", priority: 0.8, changeFrequency: "monthly" },
    { path: "/crack-sealing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/infrared-repair", priority: 0.8, changeFrequency: "monthly" },
    { path: "/commercial", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
