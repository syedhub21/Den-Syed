"use client";

import { useEffect, useRef, useState } from "react";

interface LampEntryProps {
  onEnter: () => void;
}

/**
 * LampEntry — the Atelier loading screen.
 *
 * Big Bebas counter ticking 000 → 100%, an orange progress bar,
 * "Loading the studio" mono caption. When the count completes the
 * overlay fades out (0.6s) and onEnter fires to reveal the site.
 */
export function LampEntry({ onEnter }: LampEntryProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const enteredRef = useRef(false);

  // Counter — random increments like the original Atelier script
  useEffect(() => {
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      current = Math.min(100, current + Math.random() * 8 + 2);
      setCount(current);
      if (current < 100) {
        timer = setTimeout(tick, Math.random() * 60 + 30);
      } else {
        // Hold a beat at 100%, then fade the loader out
        timer = setTimeout(() => setDone(true), 400);
      }
    };

    const start = setTimeout(tick, 200);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, []);

  // Fade finished → notify the shell
  useEffect(() => {
    if (!done || enteredRef.current) return;
    enteredRef.current = true;
    const t = setTimeout(onEnter, 250);
    return () => clearTimeout(t);
  }, [done, onEnter]);

  // Freeze scroll while loading
  useEffect(() => {
    if (!done) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [done]);

  const whole = Math.floor(count);

  return (
    <div
      className={`loader ${done ? "is-done" : ""}`}
      role="status"
      aria-label="Loading the studio"
    >
      <div className="loader__inner">
        <div className="loader__brand">SYED — ATELIER</div>

        <div className="loader__counter">
          <span className="loader__count">
            {String(whole).padStart(3, "0")}
          </span>
          <span className="loader__pct">%</span>
        </div>

        <div className="loader__bar">
          <div
            className="loader__fill"
            style={{ width: `${whole}%` }}
          />
        </div>

        <div className="loader__text">
          <span>Loading the studio</span>
          <span className="loader__num">
            {whole} / 100
          </span>
        </div>
      </div>
    </div>
  );
}
