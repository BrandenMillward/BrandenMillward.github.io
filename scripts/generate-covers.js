// Rewrites the project cover art so it works on both grounds.
//
// The covers were <img>-loaded SVGs with dark-theme hex baked in — #8b9dff/#2dd4bf artwork on
// an opaque #0f1220 rect. Page CSS cannot reach inside an <img>, so in light mode they rendered
// as near-black tiles on cream. Two systems were in play as well: periwinkle on the project
// covers, teal on the MSc and blog ones.
//
// Fix without touching any markup or adding a build step: drop the opaque background so the
// page ground shows through, and use one palette whose contrast holds on BOTH grounds.
//   #696fb4  4.21:1 on #0a0c16 and on #f5f4f0
//   #6b7391  4.17:1 on both
// Caption text is removed rather than recoloured: it duplicated the alt text, and at mobile
// widths an 11px label inside a ~300px cover renders around 5px, which nobody can read.
const fs = require('fs');
const path = require('path');
const IMG = require('path').join(__dirname, '..', 'images');

const A = '#696fb4';   // accent — structure, nodes, emphasis
const L = '#6b7391';   // line   — secondary strokes, supporting detail

// ── 1. Recolour the covers that already exist, preserving their artwork ────────────────
const EXISTING = ['research-engine', 'doc-platform', 'video-agent', 'repo-docs',
  'deep-learning-regulated'];

for (const name of EXISTING) {
  const p = path.join(IMG, name + '.svg');
  let s = fs.readFileSync(p, 'utf8');
  // the full-bleed background rect, whichever dark it used
  s = s.replace(/\s*<rect width="640" height="360" fill="#(?:0f1220|0b0f14|151c26)"\/>\n?/g, '\n');
  // any remaining panel fills in the old dark family become transparent
  s = s.replace(/fill="#(?:0f1220|0b0f14|151c26|1b2531)"/g, 'fill="none"');
  // artwork colours, both systems, onto the one palette
  s = s.replace(/#8b9dff/g, A).replace(/#2dd4bf/g, A);
  s = s.replace(/#9aa2bd/g, L).replace(/#6b7391/g, L).replace(/#5c6d82/g, L);
  // captions out
  s = s.replace(/\s*<text[\s\S]*?<\/text>/g, '');
  // These covers leaned on opacity for hierarchy — connector lines at 0.35–0.4 sit near 2:1,
  // under the 3:1 floor for meaningful graphics. Faint strokes become the solid slate instead,
  // which reads as the same hierarchy but stays legible, and matches the new covers' two-tone.
  s = s.replace(/stroke="#696fb4"([^>]*?)opacity="(0\.[0-5]\d*)"/g,
    (m, mid) => `stroke="${L}"${mid}opacity="0.9"`);
  s = s.replace(/fill="#696fb4"([^>]*?)opacity="(0\.[0-4]\d*)"/g,
    (m, mid) => `fill="${L}"${mid}opacity="0.9"`);
  s = s.replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(p, s);
}

// ── 2. Five new covers for the earlier work, in the same line-art language ─────────────
const head = (label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" ` +
  `role="img" aria-label="${label}">`;

const covers = {
  // Daily scrape → price history with a drop → alert out
  'web-scraper': {
    label: 'A page scraped on a schedule, its price history charted, and an alert raised when the price drops',
    body: `
  <g fill="none" stroke="${L}" stroke-width="1.5">
    <rect x="58" y="96" width="104" height="132" rx="4"/>
    <line x1="58" y1="122" x2="162" y2="122"/>
  </g>
  <g stroke="${L}" stroke-width="2" stroke-linecap="round" opacity="0.75">
    <line x1="76" y1="146" x2="140" y2="146"/>
    <line x1="76" y1="166" x2="126" y2="166"/>
    <line x1="76" y1="186" x2="144" y2="186"/>
    <line x1="76" y1="206" x2="118" y2="206"/>
  </g>
  <g fill="${A}"><circle cx="70" cy="109" r="4"/></g>

  <g stroke="${L}" stroke-width="1" opacity="0.5">
    <line x1="162" y1="162" x2="228" y2="162"/>
  </g>

  <g fill="none" stroke="${L}" stroke-width="1.5">
    <line x1="244" y1="86" x2="244" y2="262"/>
    <line x1="244" y1="262" x2="452" y2="262"/>
  </g>
  <polyline fill="none" stroke="${A}" stroke-width="2.5" stroke-linejoin="round"
            points="262,140 300,132 338,150 376,138 414,206 440,214"/>
  <g fill="${A}">
    <circle cx="262" cy="140" r="3"/><circle cx="300" cy="132" r="3"/>
    <circle cx="338" cy="150" r="3"/><circle cx="376" cy="138" r="3"/>
    <circle cx="440" cy="214" r="3"/>
  </g>
  <g stroke="${A}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8">
    <line x1="376" y1="138" x2="376" y2="262"/>
    <line x1="414" y1="206" x2="414" y2="262"/>
  </g>
  <circle cx="414" cy="206" r="7" fill="none" stroke="${A}" stroke-width="2"/>

  <g stroke="${L}" stroke-width="1" opacity="0.5">
    <line x1="452" y1="174" x2="510" y2="174"/>
  </g>
  <g fill="none" stroke="${A}" stroke-width="2">
    <path d="M 526 150 L 596 150 L 596 198 L 526 198 Z"/>
    <path d="M 526 150 L 561 178 L 596 150"/>
  </g>`,
  },

  // Letter in → three rotors → plugboard → letter out
  'enigma-cipher': {
    label: 'A letter passing through three cipher rotors and a plugboard to emerge as a different letter',
    body: `
  <g fill="none" stroke="${L}" stroke-width="1.5">
    <rect x="52" y="150" width="52" height="52" rx="4"/>
  </g>
  <line x1="104" y1="176" x2="150" y2="176" stroke="${L}" stroke-width="1" opacity="0.5"/>

  <g fill="none" stroke="${A}" stroke-width="2">
    <circle cx="196" cy="176" r="42"/>
    <circle cx="286" cy="176" r="42"/>
    <circle cx="376" cy="176" r="42"/>
  </g>
  <g fill="none" stroke="${L}" stroke-width="1.5" opacity="0.85">
    <circle cx="196" cy="176" r="26"/>
    <circle cx="286" cy="176" r="26"/>
    <circle cx="376" cy="176" r="26"/>
  </g>
  <g stroke="${A}" stroke-width="2" stroke-linecap="round">
    <line x1="196" y1="134" x2="196" y2="146"/>
    <line x1="316" y1="164" x2="328" y2="164"/>
    <line x1="376" y1="206" x2="376" y2="218"/>
  </g>
  <g stroke="${L}" stroke-width="1" opacity="0.5">
    <line x1="238" y1="176" x2="244" y2="176"/>
    <line x1="328" y1="176" x2="334" y2="176"/>
  </g>

  <g stroke="${A}" stroke-width="1.5" opacity="0.9">
    <path d="M 418 158 C 452 158 452 194 486 194" fill="none"/>
    <path d="M 418 194 C 452 194 452 158 486 158" fill="none"/>
  </g>
  <g fill="${A}">
    <circle cx="418" cy="158" r="3.5"/><circle cx="418" cy="194" r="3.5"/>
    <circle cx="486" cy="158" r="3.5"/><circle cx="486" cy="194" r="3.5"/>
  </g>

  <line x1="486" y1="176" x2="530" y2="176" stroke="${L}" stroke-width="1" opacity="0.5"/>
  <g fill="none" stroke="${A}" stroke-width="2">
    <rect x="530" y="150" width="52" height="52" rx="4"/>
  </g>`,
  },

  // Ant-colony path + genetic crossover converging on one optimum
  'hybrid-aco-ga': {
    label: 'A pheromone path search and a genetic crossover combining into a single optimum',
    body: `
  <g fill="none" stroke="${L}" stroke-width="1" opacity="0.55">
    <path d="M 70 92 L 140 66 L 210 100 L 268 78"/>
    <path d="M 70 92 L 132 122 L 210 100"/>
    <path d="M 132 122 L 196 148 L 268 78"/>
  </g>
  <polyline fill="none" stroke="${A}" stroke-width="2.5" stroke-linejoin="round"
            points="70,92 140,66 210,100 268,78"/>
  <g fill="${A}">
    <circle cx="70" cy="92" r="4.5"/><circle cx="140" cy="66" r="4.5"/>
    <circle cx="210" cy="100" r="4.5"/><circle cx="268" cy="78" r="4.5"/>
  </g>
  <g fill="none" stroke="${L}"><circle cx="132" cy="122" r="3.5"/><circle cx="196" cy="148" r="3.5"/></g>

  <g stroke="${L}" stroke-width="2" stroke-linecap="round" opacity="0.85">
    <line x1="70" y1="236" x2="150" y2="236"/>
    <line x1="70" y1="266" x2="150" y2="266"/>
  </g>
  <g stroke="${A}" stroke-width="2" stroke-linecap="round">
    <line x1="150" y1="236" x2="200" y2="266"/>
    <line x1="150" y1="266" x2="200" y2="236"/>
    <line x1="200" y1="236" x2="268" y2="236"/>
    <line x1="200" y1="266" x2="268" y2="266"/>
  </g>
  <g fill="${A}">
    <circle cx="150" cy="236" r="3.5"/><circle cx="150" cy="266" r="3.5"/>
    <circle cx="200" cy="236" r="3.5"/><circle cx="200" cy="266" r="3.5"/>
  </g>

  <g stroke="${L}" stroke-width="1" opacity="0.5" fill="none">
    <path d="M 268 78 C 350 78 350 176 418 176"/>
    <path d="M 268 251 C 350 251 350 176 418 176"/>
  </g>

  <circle cx="440" cy="176" r="22" fill="none" stroke="${A}" stroke-width="2"/>
  <circle cx="440" cy="176" r="8" fill="${A}"/>
  <g stroke="${L}" stroke-width="1.5" opacity="0.7">
    <line x1="440" y1="132" x2="440" y2="146"/>
    <line x1="440" y1="206" x2="440" y2="220"/>
    <line x1="396" y1="176" x2="410" y2="176"/>
    <line x1="470" y1="176" x2="484" y2="176"/>
  </g>
  <g fill="none" stroke="${L}" stroke-width="1.5" opacity="0.9">
    <circle cx="440" cy="176" r="40"/>
    <circle cx="440" cy="176" r="58"/>
  </g>`,
  },

  // Scatter, fitted line, residuals
  'linear-regression': {
    label: 'A scatter of observations with a fitted regression line and its residuals marked',
    body: `
  <g fill="none" stroke="${L}" stroke-width="1.5">
    <line x1="96" y1="60" x2="96" y2="286"/>
    <line x1="96" y1="286" x2="556" y2="286"/>
  </g>
  <g stroke="${L}" stroke-width="1" opacity="0.35">
    <line x1="96" y1="230" x2="556" y2="230"/>
    <line x1="96" y1="174" x2="556" y2="174"/>
    <line x1="96" y1="118" x2="556" y2="118"/>
  </g>

  <line x1="120" y1="256" x2="536" y2="94" stroke="${A}" stroke-width="2.5"/>

  <g stroke="${L}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.85">
    <line x1="176" y1="212" x2="176" y2="234"/>
    <line x1="248" y1="184" x2="248" y2="162"/>
    <line x1="320" y1="156" x2="320" y2="182"/>
    <line x1="392" y1="128" x2="392" y2="110"/>
    <line x1="464" y1="100" x2="464" y2="124"/>
  </g>
  <g fill="${A}">
    <circle cx="176" cy="234" r="5"/><circle cx="248" cy="162" r="5"/>
    <circle cx="320" cy="182" r="5"/><circle cx="392" cy="110" r="5"/>
    <circle cx="464" cy="124" r="5"/>
  </g>
  <g fill="none" stroke="${L}" stroke-width="1.5" opacity="0.8">
    <circle cx="212" cy="196" r="4"/><circle cx="284" cy="200" r="4"/>
    <circle cx="356" cy="140" r="4"/><circle cx="428" cy="152" r="4"/>
    <circle cx="500" cy="96" r="4"/>
  </g>`,
  },

  // Correlation grid + ranked bars against one target
  'movie-correlation': {
    label: 'A correlation grid beside features ranked by how strongly they track gross revenue',
    body: `
  <g fill="none" stroke="${L}" stroke-width="1" opacity="0.6">
    <rect x="62" y="88" width="188" height="188"/>
    <line x1="62" y1="135" x2="250" y2="135"/><line x1="62" y1="182" x2="250" y2="182"/>
    <line x1="62" y1="229" x2="250" y2="229"/>
    <line x1="109" y1="88" x2="109" y2="276"/><line x1="156" y1="88" x2="156" y2="276"/>
    <line x1="203" y1="88" x2="203" y2="276"/>
  </g>
  <g fill="${A}">
    <rect x="62" y="88" width="47" height="47" opacity="0.85"/>
    <rect x="109" y="135" width="47" height="47" opacity="0.85"/>
    <rect x="156" y="182" width="47" height="47" opacity="0.85"/>
    <rect x="203" y="229" width="47" height="47" opacity="0.85"/>
    <rect x="109" y="88" width="47" height="47" opacity="0.5"/>
    <rect x="62" y="135" width="47" height="47" opacity="0.5"/>
    <rect x="203" y="88" width="47" height="47" opacity="0.18"/>
    <rect x="62" y="229" width="47" height="47" opacity="0.18"/>
    <rect x="156" y="135" width="47" height="47" opacity="0.3"/>
    <rect x="109" y="229" width="47" height="47" opacity="0.12"/>
  </g>

  <line x1="286" y1="88" x2="286" y2="276" stroke="${L}" stroke-width="1.5"/>
  <g fill="${A}">
    <rect x="288" y="100" width="252" height="18" rx="2"/>
    <rect x="288" y="140" width="196" height="18" rx="2" opacity="0.8"/>
    <rect x="288" y="180" width="140" height="18" rx="2" opacity="0.62"/>
    <rect x="288" y="220" width="86" height="18" rx="2" opacity="0.44"/>
    <rect x="288" y="252" width="44" height="18" rx="2" opacity="0.28"/>
  </g>`,
  },
};

for (const [name, c] of Object.entries(covers)) {
  fs.writeFileSync(path.join(IMG, name + '.svg'), head(c.label) + c.body + '\n</svg>\n');
}

console.log('recoloured: ' + EXISTING.length);
console.log('authored:   ' + Object.keys(covers).length + ' (' + Object.keys(covers).join(', ') + ')');
