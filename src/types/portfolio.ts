// Portfolio domain types

export interface Profile {
  name: string;
  heroGreeting: string;
  roles: string[];
  rotatingRoles: string[];
  city: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  heroImage: string;
  aboutImage: string;
  github: string;
  instagram: string;
  linkedin: string;
  logoText: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  coverImage: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface TechStack {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  order: number;
}

export interface SiteSettings {
  availabilityText: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  services: Service[];
  techStack: TechStack[];
  stats: Stat[];
  settings: SiteSettings;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}
