"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/types/portfolio";

interface ProjectsProps {
  projects: Project[];
}

const EASE = [0.4, 0, 0.2, 1] as const;

export function Projects({ projects }: ProjectsProps) {
  return (
    <section
      id="projects"
      className="relative bg-surface/30 py-20 md:py-32 scroll-mt-20"
      aria-label="Projects"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-sm text-accent font-body uppercase tracking-[0.3em] mb-2">
            My work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Projects
          </h2>
        </motion.div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: EASE }}
              className="card-hover group bg-surface border border-stroke rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Cover image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-bg">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              </div>

              {/* Body */}
              <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
                <h3 className="font-display text-lg md:text-xl font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed font-body flex-1">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-body px-2.5 py-1 rounded-md bg-surface-light text-text-secondary border border-stroke"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-body text-text-primary bg-bg/50"
                  >
                    <Github size={13} /> GitHub
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-body text-text-primary bg-bg/50"
                  >
                    <ExternalLink size={13} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
