"use client";

import Link from "next/link";
import { ArrowBendUpLeft, List, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { PostSection } from "@/content/posts";
import { usePaperMotion } from "@/components/PageMotion";

type Props = {
  sections: PostSection[];
};

export function PostNavigation({ sections }: Props) {
  const { returnHome: exitWithPaper } = usePaperMotion();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const updateNavigation = () => {
      setShowBackTop(window.scrollY > window.innerHeight * 0.5);

      const current = [...sections]
        .reverse()
        .find(
          (section) =>
            (document.getElementById(section.id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY) <= 160,
        );

      setActiveSection(current?.id ?? sections[0]?.id ?? "");
    };

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    return () => window.removeEventListener("scroll", updateNavigation);
  }, [sections]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-is-open", open);
    return () => document.body.classList.remove("mobile-menu-is-open");
  }, [open]);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  const returnHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    exitWithPaper("/");
  };

  return (
    <>
      <aside className="article-sidebar" aria-label="文章导航">
        <Link className="back-link" href="/" onClick={returnHome}>
          <ArrowBendUpLeft aria-hidden="true" size={14} weight="light" />
          首页
        </Link>
        {sections.map((section) => (
          <a
            className={`toc-link${activeSection === section.id ? " is-active" : ""}`}
            key={section.id}
            href={`#${section.id}`}
          >
            {section.label}
          </a>
        ))}
        <button
          className={`back-top${showBackTop ? " is-visible" : ""}`}
          type="button"
          onClick={backToTop}
        >
          返回顶部
        </button>
      </aside>

      <button
        className={`mobile-nav${open ? " is-open" : ""}`}
        type="button"
        aria-label={open ? "关闭文章目录" : "打开文章目录"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="mobile-nav-icon" aria-hidden="true">
          <List className="mobile-nav-list-icon" size={24} weight="light" />
          <X className="mobile-nav-close-icon" size={23} weight="light" />
        </span>
      </button>

      <nav
        id="mobile-menu-panel"
        className={`mobile-menu-panel${open ? " is-open" : ""}`}
        aria-label="移动端文章导航"
        aria-hidden={!open}
        inert={!open}
      >
        <Link href="/" onClick={(event) => {
          setOpen(false);
          returnHome(event);
        }}>
          首页
        </Link>
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} onClick={() => setOpen(false)}>
            {section.label}
          </a>
        ))}
      </nav>
    </>
  );
}
