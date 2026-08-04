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

function clonePaper(paper: HTMLElement, transitionClass: "paper-transition-underlay" | "paper-transition-exit") {
  const rect = paper.getBoundingClientRect();
  const clone = paper.cloneNode(true) as HTMLElement;

  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  clone.inert = true;
  clone.classList.remove("paper--entering", "paper--leaving");
  clone.classList.add(transitionClass);
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
  const exitPaper = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prepareBrowserReturnHome = () => {
      if (window.location.pathname !== "/") return;

      returningHome.current = true;
      document.body.classList.add("page-is-returning-home");
    };

    window.addEventListener("popstate", prepareBrowserReturnHome);
    return () => window.removeEventListener("popstate", prepareBrowserReturnHome);
  }, []);

  useEffect(() => {
    const paper = document.querySelector<HTMLElement>(".paper:not(.paper-transition-underlay):not(.paper-transition-exit)");
    if (!paper) return;

    paper.classList.remove("paper--leaving");

    if (pathname === "/" && !returningHome.current) {
      underlay.current?.remove();
      underlay.current = null;
      exitPaper.current?.remove();
      exitPaper.current = null;
      document.body.classList.remove("page-has-underlay", "page-has-exit-paper", "page-is-leaving", "page-is-returning-home");
    }

    if (returningHome.current) {
      paper.classList.remove("paper--entering", "home-text--entering");
      returningHome.current = false;
      leaving.current = false;
      requestAnimationFrame(() => {
        if (exitPaper.current) {
          const departingPaper = exitPaper.current;
          const cleanUp = () => {
            window.clearTimeout(fallbackTimer);

            departingPaper.remove();
            exitPaper.current = null;
            document.body.classList.remove("page-has-exit-paper", "page-is-leaving", "page-is-returning-home");
            departingPaper.removeEventListener("animationend", cleanUp);
          };

          const fallbackTimer = window.setTimeout(cleanUp, PAPER_EXIT_MS + 100);
          departingPaper.addEventListener("animationend", cleanUp);
          departingPaper.classList.add("paper--leaving");
          return;
        }

        underlay.current?.remove();
        underlay.current = null;
        document.body.classList.remove("page-has-underlay", "page-is-leaving", "page-is-returning-home");
      });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const homeTextTarget = paper.classList.contains("home-paper")
      ? paper.querySelector<HTMLElement>(".site-footer")
      : null;
    const clearHomeText = (event: AnimationEvent) => {
      if (event.target !== homeTextTarget) return;
      paper.classList.remove("home-text--entering");
      homeTextTarget?.removeEventListener("animationend", clearHomeText);
    };

    if (homeTextTarget) {
      paper.classList.add("home-text--entering");
      homeTextTarget.addEventListener("animationend", clearHomeText);
    }
    paper.classList.add("paper--entering");
    const clearEntry = (event: AnimationEvent) => {
      if (event.target !== paper) return;
      paper.classList.remove("paper--entering");
      paper.removeEventListener("animationend", clearEntry);
    };
    paper.addEventListener("animationend", clearEntry);
    return () => {
      paper.classList.remove("home-text--entering");
      homeTextTarget?.removeEventListener("animationend", clearHomeText);
      paper.removeEventListener("animationend", clearEntry);
    };
  }, [pathname]);

  const openPost = useCallback(
    (href: string) => {
      if (leaving.current) return;

      const paper = document.querySelector<HTMLElement>(".paper:not(.paper-transition-underlay):not(.paper-transition-exit)");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!paper || reducedMotion) {
        router.push(href);
        return;
      }

      underlay.current?.remove();
      underlay.current = clonePaper(paper, "paper-transition-underlay");
      document.body.classList.add("page-has-underlay");
      router.push(href);
    },
    [router],
  );

  const returnHome = useCallback(
    (href: string) => {
      if (leaving.current) return;

      const paper = document.querySelector<HTMLElement>(".paper:not(.paper-transition-underlay):not(.paper-transition-exit)");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!paper || reducedMotion) {
        router.push(href);
        return;
      }

      leaving.current = true;
      returningHome.current = true;
      document.body.classList.add("page-is-leaving", "page-is-returning-home");

      if (!underlay.current) {
        exitPaper.current?.remove();
        exitPaper.current = clonePaper(paper, "paper-transition-exit");
        document.body.classList.add("page-has-exit-paper");
        router.push(href);
        return;
      }

      paper.classList.remove("paper--entering");
      const navigate = () => {
        window.clearTimeout(fallbackTimer);
        paper.removeEventListener("animationend", navigate);
        router.push(href);
      };

      const fallbackTimer = window.setTimeout(navigate, PAPER_EXIT_MS + 100);
      paper.addEventListener("animationend", navigate);
      paper.classList.add("paper--leaving");
    },
    [router],
  );

  return <PageMotionContext.Provider value={{ openPost, returnHome }}>{children}</PageMotionContext.Provider>;
}

export function usePaperMotion() {
  return useContext(PageMotionContext);
}
