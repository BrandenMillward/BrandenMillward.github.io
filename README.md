# BrandenMillward.github.io

## Overview

This repository contains the source for a personal website hosted via GitHub Pages (`BrandenMillward.github.io`). Based on the visible file structure, the site is a client-side, static HTML/CSS/JavaScript project built on a common front-end template pattern: a set of vendor/utility JavaScript libraries paired with custom site scripts.

**Note on scope:** The provided file tree only exposes the `assets/js/` directory. There is likely additional structure not shown here (e.g. an `index.html`, `assets/css/`, `assets/sass/`, `images/`, or similar folders) that is typical of GitHub Pages sites of this kind, but since these are not present in the provided listing, they are not documented here with certainty.

## What's in `assets/js/`

- **breakpoints.min.js** — Minified library for handling responsive design breakpoints (commonly used to toggle layout behavior based on viewport size).
- **browser.min.js** — Minified browser/feature detection utility (commonly used to apply browser-specific classes or behavior).
- **jquery.min.js** — Minified jQuery library, the core dependency for DOM manipulation used by the other scripts.
- **jquery.scrollex.min.js** — jQuery plugin for scroll-based event triggering (e.g., animations tied to scroll position).
- **jquery.scrolly.min.js** — jQuery plugin for smooth scrolling (e.g., smooth anchor-link navigation).
- **main.js** — Custom site JavaScript that likely wires together the above libraries to drive the page's interactive behavior (navigation, scroll effects, responsive adjustments).
- **site.js** — Additional custom site-specific JavaScript, likely supplementing or configuring behavior defined in `main.js`.
- **util.js** — Custom utility/helper functions used across the site's scripts.

## Setup / Installation

Since this is a GitHub Pages user site (repository name matches the `<username>.github.io` pattern), it is served directly by GitHub Pages without a separate build/deploy step:

1. Clone the repository:
   ```bash
   git clone https://github.com/BrandenMillward/BrandenMillward.github.io.git
   cd BrandenMillward.github.io
   ```
2. Open the site locally. If there is an `index.html` at the repository root (typical for this kind of project, though not confirmed in the provided file listing), you can open it directly in a browser or serve it with a simple local HTTP server, for example:
   ```bash
   python3 -m http.server
   ```
   then visit `http://localhost:8000` in your browser.
3. No build tooling, package manager, or dependency installation step is evidenced by the provided files — the JavaScript libraries are already vendored as minified files in `assets/js/`, suggesting no `npm install` or bundler step is required.

## Usage

- The site is intended to be viewed as a static web page, either locally (via a file server) or live at `https://brandenmillward.github.io`, since it is published through GitHub Pages.
- Any content or page-structure changes would be made in the HTML/CSS files (not shown in the provided tree).
- Behavioral changes to interactivity, animations, or scroll effects would be made in `assets/js/main.js`, `assets/js/site.js`, or `assets/js/util.js`.
- The vendor libraries (`jquery.min.js`, `jquery.scrollex.min.js`, `jquery.scrolly.min.js`, `breakpoints.min.js`, `browser.min.js`) should generally not be edited directly, as they are minified third-party/template dependencies.

## Deployment

Since this repository follows the `<username>.github.io` naming convention, GitHub Pages will automatically publish the contents of the default branch (commonly `main` or `master`) at `https://brandenmillward.github.io`. No explicit CI/CD configuration is evidenced in the provided file listing, so deployment is presumed to be handled automatically by GitHub Pages upon pushing to the repository.
