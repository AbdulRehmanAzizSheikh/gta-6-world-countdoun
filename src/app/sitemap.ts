import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gta-6-countdown.supersoftware.agency";
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];
}
