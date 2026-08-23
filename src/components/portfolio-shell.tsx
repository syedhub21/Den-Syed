"use client";

import { useState, useCallback, useEffect } from "react";
import { LampEntry } from "@/components/sections/lamp-entry";
import { AtelierAtmosphere } from "@/components/primitives/atelier-atmosphere";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { LetsBuild } from "@/components/sections/lets-build";
import { Tech } from "@/components/sections/tech";
import { Now } from "@/components/sections/now";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { AdminPanel } from "@/components/admin/admin-panel";
import type { PortfolioData } from "@/types/portfolio";

interface PortfolioShellProps {
  data: PortfolioData;
}

export function PortfolioShell({ data }: PortfolioShellProps) {
  const [entered, setEntered] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [liveData, setLiveData] = useState<PortfolioData>(data);
  // Force re-render key — increments on data refresh to ensure all children re-render
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ".") {
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      // Small delay to ensure DB write completes before fetching
      await new Promise((r) => setTimeout(r, 300));
      const res = await fetch("/api/portfolio", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        const fresh = await res.json();
        setLiveData(fresh);
        // Increment render key to force all child components to re-render with new data
        setRenderKey((k) => k + 1);
      }
    } catch (err) {
      console.error("[refreshData] failed:", err);
    }
  }, []);

  return (
    <>
      {/* Atelier loader — 000% counter, fades to reveal the site */}
      {!entered && <LampEntry onEnter={() => setEntered(true)} />}

      {/* Cursor + mesh + grain + scroll progress (always mounted; re-attaches
          observers whenever admin edits re-mount the section DOM) */}
      <AtelierAtmosphere refreshKey={renderKey} />

      {/* Main portfolio — keyed by renderKey to force re-render after admin edits */}
      <div
        key={renderKey}
        className={`min-h-screen flex flex-col bg-bg transition-opacity duration-700 ${
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Navbar profile={liveData.profile} settings={liveData.settings} />

        <main className="flex-1">
          <Hero profile={liveData.profile} />
          <About profile={liveData.profile} services={liveData.services} stats={liveData.stats} />
          <Projects projects={liveData.projects} profile={liveData.profile} />
          <LetsBuild profile={liveData.profile} />
          <Tech techStack={liveData.techStack} />
          <Now profile={liveData.profile} />
          <Contact profile={liveData.profile} />
        </main>

        <Footer
          profile={liveData.profile}
          settings={liveData.settings}
          onAdminClick={() => setAdminOpen(true)}
        />
      </div>

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onDataChanged={refreshData}
      />
    </>
  );
}
