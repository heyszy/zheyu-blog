import type { Metadata } from "next";
import { PostNavigation } from "@/components/PostNavigation";
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

export default function PostPage() {
  const { Content } = post;

  return (
    <>
      <PostNavigation sections={post.sections} />
      <main id="main" className="paper">
        <article className="article-content">
          <p className="eyebrow">
            Zheyu Shen · <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          </p>
          <h1 className="article-title">{post.title}</h1>
          <p className="article-dek">{post.description}</p>
          <div className="article-body">
            <Content />
          </div>
        </article>
      </main>
    </>
  );
}
