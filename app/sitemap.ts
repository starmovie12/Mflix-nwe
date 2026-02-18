import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mflix.example";
  const updatedAt = new Date();

  return [
    {
      url: baseUrl,
      lastModified: updatedAt,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
