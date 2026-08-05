import type { Metadata } from "next";
import { PostPage } from "@/components/PostPage";
import { getPost } from "@/content/posts";

const post = getPost("claude-context-engineering-new-rules")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/posts/${post.slug}` },
  openGraph: {
    type: "article",
    title: post.title,
    description: post.description,
    publishedTime: post.publishedAt,
    url: `/posts/${post.slug}`,
    images: [
      {
        url: "/images/claude-context-engineering-new-rules/claude-context-engineering-cover.png",
        width: 900,
        height: 383,
        alt: "给 Opus5 删掉 80% 系统提示词",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/claude-context-engineering-new-rules/claude-context-engineering-cover.png"],
  },
};

export default function ClaudeContextEngineeringNewRulesPage() {
  return <PostPage post={post} />;
}
