import type { Metadata } from "next";
import { PostPage } from "@/components/PostPage";
import { getPost } from "@/content/posts";

const post = getPost("gpt-5-6-arc-agi-3-responses-api")!;

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
  },
};

export default function Gpt56ArcAgi3ResponsesApiPage() {
  return <PostPage post={post} />;
}
