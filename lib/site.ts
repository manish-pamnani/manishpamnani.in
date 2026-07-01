export const site = {
  name: "Manish Pamnani",
  title: "Frontend Engineer",
  location: "Jaipur",
  url: "https://manishpamnani.in",
  image: "/images/manish-pamnani.png",
  pageTitle: "Manish Pamnani – Frontend Engineer, Jaipur",
  description:
    "Frontend engineer in Jaipur building fast, accessible web experiences with React and Next.js.",
  links: {
    linkedin: "https://www.linkedin.com/in/manish-pamnani/",
    github: "https://github.com/manish-pamnani",
    x: "https://x.com/imanishpamnani",
    blog: "/blogs/",
  },
} as const;

export const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "HTML & CSS",
  "Tailwind CSS",
  "Angular",
  "Performance",
  "Accessibility",
] as const;

export const projects = [
  {
    name: "Air Visual Clone",
    description:
      "A TypeScript recreation of an air-quality dashboard with responsive charts and live data views.",
    href: "https://github.com/manish-pamnani/air-visual-clone",
    tags: ["TypeScript", "React"],
  },
  {
    name: "Angular PWA",
    description:
      "A progressive web app scaffold with offline support and installable shell patterns.",
    href: "https://github.com/manish-pamnani/angular-pwa",
    tags: ["Angular", "PWA"],
  },
  {
    name: "Responsive Navigation Bar",
    description:
      "A mobile-first navigation component with accessible keyboard and touch interactions.",
    href: "https://github.com/manish-pamnani/responsive-navigation-bar",
    tags: ["TypeScript", "CSS"],
  },
] as const;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  url: site.url,
  image: `${site.url}${site.image}`,
  sameAs: [site.links.linkedin, site.links.github],
};
