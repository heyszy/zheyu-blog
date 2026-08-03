import type { Metadata } from "next";
import { PostPage } from "@/components/PostPage";
import { getPost } from "@/content/posts";

const post = getPost("why-this-blog")!;

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

export default function WhyThisBlogPage() {
  return <PostPage post={post} />;
}
