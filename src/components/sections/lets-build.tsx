"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Mail, Linkedin, ArrowRight } from "lucide-react";
import type { Profile } from "@/types/portfolio";

// Lazy-load Spline only on client — prevents the heavy 3D runtime from
// blocking initial page load. The scene only mounts when scrolled into view.
const Spline = dynamic(() => import("@splinetool/react-spline").then(m => m.default), {
  ssr: false,
  loading: () => null,
});

interface LetsBuildProps {
  profile: Profile;
}

const SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Let's Build — a bold CTA section with an interactive 3D robot (Spline).
 *
 * Sits between Projects and Contact. The 3D robot fills the right side;
 * the "Let's Build Something Together" copy sits on the left with email
 * + LinkedIn CTAs. Cursor-following light + live label keep it alive.
 */
export function LetsBuild({ profile }: LetsBuildProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  // Only mount the Spline 3D scene when this section is visible on screen.
  // This is the #1 performance fix — Spline's WebGL render loop is extremely
  // expensive and was running continuously even when scrolled away.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" } // start loading slightly before visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);

  const smoothX = useSpring(cursorX, { stiffness: 130, damping: 25, mass: 0.25 });
  const smoothY = useSpring(cursorY, { stiffness: 130, damping: 25, mass: 0.25 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    cursorX.set(event.clientX - bounds.left);
    cursorY.set(event.clientY - bounds.top);
  }

  const email = profile.email || "syedrabbansr@gmail.com";
  const linkedin = profile.linkedin || "https://linkedin.com";

  return (
    <section
      id="lets-build"
      ref={containerRef}
      className="relative w-full overflow-hidden bg-bg"
      style={{ minHeight: "100vh" }}
      onMouseMove={handleMouseMove}
      aria-label="Let's build something together"
    >
      <style>{`
        .lets-build-hero {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: hsl(0 0% 4%);
        }
        .lets-build-cursor-light {
          position: absolute;
          top: -250px;
          left: -250px;
          z-index: 20;
          width: 500px;
          height: 500px;
          pointer-events: none;
          border-radius: 50%;
          opacity: 0.65;
          filter: blur(16px);
          mix-blend-mode: screen;
          background: radial-gradient(circle, rgba(255,255,255,0.12), rgba(135,101,255,0.07) 30%, transparent 70%);
        }
        .lets-build-content {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: hsl(0 0% 4%);
        }
        .lets-build-scene-area {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
          overflow: visible;
          background: hsl(0 0% 4%);
        }
        .lets-build-spline {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          background: hsl(0 0% 4%);
          transform: translateX(15%) scale(1.08);
          transform-origin: center center;
        }
        .lets-build-spline canvas {
          width: 100% !important;
          height: 100% !important;
          background: hsl(0 0% 4%) !important;
        }
        .lets-build-text-area {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 10;
          display: flex;
          width: 50%;
          min-width: 0;
          min-height: 0;
          flex-direction: column;
          justify-content: center;
          padding: clamp(30px, 6vh, 70px) clamp(40px, 7vw, 120px);
          padding-right: 20px;
          pointer-events: none;
          background: transparent;
        }
        .lets-build-text-area a,
        .lets-build-text-area button {
          pointer-events: auto;
        }
        .lets-build-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          margin-bottom: clamp(15px, 2.6vh, 25px);
          padding: 8px 13px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(10px);
        }
        .lets-build-eyebrow > span {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 10px #a78bfa, 0 0 20px rgba(167, 139, 250, 0.7);
        }
        .lets-build-h1 {
          max-width: 620px;
          margin: 0;
          color: #f5f5f7;
          font-size: clamp(40px, min(6vw, 9vh), 84px);
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -0.05em;
          font-family: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
        }
        .lets-build-gradient-text {
          display: block;
          padding-bottom: clamp(5px, 1.2vh, 12px);
          color: transparent;
          background: linear-gradient(135deg, #ffffff, #b8a5ff 48%, #7565ff);
          background-clip: text;
          -webkit-background-clip: text;
        }
        .lets-build-text-area > p {
          max-width: 530px;
          margin: clamp(15px, 2.8vh, 26px) 0 0;
          color: rgba(255, 255, 255, 0.5);
          font-size: clamp(13px, 1.3vw, 17px);
          line-height: 1.7;
        }
        .lets-build-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: clamp(18px, 3.5vh, 33px);
          flex-wrap: wrap;
        }
        .lets-build-primary-button,
        .lets-build-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: clamp(45px, 6vh, 52px);
          padding: 0 21px;
          cursor: pointer;
          border-radius: 999px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 650;
          transition: transform 220ms ease, background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }
        .lets-build-primary-button {
          color: #090909;
          border: 0;
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.13);
        }
        .lets-build-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px rgba(255, 255, 255, 0.19);
        }
        .lets-build-primary-button svg {
          width: 16px;
          height: 16px;
          transition: transform 220ms ease;
        }
        .lets-build-primary-button:hover svg {
          transform: translateX(3px);
        }
        .lets-build-secondary-button {
          color: rgba(255, 255, 255, 0.72);
          font-weight: 550;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(10px);
        }
        .lets-build-secondary-button:hover {
          transform: translateY(-2px);
          color: white;
          border-color: rgba(255, 255, 255, 0.23);
          background: rgba(255, 255, 255, 0.07);
        }
        .lets-build-secondary-button svg {
          width: 16px;
          height: 16px;
        }
        .lets-build-features {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-top: clamp(20px, 4.5vh, 44px);
        }
        .lets-build-features div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lets-build-features strong {
          color: rgba(255, 255, 255, 0.88);
          font-size: 12px;
          font-weight: 600;
        }
        .lets-build-features span {
          color: rgba(255, 255, 255, 0.31);
          font-size: 11px;
        }
        .lets-build-features i {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.12);
        }
        .lets-build-loader-container {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 13px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 10px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          background: hsl(0 0% 4%);
        }
        .lets-build-loader-container p { margin: 0; }
        .lets-build-loader {
          width: 34px;
          height: 34px;
          border: 2px solid rgba(255, 255, 255, 0.12);
          border-top-color: white;
          border-radius: 50%;
          animation: lets-build-spin 0.8s linear infinite;
        }
        .lets-build-live-label {
          position: absolute;
          right: clamp(18px, 2.5vw, 35px);
          bottom: max(clamp(20px, 3.5vh, 35px), env(safe-area-inset-bottom));
          z-index: 30;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: calc(100% - 36px);
          padding: 12px 14px;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(8, 8, 10, 0.72);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(12px);
        }
        .lets-build-live-icon {
          display: grid;
          place-items: center;
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          border: 1px solid rgba(158, 130, 255, 0.2);
          border-radius: 10px;
          background: rgba(139, 107, 255, 0.14);
        }
        .lets-build-live-icon span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 10px #a78bfa, 0 0 20px rgba(167, 139, 250, 0.8);
        }
        .lets-build-live-label > div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 3px;
        }
        .lets-build-live-label strong {
          color: rgba(255, 255, 255, 0.88);
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .lets-build-live-label small {
          color: rgba(255, 255, 255, 0.38);
          font-size: 9px;
          white-space: nowrap;
        }
        @keyframes lets-build-spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .lets-build-content {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto minmax(460px, 1fr);
            min-height: 100vh;
            overflow: visible;
          }
          .lets-build-text-area {
            position: relative;
            inset: auto;
            width: 100%;
            height: auto;
            padding: 75px 35px 20px;
          }
          .lets-build-scene-area {
            position: relative;
            inset: auto;
            width: 100%;
            min-height: 460px;
            overflow: hidden;
          }
          .lets-build-spline { transform: none; }
          .lets-build-h1 { font-size: clamp(40px, 12vw, 64px); }
        }
        @media (max-width: 580px) {
          .lets-build-content { grid-template-rows: auto minmax(410px, 1fr); }
          .lets-build-text-area { padding: 58px 22px 5px; }
          .lets-build-buttons { flex-direction: column; align-items: stretch; margin-top: 26px; }
          .lets-build-primary-button, .lets-build-secondary-button { width: 100%; }
          .lets-build-features { display: none; }
          .lets-build-scene-area { min-height: 410px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lets-build-hero *, .lets-build-hero *::before, .lets-build-hero *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <motion.div
        className="lets-build-hero"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="lets-build-cursor-light"
          style={{ x: smoothX, y: smoothY }}
        />

        <div className="lets-build-content">
          {/* Full-screen Spline 3D robot layer */}
          <motion.div
            className="lets-build-scene-area"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {!sceneLoaded && isVisible && (
              <div className="lets-build-loader-container">
                <span className="lets-build-loader" />
                <p>Loading 3D scene</p>
              </div>
            )}

            {/* Only mount the Spline 3D scene when this section is visible —
                unmounting when scrolled away frees the GPU and stops the
                WebGL render loop, eliminating scroll lag. */}
            {isVisible && (
              <Spline
                scene={SCENE_URL}
                className="lets-build-spline"
                onLoad={() => setSceneLoaded(true)}
              />
            )}

            <motion.div
              className="lets-build-live-label"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="lets-build-live-icon">
                <span />
              </span>
              <div>
                <strong>Live environment</strong>
                <small>Move your cursor to interact</small>
              </div>
            </motion.div>
          </motion.div>

          {/* Transparent text overlay — "Let's Build" CTA */}
          <motion.div
            className="lets-build-text-area"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lets-build-eyebrow">
              <span />
              Let&apos;s build
            </div>

            <h1 className="lets-build-h1">
              Let&apos;s Build
              <span className="lets-build-gradient-text">Something Together</span>
            </h1>

            <p>
              I&apos;m looking for roles where I can ship products, automate
              workflows, and integrate AI. Skip the LeetCode—let&apos;s talk
              about how I can solve your deployment or automation challenges.
            </p>

            <div className="lets-build-buttons">
              <a
                href={`mailto:${email}`}
                className="lets-build-primary-button"
              >
                <Mail size={16} />
                {email}
                <ArrowRight size={16} />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="lets-build-secondary-button"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>

            <div className="lets-build-features">
              <div>
                <strong>Ship</strong>
                <span>Products end-to-end</span>
              </div>
              <i />
              <div>
                <strong>Automate</strong>
                <span>Workflows &amp; pipelines</span>
              </div>
              <i />
              <div>
                <strong>Integrate</strong>
                <span>AI into your stack</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
