"use client";

import type { Profile } from "@/types/portfolio";

interface ContactProps {
  profile: Profile;
}

/** Pull a "@handle" style string out of a profile URL. */
function handleFromUrl(url: string, fallback: string): string {
  if (!url) return fallback;
  try {
    const u = new URL(url);
    const last = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop();
    return last ? `@${last.replace(/^@/, "")}` : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Contact — the Atelier closer.
 * Giant email link with the dramatic hover sweep + numbered social rows
 * that flood orange on hover. Socials come straight from the profile.
 */
export function Contact({ profile }: ContactProps) {
  const email = profile.email || "contact@syeds-den.com";
  const name = (profile.name || "Syed").toLowerCase();

  const socials = [
    {
      num: "01",
      name: "GitHub",
      handle: handleFromUrl(profile.github, `@${name}`),
      href: profile.github || "https://github.com",
    },
    {
      num: "02",
      name: "LinkedIn",
      handle: handleFromUrl(profile.linkedin, `in/${name}`),
      href: profile.linkedin || "https://linkedin.com",
    },
    {
      num: "03",
      name: "Instagram",
      handle: handleFromUrl(profile.instagram, `@${name}`),
      href: profile.instagram || "https://instagram.com",
    },
    {
      num: "04",
      name: "Newsletter",
      handle: "A monthly note",
      href: `mailto:${email}`,
    },
  ];

  return (
    <section className="contact" id="contact" aria-label="Contact">
      <div className="section-head">
        <span className="section-head__num">05 /</span>
        <h2 className="section-head__title">Let&apos;s make something</h2>
      </div>

      <div className="contact__bigwrap">
        <a
          href={`mailto:${email}`}
          className="contact__email"
          data-cursor="cta"
          data-cursor-text="Email"
        >
          <span>{email}</span>
          <span className="contact__email-arrow">→</span>
        </a>
        <p className="contact__sub">
          For commissions, internships, full-time roles, collaborations, or
          just to say hi. I read everything. I answer most things.
        </p>
      </div>

      <ul className="socials">
        {socials.map((s) => (
          <li key={s.num}>
            <a
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="social"
              data-cursor="link"
            >
              <span className="social__num">{s.num}</span>
              <span className="social__name">{s.name}</span>
              <span className="social__handle">{s.handle}</span>
              <span className="social__arrow">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
