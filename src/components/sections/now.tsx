"use client";

import type { Profile } from "@/types/portfolio";

interface NowProps {
  profile: Profile;
}

/** Render *asterisk* wrapped words as green-highlighted <em> spans. */
function renderHighlight(text: string) {
  const parts = text.split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>
  );
}

const DEFAULT_WORKING_ON =
  "Shipping a *new project* with React + Next.js. Real users, real deadlines, real commits.";
const DEFAULT_CURRENTLY =
  "*Software Developer.* Always building, always learning — usually with too many tabs open.";
const DEFAULT_READING =
  "Clean Code, the docs for whatever framework I last broke, and the same three threads on Hacker News.";

/**
 * Now — the Atelier "What I'm up to" 4-cell grid.
 * Every cell is editable from the admin panel (Profile → Now):
 * working on / currently / reading; the fourth uses the profile email.
 */
export function Now({ profile }: NowProps) {
  const email = profile.email || "contact@syeds-den.com";

  return (
    <section className="now" id="now" aria-label="What I'm up to">
      <div className="section-head">
        <span className="section-head__num">04 /</span>
        <h2 className="section-head__title">What I&apos;m up to</h2>
      </div>

      <div className="now__grid">
        <div className="now__entry">
          <span className="now__label">Working on</span>
          <p>{renderHighlight(profile.nowWorkingOn || DEFAULT_WORKING_ON)}</p>
        </div>
        <div className="now__entry">
          <span className="now__label">Currently</span>
          <p>{renderHighlight(profile.nowCurrently || DEFAULT_CURRENTLY)}</p>
        </div>
        <div className="now__entry">
          <span className="now__label">Reading</span>
          <p>{renderHighlight(profile.nowReading || DEFAULT_READING)}</p>
        </div>
        <div className="now__entry">
          <span className="now__label">Reach me at</span>
          <p>
            <em>{email}</em> — for commissions, collabs, or just to say hi.
          </p>
        </div>
      </div>
    </section>
  );
}
