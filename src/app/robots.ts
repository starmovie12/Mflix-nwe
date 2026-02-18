import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/watch/", "/profiles", "/account"],
    },
    sitemap: "https://mflix.example.com/sitemap.xml",
  };
}
