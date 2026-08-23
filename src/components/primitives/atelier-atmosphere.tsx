"use client";

import { useEffect, useRef } from "react";

interface AtelierAtmosphereProps {
  /** Bump to re-attach observers after admin edits re-mount the section DOM. */
  refreshKey?: number;
}

/**
 * AtelierAtmosphere — all the global Atelier chrome in one client component:
 *
 * 1. Custom cursor (dot + lagging ring + label). Detects [data-cursor]
 *    ancestors ("link" → ring expands, "cta" → big orange ring + label text).
 * 2. Magnetic cursor pull + magnetic hover translate on [data-cursor="cta"].
 * 3. Mesh background orbs with mouse parallax.
 * 4. Grain overlay.
 * 5. Scroll progress bar.
 * 6. `.reveal` scroll-in observer.
 * 7. `[data-count]` stat counter observer.
 * 8. Gallery image tilt on hover.
 * 9. Let's-build cube mouse-follow.
 * 10. Smooth-scroll for in-page anchors.
 *
 * Everything is a no-op on touch devices / reduced-motion.
 */
export function AtelierAtmosphere({ refreshKey = 0 }: AtelierAtmosphereProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = !isCoarse && !reduced;

    const cleanups: Array<() => void> = [];

    /* ---------- 1 + 2. Custom cursor ---------- */
    if (fine && rootRef.current) {
      const cursorEl = rootRef.current.querySelector<HTMLElement>(".cursor");
      const dot = cursorEl?.querySelector<HTMLElement>(".cursor__dot");
      const ring = cursorEl?.querySelector<HTMLElement>(".cursor__ring");
      const label = cursorEl?.querySelector<HTMLElement>(".cursor__label");

      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let dx = mx, dy = mx, rx = mx, ry = my;
      let magX = 0, magY = 0, magActive = false;
      let currentMode: string | null = null;

      // Big full-width CTAs (contact email + social rows): the big orange
      // circle should track the cursor exactly — no magnetic pull, no
      // element translate (matches the reference video).
      const isFullWidthCta = (el: HTMLElement) =>
        !!(el.closest(".contact__email") || el.closest(".social"));

      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;

        // Walk up the DOM to find a [data-cursor] ancestor
        let node = e.target as HTMLElement | null;
        let matched: HTMLElement | null = null;
        while (node) {
          if (node.dataset && node.dataset.cursor) {
            matched = node;
            break;
          }
          node = node.parentElement;
        }

        if (matched) {
          const mode = matched.dataset.cursor;
          if (mode !== currentMode) {
            currentMode = mode;
            cursorEl?.classList.remove("is-hover", "is-cta");
            if (mode === "cta") {
              cursorEl?.classList.add("is-cta");
              const txt = matched.dataset.cursorText || "Click";
              if (label) {
                label.textContent = txt;
                label.classList.add("is-on");
              }
            } else if (mode === "link") {
              cursorEl?.classList.add("is-hover");
              label?.classList.remove("is-on");
            }
          }
          if (mode === "cta" && !isFullWidthCta(matched)) {
            magActive = true;
            const r = matched.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            magX = (mx - cx) * 0.35;
            magY = (my - cy) * 0.35;
          } else {
            magActive = false; magX = 0; magY = 0;
          }
        } else {
          if (currentMode !== null) {
            currentMode = null;
            cursorEl?.classList.remove("is-hover", "is-cta");
            label?.classList.remove("is-on");
          }
          magActive = false; magX = 0; magY = 0;
        }
      };

      const render = () => {
        dx += (mx - dx) * 0.9;
        dy += (my - dy) * 0.9;
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        if (dot) dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
        if (ring) {
          const ox = magActive ? magX : 0;
          const oy = magActive ? magY : 0;
          ring.style.transform = `translate3d(${rx + ox}px, ${ry + oy}px, 0) translate(-50%, -50%)`;
        }
        if (label) {
          label.style.transform = `translate3d(${rx}px, ${ry - 56}px, 0) translate(-50%, -50%) scale(${label.classList.contains("is-on") ? 1 : 0})`;
        }
        rafId = requestAnimationFrame(render);
      };

      let rafId = requestAnimationFrame(render);
      window.addEventListener("mousemove", onMove, { passive: true });
      cleanups.push(() => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", onMove);
      });

      /* ---------- Magnetic hover translate on CTAs ----------
         (skipped for the big full-width contact email + social rows —
          they must stay put, only the cursor circle reacts) */
      const ctas = Array.from(
        document.querySelectorAll<HTMLElement>('[data-cursor="cta"]')
      ).filter((el) => !isFullWidthCta(el));
      const ctaHandlers: Array<[HTMLElement, EventListener, EventListener]> = [];
      ctas.forEach((el) => {
        let raf = false;
        const onMove2 = ((e: Event) => {
          if (raf) return;
          raf = true;
          requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            const me = e as MouseEvent;
            const x = me.clientX - (r.left + r.width / 2);
            const y = me.clientY - (r.top + r.height / 2);
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            raf = false;
          });
        }) as EventListener;
        const onLeave = () => {
          el.style.transform = "translate(0, 0)";
          el.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
          setTimeout(() => { el.style.transition = ""; }, 600);
        };
        el.addEventListener("mousemove", onMove2);
        el.addEventListener("mouseleave", onLeave);
        ctaHandlers.push([el, onMove2, onLeave]);
      });
      cleanups.push(() => {
        ctaHandlers.forEach(([el, mv, lv]) => {
          el.removeEventListener("mousemove", mv);
          el.removeEventListener("mouseleave", lv);
        });
      });
    }

    /* ---------- 3. Mesh parallax ---------- */
    if (fine) {
      const orbs = Array.from(document.querySelectorAll<HTMLElement>(".mesh__orb"));
      if (orbs.length) {
        let raf = false;
        const px = { x: 0, y: 0 };
        const onMove = (e: MouseEvent) => {
          px.x = (e.clientX / window.innerWidth - 0.5) * 40;
          px.y = (e.clientY / window.innerHeight - 0.5) * 40;
          if (!raf) {
            raf = true;
            requestAnimationFrame(() => {
              orbs.forEach((orb, i) => {
                const factor = (i + 1) * 0.6;
                orb.style.translate = `${px.x * factor}px ${px.y * factor}px`;
              });
              raf = false;
            });
          }
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("mousemove", onMove));
      }
    }

    /* ---------- 5. Scroll progress ---------- */
    const progress = rootRef.current?.querySelector<HTMLElement>(".scroll-progress");
    if (progress) {
      let raf = false;
      const update = () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        progress.style.width = Math.min(100, Math.max(0, scrolled)) + "%";
        raf = false;
      };
      const onScroll = () => {
        if (!raf) {
          raf = true;
          requestAnimationFrame(update);
        }
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    /* ---------- 6. Reveal on scroll ---------- */
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reveals.length && "IntersectionObserver" in window) {
      const ro = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              ro.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );
      reveals.forEach((el) => ro.observe(el));
      cleanups.push(() => ro.disconnect());
    }

    /* ---------- 7. Stat counters ---------- */
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    if (counters.length && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count || "0", 10) || 0;
            const duration = 1600;
            const start = performance.now();
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              el.textContent = String(Math.floor(eased * target));
              if (t < 1) requestAnimationFrame(step);
              else el.textContent = String(target);
            };
            requestAnimationFrame(step);
            obs.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => obs.observe(c));
      cleanups.push(() => obs.disconnect());
    }

    /* ---------- 8. Gallery parallax tilt ---------- */
    if (fine) {
      const medias = Array.from(document.querySelectorAll<HTMLElement>(".gallery__media"));
      const handlers: Array<[HTMLElement, EventListener, EventListener]> = [];
      medias.forEach((media) => {
        const img = media.querySelector("img");
        if (!img) return;
        const onMove3 = ((e: Event) => {
          const me = e as MouseEvent;
          const r = media.getBoundingClientRect();
          const x = (me.clientX - r.left) / r.width - 0.5;
          const y = (me.clientY - r.top) / r.height - 0.5;
          img.style.transform = `scale(1.08) translate(${x * -10}px, ${y * -10}px)`;
        }) as EventListener;
        const onLeave = () => {
          img.style.transform = "";
        };
        media.addEventListener("mousemove", onMove3);
        media.addEventListener("mouseleave", onLeave);
        handlers.push([media, onMove3, onLeave]);
      });
      cleanups.push(() => {
        handlers.forEach(([el, mv, lv]) => {
          el.removeEventListener("mousemove", mv);
          el.removeEventListener("mouseleave", lv);
        });
      });
    }

    /* ---------- 9. (removed — the Let's Build cube was replaced by the
          interactive Spline 3D robot, which handles its own input) ---------- */

    /* ---------- 10. Smooth scroll for in-page anchors ---------- */
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    );
    const onClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (href && href.length > 1) {
        const t = document.querySelector(href);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    anchors.forEach((a) => a.addEventListener("click", onClick));
    cleanups.push(() => {
      anchors.forEach((a) => a.removeEventListener("click", onClick));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [refreshKey]);

  return (
    <div ref={rootRef}>
      {/* Custom cursor (CSS hides on touch) */}
      <div className="cursor" aria-hidden="true">
        <div className="cursor__dot"></div>
        <div className="cursor__ring"></div>
        <div className="cursor__label"></div>
      </div>

      {/* Mesh background orbs */}
      <div className="mesh" aria-hidden="true">
        <div className="mesh__orb mesh__orb--1"></div>
        <div className="mesh__orb mesh__orb--2"></div>
        <div className="mesh__orb mesh__orb--3"></div>
      </div>

      {/* Grain overlay */}
      <div className="grain" aria-hidden="true"></div>

      {/* Scroll progress bar */}
      <div className="scroll-progress" aria-hidden="true"></div>
    </div>
  );
}
