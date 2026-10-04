import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spottertools.pro";

/**
 * The marketing pages only. The release notes (/whats-new, /<version>) and
 * the training portal are deliberately left out: they are shared by direct
 * link and are not part of the site's navigation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/radar", priority: 0.9, changeFrequency: "weekly" },
    { path: "/alerts", priority: 0.8, changeFrequency: "monthly" },
    { path: "/storm-track", priority: 0.6, changeFrequency: "monthly" },
    { path: "/draw", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
