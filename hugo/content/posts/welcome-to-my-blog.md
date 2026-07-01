---
title: "Welcome to My Self-Hosted Blog"
slug: "welcome-to-my-blog"
date: 2025-06-19
description: "A quick tour of this Hugo blog — fully static, version-controlled, and served under /blogs on your domain."
coverImage: "images/welcome-cover.svg"
tags:
  - Hugo
  - Static Sites
  - Writing
---

Building a blog on your own domain is one of the simplest ways to compound SEO authority over time. Posts live as Markdown in Git, build with Hugo, and ship as static HTML — no database and no runtime CMS.

## Why Hugo + Markdown?

Markdown files are easy to version, review in Git, and ship as static HTML at build time. That means:

- **Fast page loads** — pages are pre-rendered during `npm run build`
- **Full domain authority** — every article lives at `yoursite.com/blogs/slug`
- **Simple workflow** — add a `.md` file, commit, deploy

## Rich typography out of the box

The Hugo templates include readable defaults for headings, paragraphs, lists, and blockquotes:

> Good typography is invisible. Great typography is felt.

### A short checklist

1. Add a new `.md` file under `hugo/content/posts/`
2. Fill in the frontmatter (`title`, `date`, `description`, `coverImage`, `tags`)
3. Run `npm run build` to compile Hugo into `public/blogs/` and export the site

**Bold text**, *italic text*, and `inline code` all render correctly.

```toml
[permalinks]
  posts = "/:slug/"
```

Happy writing!
