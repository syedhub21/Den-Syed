"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Instagram, Linkedin } from "lucide-react";
import { NAV_LINKS } from "@/constants/portfolio";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

interface NavbarProps {
  profile: Profile;
}

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));

/**
 * Static navbar — scrolls away with the page (not fixed/sticky).
 * Floating dock with circular corners + windglass effect.
 */
export function Navbar({ profile }: NavbarProps) {
  const activeId = useScrollSpy(SECTION_IDS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative z-50 flex justify-center px-4 pt-4"
      aria-label="Primary"
    >
      {/* Floating dock — transparent so hero gradient shows through, with subtle glass blur */}
      <div
        className="flex items-center gap-2 px-4 py-2 w-full"
        style={{
          background: "transparent",
          backdropFilter: "blur(20px) saturate(120%)",
          WebkitBackdropFilter: "blur(20px) saturate(120%)",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
          maxWidth: "1100px",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav("#home")}
          className="font-display text-lg font-semibold text-text-primary hover:text-accent transition-colors duration-300 px-3 py-1 flex-shrink-0"
          aria-label="Home"
        >
          {profile.logoText}
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/15 mx-1" aria-hidden />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={cn(
                  "text-sm font-body px-3 py-1.5 rounded-full transition-all duration-300",
                  isActive
                    ? "text-text-primary bg-white/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/15 mx-1" aria-hidden />

        {/* Social icons */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-icon text-muted p-2 rounded-full hover:bg-white/10" aria-label="GitHub">
            <Github size={16} />
          </a>
          <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="social-icon text-muted p-2 rounded-full hover:bg-white/10" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon text-muted p-2 rounded-full hover:bg-white/10" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-text-primary p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-16 left-4 right-4 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.80) 100%)",
              backdropFilter: "blur(40px) saturate(150%)",
              WebkitBackdropFilter: "blur(40px) saturate(150%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.href.replace("#", "");
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href)}
                    className={cn(
                      "text-left text-sm py-3 px-4 rounded-2xl font-body smooth",
                      isActive ? "text-text-primary bg-white/10" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
              <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-icon text-muted p-2 rounded-full hover:bg-white/10" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="social-icon text-muted p-2 rounded-full hover:bg-white/10" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon text-muted p-2 rounded-full hover:bg-white/10" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
