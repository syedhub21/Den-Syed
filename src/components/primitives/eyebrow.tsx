"use client";

import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  showLine?: boolean;
}

/**
 * Small uppercase tracked label used at the top of each section.
 * Optional leading hairline.
 */
export function Eyebrow({ children, className, showLine = true }: EyebrowProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLine && <span className="w-8 h-px bg-stroke" aria-hidden />}
      <span className="text-xs text-muted uppercase tracking-[0.3em] font-body">
        {children}
      </span>
    </div>
  );
}
