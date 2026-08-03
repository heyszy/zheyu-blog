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
    images: [
      {
        url: "/images/gpt-5-6-arc-agi-3-responses-api/wechat-cover-handdrawn.png",
        width: 1923,
        height: 818,
        alt: "GPT5.6 的两项重要设置",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/gpt-5-6-arc-agi-3-responses-api/wechat-cover-handdrawn.png"],
  },
};

export default function Gpt56ArcAgi3ResponsesApiPage() {
  return <PostPage post={post} />;
}
