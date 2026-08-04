# Zheyu

Zheyu 的个人博客，基于 Next.js App Router、MDX 和 OpenNext 部署到 Cloudflare Workers。

## 本地开发

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 校验与部署

```bash
pnpm lint
pnpm build
pnpm preview
pnpm run deploy
```

`pnpm run deploy` 会构建并发布 Worker `zheyu-blog`；生产域名为 [zheyu.me](https://zheyu.me)。

## 新文章

文章内容与元数据在 `src/content/posts/` 和 `src/content/posts.ts` 中维护。为兼容当前 OpenNext 静态路由部署，每篇文章在 `src/app/posts/<slug>/page.tsx` 保留一个薄路由入口。
