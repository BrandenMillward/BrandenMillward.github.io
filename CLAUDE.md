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

A site-wide visual change therefore means editing several inline `<style>` blocks,
not one stylesheet. When changing something on the homepage, check whether the blog
and project pages need the same edit. The 10 `projects/*.html` pages share an
identical style/nav/footer skeleton — keep them in lockstep when editing one.

The old template-derived styling (`assets/**`, `index.html.bak`,
`preview-restyle.html`, and the template's `LICENSE.txt`) was deleted in the
2026-07 cleanup — recover from git history if ever needed.

### Homepage section ids

`#essays`, `#blog`, `#speaking`, `#experience`, `#work`, `#skills`, `#contact`.
Most are on `div.section-mark` anchors rather than the `<section>` elements themselves.

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

Two behaviours that surprise people:

- The script only rewrites HTML at the repo **root** (`REPO_ROOT.glob("*.html")`).
  Images used only in `blog/` or `projects/` pages get converted but never re-referenced.
- The bot pushes a follow-up commit to `main`, so pull after adding images.

## Page conventions

Every page carries its own `<title>`, `<meta name="description">`, and OG tags; the
homepage also has a JSON-LD `Person` block. Adding a page means adding its URL to
`sitemap.xml`, which is an explicit hand-maintained list (15 entries currently).
`robots.txt` points at the sitemap. `files/Branden Millward_CV.pdf` is linked from the site.
