"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Profile, TechStack } from "@/types/portfolio";

interface AboutProps {
  profile: Profile;
  techStack: TechStack[];
}

const EASE = [0.4, 0, 0.2, 1] as const;

// Brand colors for tech icons
const TECH_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  react: "#61dafb",
  "node-dotjs": "#339933",
  mysql: "#4479A1",
  php: "#777BB4",
  express: "#000000",
  nextdotjs: "#000000",
  git: "#f05032",
  c: "#A8B9CC",
  typescript: "#3178c6",
  html5: "#e34f26",
  css3: "#1572b6",
  tailwindcss: "#06b6d4",
  sass: "#cc6699",
};

export function About({ profile, techStack }: AboutProps) {
  return (
    <section
      id="about"
      className="relative bg-bg py-20 md:py-32 scroll-mt-20"
      aria-label="About"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-sm text-accent font-body uppercase tracking-[0.3em] mb-2">
            Get to know me
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            About Me
          </h2>
        </motion.div>

        {/* Two-column layout with flip card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Flip card left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex justify-center"
          >
            <FlipCard profile={profile} />
          </motion.div>

          {/* Text right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
              {profile.roles.join(" & ")}
            </h3>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-body">
              {profile.bio}
            </p>
          </motion.div>
        </div>

        {/* Tech stack — continuous horizontal marquee scroll (video style) */}
        {techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-16 md:mt-24"
          >
            <p className="text-center text-sm text-muted font-body uppercase tracking-[0.3em] mb-8">
              Technologies I work with
            </p>
            <div className="marquee-container">
              <div className="marquee-track">
                {/* Duplicate the list for seamless loop */}
                {[...techStack, ...techStack].map((tech, i) => (
                  <div
                    key={`${tech.id}-${i}`}
                    className="flex flex-col items-center gap-2 group cursor-default flex-shrink-0"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface border border-stroke flex items-center justify-center smooth group-hover:border-accent/40 group-hover:shadow-lg group-hover:bg-surface-light">
                      <TechIcon icon={tech.icon} name={tech.name} />
                    </div>
                    <span className="text-xs text-muted font-body group-hover:text-text-secondary transition-colors whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   FLIP CARD — horizontal Y-axis 180° rotation (pic2 style)
   Front: character with laptop
   Back: quick info / about text
   ============================================================ */
function FlipCard({ profile }: { profile: Profile }) {
  return (
    <div className="flip-card w-full max-w-md aspect-[2/3] rounded-2xl overflow-hidden">
      <div className="flip-card-inner">
        {/* Front — workspace scene image (portrait 2:3 to match 832x1216) */}
        <div className="flip-card-front rounded-2xl overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src="/images/flip-card-image.png"
              alt="Developer workspace"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Back — info panel */}
        <div className="flip-card-back bg-surface rounded-2xl overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <span className="font-display text-2xl font-bold text-accent">
              {profile.name.charAt(0)}
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold text-text-primary">
            {profile.name}
          </h3>
          <p className="text-sm text-text-secondary font-body">
            {profile.roles.join(" • ")}
          </p>
          <div className="w-12 h-px bg-stroke my-2" />
          <p className="text-xs text-muted font-body leading-relaxed">
            {profile.location}
          </p>
          <p className="text-xs text-muted font-body">
            {profile.email}
          </p>
          <div className="flex gap-2 mt-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-surface-light text-xs text-text-secondary hover:text-accent border border-stroke smooth font-body"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-surface-light text-xs text-text-secondary hover:text-accent border border-stroke smooth font-body"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TechIcon — renders brand SVG logos from /public/icons/
   ============================================================ */
function TechIcon({ icon, name }: { icon: string; name: string }) {
  const color = TECH_COLORS[icon] || "#ffffff";
  const [svgContent, setSvgContent] = useState<string | null>(null);

  // Load SVG on mount
  useEffect(() => {
    fetch(`/icons/${icon}.svg`)
      .then((r) => r.text())
      .then((svg) => {
        setSvgContent(svg);
      })
      .catch(() => setSvgContent(null));
  }, [icon]);

  if (svgContent) {
    return (
      <div
        className="w-8 h-8 md:w-9 md:h-9"
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

  // Fallback: text initials
  return (
    <span
      className="font-display text-xs md:text-sm font-bold"
      style={{ color }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
