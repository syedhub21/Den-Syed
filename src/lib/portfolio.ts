import { db } from "@/lib/db";
import { SEED_DATA } from "@/data/seed";
import type {
  PortfolioData,
  Profile,
  Project,
  Service,
  TechStack,
  Stat,
  SiteSettings,
} from "@/types/portfolio";

function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function serializeProject(p: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  technologies: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  coverImage: string | null;
  order: number;
}): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description || "",
    technologies: splitList(p.technologies),
    githubUrl: p.githubUrl || "",
    liveUrl: p.liveUrl || "",
    coverImage: p.coverImage || "",
    order: p.order,
  };
}

export async function ensureSeeded() {
  const profileCount = await db.profile.count().catch(() => 0);

  if (profileCount === 0) {
    await db.profile.create({
      data: {
        id: "profile",
        name: SEED_DATA.profile.name,
        heroGreeting: SEED_DATA.profile.heroGreeting,
        roles: SEED_DATA.profile.roles.join(","),
        rotatingRoles: SEED_DATA.profile.rotatingRoles.join(","),
        city: SEED_DATA.profile.city,
        bio: SEED_DATA.profile.bio,
        email: SEED_DATA.profile.email,
        phone: SEED_DATA.profile.phone,
        location: SEED_DATA.profile.location,
        heroImage: SEED_DATA.profile.heroImage,
        aboutImage: SEED_DATA.profile.aboutImage,
        github: SEED_DATA.profile.github,
        instagram: SEED_DATA.profile.instagram,
        linkedin: SEED_DATA.profile.linkedin,
        logoText: SEED_DATA.profile.logoText,
      },
    });

    await db.siteSettings.create({
      data: {
        id: "settings",
        availabilityText: SEED_DATA.settings.availabilityText,
      },
    });

    await db.project.createMany({
      data: SEED_DATA.projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        technologies: p.technologies.join(","),
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        coverImage: p.coverImage,
        order: p.order,
      })),
    });

    await db.service.createMany({
      data: SEED_DATA.services.map((s) => ({
        title: s.title,
        description: s.description,
        icon: s.icon,
        order: s.order,
      })),
    });

    await db.techStack.createMany({
      data: SEED_DATA.techStack.map((t) => ({
        name: t.name,
        icon: t.icon,
        order: t.order,
      })),
    });

    await db.stat.createMany({
      data: SEED_DATA.stats.map((s) => ({
        label: s.label,
        value: s.value,
        suffix: s.suffix,
        order: s.order,
      })),
    });
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    await ensureSeeded();

    const [profileRow, settingsRow, projectRows, serviceRows, techRows, statRows] =
      await Promise.all([
        db.profile.findFirst(),
        db.siteSettings.findFirst(),
        db.project.findMany({ orderBy: { order: "asc" } }),
        db.service.findMany({ orderBy: { order: "asc" } }),
        db.techStack.findMany({ orderBy: { order: "asc" } }),
        db.stat.findMany({ orderBy: { order: "asc" } }),
      ]);

    const profile: Profile = profileRow
      ? {
          name: profileRow.name,
          heroGreeting: profileRow.heroGreeting,
          roles: splitList(profileRow.roles),
          rotatingRoles: splitList(profileRow.rotatingRoles),
          city: profileRow.city,
          bio: profileRow.bio,
          email: profileRow.email,
          phone: profileRow.phone,
          location: profileRow.location,
          heroImage: profileRow.heroImage,
          aboutImage: profileRow.aboutImage,
          github: profileRow.github,
          instagram: profileRow.instagram,
          linkedin: profileRow.linkedin,
          logoText: profileRow.logoText,
        }
      : SEED_DATA.profile;

    const settings: SiteSettings = settingsRow
      ? { availabilityText: settingsRow.availabilityText }
      : SEED_DATA.settings;

    const projects: Project[] = projectRows.length
      ? projectRows.map(serializeProject)
      : SEED_DATA.projects;

    const services: Service[] = serviceRows.length
      ? serviceRows.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon,
          order: s.order,
        }))
      : SEED_DATA.services;

    const techStack: TechStack[] = techRows.length
      ? techRows.map((t) => ({
          id: t.id,
          name: t.name,
          icon: t.icon,
          order: t.order,
        }))
      : SEED_DATA.techStack;

    const stats: Stat[] = statRows.length
      ? statRows.map((s) => ({
          id: s.id,
          label: s.label,
          value: s.value,
          suffix: s.suffix,
          order: s.order,
        }))
      : SEED_DATA.stats;

    return { profile, projects, services, techStack, stats, settings };
  } catch (err) {
    console.error("[getPortfolioData] DB error, using seed fallback:", err);
    return SEED_DATA;
  }
}
