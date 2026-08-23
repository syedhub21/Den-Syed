"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the section currently in view using IntersectionObserver.
 * Used by the navbar to highlight the active link.
 */
export function useScrollSpy(
  ids: string[],
  options?: { rootMargin?: string; threshold?: number }
) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: options?.rootMargin ?? "-40% 0px -55% 0px",
        threshold: options?.threshold ?? [0, 0.25, 0.5, 1],
      }
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids, options?.rootMargin, options?.threshold]);

  return activeId;
}
