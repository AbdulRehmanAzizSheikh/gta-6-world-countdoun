import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ],
    sitemap: "https://gta-6-countdown.supersoftware.agency/sitemap.xml",
    host: "https://gta-6-countdown.supersoftware.agency",
  };
}
