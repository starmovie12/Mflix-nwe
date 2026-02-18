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
    {
      url: `${baseUrl}/movies`,
      lastModified: updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tv`,
      lastModified: updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/new-popular`,
      lastModified: updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/my-list`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: updatedAt,
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];
}
