import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin portal and API routes out of search indexes.
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://polarisconsulting.uk/sitemap.xml",
  };
}
