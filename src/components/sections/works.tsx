"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/primitives/section-header";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface WorksProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Selected Works — bento grid of project cards.
 * Column spans alternate (7/5/5/7) per the design spec.
 * Each card: cover image, halftone overlay, hover reveal pill.
 * Click opens the project detail modal.
 */
export function Works({ projects, onSelectProject }: WorksProps) {
  if (!projects.length) return null;

  return (
    <section
      id="works"
      className="relative bg-bg py-16 md:py-24 scroll-mt-24"
      aria-label="Selected Work"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          title={
            <>
              Featured <span className="font-display italic">projects</span>
            </>
          }
          subtext="A selection of projects I've worked on, from concept to launch."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onSelect={() => onSelectProject(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
}) {
  // Alternate spans: 7/5/5/7 pattern
  const span = project.span === 5 || project.span === 7 ? project.span : 7;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: EASE }}
      onClick={onSelect}
      className={cn(
        "group relative block w-full text-left bg-surface border border-stroke rounded-3xl overflow-hidden focus-visible:outline-2 focus-visible:outline-[hsl(var(--text)/0.6)]",
        span === 7 ? "md:col-span-7 aspect-[16/10]" : "md:col-span-5 aspect-[4/3]"
      )}
      aria-label={`Open project: ${project.title}`}
    >
      {/* Cover image */}
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone-overlay pointer-events-none" aria-hidden />

      {/* Hover reveal */}
      <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-opacity duration-400 flex items-center justify-center p-6">
        <div className="relative inline-flex rounded-full">
          <span className="absolute -inset-[2px] rounded-full animated-gradient-border opacity-100" />
          <span className="relative inline-flex items-center gap-2 bg-white text-bg rounded-full px-5 py-2.5 text-sm font-body">
            View — <span className="font-display italic">{project.title}</span>
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      {/* Title overlay (always visible, bottom-left) */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-bg/90 to-transparent">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-display italic text-2xl md:text-3xl text-text-primary leading-tight">
              {project.title}
            </h3>
            {project.tagline && (
              <p className="text-xs md:text-sm text-muted mt-1 font-body line-clamp-1">
                {project.tagline}
              </p>
            )}
          </div>
          {project.technologies[0] && (
            <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.2em] text-muted/80 font-body flex-shrink-0">
              {project.technologies[0]}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
