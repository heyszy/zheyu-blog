import type { Post } from "@/content/posts";
import { PostNavigation } from "@/components/PostNavigation";

export function PostPage({ post }: { post: Post }) {
  const { Content } = post;

  return (
    <>
      <PostNavigation sections={post.sections} />
      <main id="main" className="paper paper--entering">
        <article className="article-content">
          <p className="eyebrow">
            Zheyu · <time dateTime={post.publishedAt}>{post.publishedAt}</time>
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
