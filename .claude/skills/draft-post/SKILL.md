---
name: draft-post
description: Turn a Google Doc blog draft into a reviewable Hugo post in this repo — imports the doc as Markdown, downloads its images, generates frontmatter matching the existing post schema, runs an SEO checklist, and starts the local Hugo dev server for review. Pass a Google Doc URL or ID as ARGUMENTS.
---

# Draft a blog post from a Google Doc

Turns a Google Doc into `hugo/content/posts/<slug>.md`, ready for Manish to review and edit in-browser. This is the "import + scaffold" half of the blog pipeline — the companion skill `publish-post` handles deploy + announce once the draft is finished by hand.

If ARGUMENTS is empty, ask for a Google Doc URL, ID, or title before doing anything else.

## 1. Resolve the doc

- If ARGUMENTS looks like a Drive URL (`docs.google.com/document/d/<ID>/...`), extract the `<ID>` directly.
- If it's a bare Drive file ID, use it as-is.
- Otherwise treat it as a title/keyword and call `mcp__claude_ai_Google_Drive__search_files` with `title contains '<terms>'` (or `fullText contains` if a title search finds nothing) to find the doc. If more than one plausible match comes back, list them and ask which one.
- Call `mcp__claude_ai_Google_Drive__get_file_metadata` on the resolved ID to confirm it's a Google Doc (`application/vnd.google-apps.document`) and grab its title.

## 2. Export the doc as Markdown

Call `mcp__claude_ai_Google_Drive__download_file_content` with `fileId` = the resolved ID and `exportMimeType: "text/markdown"`. Decode the base64 result to get the raw Markdown body.

Google's Markdown export embeds inline images as ordinary `![alt](https://...)` links pointing at temporary Google-hosted URLs — handle those in the next step before they expire.

## 3. Derive the slug and check for collisions

- Slug: lowercase the doc title, replace anything that isn't `[a-z0-9]` with `-`, collapse repeated `-`, trim leading/trailing `-`.
- Check `hugo/content/posts/<slug>.md` doesn't already exist. If it does, ask Manish whether this is an update to that post (skip creating a new file, tell them to edit the existing one) or whether the slug needs disambiguating.

## 4. Download images

- Regex out every `![alt](url)` in the exported Markdown.
- `mkdir -p hugo/static/images/<slug>` and download each image into it (sequential filenames like `01.png`, `02.png`, or reuse the original filename from the URL if it's meaningful — check the existing convention in `hugo/static/images/` first and match it).
- Rewrite each Markdown image link to the relative path Hugo expects, matching how existing posts reference images (check `hugo/content/posts/*.md` for the exact pattern — e.g. `images/<slug>/01.png` relative to the post, consistent with the `coverImage: "images/..."` frontmatter field already in use).
- If the first image in the doc reads like a hero/cover image (appears before the first heading, or is clearly a banner), treat it as `coverImage` in frontmatter rather than leaving it inline — again, follow whatever `useref-vs-usestate.md` and `zustand-vs-redux-2026.md` already do.

## 5. Write frontmatter + body

Match the exact schema used by the existing posts in `hugo/content/posts/*.md` — read both existing posts first if it's been a while, since this is the source of truth, not this file:

```yaml
---
title: "<doc title, cleaned up>"
slug: "<slug>"
date: <today, YYYY-MM-DD>
description: "<TODO: 150-160 char meta description>"
coverImage: "images/<slug>/<file>"   # omit entirely if no clear cover image
coverImageAlt: "<short alt text>"     # omit if coverImage omitted
---
```

If the doc's own text already contains something description-shaped near the top (a one-line summary before the first heading), use it as the `description` and don't leave a TODO — only placeholder it if nothing suitable exists.

Write the frontmatter + converted body to `hugo/content/posts/<slug>.md`.

## 6. SEO checklist (report only — do not silently rewrite prose)

Read every other file in `hugo/content/posts/` and produce a short report covering:

- **Internal links**: any existing post whose title/description topically overlaps this one — suggest 1-2 "if you liked this, you might also enjoy [...]" links, matching the closing-paragraph pattern already used in `useref-vs-usestate.md`. Don't insert them automatically — propose the exact sentence and let Manish drop it in.
- **Meta description**: flag if missing, or outside ~150-160 characters.
- **Image alt text**: flag any image whose alt text is empty or just repeats the filename.
- **Heading structure**: flag any heading-level skip (e.g. an H4 with no preceding H3).
- **External links**: flag bare mentions of technologies/APIs/libraries that aren't hyperlinked to their docs, mirroring how existing posts link out (e.g. `[useRef](https://react.dev/reference/react/useRef)`).

Print this as a short bulleted list in chat — don't create a separate report file.

## 7. Start the dev server for review

Run `npm run dev:hugo` (or `npm run dev` if Manish wants the full Next.js shell around it) in the background so the new post is live at `http://localhost:3000/blogs/<slug>/` for review. Tell Manish the URL and that the draft is ready for him to edit directly in `hugo/content/posts/<slug>.md` — this skill stops here. Don't run `publish-post` automatically; that's a separate, explicit step once he's happy with the content.
