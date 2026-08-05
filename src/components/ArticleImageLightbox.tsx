"use client";

import { X } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type LightboxImage = {
  src: string;
  alt: string;
  caption: string | null;
};

const OPEN_MS = 280;
const CLOSE_MS = 240;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readCaption(img: HTMLImageElement) {
  const figure = img.closest("figure");
  const fromFigcaption = figure
    ?.querySelector("figcaption")
    ?.textContent?.trim();
  if (fromFigcaption) return fromFigcaption;

  const titled = img.getAttribute("title")?.trim();
  if (titled) return titled;

  const alt = img.alt?.trim();
  return alt || null;
}

export function ArticleImageLightbox({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const captionId = useId();
  const [image, setImage] = useState<LightboxImage | null>(null);
  const [open, setOpen] = useState(false);

  const openFromImage = useCallback((img: HTMLImageElement) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }

    triggerRef.current = img;
    setImage({
      src: img.currentSrc || img.src,
      alt: img.alt || "",
      caption: readCaption(img),
    });
    setOpen(false);

    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = window.requestAnimationFrame(() => {
        openFrameRef.current = null;
        setOpen(true);
      });
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const markZoomable = (img: HTMLImageElement) => {
      img.classList.add("article-image--zoomable");
      if (!img.hasAttribute("tabindex")) img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-haspopup", "dialog");
      img.setAttribute(
        "aria-label",
        img.alt ? `查看大图：${img.alt}` : "查看大图",
      );
    };

    const unmarkZoomable = (img: HTMLImageElement) => {
      img.classList.remove("article-image--zoomable");
      img.removeAttribute("tabindex");
      img.removeAttribute("role");
      img.removeAttribute("aria-haspopup");
      img.removeAttribute("aria-label");
    };

    const enhanceAll = () => {
      for (const img of root.querySelectorAll<HTMLImageElement>("img")) {
        markZoomable(img);
      }
    };

    enhanceAll();

    const observer = new MutationObserver(() => {
      enhanceAll();
    });
    observer.observe(root, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const img = target.closest("img");
      if (!img || !root.contains(img)) return;
      event.preventDefault();
      openFromImage(img);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!root.contains(target)) return;
      event.preventDefault();
      openFromImage(target);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);

    return () => {
      observer.disconnect();
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
      for (const img of root.querySelectorAll<HTMLImageElement>("img")) {
        unmarkZoomable(img);
      }
    };
  }, [openFromImage]);

  const finishClose = useCallback(() => {
    setImage(null);
    setOpen(false);
    const trigger = triggerRef.current;
    triggerRef.current = null;
    trigger?.focus({ preventScroll: true });
  }, []);

  const close = useCallback(() => {
    if (!image) return;

    setOpen(false);
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    const delay = prefersReducedMotion() ? 0 : CLOSE_MS;
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      finishClose();
    }, delay);
  }, [finishClose, image]);

  useEffect(() => {
    if (!image) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, OPEN_MS);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, image]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (openFrameRef.current !== null) {
        window.cancelAnimationFrame(openFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="article-image-lightbox-root">
        {children}
      </div>

      {image &&
        createPortal(
          <div
            className={`image-lightbox${open ? " is-open" : ""}`}
            data-state={open ? "open" : "closed"}
          >
            <div
              className="image-lightbox__backdrop"
              onClick={close}
              aria-hidden="true"
            />
            <div
              ref={dialogRef}
              className="image-lightbox__dialog"
              role="dialog"
              aria-modal="true"
              aria-label="图片预览"
              aria-describedby={image.caption ? captionId : undefined}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="image-lightbox__close"
                aria-label="关闭图片预览"
                onClick={close}
              >
                <X aria-hidden="true" size={22} weight="light" />
              </button>
              <div className="image-lightbox__content">
                <figure className="image-lightbox__figure">
                  {/* eslint-disable-next-line @next/next/no-img-element -- match article MDX image rendering */}
                  <img
                    className="image-lightbox__image"
                    src={image.src}
                    alt={image.alt}
                    onClick={close}
                  />
                  {image.caption ? (
                    <figcaption
                      className="image-lightbox__caption"
                      id={captionId}
                    >
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
