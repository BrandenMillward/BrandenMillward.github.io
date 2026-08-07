# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Branden Millward's personal site — portfolio, blog, and project write-ups — served by
GitHub Pages at <https://brandenmillward.com>. Topic focus is AI orchestration,
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

The shared layer was extracted in 2026-08. A site-wide visual change is now **one
file**, not 17. Every page links:

- `assets/css/base.css` — tokens, `[data-theme='light']`, base elements, nav, footer.
  Linked by all 17 pages. `--shell` is `1240px` here and **no page overrides it** — the
  homepage's old `2400px` full-bleed is gone, so the token block now has no per-page exceptions.
  `--accountable` (ochre) is a second semantic colour reserved for the accountability layer:
  guardrails, governance, human-in-the-loop. It is never decorative — if it appears, it means a
  human stays answerable for what happens there. Like `--accent-soft` it must be restated in
  `[data-theme='light']`, where it is darkened to clear AA on paper.
- `assets/js/base.js` — theme toggle (`localStorage['site-theme']`) and mobile nav.
  Linked by all 17, `defer`.

Two page-type stylesheets load *after* `base.css`:

- `assets/css/post.css` — the 5 `blog/*` post pages
- `assets/css/case-study.css` — the 10 `projects/*` pages

**Do not merge those two into `base.css`.** They both style `.post-hero` and
`.post-body` with different rules, so a merged file cross-contaminates: project pages
would inherit blog list styling and vice versa. For the same reason the `.list`/`.row`
ledger is **not** shared — `index.html` and `blog/index.html` use those class names for
different components (row height, thumbnails, dek scoping), so each keeps its ledger inline.

What stays inline, and why:

- the head boot script resolving `data-theme` before first paint — must stay inline in
  all 17 heads or the page flashes the wrong theme. It mirrors `base.js`; if the two
  ever disagree, that flash is the symptom.
- `index.html`: the homepage-only hero, diagram,
  showcase, skills, experience and ledger rules.
- `blog/index.html`: its larger `.post-hero h1` and its own ledger.

The extraction was verified by diffing *effective* CSS (linked + inline, last-wins)
against the pre-extraction pages: 19/19 identical, 0 modified, 0 removed, 0 newly
applying rules — plus a computed-style diff over 606 live elements across the three
page types, also zero. Re-run that comparison against `git show HEAD:<file>` after any
change that moves rules between files. (That check ran when the site was 19 pages; the
two July 2026 blog posts were deleted afterwards, hence 17 today.)

Careful with find-and-replace across these files. A `gap` → `` replacement without a
word boundary once shipped `: .32rem`, `column-:` and `row-:` to production, which the
CSS parser drops silently — the hero grid and burger icon lost their spacing and
nothing errored. Grep for `column-:`, `row-:` and `[a-z-]\+:\s*;` after any bulk edit;
note the ternary at `index.html`'s canvas colour logic is a legitimate `:` match.

The old template-derived styling (the *previous* `assets/**`, `index.html.bak`,
`preview-restyle.html`, and the template's `LICENSE.txt`) was deleted in the
2026-07 cleanup — recover from git history if ever needed. The current `assets/`
is unrelated to it: it is the 2026-08 extraction described above.

### Homepage section ids

`#essays`, `#blog`, `#speaking`, `#experience`, `#work`, `#skills`, `#contact`.
Each is now on a real `<section aria-labelledby>` wrapping the `div.section-mark`
heading and its content block, so landmark navigation exposes them. Everything from
the hero to the skills grid sits inside `<main id="main">`.

### Homepage inline script

Theme toggle and mobile nav live in `assets/js/base.js`. Only **one** IIFE remains inline in
`index.html`, marked `// ── Hero diagram ──`: it wires the `.net-svg` diagram to its detail panel.

**The hero particle canvas (`#net`) is gone** (2026-08) — replaced by the inline SVG diagram,
which has no animation loop. **The parallax background (`#bg-net`) stays**: it was removed and
then deliberately reinstated.

That one canvas is the only `requestAnimationFrame` loop on the site, and its lifecycle is easy
to undo by accident: `render()` only paints, `draw()` owns scheduling, `sync()` decides whether
to run, and it stops on `visibilitychange`. Add a `requestAnimationFrame` that reschedules
unconditionally and it repaints forever in a background tab. Under `prefers-reduced-motion` it
also pins the parallax offset to 0 — the drift *and* the scroll coupling must both go.

Note you cannot verify it paints from the Browser pane: `requestAnimationFrame` never fires
there (measured 0 frames in 700ms), so the canvas reads as blank and mid-transition. Check it
in a real browser.

The hero diagram is the reference architecture Branden designs — retrieval, memory, tools and
skills feeding an agent layer, then an orchestrator, then guardrails and governance, then
output — with each of the 9 layers opening real evidence from his work. Regenerate it with
`scratchpad/build-hero.js` rather than hand-editing coordinates: geometry, markup and the
button overlay are all derived there so they cannot drift apart.

The interactive layer is **real HTML `<button class="net-hit">` positioned over the SVG
in percentages derived from the viewBox**, not `tabindex` on the `<g>` elements. Keep it that
way: SVG `<g>` focus support is inconsistent across browsers, and the buttons give native
focus, native Enter/Space, and real screen-reader semantics for free. The `<g>`s are painted
only — they get `.is-hot` (hover/focus) and `.is-active` (selected) as classes from the
button handlers. If you change any node's geometry you must change its button's percentages
to match; verify by comparing each button's `getBoundingClientRect()` to its `rect`'s.

`.net-figure` is bounded at **both** ends deliberately: `max-width: 34rem` stops the diagram
ballooning to ~880px in the single-column layout, and `min-width: 22.5rem` stops it shrinking
until the tap targets drop below the 24px AA floor — below that width the diagram scrolls
inside `.net-stage` rather than dragging the page sideways. The SVG text sizes are bumped by
media query at narrow and mid widths because SVG text scales with the drawing and otherwise
fell to ~7px.

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
- It converts but never **resizes**. Every referenced image was capped at **1280px wide** and
  re-encoded in 2026-08 (WebP q78, JPEG q80 mozjpeg) — 1280 being 2× the ~642px column the
  1240px shell produces. 44 of 73 images were rewritten; `blog/unlocking-value-of-ai-ep2.html`
  went 1.16 MB → 730 KB. **New images will not be resized by CI**, only converted, so run
  `scratchpad/img/resize-all.js` again after adding any. There is no `cwebp`, ImageMagick or
  working Python on the dev box — `sharp` installed into a scratch dir is the route, and note
  `sharp` holds a handle on a path source, so read to a Buffer first if you mean to overwrite
  in place. (The earlier note here about a 3024×4032 source rendered at 51px was stale.)
- `srcset` splits its value on whitespace, so filenames containing spaces must be
  percent-encoded there; `src` has no such rule. Get this wrong and the browser silently
  ignores the `<source>` and serves the full-size original. The script does this now, and
  its "already wrapped" marker matches the encoded form — hand-written `<picture>` markup
  must encode the same way or the workflow will wrap it a second time.
- The bot pushes a follow-up commit to `main`, so pull after adding images.

## Page conventions

Every page carries its own `<title>`, `<meta name="description">`, and OG tags; the
homepage also has a JSON-LD `Person` block. Adding a page means adding its URL to
`sitemap.xml`, which is an explicit hand-maintained list (17 entries currently).
`robots.txt` points at the sitemap. `files/Branden Millward_CV.pdf` is linked from the site.
