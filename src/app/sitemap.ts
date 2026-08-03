import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zheyu.me",
      lastModified: "2026-08-04",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `https://zheyu.me/posts/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
