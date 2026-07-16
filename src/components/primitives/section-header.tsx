"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtext?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Standard section header: eyebrow + heading (with italic display word) + subtext.
 * Reveals on scroll into view.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtext,
  align = "left",
  className,
  action,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: EASE }}
      className={cn(
        "flex flex-col gap-4 mb-10 md:mb-14",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-4", align === "center" && "items-center")}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display italic text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-text-primary">
          {title}
        </h2>
        {subtext && (
          <p className="text-sm md:text-base text-muted max-w-md font-body">
            {subtext}
          </p>
        )}
      </div>
      {action && <div className="hidden md:block">{action}</div>}
    </motion.div>
  );
}
