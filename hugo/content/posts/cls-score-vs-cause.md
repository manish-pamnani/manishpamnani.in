---
title: "Your CLS Score Shows Where the Shift Landed, Not What Caused It"
slug: "cls-score-vs-cause"
date: 2026-11-17
description: "A 0.6 CLS blamed on two logo images turned out to be a late cookie banner. Lighthouse attributes layout shifts to the element that moved, not the one that caused it."
---

I spent an hour yesterday convinced that two logo images were causing a 0.6 CLS on a page I don't own.

They weren't. The images already had width and height. The browser was reserving exactly the right box.

Here's the bit I had wrong. Lighthouse attributes each layout shift to the element that moved, not the element that caused it. The form container scored 0.448 of the 0.609 total. A div doesn't move on its own. Something above it grew and pushed it down.

The actual cause was the cookie banner injecting after first paint.

The lesson isn't "**check your cookie banner**". It's that the score tells you where the damage landed, not who caused it. The trace tells you who caused it, and it takes ten minutes to read one.

Performance mobile: 47. CLS 0.60, where it should be under 0.1. LCP 5.4s, where it should be under 2.5.

I was wrong at first. That's the normal way this goes.
