import type { Metadata } from "next";
import { SiteLogo } from "@/components/site-logo";
import { formatBlogDate, getBlogPosts } from "@/lib/blog";
import { personSchema, site, skills } from "@/lib/site";

export const metadata: Metadata = {
  title: site.pageTitle,
  description: site.description,
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    url: site.url,
    title: site.pageTitle,
    description: site.description,
    images: [{ url: site.image, alt: site.pageTitle }],
  },
  twitter: {
    title: site.pageTitle,
    description: site.description,
    images: [site.image],
  },
};

export default function Home() {
  const blogPosts = getBlogPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-10 sm:px-8 sm:pb-24">
        <header className="mb-16">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <SiteLogo size="lg" />
            <div>
              <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {site.title} · {site.location}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                {site.name}
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            I build polished, performant interfaces with React and Next.js — from
            product dashboards to marketing sites that ship fast and scale cleanly.
          </p>
          <nav
            className="mt-8 flex flex-wrap gap-4 text-sm font-medium"
            aria-label="Social links"
          >
            <a
              href={site.links.linkedin}
              className="text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href={site.links.github}
              className="text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href={site.links.x}
              className="text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            <a
              href={site.links.blog}
              className="text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Blog
            </a>
          </nav>
        </header>

        <main className="space-y-16">
          <section aria-labelledby="about-heading">
            <h2
              id="about-heading"
              className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
            >
              About
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              <p>
                I&apos;m a frontend engineer based in Jaipur with eight years of
                experience shipping React and Next.js applications for startups and
                product teams. I care about clear UX, maintainable code, and the
                details that make interfaces feel fast.
              </p>
              <p>
                When I&apos;m not contracting on frontend work, I&apos;m building
                indie tools and writing about engineering on my blog.
              </p>
            </div>
          </section>

          <section aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
            >
              Skills
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="blog-heading">
            <h2
              id="blog-heading"
              className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
            >
              Blog
            </h2>
            {blogPosts.length > 0 ? (
              <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
                {blogPosts.map((post) => (
                  <li key={post.slug} className="py-6 first:pt-0 last:pb-0">
                    <a href={post.href} className="group block">
                      <time
                        dateTime={post.date.toISOString().slice(0, 10)}
                        className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                      >
                        {formatBlogDate(post.date)}
                      </time>
                      <h3 className="mt-2 text-lg font-medium text-zinc-950 group-hover:underline dark:text-zinc-50">
                        {post.title}
                      </h3>
                      {post.description ? (
                        <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                          {post.description}
                        </p>
                      ) : null}
                      {post.tags.length > 0 ? (
                        <ul
                          className="mt-3 flex flex-wrap gap-2"
                          aria-label="Tags"
                        >
                          {post.tags.map((tag) => (
                            <li
                              key={tag}
                              className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                No posts yet.
              </p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
