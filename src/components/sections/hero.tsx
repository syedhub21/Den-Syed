"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/types/portfolio";

interface HeroProps {
  profile: Profile;
}

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&/!=+*0123456789";

/** Scramble text back to its original value over ~22 frames.
 *  Tracks one animation per element so hovering both hero lines in quick
 *  succession never leaves one stuck mid-scramble. */
function useScramble() {
  const timersRef = useRef<Map<HTMLElement, number>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => cancelAnimationFrame(id));
      timers.clear();
    };
  }, []);

  const scramble = (el: HTMLElement, text: string) => {
    const timers = timersRef.current;
    const existing = timers.get(el);
    if (existing) cancelAnimationFrame(existing);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = text;
      return;
    }

    let frame = 0;
    const total = 22;
    const tick = () => {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < (frame / total) * text.length) out += text[i];
        else if (text[i] === " ") out += " ";
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame <= total) {
        timers.set(el, requestAnimationFrame(tick));
      } else {
        el.textContent = text;
        timers.delete(el);
      }
    };
    timers.set(el, requestAnimationFrame(tick));
  };

  return scramble;
}

/**
 * Hero — the Atelier opening statement.
 *
 * Meta row (N° / EST. / live local time) → massive Bebas name with
 * hover-scramble → Fraunces italic role line with the RGB split glitch →
 * tilted portrait card → serif tag → pill CTA → bottom marquee strip.
 */
export function Hero({ profile }: HeroProps) {
  const scramble = useScramble();
  const nameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const [time, setTime] = useState("— : — · LOCAL");

  const name = (profile.name || "Syed").trim();
  const nameUpper = name.toUpperCase();
  const role =
    (profile.roles?.[0] || "Frontend Developer").toLowerCase().replace(/\.$/, "") + ".";

  // Live local time — ticks every 15s like the original
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setTime(`${h} : ${m} · LOCAL`);
    };
    tick();
    const id = setInterval(tick, 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const marqueeItems = [
    `SELECTED WORK 2024—${new Date().getFullYear()}`,
    ...(profile.rotatingRoles?.length
      ? profile.rotatingRoles.map((r) => r.toUpperCase())
      : ["SOFTWARE DEVELOPER", "DESIGNER"]),
    "AVAILABLE FOR HIRE",
  ];
  const marquee = [...marqueeItems, ...marqueeItems];

  return (
    <section className="hero" id="top" aria-label="Intro">
      <div className="hero__meta">
        <span className="hero__meta-item">N° 0042</span>
        <span className="hero__meta-item">EST. 2024</span>
        <span className="hero__meta-item">{time}</span>
      </div>

      <div className="hero__main">
        <h1 className="hero__title">
          <span
            className="hero__title-line"
            ref={nameRef}
            onMouseEnter={() => {
              if (nameRef.current) scramble(nameRef.current, nameUpper);
            }}
          >
            {nameUpper}
          </span>
          <span
            className="hero__title-line hero__title-line--italic"
            ref={roleRef}
            data-text={role}
            data-scramble={role}
            onMouseEnter={() => {
              if (roleRef.current) scramble(roleRef.current, role);
            }}
          >
            {role}
          </span>
        </h1>

        <div className="hero__portrait" data-cursor="link">
          <img
            src={profile.heroImage || "/images/hero-character.png"}
            alt={`${profile.name} portrait`}
            loading="eager"
          />
          <span className="hero__portrait-caption">
            Self, {new Date().getFullYear()}
          </span>
        </div>
      </div>

      <div className="hero__bottom">
        <p className="hero__tag">
          Software developer &amp; product builder
          <br />
          shipping <em>real things</em> from a small studio.
        </p>
        <a href="#work" className="hero__cta" data-cursor="cta" data-cursor-text="See work">
          <span className="hero__cta-text">See the work</span>
          <span className="hero__cta-arrow">↓</span>
        </a>
      </div>

      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {marquee.map((item, i) => (
            <span key={i}>★ {item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
