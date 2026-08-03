import type { ComponentType } from "react";
import Gpt56ArcAgi3ResponsesApi from "./posts/gpt-5-6-arc-agi-3-responses-api.mdx";

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
    slug: "gpt-5-6-arc-agi-3-responses-api",
    title: "同一个 GPT-5.6，换两个 API 设置，ARC-AGI-3 分数涨了三倍",
    description: "同一个模型、同一个测试，只调整 Responses API 的两个设置，ARC-AGI-3 分数从 13.3% 升到 38.3%。",
    publishedAt: "2026-08-03",
    year: "2026",
    sections: [
      { id: "arc-agi-3", label: "ARC-AGI-3 是什么" },
      { id: "official-harness", label: "官方 Harness" },
      { id: "two-settings", label: "两个设置" },
      { id: "think", label: "把思考发回去" },
      { id: "agents", label: "Agents 的记忆" },
      { id: "references", label: "参考资料" },
    ],
    Content: Gpt56ArcAgi3ResponsesApi,
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
