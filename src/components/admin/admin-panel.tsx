"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, LogOut, Loader2, Plus, Trash2, Save, Mail } from "lucide-react";
import { toast } from "sonner";
import type {
  Profile,
  Project,
  Service,
  TechStack,
  ContactMessage,
} from "@/types/portfolio";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

type Tab = "profile" | "projects" | "services" | "techstack" | "messages";

export function AdminPanel({ open, onClose, onDataChanged }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!open) return;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .finally(() => setChecking(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-bg/95 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Admin panel"
        >
          <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="relative w-full max-w-5xl bg-surface border border-stroke rounded-3xl overflow-hidden my-4"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-stroke">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-muted" />
                  <span className="text-xs uppercase tracking-[0.3em] text-muted font-body">
                    Admin
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {authed && (
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        setAuthed(false);
                        toast.success("Signed out");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-surface-light font-body"
                    >
                      <LogOut size={12} /> Sign out
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-text-primary hover:bg-surface-light transition-colors"
                    aria-label="Close admin"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {checking ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={20} className="animate-spin text-muted" />
                </div>
              ) : !authed ? (
                <LoginView onSuccess={() => setAuthed(true)} />
              ) : (
                <div className="flex flex-col md:flex-row min-h-[500px]">
                  <div className="md:w-48 flex md:flex-col gap-1 p-3 border-b md:border-b-0 md:border-r border-stroke overflow-x-auto no-scrollbar">
                    {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`text-left text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors font-body ${
                          tab === t
                            ? "bg-surface-light text-text-primary"
                            : "text-muted hover:text-text-primary hover:bg-surface"
                        }`}
                      >
                        {TAB_LABELS[t]}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[70vh]">
                    {tab === "profile" && <ProfileEditor onChanged={onDataChanged} />}
                    {tab === "projects" && <ProjectsEditor onChanged={onDataChanged} />}
                    {tab === "services" && <ServicesEditor onChanged={onDataChanged} />}
                    {tab === "techstack" && <TechStackEditor onChanged={onDataChanged} />}
                    {tab === "messages" && <MessagesView />}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TAB_LABELS: Record<Tab, string> = {
  profile: "Profile",
  projects: "Projects",
  services: "Services",
  techstack: "Tech Stack",
  messages: "Messages",
};

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Incorrect password");
      }
      toast.success("Signed in");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-8 md:p-12 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-stroke mb-2">
          <Lock size={18} className="text-muted" />
        </div>
        <h2 className="font-display text-3xl text-text-primary">Admin</h2>
        <p className="text-xs text-muted font-body">Enter password to edit your portfolio.</p>
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted font-body">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 font-body"
          placeholder="••••••••"
        />
        {error && <p className="text-xs text-red-400 font-body">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full inline-flex items-center justify-center gap-2 text-sm rounded-xl bg-accent text-bg py-3 disabled:opacity-50 hover:opacity-90 transition-opacity font-body font-medium"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        Sign in
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-body">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-bg border border-stroke rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/50 font-body resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-bg border border-stroke rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/50 font-body"
        />
      )}
    </label>
  );
}

function SaveButton({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 text-xs rounded-xl bg-accent text-bg px-4 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity font-body font-medium"
    >
      {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
      Save
    </button>
  );
}

function ProfileEditor({ onChanged }: { onChanged: () => void }) {
  const [data, setData] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/profile", { cache: "no-store" });
    if (res.ok) {
      const row = await res.json();
      setData({
        name: row.name ?? "",
        heroGreeting: row.heroGreeting ?? "Hi! I'm",
        roles: (row.roles ?? "").split(",").filter(Boolean),
        rotatingRoles: (row.rotatingRoles ?? "").split(",").filter(Boolean),
        city: row.city ?? "",
        bio: row.bio ?? "",
        email: row.email ?? "",
        phone: row.phone ?? "",
        location: row.location ?? "",
        heroImage: row.heroImage ?? "",
        aboutImage: row.aboutImage ?? "",
        github: row.github ?? "",
        instagram: row.instagram ?? "",
        linkedin: row.linkedin ?? "",
        logoText: row.logoText ?? "",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!data) return <div className="py-10 text-center text-muted text-sm">Loading…</div>;

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Profile saved");
      onChanged();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-text-primary">Profile</h3>
        <SaveButton onSave={save} saving={saving} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
        <Field label="Hero greeting" value={data.heroGreeting} onChange={(v) => setData({ ...data, heroGreeting: v })} />
        <Field label="Logo text" value={data.logoText} onChange={(v) => setData({ ...data, logoText: v })} />
        <Field label="Roles — shown in About (comma-separated)" value={data.roles.join(", ")} onChange={(v) => setData({ ...data, roles: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <Field label="Rotating roles — hero page (comma-separated)" value={data.rotatingRoles.join(", ")} onChange={(v) => setData({ ...data, rotatingRoles: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <Field label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
        <Field label="Phone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
        <Field label="Location" value={data.location} onChange={(v) => setData({ ...data, location: v })} />
        <Field label="GitHub URL" value={data.github} onChange={(v) => setData({ ...data, github: v })} />
        <Field label="Instagram URL" value={data.instagram} onChange={(v) => setData({ ...data, instagram: v })} />
        <Field label="LinkedIn URL" value={data.linkedin} onChange={(v) => setData({ ...data, linkedin: v })} />
        <Field label="Hero image path" value={data.heroImage} onChange={(v) => setData({ ...data, heroImage: v })} />
        <Field label="About image path" value={data.aboutImage} onChange={(v) => setData({ ...data, aboutImage: v })} />
      </div>
      <Field label="Bio" value={data.bio} onChange={(v) => setData({ ...data, bio: v })} textarea rows={5} />
    </div>
  );
}

function ProjectsEditor({ onChanged }: { onChanged: () => void }) {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    const data = await res.json();
    setItems(data.projects ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const blank = (): Project => ({
    id: "",
    slug: "",
    title: "",
    description: "",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
    coverImage: "",
    order: items.length,
  });

  const save = async (p: Project) => {
    const isNew = !p.id;
    const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${p.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error("Save failed");
    toast.success("Project saved");
    setEditing(null);
    load();
    onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
    onChanged();
  };

  if (editing) {
    return <ProjectForm project={editing} onSave={save} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-text-primary">Projects</h3>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-1.5 text-xs rounded-xl bg-accent text-bg px-3 py-1.5 font-body font-medium"
        >
          <Plus size={12} /> New
        </button>
      </div>
      {loading ? (
        <div className="py-8 text-center text-muted text-sm">Loading…</div>
      ) : (
        <div className="space-y-2">
          {items.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-bg border border-stroke rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                {p.coverImage && <img src={p.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm text-text-primary truncate font-body">{p.title}</p>
                  <p className="text-xs text-muted truncate font-body">{p.technologies.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditing(p)} className="text-xs text-muted hover:text-text-primary px-2 py-1 font-body">Edit</button>
                <button onClick={() => remove(p.id)} className="text-muted hover:text-red-400 p-1.5 rounded" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Project>(project);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave(data);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-text-primary">{project.id ? "Edit project" : "New project"}</h3>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="text-xs text-muted hover:text-text-primary px-3 py-1.5 font-body">Cancel</button>
          <SaveButton onSave={submit} saving={saving} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title" value={data.title} onChange={(v) => setData({ ...data, title: v })} />
        <Field label="Slug" value={data.slug} onChange={(v) => setData({ ...data, slug: v })} />
        <Field label="GitHub URL" value={data.githubUrl} onChange={(v) => setData({ ...data, githubUrl: v })} />
        <Field label="Live URL" value={data.liveUrl} onChange={(v) => setData({ ...data, liveUrl: v })} />
        <Field label="Cover image URL" value={data.coverImage} onChange={(v) => setData({ ...data, coverImage: v })} />
        <Field label="Order" value={String(data.order)} onChange={(v) => setData({ ...data, order: Number(v) || 0 })} />
      </div>
      <Field label="Description" value={data.description} onChange={(v) => setData({ ...data, description: v })} textarea rows={3} />
      <Field label="Technologies (comma-separated)" value={data.technologies.join(", ")} onChange={(v) => setData({ ...data, technologies: v.split(",").map((s) => s.trim()).filter(Boolean) })} textarea rows={2} />
    </div>
  );
}

function ServicesEditor({ onChanged }: { onChanged: () => void }) {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    const data = await res.json();
    setItems(data.services ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (id: string, patch: Partial<Service>) => {
    setItems((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const saveOne = async (s: Service) => {
    setSaving(s.id);
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved");
      onChanged();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(null);
    }
  };

  const add = async () => {
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Service", description: "", icon: "Code2", order: items.length }),
    });
    if (res.ok) {
      toast.success("Added");
      load();
      onChanged();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
    onChanged();
  };

  if (loading) return <div className="py-8 text-center text-muted text-sm">Loading…</div>;

  const ICON_OPTIONS = ["Code2", "Palette", "AppWindow", "Smartphone", "Database", "Zap"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-text-primary">Services</h3>
        <button onClick={add} className="inline-flex items-center gap-1.5 text-xs rounded-xl bg-accent text-bg px-3 py-1.5 font-body font-medium">
          <Plus size={12} /> New
        </button>
      </div>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="p-3 bg-bg border border-stroke rounded-xl space-y-3">
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Field label="Title" value={s.title} onChange={(v) => update(s.id, { title: v })} />
              </div>
              <div className="col-span-4">
                <label className="block space-y-1.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-body">Icon</span>
                  <select
                    value={s.icon}
                    onChange={(e) => update(s.id, { icon: e.target.value })}
                    className="w-full bg-bg border border-stroke rounded-lg px-2 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/50 font-body"
                  >
                    {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              </div>
              <div className="col-span-3 flex items-center gap-1">
                <button onClick={() => saveOne(s)} disabled={saving === s.id} className="text-xs text-text-primary hover:opacity-80 px-2 py-2 font-body">
                  {saving === s.id ? "…" : "Save"}
                </button>
                <button onClick={() => remove(s.id)} className="text-muted hover:text-red-400 p-2" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <Field label="Description" value={s.description} onChange={(v) => update(s.id, { description: v })} textarea rows={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TechStackEditor({ onChanged }: { onChanged: () => void }) {
  const [items, setItems] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    const data = await res.json();
    setItems(data.techStack ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (id: string, patch: Partial<TechStack>) => {
    setItems((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const saveOne = async (t: TechStack) => {
    setSaving(t.id);
    try {
      const res = await fetch(`/api/admin/techstack/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved");
      onChanged();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(null);
    }
  };

  const add = async () => {
    const res = await fetch("/api/admin/techstack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New", icon: "javascript", order: items.length }),
    });
    if (res.ok) {
      toast.success("Added");
      load();
      onChanged();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/techstack/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
    onChanged();
  };

  if (loading) return <div className="py-8 text-center text-muted text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-text-primary">Tech Stack</h3>
        <button onClick={add} className="inline-flex items-center gap-1.5 text-xs rounded-xl bg-accent text-bg px-3 py-1.5 font-body font-medium">
          <Plus size={12} /> New
        </button>
      </div>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-bg border border-stroke rounded-xl">
            <div className="col-span-4">
              <Field label="Name" value={t.name} onChange={(v) => update(t.id, { name: v })} />
            </div>
            <div className="col-span-5">
              <Field label="Icon key" value={t.icon} onChange={(v) => update(t.id, { icon: v })} />
            </div>
            <div className="col-span-3 flex items-center gap-1">
              <button onClick={() => saveOne(t)} disabled={saving === t.id} className="text-xs text-text-primary hover:opacity-80 px-2 py-2 font-body">
                {saving === t.id ? "…" : "Save"}
              </button>
              <button onClick={() => remove(t.id)} className="text-muted hover:text-red-400 p-2" aria-label="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesView() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/messages", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-display text-2xl text-text-primary">Messages</h3>
      {loading ? (
        <div className="py-8 text-center text-muted text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted text-sm font-body">
          <Mail size={20} className="mx-auto mb-2 opacity-50" />
          No messages yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {items.map((m) => (
            <div key={m.id} className="p-4 bg-bg border border-stroke rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-primary font-body">{m.name}</span>
                <span className="text-[10px] text-muted font-body">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <a href={`mailto:${m.email}`} className="text-xs text-accent hover:underline font-body block mb-2">
                {m.email}
              </a>
              <p className="text-sm text-text-secondary whitespace-pre-wrap font-body">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
