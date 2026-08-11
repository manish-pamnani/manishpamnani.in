---
name: publish-post
description: Ship a finished Hugo blog draft in this repo — builds and deploys to the manishpamnani.in Hostinger site, drafts and (on approval) posts a LinkedIn announcement, and imports the post into Medium via the Story Importer for a backlink, publishing only after explicit chat approval. Pass the post slug as ARGUMENTS.
---

# Publish a finished blog post

Companion to `draft-post`. Run this once Manish has finished reviewing/editing a draft in `hugo/content/posts/<slug>.md`. Three stages: deploy, LinkedIn, Medium — each of the last two stops for explicit approval before anything goes public.

If ARGUMENTS is empty, ask for the post slug. Confirm `hugo/content/posts/<slug>.md` exists before doing anything else.

## Stage 1 — Deploy to Hostinger

This is the exact sequence validated manually earlier in this project:

1. `rm -rf out .next && NODE_ENV=production npm run build` — runs the Hugo build (via the `prebuild` script) then `next build` with `output: "export"` from `next.config.ts`. Confirm it exits clean; if TypeScript or Hugo errors surface, stop and report them rather than deploying a broken build.
2. Sanity-check `out/` contains `index.html`, `blogs/<slug>/index.html`, and the images referenced by the new post.
3. Zip the **contents** of `out/` (not the folder itself — the archive root must contain `index.html` directly, or Hostinger serves a 404) into the scratchpad directory: `cd out && zip -r -q <scratchpad>/manishpamnani_$(date +%Y%m%d_%H%M%S).zip . && cd ..`.
4. `mcp__hostinger-hosting__hosting_deployStaticWebsite` with `domain: "manishpamnani.in"` and the zip path, `removeArchive: true`.
5. `mcp__hostinger-hosting__hosting_clearWebsiteCacheV1` with `username: "u903409556"`, `domain: "manishpamnani.in"`.
6. Verify with `WebFetch` against `https://manishpamnani.in/blogs/<slug>/` — confirm the new post's title/content actually shows up before telling Manish it's live.

## Stage 2 — LinkedIn

### Token setup check

Look for `~/.config/manishpamnani-in/linkedin.env`. It should define:

```
LINKEDIN_ACCESS_TOKEN=...
LINKEDIN_PERSON_URN=urn:li:person:...
```

If the file is missing, **stop here and tell Manish** he needs to do the one-time setup: register a LinkedIn Developer app at developer.linkedin.com, add the "Share on LinkedIn" product (self-serve), complete OAuth to get a `w_member_social`-scoped access token, then fetch his person URN via `GET https://api.linkedin.com/v2/userinfo` (the `sub` claim, prefixed `urn:li:person:`) and save both into that file. Don't attempt to do OAuth yourself — it needs his browser login. Skip to Stage 3 if he wants Medium done first.

### Draft

Write a LinkedIn post for the new content — see the tone/structure already used earlier in this project's conversation history for this exact post as a reference (hook opener, a few arrow bullet takeaways, link, hashtags). Show it to Manish in chat for edits.

### Publish (on approval only)

Once Manish explicitly approves the text, post it:

```bash
source ~/.config/manishpamnani-in/linkedin.env
curl -s -X POST https://api.linkedin.com/rest/posts \
  -H "Authorization: Bearer $LINKEDIN_ACCESS_TOKEN" \
  -H "LinkedIn-Version: 202405" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg author "$LINKEDIN_PERSON_URN" --arg text "<approved post text>" \
    '{author:$author, commentary:$text, visibility:"PUBLIC", distribution:{feedDistribution:"MAIN_FEED", targetEntities:[], thirdPartyDistributionChannels:[]}, lifecycleState:"PUBLISHED", isReshareDisabledByAuthor:false}')"
```

Never fire this call before Manish has said an explicit go-ahead on the exact text — approving the general workflow earlier is not the same as approving this specific post. If the API returns a 401, the token has likely expired (~60 days); tell Manish to re-run the OAuth flow rather than retrying.

## Stage 3 — Medium (backlink import)

Medium closed new API-token issuance, so this goes through the Story Importer in the browser instead of a direct API call.

1. Load the Chrome automation tools if not already loaded: `ToolSearch` with `select:mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__find,mcp__claude-in-chrome__tabs_context_mcp`.
2. Open a new tab to `https://medium.com/p/import`. If Manish isn't logged into Medium in this Chrome profile, stop and tell him to log in first — don't attempt to authenticate on his behalf.
3. Enter `https://manishpamnani.in/blogs/<slug>/` into the importer's URL field and trigger the import.
4. Wait for Medium to render the pulled-in draft. Take a screenshot and describe what came through — flag anything that looks visibly broken (missing images, mangled code blocks) rather than assuming it's fine.
5. Show the result to Manish and ask explicitly: "ready to publish this to Medium?" Do not proceed without a clear yes.
6. On approval, find and click Medium's Publish control (it may open a short publish dialog — e.g. tags/topic selection; fill in something reasonable based on the post's content if asked, but don't invent claims about the post that aren't true).
7. Confirm the resulting Medium URL and share it back to Manish along with the LinkedIn post URL (if Stage 2 ran) as a short wrap-up.

## Notes

- Stages are independent enough to re-run individually if one fails — e.g. if deploy succeeds but LinkedIn posting fails, don't redeploy, just retry Stage 2.
- Never combine Stage 2/3 approval into a single upfront "yes to everything" — ask separately for each, since Manish may want to edit the LinkedIn text after seeing the Medium import, or vice versa.
