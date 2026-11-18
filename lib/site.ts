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
  email: "manishpamnani169@gmail.com",
} as const;

export const work = [
  {
    name: "Hosted Seats, Coca-Cola (contract)",
    description:
      "VIP guest management and CRM for FIFA, the Olympics and Coachella.",
  },
  {
    name: "Zeus, Legends",
    description:
      "Inventory and ticketing running live across FIFA World Cup venues, plus VIP hospitality for the 2023 US Open Golf.",
  },
  {
    name: "SIDEARM Sports",
    description:
      "Cut the JavaScript bundle by 30% and fixed Core Web Vitals across NCAA client sites.",
  },
  {
    name: "HandWrought",
    description: "An AI writing editor that edits in place, no copy-paste.",
    href: "https://handwrought.online",
  },
] as const satisfies readonly {
  name: string;
  description: string;
  href?: string;
}[];

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
