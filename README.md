# brandenmillward.github.io

Branden Millward's personal site — portfolio, blog, and project case studies —
served by GitHub Pages at <https://brandenmillward.com>.

Hand-written static HTML, CSS, and vanilla JS. No framework, no build step:
every page carries its own inline `<style>` and `<script>`, themed with CSS
custom properties (dark/light toggle, JetBrains Mono throughout).

- `index.html` — single-page home: hero, writing, speaking, experience, work, skills
- `blog/` — posts
- `projects/` — project case-study pages
- `images/` — photos and SVG diagrams (pushes touching `images/**` trigger a
  WebP-optimization workflow in `.github/workflows/`)

Deployment is `git push` to `main`. See `CLAUDE.md` for architecture notes and
editing conventions.
