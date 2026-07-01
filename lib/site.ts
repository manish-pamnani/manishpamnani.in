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

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  url: site.url,
  image: `${site.url}${site.image}`,
  sameAs: [site.links.linkedin, site.links.github],
};
