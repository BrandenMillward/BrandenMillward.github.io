# Post cards

Two images per post, doing two different jobs. They are separate files because
one asset cannot serve both, and the difference is not cosmetic.

| File | Size | Where it is read |
|---|---|---|
| `social-card.html` | 1200×627 | `og:image`, seen in a LinkedIn or X feed at about **550px** |
| `inline-card.html` | 1400×440 | inside the article, displayed at the **60ch measure**, about 700px |

## The two rules that matter

**Size the type for where it is read, not for the canvas.** A feed halves a
1200px card, so 14px mono lands near 6px and is a grey smear. The social card
therefore carries five elements: eyebrow, headline, three states, and the line
about what holds anyway. The in-article card can carry the citations
(`SR 26-2, footnote 3`) because it is rendered at 2x and only halved once.
`generate-covers.js` records the same lesson from the project covers: an 11px
label inside a ~300px cover renders around 5px, which nobody can read.

**A changed card needs a new filename.** Scrapers cache `og:image` by URL, so
overwriting the bytes at a path that has already been shared changes nothing
that anyone sees. Publish `foo-social.png`, not new bytes in the old `foo.png`,
and re-run the LinkedIn Post Inspector afterwards.

## Rendering

Headless Chromium, because the site has no build step and this needs real font
rendering. Chrome sizes its screenshot from `--window-size` but lays out against
a viewport about **87px shorter**, so render taller and crop the surplus off.

```bash
CHROME=/path/to/chrome   # or: chromium, google-chrome

# social card: 627 tall viewport needs a 714 window
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=4000 --window-size=1200,714 \
  --screenshot=raw.png "file://$PWD/social-card.html"
python3 crop-png.py raw.png ../../images/<slug>-social.png 627

# in-article card: 440 tall viewport needs a 527 window
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=4000 --window-size=1400,527 \
  --screenshot=raw.png "file://$PWD/inline-card.html"
python3 crop-png.py raw.png ../../images/<slug>-inline.png 440
```

`crop-png.py` is pure stdlib, so it needs no Pillow. Do not commit `raw.png`.

The `.webp` companions are produced automatically by
`.github/workflows/optimize-images.yml` on push, so only the PNGs are committed
here. Reference them as `<picture><source srcset="...webp"><img src="...png"></picture>`.

## Checking before you publish

Render the social card at the width it will actually be read at, and read it:

```bash
python3 - <<'EOF'
import base64, pathlib
b = base64.b64encode(pathlib.Path('../../images/<slug>-social.png').read_bytes()).decode()
pathlib.Path('feedtest.html').write_text(
    f'<body style="margin:0"><img src="data:image/png;base64,{b}" style="width:552px;display:block">')
EOF
```

Screenshot that at 552px wide. If any line is unreadable, remove it rather than
shrinking it. The fix for text nobody can read is fewer things, not smaller ones.

## Fonts

The sources link Google Fonts, which is what the site itself does. A sandbox
without network access to `fonts.gstatic.com` will silently fall back to a
system face and the render will be subtly wrong, so check the output rather than
assuming. In that case, download the woff2 files and inline them as base64
`@font-face` rules for the render only, and do not commit that version.

## Palette

Tokens come from `assets/css/base.css`; do not invent values. `--accountable`
(`#e0a458`) is reserved for the accountability layer and is never decorative. On
these cards it is used only for the line naming what the reader still has to do.
