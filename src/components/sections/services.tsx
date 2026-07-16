"use client";

import { motion } from "framer-motion";
import { Code2, Palette, AppWindow, Smartphone, Database, Zap } from "lucide-react";
import type { Service } from "@/types/portfolio";

interface ServicesProps {
  services: Service[];
}

const EASE = [0.4, 0, 0.2, 1] as const;

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2,
  Palette,
  AppWindow,
  Smartphone,
  Database,
  Zap,
};

export function Services({ services }: ServicesProps) {
  return (
    <section
      id="services"
      className="relative bg-bg py-20 md:py-32 scroll-mt-20"
      aria-label="Services"
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
            What I do
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Services
          </h2>
        </motion.div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon] || Code2;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                className="card-hover group relative bg-surface border border-stroke rounded-2xl p-8 flex flex-col items-center text-center gap-4"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-surface-light border border-stroke flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
                  <Icon
                    size={28}
                    className="text-text-secondary group-hover:text-accent transition-colors duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="font-display text-lg md:text-xl font-semibold text-text-primary">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed font-body">
                  {service.description}
                </p>

                {/* Accent number */}
                <span className="absolute top-4 right-5 font-display text-5xl font-bold text-text-primary/[0.05] select-none">
                  0{i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
