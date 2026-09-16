# Hyperframes Composition Brief: brandenmillward.com

## Objective
Create a short launch-style brag video for brandenmillward.com, the personal site of
Branden Millward, AI Orchestration Architect.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21.2 seconds

## Source Material
- Project root: `/home/user/BrandenMillward.github.io`
- Primary files read: `index.html`, `assets/css/base.css`, `README.md`, `CLAUDE.md`
- Product name: brandenmillward.com (Branden Millward, AI Orchestration Architect)
- Tagline / strongest claim: "Most organisations don't have an AI problem. They have a trust problem."
- Key UI or visual moment to recreate: the hero's interactive nine-layer agent architecture
  diagram (`.net-svg`, viewBox `0 0 400 325`) plus its live detail panel (`.net-detail`).
  This is the site's centrepiece and its only real interaction.
- Copy that must appear verbatim:
  - "Most organisations don't have an AI problem."
  - "They have a trust problem."
  - "How agent networks fit together"
  - Node labels, exactly as drawn: RETRIEVAL / MEMORY / TOOLS / SKILLS /
    AGENTS · ROLES & HANDOFFS / ORCHESTRATOR · PROTOCOLS / GUARDRAILS / GOVERNANCE /
    OUTPUT · MEASURED
  - "Nine layers, one accountable system"
  - "Governance: accountability"
  - "The barrier to adoption is auditability, not capability."
  - "I turn AI strategy into deployed systems."
  - "brandenmillward.com"

## Creative Direction
- Tone preset: polished
- Creative direction: an architect's reference drawing assembling itself, quiet and certain
- Interpretation: four scenes, long holds, soft crossfades (0.6-0.8s), no aggressive motion.
  A video about accountability should not shout. Nothing flashes or spins; every line sits
  long enough to be read twice.
- Angle: The site's whole argument is one sentence, and everything else on the page exists to
  prove it. So the video is that argument, built in front of you: the nine-layer reference
  architecture assembles layer by layer, the accountability layer arrives in a different
  colour on purpose, and then a real click opens the evidence behind it. Not a portfolio
  tour. The thesis, assembled.
- Hook: black ground, "Most organisations don't have an AI problem." holds, then
  "They have a trust problem." lands beneath it with "trust" in accent blue.
- Outro / punchline: "I turn AI strategy into deployed systems." then "brandenmillward.com".
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Em dashes in on-screen prose. This is a hard house rule for this project's copy
    (see CLAUDE.md). Use a comma, colon or full stop. The mono middot separators inside
    node labels ("AGENTS · ROLES & HANDOFFS") are the site's own idiom and must stay.
  - Recolouring GUARDRAILS / GOVERNANCE to the accent blue. On this site ochre is semantic:
    it marks where a human stays answerable. That distinction is the point of the video.

## Visual Identity
- Background: `#0a0c16`
- Background 2 (panels, cards): `#0f1220`
- Text: `#e6e9f5`
- Muted text: `#9aa2bd`
- Faint text: `#7b83a3`
- Accent: `#8b9dff`
- Accent soft (fills): `rgba(139,157,255,.10)`
- Accountable (control layer only): `#e0a458`
- Accountable soft: `rgba(224,164,88,.12)`
- Line / border: `rgba(255,255,255,.1)`
- Display font: Archivo, weight 600, `font-stretch: 92%`, `letter-spacing: -.015em`
- Body font: Newsreader
- Mono font: JetBrains Mono, used for every node label and HUD label, uppercase, wide tracking
- Ship all three as local `@font-face` files in `assets/fonts/` (lint requires an in-file
  `@font-face` to a shipped local file for any named family).
- Visual references from the project:
  - `.net-svg` node rects: 4px corner radius, 1px `rgba(255,255,255,.1)` stroke, dark fill
  - thin converging wires between layers, same line colour
  - `.hud` labels: JetBrains Mono, ~0.72rem, letter-spacing `.1em`, uppercase, muted
  - `.net-detail`: a bordered panel under the drawing with a mono label and a prose line

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. The claim — 4.5s (0.0-4.5) — the two-line hook, nothing else on screen
2. The architecture assembles — 7.0s (4.5-11.5) — nine nodes in five grouped reveals, top to
   bottom in flow order, the GUARDRAILS + GOVERNANCE pair arriving in ochre
3. Select a layer — 5.5s (11.5-17.0) — a cursor clicks GOVERNANCE, the node goes active, the
   detail panel swaps to its real evidence line
4. The line — 4.2s (17.0-21.2) — the site h1 at full scale, then the domain

## Audio
- Audio role: sparse professional accents over a low music bed
- Audio arc: barely present under the hook, lifts slightly as the architecture accumulates,
  steady through the interaction, carries the outro on one strong cue, fades to silence.
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (109.96 BPM, 60.0s)
- Music treatment: start 0.0s, low throughout, never louder than the type, fade out by 21.2s.
- Music cue guidance: bundled preset at
  `~/.claude/skills/brag/assets/music/cues/happy-beats-business-moves-vol-10-by-ende-dot-app.music-cues.json`.
  Beat grid ~0.545s apart. One strong cue in window at **20.19s** — lock the outro domain
  settle to it. For Scene 2's five grouped reveals use **every other beat** (~1.09s), not the
  raw grid: these are text labels and the reading floor governs.
- Audio-reactive treatment: subtle. Wire music energy to the diagram's wire opacity or node
  presence so the drawing breathes. No waveform bars, no equalizers, no strobing, nothing on
  the type.
- Audio-coupled moments:
  - Scene 2, each of the five grouped node reveals — beat-grid reveal, one soft tick each
  - Scene 2, the ochre GUARDRAILS + GOVERNANCE pair — a warmer, slightly fuller cue than the
    other four, because this arrival means something the others do not
  - Scene 3, cursor down on GOVERNANCE — a real, dry UI click
  - Scene 3, detail panel swap — a very soft cue, nothing on the sentence itself
  - Scene 4, domain settle — beat-locked to 20.19s, no sound of its own
- SFX selection guidance: roughly five cues in the whole video. Sound only where something
  actually moves. Prefer the `ui/` switch and click family for the node seats and the cursor
  click. No whooshes, no risers, no impact hits, no logo sting.
- SFX analysis guidance: `~/.claude/skills/brag/assets/sfx/sfx-analysis.md` if present. Prefer
  low high-frequency-risk files: this tone is restrained and repeated ticks must not get sharp.
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density and volume after the
  visual animation exists.
- Audio files: copy the chosen music and any selected SFX into
  `brag-output/composition/assets/`.

## Hyperframes Instructions
Load `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`
and `hyperframes-cli`. This is the /brag workflow: do not enter the `hyperframes` entry-point
intent interview and do not route into the generic promo / launch-video workflow. Prefer native
Hyperframes conventions over anything in /brag.

Requirements:
- Show at least one real UI, copy, or visual element from the source project. The nine-layer
  diagram and its detail panel are that element, recreated faithfully, not reinterpreted.
- Keep all text readable in the final render. Reading floors: short mono label ~0.8s settled,
  a sentence ~0.3s per word.
- Keep the video within 15-25 seconds.
- Include the planned music and SFX layer.
- Treat the /brag audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual
  animation exists.
- Treat music cue metadata as optional timing hints. Ignore any cue that hurts readability,
  scene pacing, or the product story.
- Lock the outro settle to the 20.19s strong cue (±0.15s), mark it `// beat-locked`.
  Snap Scene 2's five grouped reveals to every other beat (±0.10s), mark them `// beat-grid`.
- Use local assets for audio, fonts, and any runtime dependency.
- Run `npx hyperframes check` before render. It is brag's single gate.
