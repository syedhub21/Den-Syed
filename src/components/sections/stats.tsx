"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Stat } from "@/types/portfolio";

interface StatsProps {
  stats: Stat[];
}

/**
 * Stats — 3-column counter section.
 * Numbers count up from 0 to value when scrolled into view.
 */
export function Stats({ stats }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  if (!stats.length) return null;

  return (
    <section className="relative bg-bg py-16 md:py-24" aria-label="Stats">
      <div ref={ref} className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center md:border-l border-stroke md:pl-6 first:border-l-0"
            >
              <Counter value={stat.value} suffix={stat.suffix} active={inView} />
              <p className="text-xs md:text-sm text-muted uppercase tracking-[0.2em] mt-2 font-body">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <span className="font-display italic text-5xl md:text-6xl lg:text-7xl text-text-primary tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
