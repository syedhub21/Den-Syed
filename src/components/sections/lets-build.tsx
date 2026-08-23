"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Profile } from "@/types/portfolio";

interface LetsBuildProps {
  profile: Profile;
}

// Lazy-load Spline only on the client — the heavy 3D runtime never blocks
// initial page load. The scene mounts only when scrolled into view.
const Spline = dynamic(
  () => import("@splinetool/react-spline").then((m) => m.default),
  { ssr: false, loading: () => null }
);

const SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * LetsBuild — the Atelier call-to-action block with the interactive 3D robot.
 *
 * Left: eyebrow, "Let's Build" + italic "Something Together" wrapped in the
 * ORANGE gradient (white → #ff4d00 → #ffd23f) to match the Atelier accent.
 * Right: the Spline 3D robot (lazy-mounted when in view) over the ambient
 * orb/grid backdrop, with the "Live environment" glass label.
 */
export function LetsBuild({ profile }: LetsBuildProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  // Only mount the Spline 3D scene while this section is near the viewport —
  // mounting on visibility keeps the initial load fast, and unmounting when
  // scrolled far away frees the GPU render loop.
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

  const email = profile.email || "contact@syeds-den.com";
  const linkedin = profile.linkedin || "https://linkedin.com";

  return (
    <section
      className="lets-build"
      id="lets-build"
      aria-label="Let's build something together"
    >
      <div className="section-head">
        <span className="section-head__num">03 /</span>
        <h2 className="section-head__title">Let&apos;s build</h2>
      </div>

      <div className="lets-build__inner">
        <div className="lets-build__text">
          <span className="lets-build__eyebrow">
            <span></span> Available now
          </span>

          <h1 className="lets-build__h1">
            Let&apos;s Build
            <span className="lets-build__gradient">Something Together</span>
          </h1>

          <p className="lets-build__copy">
            I&apos;m looking for roles where I can ship products, automate
            workflows, and integrate AI. Skip the LeetCode—let&apos;s talk about
            how I can solve your deployment or automation challenges.
          </p>

          <div className="lets-build__buttons">
            <a
              href={`mailto:${email}`}
              className="lets-build__primary"
              data-cursor="cta"
              data-cursor-text="Email"
            >
              <span>{email}</span>
              <span className="lets-build__arrow">→</span>
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="lets-build__secondary"
              data-cursor="link"
            >
              LinkedIn
            </a>
          </div>

          <div className="lets-build__features">
            <div>
              <strong>Ship</strong>
              <span>Products end-to-end</span>
            </div>
            <i></i>
            <div>
              <strong>Automate</strong>
              <span>Workflows &amp; pipelines</span>
            </div>
            <i></i>
            <div>
              <strong>Integrate</strong>
              <span>AI into your stack</span>
            </div>
          </div>
        </div>

        <div className="lets-build__scene" ref={containerRef}>
          {/* Interactive 3D robot — mounts when in view, plain black backdrop */}
          {isVisible && (
            <div
              className={`lets-build__robot ${sceneLoaded ? "is-loaded" : ""}`}
            >
              {!sceneLoaded && (
                <div className="lets-build__loader">
                  <span className="lets-build__loader-ring"></span>
                  <p>Loading 3D scene</p>
                </div>
              )}
              <Spline
                scene={SCENE_URL}
                onLoad={() => setSceneLoaded(true)}
              />
            </div>
          )}

          <div className="lets-build__live-label">
            <span className="lets-build__live-icon">
              <span></span>
            </span>
            <div>
              <strong>Live environment</strong>
              <small>Move your cursor to interact</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
