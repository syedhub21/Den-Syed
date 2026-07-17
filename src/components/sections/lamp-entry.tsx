"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface LampEntryProps {
  onEnter: () => void;
  hint?: string;
}

type LampState = "off" | "dragging" | "on";

/**
 * Lamp Entry — cinematic, with a physics-based chain that STAYS CONNECTED.
 *
 * The chain is anchored at the shade (x=150, y=42) — this point NEVER moves.
 * Only the lower part of the chain (below the anchor) stretches/moves.
 * The chain is drawn as a flexible path that bends naturally when pulled.
 *
 * States:
 * - Idle: chain hangs straight, gentle sway at the bottom only
 * - Drag: bottom of chain follows cursor, chain stretches like a real chain
 * - Shudder: brief vibration when light catches
 * - On: chain stays in pulled position
 */
export function LampEntry({ onEnter, hint = "Pull the chain" }: LampEntryProps) {
  const [state, setState] = useState<LampState>("off");
  const [hovered, setHovered] = useState(false);
  const [chainY, setChainY] = useState(0);
  const [shudder, setShudder] = useState(0);
  const reduced = useReducedMotion();
  const enteredRef = useRef(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startChainYRef = useRef(0);

  const PULL_THRESHOLD = 35;
  const MAX_PULL = 50;
  const ANCHOR_X = 150;
  const ANCHOR_Y = 42;
  const KNOB_REST_Y = 124;

  const handleDragStart = useCallback(
    (clientY: number) => {
      if (enteredRef.current || state === "on") return;
      draggingRef.current = true;
      startYRef.current = clientY;
      startChainYRef.current = chainY;
      setState("dragging");
    },
    [state, chainY]
  );

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!draggingRef.current || enteredRef.current) return;
      const delta = clientY - startYRef.current;
      const newY = Math.max(0, Math.min(MAX_PULL, startChainYRef.current + delta));
      setChainY(newY);

      if (newY >= PULL_THRESHOLD && state !== "on") {
        draggingRef.current = false;
        setState("on");
        enteredRef.current = true;
        setShudder(1);
        setTimeout(() => setShudder(0), 500);
        if (reduced) {
          setTimeout(onEnter, 300);
        } else {
          setTimeout(onEnter, 1500);
        }
      }
    },
    [state, onEnter, reduced]
  );

  const handleDragEnd = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (state === "dragging" && chainY < PULL_THRESHOLD) {
      setState("off");
      setChainY(0);
    }
  }, [state, chainY]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientY);
    },
    [handleDragStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (draggingRef.current) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientY);
      }
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  useEffect(() => {
    if (state !== "dragging") return;
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [state, handleDragMove, handleDragEnd]);

  const pullProgress = chainY / PULL_THRESHOLD;
  const lightIntensity =
    state === "on" ? 1 : state === "dragging" ? pullProgress * 0.5 : 0;
  const lightOn = state === "on";

  // Chain knob position — stays connected, only moves down
  const knobY = KNOB_REST_Y + chainY;

  // Sway offset for idle animation (only affects bottom, not anchor)
  const swayOffset = state === "off" && !reduced ? 2 : 0;
  const shudderX = shudder ? Math.sin(Date.now() / 30) * 1.5 : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: "hsl(0 0% 4%)" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: lightOn ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut", delay: lightOn ? 0.6 : 0 }}
      aria-hidden={lightOn}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, hsl(0 0% 6%) 0%, hsl(0 0% 3%) 70%, hsl(0 0% 0%) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, hsl(0 0% 5%) 50%, hsl(0 0% 3%) 100%)",
        }}
        aria-hidden
      />

      {/* Dust motes */}
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `hsl(38 80% 70% / ${0.15 + lightIntensity * 0.3})`,
                left: `${15 + i * 7}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{ y: [0, -30, 0], x: [0, i % 2 === 0 ? 15 : -15, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </div>
      )}

      {/* Warm glow halo — anchored near the pendant bulb at the top, not screen-center */}
      <motion.div
        className="absolute left-1/2 top-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle, hsl(38 92% 62% / 0.6) 0%, hsl(36 80% 55% / 0.25) 35%, transparent 70%)",
          filter: "blur(12px)",
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: lightOn ? 0.95 : hovered ? 0.08 : lightIntensity * 0.7,
          scale: lightOn ? 1.15 : lightIntensity > 0 ? 0.5 + lightIntensity : 0.3,
        }}
        transition={{ duration: lightOn ? 0.8 : 0.3, ease: "easeOut" }}
      />

      {/* Conical light beam — spills downward from the bulb, filling the screen */}
      <motion.div
        className="absolute left-1/2 top-[14%] -translate-x-1/2 pointer-events-none"
        style={{
          width: "460px",
          height: "86vh",
          background: "linear-gradient(180deg, hsl(38 92% 62% / 0.35) 0%, hsl(36 80% 55% / 0.12) 40%, transparent 100%)",
          clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
          filter: "blur(4px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: lightOn ? 0.7 : lightIntensity * 0.4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Ground-level wash — soft pool of light lower on the screen */}
      {lightIntensity > 0.1 && (
        <motion.div
          className="absolute left-1/2 bottom-[15%] -translate-x-1/2 pointer-events-none"
          style={{
            width: "320px",
            height: "60px",
            background: "radial-gradient(ellipse, hsl(38 92% 62% / 0.4) 0%, hsl(36 80% 55% / 0.15) 50%, transparent 80%)",
            filter: "blur(16px)",
          }}
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={{ opacity: lightOn ? 0.6 : lightIntensity * 0.5, scaleX: lightOn ? 1 : 0.3 + lightIntensity * 0.7 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* === THE PENDANT LAMP — small hanging bulb near the top, cord from the ceiling === */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 select-none"
        style={{ width: "min(55vw, 200px)", height: "min(32vh, 240px)" }}
      >
        <svg
          viewBox="0 0 200 240"
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="Pendant lamp — drag the chain down to turn on"
        >
          {/* Shade */}
          <motion.ellipse
            cx="100" cy="40" rx="60" ry="16"
            fill={lightIntensity > 0 ? `hsl(38 92% ${30 + lightIntensity * 25}%)` : "hsl(0 0% 10%)"}
            style={{ filter: lightIntensity > 0 ? `drop-shadow(0 0 ${20 + lightIntensity * 15}px hsl(38 92% 62% / ${lightIntensity * 0.9}))` : "none" }}
          />
          <motion.ellipse
            cx="100" cy="44" rx="60" ry="10"
            fill={lightIntensity > 0 ? `hsl(40 85% ${50 + lightIntensity * 20}%)` : "hsl(0 0% 6%)"}
          />
          {lightIntensity > 0.05 && (
            <motion.ellipse
              cx="100" cy="42" rx="44" ry="8"
              fill={`hsl(48 100% ${70 + lightIntensity * 18}%)`}
              initial={{ opacity: 0 }}
              animate={{ opacity: lightOn ? [0, 0.7, 1, 0.95, 1] : lightIntensity }}
              transition={{ duration: lightOn ? 0.6 : 0.3, times: lightOn ? [0, 0.4, 0.7, 0.85, 1] : [0, 1] }}
            />
          )}

          {/* Ceiling cord — short, pendant-style */}
          <rect x="98" y="0" width="4" height="40" fill="hsl(0 0% 14%)" />
          <motion.rect
            x="99" y="0" width="1" height="40"
            fill={lightIntensity > 0 ? `hsl(38 60% ${30 + lightIntensity * 20}%)` : "hsl(0 0% 20%)"}
          />

          {/* === CHAIN — STAYS CONNECTED === */}
          {/* The chain is drawn from ANCHOR (150,42) to knob (150, knobY).
              The anchor point NEVER moves — only the knob moves down.
              The chain string is a straight line that stretches.
              The knob and links below the anchor move together. */}

          {/* Chain attachment point — small ring at the shade */}
          <circle cx={ANCHOR_X} cy={ANCHOR_Y} r="2.5"
            fill={hovered || state === "dragging" ? "hsl(38 60% 55%)" : "hsl(0 0% 35%)"}
            className="transition-all duration-200"
          />

          {/* Chain string — from anchor to knob, stretches as knob moves */}
          <motion.line
            x1={ANCHOR_X} y1={ANCHOR_Y} x2={ANCHOR_X} y2={knobY - 6}
            stroke={hovered || state === "dragging" ? "hsl(38 60% 60%)" : "hsl(0 0% 28%)"}
            strokeWidth="1.5"
            className="transition-all duration-200"
          />

          {/* Chain links — positioned along the string, move with knob */}
          {/* These are between anchor and knob, evenly distributed */}
          {Array.from({ length: 7 }).map((_, i) => {
            const linkY = ANCHOR_Y + 8 + (i + 1) * ((knobY - 6 - ANCHOR_Y - 8) / 8);
            return (
              <motion.circle
                key={i}
                cx={ANCHOR_X}
                cy={linkY}
                r="2"
                fill={hovered || state === "dragging" ? "hsl(38 70% 65%)" : "hsl(0 0% 36%)"}
                animate={
                  state === "off" && !reduced
                    ? { cy: [linkY, linkY + 0.5, linkY] }
                    : state === "dragging"
                    ? { opacity: [1, 0.6, 1] }
                    : {}
                }
                transition={
                  state === "off"
                    ? { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                    : state === "dragging"
                    ? { duration: 0.4, repeat: Infinity, delay: i * 0.05, ease: "easeOut" }
                    : {}
                }
                className="transition-all duration-200"
              />
            );
          })}

          {/* Chain knob — the pull handle, moves down with chainY */}
          <motion.circle
            cx={ANCHOR_X}
            cy={knobY}
            r="7"
            fill={hovered || state === "dragging" || lightOn ? "hsl(38 85% 65%)" : "hsl(0 0% 50%)"}
            animate={{
              x: shudder ? [0, 1.5, -1.5, 1, 0] : 0,
              scale: state === "dragging" ? [1, 1.1, 1] : 1,
            }}
            transition={
              shudder
                ? { duration: 0.5, ease: "easeOut" }
                : state === "dragging"
                ? { duration: 0.3, repeat: Infinity }
                : { duration: 0.2 }
            }
            style={{
              filter:
                hovered || state === "dragging" || lightOn
                  ? "drop-shadow(0 0 12px hsl(38 92% 62% / 0.8))"
                  : "none",
            }}
            className="transition-all duration-200 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="button"
            tabIndex={0}
            aria-label="Drag the chain down to turn on the lamp"
          />

          {/* Invisible larger hit area around knob for easier dragging */}
          <rect
            x={ANCHOR_X - 20}
            y={knobY - 15}
            width="40"
            height="30"
            fill="transparent"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Drag indicator */}
          {(hovered || state === "dragging") && (
            <motion.g
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <text x={ANCHOR_X + 15} y={knobY + 3} fill="hsl(38 70% 70%)" fontSize="7" className="font-body pointer-events-none">
                ↓ pull
              </text>
            </motion.g>
          )}

        </svg>

        {/* Click target fallback */}
        {state === "off" && (
          <button
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            aria-label="Drag the chain down to turn on the lamp"
          />
        )}
      </div>

      {/* Hint text */}
      <AnimatePresence>
        {state !== "on" && (
          <motion.div
            className="absolute bottom-[14%] left-1/2 -translate-x-1/2 text-center pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-sm text-text-secondary/80 uppercase tracking-[0.35em] font-body">
              {hint}
            </p>
            <motion.p
              className="text-xs text-muted/60 mt-3 font-body"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {state === "dragging" ? "keep pulling..." : "grab and drag the chain down"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}
      <motion.div
        className="absolute top-6 left-6 md:top-10 md:left-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: state === "on" ? 0 : 0.6, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="font-display text-lg text-text-primary/60 tracking-tight">
          Syed&apos;s-Den
        </p>
      </motion.div>
    </motion.div>
  );
}
