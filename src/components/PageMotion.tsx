"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";

const PAPER_EXIT_MS = 560;

const PageMotionContext = createContext<(href: string) => void>(() => undefined);

export function PageMotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const leaving = useRef(false);

  useEffect(() => {
    document.body.classList.remove("page-is-leaving");
    leaving.current = false;

    const paper = document.querySelector<HTMLElement>(".paper");
    if (!paper) return;

    paper.classList.remove("paper--leaving");
    paper.classList.add("paper--entering");
    const clearEntry = () => paper.classList.remove("paper--entering");
    paper.addEventListener("animationend", clearEntry, { once: true });
    return () => paper.removeEventListener("animationend", clearEntry);
  }, [pathname]);

  const navigateWithPaperExit = useCallback(
    (href: string) => {
      if (leaving.current) return;

      const paper = document.querySelector<HTMLElement>(".paper");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!paper || reducedMotion) {
        router.push(href);
        return;
      }

      leaving.current = true;
      document.body.classList.add("page-is-leaving");
      paper.classList.remove("paper--entering");
      paper.classList.add("paper--leaving");
      window.setTimeout(() => router.push(href), PAPER_EXIT_MS);
    },
    [router],
  );

  return <PageMotionContext.Provider value={navigateWithPaperExit}>{children}</PageMotionContext.Provider>;
}

export function usePaperExit() {
  return useContext(PageMotionContext);
}
