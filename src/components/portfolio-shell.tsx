"use client";

import { useState, useCallback, useEffect } from "react";
import { LampEntry } from "@/components/sections/lamp-entry";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
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
      {/* Lamp entry gate */}
      {!entered && <LampEntry onEnter={() => setEntered(true)} />}

      {/* Main portfolio — keyed by renderKey to force re-render after admin edits */}
      <div
        key={renderKey}
        className={`min-h-screen flex flex-col bg-bg transition-opacity duration-700 ${
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Navbar profile={liveData.profile} />

        <main className="flex-1">
          <Hero profile={liveData.profile} />
          <About profile={liveData.profile} techStack={liveData.techStack} />
          <Projects projects={liveData.projects} />
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
