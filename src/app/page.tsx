import { PaperStackLink } from "@/components/PaperStackLink";
import { posts } from "@/content/posts";

export default function Home() {
  return (
    <main id="main" className="paper home-paper paper--entering home-text--entering">
      <div className="home-content">
        <h1 className="signature">Zheyu</h1>

        <div className="intro">
          <p>
            关注 AI、产品与工程实践，也关心技术如何改变我们的工作方式，以及人与世界的关系。
          </p>
          <p>
            在这里记录新工具、新产品，以及一个想法从出现到真正被做出来的完整过程。
          </p>
          <p>
            偶尔也写投资、生活，和那些值得在快速变化中长期思考的问题。
          </p>
        </div>

        <ol className="post-list" aria-label="文章列表">
          {posts.map((post) => (
            <li key={post.slug}>
              <PaperStackLink href={`/posts/${post.slug}`}>
                <span className="post-title">{post.title}</span>
                <span className="leader" aria-hidden="true" />
                <time dateTime={post.publishedAt}>{post.year}</time>
              </PaperStackLink>
            </li>
          ))}
        </ol>

        <footer className="site-footer">
          <span aria-hidden="true">—</span>
          <p className="social-links">
            <a href="https://x.com/zheyuhl" target="_blank" rel="noreferrer">X</a>
            <span aria-hidden="true"> · </span>
            <a href="https://github.com/heyszy" target="_blank" rel="noreferrer">GitHub</a>
            <span aria-hidden="true"> · </span>
            <a href="https://github.com/heyszy/zheyu-blog" target="_blank" rel="noreferrer">Source</a>
          </p>
          <p>© 2026 Zheyu. Built with curiosity.</p>
        </footer>
      </div>
    </main>
  );
}
