import type { PortfolioData } from "@/types/portfolio";

// Fallback / seed data — Amine-style portfolio with rich placeholder content.
// All editable via the admin panel.

export const SEED_DATA: PortfolioData = {
  profile: {
    name: "Syed",
    heroGreeting: "Hi! I'm",
    roles: ["Frontend Developer", "CS Student"],
    rotatingRoles: ["Software Developer", "Frontend Developer", "CS Student", "Designer", "Creator", "Problem Solver"],
    city: "",
    bio: "I'm a frontend developer and computer science student with a passion for creating smooth animations and writing efficient code using modern web technologies. I'm always learning new tools and improving my skills to create better digital products. My goal is to combine creativity with technology to build websites that are both beautiful and functional.",
    email: "contact@syeds-den.com",
    phone: "+123 456 7890",
    location: "City, Country",
    heroImage: "/images/hero-character.png",
    aboutImage: "/images/about-character.png",
    github: "https://github.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    logoText: "Syed's-Den",
  },
  projects: [
    {
      id: "p1",
      slug: "ecommerce-website",
      title: "E-Commerce Website",
      description:
        "Modern online store with product filtering, cart, and payment system.",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      coverImage: "https://picsum.photos/seed/ecommerce-project/600/400",
      order: 0,
    },
    {
      id: "p2",
      slug: "portfolio-website",
      title: "Portfolio Website",
      description:
        "A clean and modern portfolio website showcasing projects and skills.",
      technologies: ["HTML", "CSS", "Bootstrap"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      coverImage: "https://picsum.photos/seed/portfolio-project/600/400",
      order: 1,
    },
    {
      id: "p3",
      slug: "weather-app",
      title: "Weather App",
      description:
        "Real-time weather application with location search and 7-day forecast.",
      technologies: ["HTML", "CSS", "API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      coverImage: "https://picsum.photos/seed/weather-project/600/400",
      order: 2,
    },
    {
      id: "p4",
      slug: "task-manager",
      title: "Task Manager",
      description:
        "A productivity app with drag-and-drop boards, reminders, and team sharing.",
      technologies: ["React", "TypeScript", "Tailwind"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      coverImage: "https://picsum.photos/seed/task-project/600/400",
      order: 3,
    },
    {
      id: "p5",
      slug: "music-player",
      title: "Music Player",
      description:
        "A sleek music player with playlists, visualizer, and audio streaming.",
      technologies: ["React", "Node.js", "API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      coverImage: "https://picsum.photos/seed/music-project/600/400",
      order: 4,
    },
    {
      id: "p6",
      slug: "chat-app",
      title: "Chat Application",
      description:
        "Real-time chat app with rooms, typing indicators, and message history.",
      technologies: ["React", "Socket.io", "Node.js"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      coverImage: "https://picsum.photos/seed/chat-project/600/400",
      order: 5,
    },
  ],
  services: [
    {
      id: "s1",
      title: "Frontend Development",
      description:
        "Build modern and interactive interfaces using React, HTML, CSS, JavaScript, and the latest frameworks.",
      icon: "Code2",
      order: 0,
    },
    {
      id: "s2",
      title: "UI Design",
      description:
        "Create clean and modern user interfaces with focus on design, usability, and smooth interactions.",
      icon: "Palette",
      order: 1,
    },
    {
      id: "s3",
      title: "Web Applications",
      description:
        "Build robust web applications with seamless user experience and scalable architecture.",
      icon: "AppWindow",
      order: 2,
    },
  ],
  techStack: [
    { id: "t1", name: "JavaScript", icon: "javascript", order: 0 },
    { id: "t2", name: "React", icon: "react", order: 1 },
    { id: "t3", name: "Node.js", icon: "node-dotjs", order: 2 },
    { id: "t4", name: "MySQL", icon: "mysql", order: 3 },
    { id: "t5", name: "PHP", icon: "php", order: 4 },
    { id: "t6", name: "Express", icon: "express", order: 5 },
    { id: "t7", name: "Next.js", icon: "nextdotjs", order: 6 },
    { id: "t8", name: "Git", icon: "git", order: 7 },
    { id: "t9", name: "C", icon: "c", order: 8 },
    { id: "t10", name: "TypeScript", icon: "typescript", order: 9 },
    { id: "t11", name: "HTML5", icon: "html5", order: 10 },
    { id: "t12", name: "CSS3", icon: "css3", order: 11 },
  ],
  stats: [
    { id: "st1", label: "Projects Completed", value: 20, suffix: "+", order: 0 },
    { id: "st2", label: "Years Experience", value: 2, suffix: "+", order: 1 },
    { id: "st3", label: "Happy Clients", value: 15, suffix: "+", order: 2 },
  ],
  settings: {
    availabilityText: "Available for projects",
  },
};
