"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePaperMotion } from "@/components/PageMotion";

type Props = {
  children: ReactNode;
  href: string;
};

export function PaperStackLink({ children, href }: Props) {
  const { openPost } = usePaperMotion();

  return (
    <Link
      href={href}
      scroll={false}
      onClick={(event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();
        openPost(href);
      }}
    >
      {children}
    </Link>
  );
}
