"use client";

import type { Profile, SiteSettings } from "@/types/portfolio";

interface NavbarProps {
  profile: Profile;
  settings: SiteSettings;
}

/**
 * Navbar — the Atelier fixed top nav.
 * ▲ logo + name, center links, live availability status with green pulse.
 */
export function Navbar({ profile, settings }: NavbarProps) {
  const name = (profile.name || "Syed").trim();

  return (
    <header className="nav">
      <a href="#top" className="nav__logo" data-cursor="link">
        <span className="nav__logo-mark">▲</span>
        <span className="nav__logo-text">
          {name.toUpperCase()} <em>— Atelier</em>
        </span>
      </a>

      <nav className="nav__links" aria-label="Main navigation">
        <a href="#work" data-cursor="link">Work</a>
        <a href="#about" data-cursor="link">About</a>
        <a href="#now" data-cursor="link">Now</a>
        <a href="#contact" data-cursor="link">Contact</a>
      </nav>

      <div className="nav__status" data-cursor="link">
        <span className="nav__pulse"></span>
        <span>
          {settings.availabilityText || "Open for projects"} ·{" "}
          {new Date().getFullYear()}
        </span>
      </div>
    </header>
  );
}
