# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Branden Millward's personal site — portfolio, blog, and project write-ups — served by
GitHub Pages at <https://brandenmillward.github.io>. Topic focus is AI orchestration,
machine learning, and data.

## Tech stack

Hand-written static HTML, CSS, and vanilla JS. No framework, no bundler, no
`package.json`, no build step, no tests, no linter. Fonts come from Google Fonts
(JetBrains Mono for the restyled pages, Inter + JetBrains Mono for the older ones).
The only Python is a CI-only image script.

## Commands

There is nothing to build. Serve the directory and open it:

```bash
npx -y http-server -p 8123
```

`.claude/launch.json` defines this as the `static-preview` config — start it with
`preview_start {name: "static-preview"}` rather than spawning a server another way.
(`.claude/` is untracked, so a fresh clone won't have it; recreate it if missing.)
Opening `index.html` over `file://` mostly works but breaks relative image paths in
sub-directories, so prefer the server.

Deployment is `git push` to `main`. GitHub Pages serves the repo root; there is no
build or release step.

## Architecture

### One design system, per-page styles — this is the thing to know first

Every page (`index.html`, `blog/*.html`, `projects/*.html`) is **self-contained**:
per-page inline `<style>` block, JetBrains Mono, `:root` / `[data-theme='light']`
custom properties, and a per-page inline `<script>` for the theme toggle
(`localStorage['site-theme']`) and mobile nav. There is no shared stylesheet in use.

A site-wide visual change therefore means editing all 19 inline `<style>` blocks,
not one stylesheet. When changing something on the homepage, check whether the blog
and project pages need the same edit.

To keep that tractable, four regions are **byte-identical across all 18 blog and
project pages**, with `index.html` the single deliberate exception (it carries
`--shell: 2400px` and the homepage-only hero/canvas rules):

1. the head boot script that resolves `data-theme` before first paint — identical
   across all 19, no exception,
2. the token block, `:root {` down to `.hud {`,
3. the nav CSS block,
4. the bottom `<script>` (theme toggle + mobile nav).

Verify with a hash over those four regions after any edit that touches them. That
invariant is what would make a later extraction into `assets/css/base.css` +
`assets/js/base.js` a mechanical, hash-checkable lift rather than a judgement call.
It was deliberately deferred: splitting `index.html`'s inline block is the one change
that can silently break the highest-traffic page on a site with no tests and no staging.

Careful with find-and-replace across these files. A `gap` → `` replacement without a
word boundary once shipped `: .32rem`, `column-:` and `row-:` to production, which the
CSS parser drops silently — the hero grid and burger icon lost their spacing and
nothing errored.

The old template-derived styling (`assets/**`, `index.html.bak`,
`preview-restyle.html`, and the template's `LICENSE.txt`) was deleted in the
2026-07 cleanup — recover from git history if ever needed.

### Homepage section ids

`#essays`, `#blog`, `#speaking`, `#experience`, `#work`, `#skills`, `#contact`.
Each is now on a real `<section aria-labelledby>` wrapping the `div.section-mark`
heading and its content block, so landmark navigation exposes them. Everything from
the hero to the skills grid sits inside `<main id="main">`; `#bg-net` stays outside it.

### Homepage inline script

One IIFE at the bottom of `index.html`, split by `// ── ` comment markers — navigate by
those, not by line number, since this file gets edited often:

- `Theme toggle` — sets `data-theme` on `<html>`, persists to `site-theme`
- `Mobile nav toggle` — burger menu, drives `#nav-menu` / `#nav-toggle`
- `Agent-network canvas` — `#net`, the animation inside the hero stage
- `Background parallax neural network` — `#bg-net`, the full-page background canvas;
  fades in by gaining `.is-visible`, and scrolls at a fraction of page speed

Node count, opacity, drift speed, and line weight in these two canvases are tuned
frequently — expect requests about their visibility.

Both loops are lifecycle-managed, and this is easy to undo by accident:
`render()` only paints, `draw()` owns scheduling, `sync()` decides whether to run.
The hero canvas stops when its stage scrolls out of view (`IntersectionObserver`) and
when the tab is hidden; the background canvas stops on `visibilitychange`. Add a
`requestAnimationFrame` that reschedules unconditionally and you reintroduce a loop
that repaints forever in a background tab. Under `prefers-reduced-motion` the
background canvas also pins its parallax offset to 0 — the drift *and* the scroll
coupling must both go, not just the drift.

### Branch model

`main` is live. The old `restyle-preview` branch carried `preview-restyle.html`,
the design prototype for the restyle — the restyle has long since shipped to `main`
and that branch is stale; don't assume any file matches across branches. Design
work now happens directly on `main`'s real pages.

## Image pipeline

`.github/workflows/optimize-images.yml` runs on pushes to `main` touching `images/**`.
It diffs the push range, converts new/changed `.jpg/.jpeg/.png/.gif` to WebP with
`cwebp`/`gif2webp` (quality 85), then pipes those paths on **stdin** to
`scripts/optimize_images.py`, which rewrites matching `<img src="…">` into a `<picture>`
with a WebP `<source>` and the original as fallback, and commits with `[skip ci]`.

Four behaviours that surprise people:

- The script only rewrites HTML at the repo **root** (`REPO_ROOT.glob("*.html")`).
  Images used only in `blog/` or `projects/` pages get converted but never re-referenced,
  so their `<picture>` markup is hand-written and the workflow will not maintain it.
- It converts but never **resizes**. WebP alone does not fix a 3024×4032 source rendered
  at 51px. There is no `cwebp`, ImageMagick or working Python on the dev box — `sharp`
  installed into a scratch dir is the route, and note `sharp` holds a handle on a path
  source, so read to a Buffer first if you mean to overwrite in place.
- `srcset` splits its value on whitespace, so filenames containing spaces must be
  percent-encoded there; `src` has no such rule. Get this wrong and the browser silently
  ignores the `<source>` and serves the full-size original. The script does this now, and
  its "already wrapped" marker matches the encoded form — hand-written `<picture>` markup
  must encode the same way or the workflow will wrap it a second time.
- The bot pushes a follow-up commit to `main`, so pull after adding images.

## Page conventions

Every page carries its own `<title>`, `<meta name="description">`, and OG tags; the
homepage also has a JSON-LD `Person` block. Adding a page means adding its URL to
`sitemap.xml`, which is an explicit hand-maintained list (15 entries currently).
`robots.txt` points at the sitemap. `files/Branden Millward_CV.pdf` is linked from the site.
