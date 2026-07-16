"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types/portfolio";

interface ContactProps {
  profile: Profile;
}

const EASE = [0.4, 0, 0.2, 1] as const;

export function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to send");
      }
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-surface/30 py-20 md:py-32 scroll-mt-20"
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-sm text-accent font-body uppercase tracking-[0.3em] mb-2">
            Get in touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
            Contact Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
              Get In Touch
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed font-body">
              If you want to work together or have any questions, feel free to
              contact me. I&apos;m always open to new opportunities.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-stroke flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
                  <Mail size={18} className="text-text-secondary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted font-body uppercase tracking-wider">Email</p>
                  <p className="text-sm text-text-primary font-body">{profile.email}</p>
                </div>
              </a>

              <a href={`tel:${profile.phone}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-surface border border-stroke flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
                  <Phone size={18} className="text-text-secondary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted font-body uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-text-primary font-body">{profile.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-surface border border-stroke flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
                  <MapPin size={18} className="text-text-secondary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-xs text-muted font-body uppercase tracking-wider">Location</p>
                  <p className="text-sm text-text-primary font-body">{profile.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            onSubmit={submit}
            className="flex flex-col gap-5"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-surface border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:shadow-[0_0_20px_hsl(var(--accent)/0.15)] transition-all duration-300 font-body"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-surface border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:shadow-[0_0_20px_hsl(var(--accent)/0.15)] transition-all duration-300 font-body"
            />
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full bg-surface border border-stroke rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:shadow-[0_0_20px_hsl(var(--accent)/0.15)] transition-all duration-300 font-body resize-y"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-outline flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-body text-text-primary bg-surface hover:bg-accent hover:text-bg hover:border-accent disabled:opacity-50 transition-all duration-300"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
