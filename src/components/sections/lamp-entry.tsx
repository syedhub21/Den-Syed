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
 * Lamp Entry — a pendant pull-chain that swings on a pivot like a real chain,
 * instead of stretching like elastic. Applies real physical behavior:
 *
 * - The chain hangs at fixed length from the anchor (shade) and SWINGS
 *   (rotates around the anchor) as it's pulled — it doesn't stretch.
 * - Releasing early snaps it back with a springy overshoot + settle,
 *   like a real weighted chain finding its rest position.
 * - Powering on triggers a bulb flicker sequence (a couple of uneven
 *   catches) before it holds steady, mimicking an incandescent filament
 *   catching current — not an instant, linear fade-in.
 * - Idle state has a slow, irregular pendulum sway (a pendant catching
 *   faint air currents), not a mechanical linear wobble.
 */
export function LampEntry({ onEnter, hint = "Pull the chain" }: LampEntryProps) {
  const [state, setState] = useState<LampState>("off");
  const [hovered, setHovered] = useState(false);
  const [angle, setAngle] = useState(0); // degrees, chain swing around the anchor
  const [flickerOn, setFlickerOn] = useState(false);
  const reduced = useReducedMotion();
  const enteredRef = useRef(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startAngleRef = useRef(0);

  const ANCHOR_X = 150;
  const ANCHOR_Y = 42;
  const CHAIN_LENGTH = 78; // fixed — the chain never stretches, only swings
  const MAX_ANGLE = 46; // degrees
  const PULL_THRESHOLD_ANGLE = 33;
  const PX_PER_DEGREE = 3.4; // how much vertical drag maps to a degree of swing

  const handleDragStart = useCallback(
    (clientY: number) => {
      if (enteredRef.current || state === "on") return;
      draggingRef.current = true;
      startYRef.current = clientY;
      startAngleRef.current = angle;
      setState("dragging");
    },
    [state, angle]
  );

  const triggerOn = useCallback(() => {
    draggingRef.current = false;
    setState("on");
    enteredRef.current = true;
    setAngle(MAX_ANGLE);

    // Bulb catches current unevenly before holding steady — like a real
    // incandescent filament, not a clean linear fade.
    setFlickerOn(true);
    if (!reduced) {
      setTimeout(onEnter, 1500);
    } else {
      setTimeout(onEnter, 300);
    }
  }, [onEnter, reduced]);

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!draggingRef.current || enteredRef.current) return;
      const delta = clientY - startYRef.current;
      const newAngle = Math.max(0, Math.min(MAX_ANGLE, startAngleRef.current + delta / PX_PER_DEGREE));
      setAngle(newAngle);

      if (newAngle >= PULL_THRESHOLD_ANGLE) {
        triggerOn();
      }
    },
    [triggerOn]
  );

  const handleDragEnd = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (state === "dragging") {
      setState("off");
      // Let the spring transition (below, on the chain group) handle the
      // swing back to rest — that's where the physical "give" reads as real.
      setAngle(0);
    }
  }, [state]);

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

  const pullProgress = angle / PULL_THRESHOLD_ANGLE;
  const lightIntensity =
    state === "on" ? 1 : state === "dragging" ? Math.min(1, pullProgress) * 0.5 : 0;
  const lightOn = state === "on";

  // Knob position at the end of the fixed-length chain, BEFORE rotation —
  // the rotation transform below swings this whole group around the anchor.
  const knobLocalY = ANCHOR_Y + CHAIN_LENGTH;

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

      {/* Warm glow halo — anchored near the pendant bulb at the top */}
      <motion.div
        className="absolute left-1/2 top-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle, hsl(38 92% 62% / 0.6) 0%, hsl(36 80% 55% / 0.25) 35%, transparent 70%)",
          filter: "blur(12px)",
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={
          lightOn && flickerOn
            ? {
                // Filament "catching" — a couple of uneven flickers before it holds.
                opacity: [0, 0.55, 0.15, 0.85, 0.35, 0.95, 1],
                scale: [0.4, 0.9, 0.7, 1.05, 0.95, 1.1, 1.15],
              }
            : {
                opacity: hovered ? 0.08 : lightIntensity * 0.7,
                scale: lightIntensity > 0 ? 0.5 + lightIntensity : 0.3,
              }
        }
        transition={
          lightOn && flickerOn
            ? { duration: 0.9, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], ease: "easeOut" }
            : { duration: 0.3, ease: "easeOut" }
        }
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
        transition={{ duration: lightOn ? 0.9 : 0.3, ease: "easeOut", delay: lightOn ? 0.3 : 0 }}
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
          transition={{ duration: 0.6, ease: "easeOut", delay: lightOn ? 0.4 : 0 }}
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
              animate={
                lightOn && flickerOn
                  ? { opacity: [0, 0.6, 0.1, 0.8, 0.3, 0.9, 1] }
                  : { opacity: lightIntensity }
              }
              transition={
                lightOn && flickerOn
                  ? { duration: 0.9, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1], ease: "easeOut" }
                  : { duration: 0.3 }
              }
              onAnimationComplete={() => {
                if (lightOn) setFlickerOn(false);
              }}
            />
          )}

          {/* Ceiling cord — short, pendant-style */}
          <rect x="98" y="0" width="4" height="40" fill="hsl(0 0% 14%)" />
          <motion.rect
            x="99" y="0" width="1" height="40"
            fill={lightIntensity > 0 ? `hsl(38 60% ${30 + lightIntensity * 20}%)` : "hsl(0 0% 20%)"}
          />

          {/* Chain attachment ring — fixed at the shade, never moves */}
          <circle cx={ANCHOR_X} cy={ANCHOR_Y} r="2.5"
            fill={hovered || state === "dragging" ? "hsl(38 60% 55%)" : "hsl(0 0% 35%)"}
            className="transition-all duration-200"
          />

          {/* === CHAIN GROUP — fixed length, pivots around the anchor like a real
               pull-chain instead of stretching. Idle: slow irregular sway.
               Drag: rotates by `angle` toward the cursor. Release: springs
               back to rest with a natural overshoot. === */}
          <motion.g
            style={{ transformOrigin: `${ANCHOR_X}px ${ANCHOR_Y}px` }}
            animate={
              state === "dragging"
                ? { rotate: angle }
                : state === "off" && !reduced
                ? { rotate: [-2.5, 3, -1.5, 2, -2.5] }
                : { rotate: 0 }
            }
            transition={
              state === "dragging"
                ? { type: "tween", duration: 0.05, ease: "linear" }
                : state === "off" && !reduced
                ? { duration: 9, repeat: Infinity, ease: "easeInOut" }
                : { type: "spring", stiffness: 260, damping: 12, mass: 0.6 }
            }
          >
            {/* Chain string — fixed length from anchor to knob */}
            <line
              x1={ANCHOR_X} y1={ANCHOR_Y} x2={ANCHOR_X} y2={knobLocalY - 6}
              stroke={hovered || state === "dragging" ? "hsl(38 60% 60%)" : "hsl(0 0% 28%)"}
              strokeWidth="1.5"
              className="transition-all duration-200"
            />

            {/* Chain links — evenly spaced along the fixed-length string */}
            {Array.from({ length: 7 }).map((_, i) => {
              const linkY = ANCHOR_Y + 8 + (i + 1) * ((knobLocalY - 6 - ANCHOR_Y - 8) / 8);
              return (
                <circle
                  key={i}
                  cx={ANCHOR_X}
                  cy={linkY}
                  r="2"
                  fill={hovered || state === "dragging" ? "hsl(38 70% 65%)" : "hsl(0 0% 36%)"}
                  className="transition-all duration-200"
                />
              );
            })}

            {/* Chain knob — the pull handle, at the fixed end of the chain */}
            <motion.circle
              cx={ANCHOR_X}
              cy={knobLocalY}
              r="7"
              fill={hovered || state === "dragging" || lightOn ? "hsl(38 85% 65%)" : "hsl(0 0% 50%)"}
              animate={{ scale: state === "dragging" ? [1, 1.08, 1] : 1 }}
              transition={state === "dragging" ? { duration: 0.35, repeat: Infinity } : { duration: 0.2 }}
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
              y={knobLocalY - 15}
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
                <text x={ANCHOR_X + 15} y={knobLocalY + 3} fill="hsl(38 70% 70%)" fontSize="7" className="font-body pointer-events-none">
                  ↓ pull
                </text>
              </motion.g>
            )}
          </motion.g>
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
