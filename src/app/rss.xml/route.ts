import { posts } from "@/content/posts";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });

export function GET() {
  const items = posts
    .map(
      (post) => `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>https://zheyu.me/posts/${post.slug}</link>
        <guid>https://zheyu.me/posts/${post.slug}</guid>
        <pubDate>${new Date(`${post.publishedAt}T00:00:00+08:00`).toUTCString()}</pubDate>
        <description>${escapeXml(post.description)}</description>
      </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Zheyu Shen</title>
        <link>https://zheyu.me</link>
        <description>关注 AI、产品与工程实践，记录新工具如何改变工作与创造。</description>
        <language>zh-CN</language>${items}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
