import type { ComponentType } from "react";
import ClaudeContextEngineeringNewRules from "./posts/claude-context-engineering-new-rules.mdx";
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
    title: "GPT5.6 的两项重要设置",
    description: "同一个模型、同一个测试，只调整 Responses API 的两个设置，ARC-AGI-3 分数从 13.3% 升到 38.3%。",
    publishedAt: "2026-08-04",
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
  {
    slug: "claude-context-engineering-new-rules",
    title: "给 Opus5 删掉 80% 系统提示词",
    description: "Anthropic 团队删掉 Claude Code 系统提示词超过 80% 的内容，编程测试没有出现可衡量的性能下降。",
    publishedAt: "2026-07-30",
    year: "2026",
    sections: [
      { id: "context", label: "提示词只是上下文" },
      { id: "principles", label: "六条上下文工程原则" },
      { id: "change", label: "我们该如何改变" },
      { id: "focus", label: "上下文工程的重点" },
    ],
    Content: ClaudeContextEngineeringNewRules,
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
