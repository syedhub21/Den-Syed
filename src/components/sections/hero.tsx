"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Profile } from "@/types/portfolio";

interface HeroProps {
  profile: Profile;
}

const EASE = [0.4, 0, 0.2, 1] as const;

// Default rotating roles — overridden by profile.rotatingRoles from admin
const DEFAULT_ROTATING_ROLES = [
  "Software Developer",
  "Frontend Developer",
  "CS Student",
  "Designer",
  "Creator",
  "Problem Solver",
];

/**
 * Hero — polished, alive, like a piece of art.
 *
 * Layers (back to front):
 * 1. Slowly shifting radial gradient background (hue drifts subtly)
 * 2. Cursor-following ambient light (soft glow tracks mouse)
 * 3. Giant background text "Hi! I'm Syed" (staggered word reveal)
 * 4. Character image (mouse parallax — moves opposite to cursor for depth)
 * 5. Role label + buttons (staggered entrance)
 *
 * All motion respects prefers-reduced-motion.
 */
export function Hero({ profile }: HeroProps) {
  const reduced = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  // Use rotating roles from admin-edited profile, fall back to defaults
  const rotatingRoles =
    profile.rotatingRoles && profile.rotatingRoles.length > 0
      ? profile.rotatingRoles
      : DEFAULT_ROTATING_ROLES;

  // Cycle through roles every 2.5s — alive, humanic rotation
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % rotatingRoles.length);
    }, 2500);
    return () => clearInterval(id);
  }, [reduced, rotatingRoles.length]);

  // Mouse parallax — character moves opposite to cursor for depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const charX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const charY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });

  // Background text parallax (moves less than character = depth)
  const textX = useSpring(useTransform(mouseX, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 25 });
  const textY = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 25 });

  // Cursor light position
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x - 0.5);
      mouseY.set(y - 0.5);
      setLightPos({ x: x * 100, y: y * 100 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reduced]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* === LAYER 1: Living gradient background === */}
      {/* Radial gradient covering the FULL section — including behind the navbar.
          Center is lighter, edges fade to match the page bg. No seam at top. */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 90% at 50% 50%, hsl(0 0% 14%) 0%, hsl(0 0% 10%) 50%, hsl(0 0% 7%) 100%)",
        }}
        animate={
          reduced
            ? {}
            : {
                background: [
                  "radial-gradient(ellipse 100% 90% at 50% 50%, hsl(0 0% 14%) 0%, hsl(0 0% 10%) 50%, hsl(0 0% 7%) 100%)",
                  "radial-gradient(ellipse 95% 85% at 52% 52%, hsl(0 0% 15%) 0%, hsl(0 0% 11%) 50%, hsl(0 0% 7%) 100%)",
                  "radial-gradient(ellipse 100% 90% at 50% 50%, hsl(0 0% 14%) 0%, hsl(0 0% 10%) 50%, hsl(0 0% 7%) 100%)",
                ],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      {/* Bottom fade — smooth transition from hero into About section (no seam) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, hsl(0 0% 6%) 100%)",
        }}
        aria-hidden
      />

      {/* === LAYER 2: Cursor-following ambient light === */}
      {!reduced && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(circle 400px at ${lightPos.x}% ${lightPos.y}%, hsl(210 100% 56% / 0.06) 0%, transparent 70%)`,
          }}
          aria-hidden
        />
      )}

      {/* === LAYER 3: Giant background text (staggered reveal + parallax) === */}
      {/* Positioned at the TOP so it's clearly visible above the character */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="absolute inset-x-0 top-[8%] flex items-start justify-center pointer-events-none select-none z-0"
      >
        <motion.h1
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={reduced ? { opacity: 0.15 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
          className="font-display font-bold text-text-primary/[0.18] whitespace-nowrap leading-none tracking-tight"
          style={{ fontSize: "clamp(2.75rem, 13vw, 11rem)" }}
        >
          {profile.heroGreeting}{" "}
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="inline-block"
          >
            {profile.name}
          </motion.span>
        </motion.h1>
      </motion.div>

      {/* === LAYER 4: Character image (mouse parallax + subtle breathing) === */}
      <motion.div
        style={{ x: charX, y: charY }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 80, scale: 0.9 }}
        animate={
          reduced
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
              }
        }
        transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        className="relative z-10 flex items-center justify-center"
      >
        <motion.div
          className="relative"
          animate={reduced ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={profile.heroImage}
            alt={`${profile.name} — ${profile.roles.join(", ")}`}
            className="relative w-auto h-auto object-contain"
            style={{ maxHeight: "42vh", maxWidth: "280px" }}
          />
        </motion.div>
      </motion.div>

      {/* === LAYER 5: Role label + buttons === */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6 px-6 w-full max-w-md"
      >
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="text-base md:text-lg font-body text-text-secondary"
          >
            I am a{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="inline-block font-display italic text-text-primary"
              >
                {rotatingRoles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-glow rounded-lg px-6 py-2.5 text-sm font-body text-text-primary bg-black/20"
          >
            Contact
          </button>
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-glow rounded-lg px-6 py-2.5 text-sm font-body text-text-primary bg-black/20"
          >
            Who I&apos;m
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <div className="w-px h-8 bg-stroke overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 w-px h-3 bg-accent"
            animate={{ y: [0, 32, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
