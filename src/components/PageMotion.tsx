"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";

const PAPER_EXIT_MS = 420;

type PaperMotion = {
  openPost: (href: string) => void;
  returnHome: (href: string) => void;
};

const PageMotionContext = createContext<PaperMotion>({
  openPost: () => undefined,
  returnHome: () => undefined,
});

function clonePaperUnderlay(paper: HTMLElement) {
  const rect = paper.getBoundingClientRect();
  const clone = paper.cloneNode(true) as HTMLElement;

  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  clone.inert = true;
  clone.classList.remove("paper--entering", "paper--leaving");
  clone.classList.add("paper-transition-underlay");
  Object.assign(clone.style, {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
  document.body.append(clone);
  return clone;
}

export function PageMotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const leaving = useRef(false);
  const returningHome = useRef(false);
  const underlay = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const paper = document.querySelector<HTMLElement>(".paper:not(.paper-transition-underlay)");
    if (!paper) return;

    paper.classList.remove("paper--leaving");

    if (returningHome.current) {
      returningHome.current = false;
      leaving.current = false;
      requestAnimationFrame(() => {
        underlay.current?.remove();
        underlay.current = null;
        document.body.classList.remove("page-has-underlay", "page-is-leaving");
      });
      return;
    }

    paper.classList.add("paper--entering");
    const clearEntry = () => paper.classList.remove("paper--entering");
    paper.addEventListener("animationend", clearEntry, { once: true });
    return () => paper.removeEventListener("animationend", clearEntry);
  }, [pathname]);

  const openPost = useCallback(
    (href: string) => {
      if (leaving.current) return;

      const paper = document.querySelector<HTMLElement>(".paper:not(.paper-transition-underlay)");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!paper || reducedMotion) {
        router.push(href);
        return;
      }

      underlay.current?.remove();
      underlay.current = clonePaperUnderlay(paper);
      document.body.classList.add("page-has-underlay");
      router.push(href);
    },
    [router],
  );

  const returnHome = useCallback(
    (href: string) => {
      if (leaving.current) return;

      const paper = document.querySelector<HTMLElement>(".paper:not(.paper-transition-underlay)");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!paper || reducedMotion || !underlay.current) {
        router.push(href);
        return;
      }

      leaving.current = true;
      returningHome.current = true;
      document.body.classList.add("page-is-leaving");
      paper.classList.remove("paper--entering");
      paper.classList.add("paper--leaving");
      window.setTimeout(() => router.push(href), PAPER_EXIT_MS);
    },
    [router],
  );

  return <PageMotionContext.Provider value={{ openPost, returnHome }}>{children}</PageMotionContext.Provider>;
}

export function usePaperMotion() {
  return useContext(PageMotionContext);
}
