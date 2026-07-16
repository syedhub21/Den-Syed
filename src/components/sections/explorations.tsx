"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/primitives/section-header";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Exploration } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ExplorationsProps {
  explorations: Exploration[];
  dribbbleUrl?: string;
}

gsap.registerPlugin(ScrollTrigger);

/**
 * Explorations — a pinned parallax gallery.
 * Content stays pinned while two columns of images drift at different
 * speeds on scroll. Click an image to open a simple lightbox.
 */
export function Explorations({ explorations, dribbbleUrl = "https://dribbble.com" }: ExplorationsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<Exploration | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current || !leftColRef.current || !rightColRef.current)
      return;

    const ctx = gsap.context(() => {
      const items = explorations.length;
      if (items < 2) return;

      gsap.to(leftColRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      gsap.to(rightColRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [explorations.length, reduced]);

  if (!explorations.length) return null;

  const left = explorations.filter((_, i) => i % 2 === 0);
  const right = explorations.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="explorations"
      ref={sectionRef}
      className="relative bg-bg py-16 md:py-24 scroll-mt-24"
      aria-label="Explorations"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Explorations"
          title={
            <>
              Visual <span className="font-display italic">playground</span>
            </>
          }
          subtext="Side projects, color studies, and motion sketches."
          action={
            <a
              href={dribbbleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex rounded-full"
            >
              <span className="absolute -inset-[2px] rounded-full animated-gradient-border opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative inline-flex items-center gap-1 text-sm rounded-full border border-stroke bg-bg text-text-primary px-5 py-2.5 font-body">
                View on Dribbble <span aria-hidden>→</span>
              </span>
            </a>
          }
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-8 md:gap-20">
          <div ref={leftColRef} className="flex flex-col gap-8 md:gap-20">
            {left.map((ex) => (
              <ExplorationCard key={ex.id} ex={ex} onClick={() => setLightbox(ex)} />
            ))}
          </div>
          <div ref={rightColRef} className="flex flex-col gap-8 md:gap-20 mt-16 md:mt-32">
            {right.map((ex) => (
              <ExplorationCard key={ex.id} ex={ex} onClick={() => setLightbox(ex)} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          <button
            className="absolute top-6 right-6 text-muted hover:text-text-primary text-sm font-body"
            onClick={() => setLightbox(null)}
          >
            Close ✕
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl w-full aspect-square rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg/90 to-transparent">
              <p className="font-display italic text-2xl text-text-primary">
                {lightbox.title}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

function ExplorationCard({
  ex,
  onClick,
}: {
  ex: Exploration;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      className={cn(
        "group relative block w-full aspect-square rounded-2xl overflow-hidden bg-surface border border-stroke"
      )}
      aria-label={`Open: ${ex.title}`}
    >
      <img
        src={ex.image}
        alt={ex.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/40 transition-colors duration-300 flex items-end p-4">
        <span className="text-xs text-text-primary opacity-0 group-hover:opacity-100 transition-opacity font-body uppercase tracking-[0.2em]">
          {ex.title}
        </span>
      </div>
    </motion.button>
  );
}
