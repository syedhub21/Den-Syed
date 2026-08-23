"use client";

import { Lock } from "lucide-react";
import type { Profile, SiteSettings } from "@/types/portfolio";

interface FooterProps {
  profile: Profile;
  settings: SiteSettings;
  onAdminClick: () => void;
}

/**
 * Footer — the Atelier sign-off.
 * Brand + live year, cleaned colophon, subtle admin lock, and the massive
 * gradient "SAY HELLO" statement that fades ink → orange.
 */
export function Footer({ profile, settings, onAdminClick }: FooterProps) {
  const name = profile.name || "Syed";

  return (
    <footer className="foot">
      <div className="foot__top">
        <span className="foot__sign">
          {name} — Atelier
        </span>
        <span className="foot__year">{new Date().getFullYear()}</span>
      </div>

      <div className="foot__colophon">
        <span>Built with Next.js, Tailwind CSS &amp; Prisma.</span>
        <span>
          {settings.availabilityText || "Available for projects"}. No trackers.
          No popups.
        </span>
        <span>Set in Fraunces, Bebas Neue, Space Grotesk &amp; JetBrains Mono.</span>
      </div>

      <div className="foot__big" aria-hidden="true">
        <span>SAY&nbsp;HELLO</span>
      </div>

      {/* Subtle admin access — lock icon only (also Ctrl/Cmd + .) */}
      <button
        onClick={onAdminClick}
        className="foot__admin"
        aria-label="Open admin panel"
        title="Admin (Ctrl/Cmd + .)"
      >
        <Lock size={12} />
      </button>
    </footer>
  );
}
