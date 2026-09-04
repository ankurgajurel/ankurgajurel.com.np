import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

const publicCrawlerRules = {
  allow: "/",
  disallow: ["/api/", "/ingest/"],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        ...publicCrawlerRules,
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "CCBot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
        ],
        ...publicCrawlerRules,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
