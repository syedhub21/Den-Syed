"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, CheckCircle2, AlertTriangle, Lightbulb, User } from "lucide-react";
import type { Project } from "@/types/portfolio";

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Project Detail — a gallery-exhibit modal.
 * Shows cover, problem, description, tech stack, features, challenges,
 * contributions, screenshots, and external links.
 * Keyboard: ESC to close. Click backdrop to close.
 */
export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [activeShot, setActiveShot] = useState(0);

  useEffect(() => {
    setActiveShot(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — project details`}
        >
          <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative w-full max-w-5xl bg-surface border border-stroke rounded-3xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg/80 backdrop-blur text-text-primary hover:bg-stroke transition-colors"
                aria-label="Close project details"
              >
                <X size={18} />
              </button>

              {/* Cover image */}
              {project.coverImage && (
                <div className="relative aspect-[16/9] bg-bg overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={`${project.title} cover`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <h2 className="font-display italic text-4xl md:text-6xl text-text-primary leading-tight">
                      {project.title}
                    </h2>
                    {project.tagline && (
                      <p className="text-sm md:text-base text-muted mt-2 max-w-xl font-body">
                        {project.tagline}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="p-6 md:p-10 space-y-10">
                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group inline-flex rounded-full"
                    >
                      <span className="absolute -inset-[2px] rounded-full animated-gradient-border opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative inline-flex items-center gap-2 text-sm rounded-full bg-text-primary text-bg px-5 py-2.5 font-body">
                        <ExternalLink size={14} /> Live
                      </span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm rounded-full border border-stroke bg-bg text-text-primary px-5 py-2.5 hover:bg-stroke/50 transition-colors font-body"
                    >
                      <Github size={14} /> Repository
                    </a>
                  )}
                </div>

                {/* Tech stack */}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] uppercase tracking-[0.15em] text-muted border border-stroke rounded-full px-3 py-1 font-body"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Problem */}
                {project.problem && (
                  <DetailBlock
                    icon={<AlertTriangle size={16} className="text-[hsl(38_92%_62%)]" />}
                    label="The problem"
                  >
                    <p className="text-sm md:text-base text-text-primary/90 leading-relaxed font-body">
                      {project.problem}
                    </p>
                  </DetailBlock>
                )}

                {/* Description */}
                {project.description && (
                  <DetailBlock label="Overview">
                    <p className="text-sm md:text-base text-muted leading-relaxed font-body">
                      {project.description}
                    </p>
                  </DetailBlock>
                )}

                {/* Features */}
                {project.features.length > 0 && (
                  <DetailBlock
                    icon={<CheckCircle2 size={16} className="text-[hsl(150_60%_55%)]" />}
                    label="What I built"
                  >
                    <ul className="space-y-2">
                      {project.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm md:text-base text-text-primary/90 font-body"
                        >
                          <span className="text-muted mt-1.5 flex-shrink-0">—</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailBlock>
                )}

                {/* Challenges */}
                {project.challenges.length > 0 && (
                  <DetailBlock
                    icon={<Lightbulb size={16} className="text-[hsl(48_100%_70%)]" />}
                    label="Technical challenges"
                  >
                    <ul className="space-y-2">
                      {project.challenges.map((c, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm md:text-base text-muted font-body"
                        >
                          <span className="text-stroke mt-1.5 flex-shrink-0">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailBlock>
                )}

                {/* Contributions */}
                {project.contributions.length > 0 && (
                  <DetailBlock
                    icon={<User size={16} className="text-[hsl(0_0%_70%)]" />}
                    label="My contributions"
                  >
                    <ul className="space-y-2">
                      {project.contributions.map((c, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm md:text-base text-muted font-body"
                        >
                          <span className="text-stroke mt-1.5 flex-shrink-0">→</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailBlock>
                )}

                {/* Screenshots gallery */}
                {project.screenshots.length > 0 && (
                  <DetailBlock label="Screenshots">
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stroke bg-bg">
                        <img
                          src={project.screenshots[activeShot]}
                          alt={`${project.title} screenshot ${activeShot + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      {project.screenshots.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                          {project.screenshots.map((shot, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveShot(i)}
                              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border transition-all ${
                                activeShot === i
                                  ? "border-text-primary/60"
                                  : "border-stroke opacity-60 hover:opacity-100"
                              }`}
                              aria-label={`View screenshot ${i + 1}`}
                            >
                              <img
                                src={shot}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </DetailBlock>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailBlock({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs uppercase tracking-[0.3em] text-muted font-body">
          {label}
        </h3>
      </div>
      {children}
    </div>
  );
}
