# BrandenMillward.github.io

This repository contains the source code for **Branden Millward's personal website**, hosted via GitHub Pages at `brandenmillward.github.io`. The site serves as a personal portfolio, blog, and project showcase, with a focus on AI, machine learning, and data-related topics.

## What This Codebase Does

The site is a static HTML/CSS/JavaScript website built on a design template (based on file structure, this appears to derive from an HTML5 UP-style template, using SASS for styling and jQuery-based scripts for interactivity). It includes:

- **Home page** (`index.html`) — landing page / introduction.
- **Blog** (`blog/`) — a collection of articles, including:
  - An index/listing page (`blog/index.html`)
  - Posts on topics such as moving from models to decisions, pursuing an MSc while leading a career, and a multi-part series "Unlocking the Value of AI" (episodes 1–5).
- **Projects** (`projects/`) — individual project write-up pages, including:
  - Amazon web scraper
  - Deep learning in regulated industries
  - Enigma machine implementation/simulation
  - Hybrid machine learning approach
  - Linear regression project
  - Movie correlation analysis
- **Generic/utility pages** — `elements.html` (a UI kit/style guide showcasing template components) and `generic.html` (a generic content page template).
- **Assets** — CSS (including compiled `main.css` and SASS sources), JavaScript utilities/plugins, web fonts (Font Awesome), and images used throughout the site (blog illustrations, project diagrams, personal photos).
- **Files** — a downloadable CV (`files/Branden Millward_CV.pdf`).

## Project Structure Overview

```
/
├── index.html              # Homepage
├── elements.html            # Template UI elements showcase
├── generic.html              # Generic content page
├── blog/                     # Blog index and individual posts
├── projects/                  # Project write-up pages
├── files/                     # Downloadable documents (CV)
├── images/                    # Site imagery (photos, diagrams, icons)
└── assets/
    ├── css/                   # Compiled CSS (main, noscript, custom site.css, fontawesome)
    ├── sass/                  # SASS source files (base, components, libs)
    ├── js/                    # JavaScript (jQuery, plugins, main.js, site.js, util.js)
    └── webfonts/              # Font Awesome icon font files
```

## Setup / Installation

This is a static site with no build tooling evidenced in the repository (no `package.json`, bundler config, or SASS compilation script was found). Based on the file structure:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BrandenMillward/BrandenMillward.github.io.git
   cd BrandenMillward.github.io
   ```

2. **View locally:**
   Since this is plain HTML/CSS/JS, you can open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:
   ```bash
   python3 -m http.server
   ```
   then navigate to `http://localhost:8000`.

3. **SASS compilation (if editing styles):**
   The `assets/sass/` directory contains SASS source files (`main.scss`, `noscript.scss`, and partials under `base/`, `components/`, and `libs/`). A SASS compiler (e.g., `sass` or `node-sass`/Dart Sass) would be needed to regenerate `assets/css/main.css` and `assets/css/noscript.css` from these sources. **No compiler configuration or npm scripts were found in this repository**, so the exact build command is not confirmed — you would need to run a standard SASS CLI command, e.g.:
   ```bash
   sass assets/sass/main.scss assets/css/main.css
   ```
   (This command is inferred from convention, not verified against a config file in the repo.)

## Deployment

Given the repository name (`BrandenMillward.github.io`) and structure, this project is deployed via **GitHub Pages**, which automatically serves the contents of the repository (likely from the `main`/`master` branch root) at `https://brandenmillward.github.io`.

## Usage

- Browse the homepage for an overview and navigation to blog and project sections.
- Visit `/blog/index.html` to see a listing of all blog posts.
- Visit individual project pages under `/projects/` for detailed write-ups on specific technical projects (e.g., the Enigma machine simulation, linear regression analysis, movie correlation study, Amazon scraper, deep learning in regulated industries, and a hybrid ML approach).
- Download the CV from `/files/Branden Millward_CV.pdf`.

## License

See `LICENSE.txt` for license details. See also `README.txt`, which may contain additional notes (likely inherited from the original HTML template this site is based on).

## Notes / Uncertainty

- No JavaScript framework, package manager, or build pipeline configuration files (e.g., `package.json`, `webpack.config.js`, `gulpfile.js`) were found in the provided file tree, so this is treated as a purely static site without an automated build step.
- The presence of `assets/js/jquery.min.js`, `jquery.scrollex.min.js`, `jquery.scrolly.min.js`, `breakpoints.min.js`, `browser.min.js`, `util.js`, and `main.js` strongly suggests this site is based on a common free HTML5 template (e.g., an "HTML5 UP" style template), customized with an additional `site.css` and `site.js` for personal content.
- Exact deployment branch and GitHub Pages configuration are not visible in the file tree and are inferred from the repository naming convention.
