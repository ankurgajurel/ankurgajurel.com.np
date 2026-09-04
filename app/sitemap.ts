import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";
import { getAllPostsMeta } from "@/lib/blog";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const updatedAt = new Date(siteConfig.updatedAt);

  const blogPosts = getAllPostsMeta().map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...["projects", "blog", "tools"].map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts,
    ...projectPages,
  ];
}
