import type { ComponentType } from "react";
import WhyThisBlog from "./posts/why-this-blog.mdx";

export type PostSection = {
  id: string;
  label: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  year: string;
  sections: PostSection[];
  Content: ComponentType;
};

export const posts: Post[] = [
  {
    slug: "why-this-blog",
    title: "为什么做这个博客",
    description: "给想法一个长期、安静、属于自己的存放之处。",
    publishedAt: "2026-08-02",
    year: "2026",
    sections: [
      { id: "why-now", label: "为什么是现在" },
      { id: "what-to-write", label: "这里会写什么" },
      { id: "keep-it-small", label: "保持简单" },
    ],
    Content: WhyThisBlog,
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
