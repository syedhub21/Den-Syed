"use client";

import type { Profile, Service, Stat } from "@/types/portfolio";

interface AboutProps {
  profile: Profile;
  services: Service[];
  stats: Stat[];
}

const DEFAULT_LIST = [
  "Frontend Development",
  "UI Design",
  "Web Applications",
  "Whatever ships",
];

const DEFAULT_MANIFESTO =
  "I build software that does the boring parts of life so you can stay in *flow*. Small, sharp products — fast UI, clean data, and the kind of details that only show up after the second cup of coffee.";

/** Render *asterisk* wrapped words as highlighted <em> spans. */
function renderHighlight(text: string) {
  const parts = text.split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>
  );
}

/**
 * About — the Atelier bento manifesto.
 *
 * Serif lead (editable manifesto + editable bio) | studio photo card |
 * count-up stat cards (all from the DB) | orange quote card | "What I do"
 * list (from the editable services).
 */
export function About({ profile, services, stats }: AboutProps) {
  const name = profile.name || "Syed";
  const year = new Date().getFullYear();
  const whatIDo =
    services.length > 0 ? services.map((s) => s.title) : DEFAULT_LIST;

  const manifesto = profile.manifesto || DEFAULT_MANIFESTO;
  const quoteText = profile.quoteText || "If it doesn't ship, it doesn't exist.";
  const quoteAttribution = profile.quoteAttribution || "house rule";

  // All stats render as count-up bento cells. With ≤2 the layout is the
  // exact Atelier grid; with 3+ the quote widens and the list goes full-width.
  const statCards = stats.length
    ? stats.map((s) => ({ id: s.id, label: s.label, value: s.value, suffix: s.suffix }))
    : [
        { id: "fb1", label: "Projects shipped", value: 20, suffix: "+" },
        { id: "fb2", label: "Years experience", value: 2, suffix: "+" },
      ];

  const manyStats = statCards.length >= 3;
  const quoteClass = manyStats ? "about__card about__card--quote about__card--quote--w3" : "about__card about__card--quote";
  const listClass = manyStats ? "about__card about__card--list about__card--list--full" : "about__card about__card--list";

  return (
    <section className="about" id="about" aria-label="About">
      <div className="section-head">
        <span className="section-head__num">01 /</span>
        <h2 className="section-head__title">A small manifesto</h2>
      </div>

      <div className="about__grid">
        <div className="about__lead">
          <p className="reveal">{renderHighlight(manifesto)}</p>
          <p className="reveal">{profile.bio}</p>
        </div>

        <div className="about__card about__card--img">
          <img
            src={profile.aboutImage || "/images/about-character.png"}
            alt={`${name} in the studio`}
            loading="lazy"
          />
          <span className="about__caption">
            {name}, in the studio, {year}.
          </span>
        </div>

        {statCards.map((s) => (
          <div className="about__card about__card--stat" key={s.id}>
            <span className="about__stat-num">
              <span data-count={s.value}>0</span>
              {s.suffix}
            </span>
            <span className="about__stat-label">{s.label}</span>
          </div>
        ))}

        <div className={quoteClass}>
          <span className="about__quote-mark">&quot;</span>
          <p>
            {quoteText}
            <br />
            <em style={{ opacity: 0.7 }}>— {quoteAttribution}</em>
          </p>
        </div>

        <div className={listClass}>
          <h3>What I do</h3>
          <ul>
            {whatIDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
