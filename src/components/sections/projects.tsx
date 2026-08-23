"use client";

import { useMemo, useState } from "react";
import type { Profile, Project } from "@/types/portfolio";

interface ProjectsProps {
  projects: Project[];
  profile: Profile;
}

// Layout rhythm matching the Atelier gallery — repeats for longer lists
const PATTERN = ["tall", "", "wide", "", "", "tall"] as const;

/** Truncate a description the way the Atelier cards do. */
function truncate(text: string, max = 46): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Projects — the Atelier "Selected work" gallery.
 *
 * Filter chips are derived from each project's primary technology
 * (first entry in `technologies`), so admin edits flow straight through.
 * The masonry-ish rhythm (tall / regular / wide) follows the Atelier grid.
 */
export function Projects({ projects, profile }: ProjectsProps) {
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      const cat = p.technologies?.[0] || "Project";
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return Array.from(counts.entries()); // [ [cat, count], ... ]
  }, [projects]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => (p.technologies?.[0] || "Project") === filter),
    [filter, projects]
  );

  return (
    <section className="work" id="work" aria-label="Selected work">
      <div className="section-head">
        <span className="section-head__num">02 /</span>
        <h2 className="section-head__title">Selected work</h2>
        <div className="work__filters" role="group" aria-label="Filter projects">
          <button
            className={`work__filter ${filter === "all" ? "is-active" : ""}`}
            onClick={() => setFilter("all")}
            data-cursor="link"
          >
            All <span>{projects.length}</span>
          </button>
          {categories.map(([cat, count]) => (
            <button
              key={cat}
              className={`work__filter ${filter === cat ? "is-active" : ""}`}
              onClick={() => setFilter(cat)}
              data-cursor="link"
            >
              {cat} <span>{count}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="gallery">
        {visible.map((project, i) => {
          const variant = PATTERN[i % PATTERN.length];
          const cls =
            variant === "tall"
              ? "gallery__item gallery__item--tall"
              : variant === "wide"
                ? "gallery__item gallery__item--wide"
                : "gallery__item";
          const href = project.liveUrl || project.githubUrl || "#";
          const tag = project.technologies?.[0] || "Project";

          return (
            <li key={project.id} className={cls}>
              <a
                className="gallery__media"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                data-cursor-text="View"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                />
                <span className="gallery__view">View ↗</span>
              </a>
              <div className="gallery__meta">
                <span className="gallery__index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{truncate(project.description)}</p>
                </div>
                <span className="gallery__tag">{tag}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="work__more">
        <a
          href={profile.github || "https://github.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          data-cursor="cta"
        >
          <span>Full archive</span>
          <span className="btn-ghost__arrow">↗</span>
        </a>
      </div>
    </section>
  );
}
