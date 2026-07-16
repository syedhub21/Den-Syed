export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Project", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));
