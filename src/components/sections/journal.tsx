"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/primitives/section-header";
import type { JournalEntry } from "@/types/portfolio";

interface JournalProps {
  entries: JournalEntry[];
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Journal — horizontal pill entries with cover image, title, read time, date.
 * Data-driven. Hover lifts the pill.
 */
export function Journal({ entries }: JournalProps) {
  if (!entries.length) return null;

  return (
    <section
      id="journal"
      className="relative bg-bg py-16 md:py-24 scroll-mt-24"
      aria-label="Journal"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          title={
            <>
              Recent <span className="font-display italic">thoughts</span>
            </>
          }
          subtext="Notes on design, engineering, and the space between."
        />

        <div className="flex flex-col gap-3">
          {entries.map((entry, i) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className="group flex items-center gap-4 md:gap-6 p-3 md:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors duration-300 cursor-pointer"
            >
              {/* Cover thumbnail */}
              {entry.coverImage && (
                <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 bg-bg">
                  <img
                    src={entry.coverImage}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title + excerpt */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display italic text-lg md:text-2xl text-text-primary truncate">
                  {entry.title}
                </h3>
                <p className="text-xs md:text-sm text-muted truncate font-body">
                  {entry.excerpt}
                </p>
              </div>

              {/* Meta */}
              <div className="hidden sm:flex flex-col items-end text-right flex-shrink-0 pr-2">
                <span className="text-xs text-muted font-body">{entry.date}</span>
                <span className="text-[10px] text-muted/70 uppercase tracking-[0.15em] font-body">
                  {entry.readTime}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border border-stroke flex items-center justify-center text-muted group-hover:text-text-primary group-hover:border-text-primary/40 transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
