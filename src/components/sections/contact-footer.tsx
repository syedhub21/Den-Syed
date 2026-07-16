"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Twitter, Linkedin, Dribbble, Github, Instagram, Mail, Globe, Youtube, Lock } from "lucide-react";
import { HlsVideo } from "@/components/primitives/hls-video";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Profile, SocialLink, SiteSettings } from "@/types/portfolio";

interface ContactFooterProps {
  profile: Profile;
  socials: SocialLink[];
  settings: SiteSettings;
  onAdminClick: () => void;
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Twitter,
  Linkedin,
  Dribbble,
  Github,
  Instagram,
  Mail,
  Globe,
  Youtube,
};

/**
 * Contact / Footer — the final section.
 * - Flipped HLS background video with heavier overlay
 * - GSAP marquee of marqueeText
 * - Email CTA button
 * - Footer bar with socials + availability pulse
 * - Subtle admin lock icon (opens admin overlay)
 * - Sticky to bottom of the page (mt-auto on the section wrapper)
 */
export function ContactFooter({
  profile,
  socials,
  settings,
  onAdminClick,
}: ContactFooterProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !marqueeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  const marqueeText = `${settings.marqueeText} • `;

  return (
    <footer
      id="contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden mt-auto scroll-mt-24"
      aria-label="Contact"
    >
      {/* Flipped background video */}
      <HlsVideo
        src={profile.footerVideoUrl}
        flip
        overlayOpacity={0.6}
        className="z-0"
      />

      {/* Marquee */}
      <div className="relative z-10 overflow-hidden py-12 md:py-16 mb-12 md:mb-16">
        <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="font-display italic text-5xl md:text-7xl lg:text-8xl text-text-primary/80 flex-shrink-0"
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 mb-16 md:mb-20">
        <p className="text-sm md:text-base text-muted text-center max-w-md font-body">
          Have a project in mind? Let&apos;s talk.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="relative group inline-flex rounded-full"
        >
          <span className="absolute -inset-[2px] rounded-full animated-gradient-border opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative inline-flex items-center gap-2 text-sm md:text-base rounded-full bg-text-primary text-bg px-7 py-3.5 font-body group-hover:bg-surface group-hover:text-text-primary transition-colors duration-300">
            {profile.email}
          </span>
        </a>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8 border-t border-stroke">
          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map((s) => {
              const Icon = ICONS[s.icon] ?? Globe;
              return (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-stroke text-muted hover:text-text-primary hover:border-text-primary/40 transition-colors"
                  aria-label={s.label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

          {/* Availability + admin */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex">
                <span className="w-2 h-2 rounded-full bg-[hsl(140_60%_50%)] animate-pulse-dot" />
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-[hsl(140_60%_50%)] animate-ping opacity-60" />
              </span>
              <span className="text-xs text-muted font-body">
                {settings.availabilityText}
              </span>
            </div>

            {/* Subtle admin lock */}
            <button
              onClick={onAdminClick}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted/40 hover:text-text-primary hover:bg-stroke/50 transition-colors"
              aria-label="Admin"
              title="Admin"
            >
              <Lock size={13} />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex items-center justify-between text-[11px] text-muted/60 font-body">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <span className="hidden sm:block">Built with care.</span>
        </div>
      </div>
    </footer>
  );
}
