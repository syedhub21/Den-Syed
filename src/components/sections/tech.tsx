"use client";

import { useEffect, useState } from "react";
import type { TechStack } from "@/types/portfolio";

interface TechProps {
  techStack: TechStack[];
}

// Brand colors keyed by icon slug (simple-icons naming)
const TECH_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  react: "#61dafb",
  "node-dotjs": "#339933",
  mysql: "#4479A1",
  php: "#777BB4",
  express: "#f5f0e8",
  nextdotjs: "#f5f0e8",
  git: "#f05032",
  c: "#A8B9CC",
  typescript: "#3178c6",
  html5: "#e34f26",
  css3: "#1572b6",
  tailwindcss: "#06b6d4",
  sass: "#cc6699",
  python: "#3776AB",
};

/**
 * Tech — the colorful icon-card marquee (tech.mp4 style).
 *
 * Squircle cards with subtle glass borders, each carrying its brand-colored
 * SVG logo, name label below, infinite horizontal scroll, pause on hover,
 * and a lift + orange border glow on card hover.
 */
export function Tech({ techStack }: TechProps) {
  if (!techStack.length) return null;

  // Duplicate the list for a seamless loop
  const items = [...techStack, ...techStack];

  return (
    <section className="tech" aria-label="Tech stack">
      <p className="tech__label">Things I work with</p>
      <div className="tech__marquee">
        <div className="tech__track">
          {items.map((tech, i) => (
            <div className="tech__card" key={`${tech.id}-${i}`}>
              <span className="tech__icon">
                <TechIcon icon={tech.icon} name={tech.name} />
              </span>
              <span className="tech__name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TechIcon — renders the brand SVG from /public/icons/ tinted
   with its brand color via fill:currentColor
   ============================================================ */
function TechIcon({ icon, name }: { icon: string; name: string }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const color = TECH_COLORS[icon] || "#f5f0e8";

  useEffect(() => {
    let alive = true;
    fetch(`/icons/${icon}.svg`)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((svg) => {
        if (alive) setSvgContent(svg);
      })
      .catch(() => {
        if (alive) setSvgContent(null);
      });
    return () => {
      alive = false;
    };
  }, [icon]);

  if (svgContent) {
    return (
      <span
        className="tech__svg"
        style={{ color }}
        dangerouslySetInnerHTML={{
          __html: svgContent.replace(
            /<svg /,
            `<svg style="width:100%;height:100%;fill:currentColor" `
          ),
        }}
      />
    );
  }

  // Fallback: colored initials
  return (
    <span className="tech__svg tech__svg--fallback" style={{ color }}>
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
