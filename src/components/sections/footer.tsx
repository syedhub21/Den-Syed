"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Lock } from "lucide-react";
import type { Profile, SiteSettings } from "@/types/portfolio";

interface FooterProps {
  profile: Profile;
  settings: SiteSettings;
  onAdminClick: () => void;
}

const EASE = [0.4, 0, 0.2, 1] as const;

export function Footer({ profile, settings, onAdminClick }: FooterProps) {
  return (
    <footer className="relative bg-bg border-t border-stroke py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Copyright */}
          <p className="text-xs text-muted font-body">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>

          {/* Socials + availability + admin */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 opacity-60" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              </span>
              <span className="text-xs text-muted font-body">{settings.availabilityText}</span>
            </div>

            <div className="flex items-center gap-3">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-icon text-muted" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="social-icon text-muted" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon text-muted" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>

            {/* Subtle admin lock */}
            <button
              onClick={onAdminClick}
              className="text-muted/40 hover:text-accent p-1.5 rounded transition-colors duration-300"
              aria-label="Admin"
              title="Admin"
            >
              <Lock size={12} />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
