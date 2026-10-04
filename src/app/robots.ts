import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spottertools.pro";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Sign-in flows, the admin tools and the API have nothing to index.
      disallow: ["/admin", "/api/", "/auth/", "/login", "/reset-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
