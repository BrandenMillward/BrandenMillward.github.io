# Post cards

Three images per post, doing three different jobs. They are separate files because
one asset cannot serve both, and the difference is not cosmetic.

| File | Size | Where it is read |
|---|---|---|
| `social-card.html` | 1600×836 | `og:image`, and X. About **550px** wide in a feed |
| `portrait-card.html` | 1200×1500 | uploaded as a native LinkedIn image. 4:5 takes far more vertical space in the feed |
| `inline-card.html` | 1400×440 | inside the article, displayed at the **60ch measure**, about 700px |

**LinkedIn no longer renders large link previews.** A shared URL gets a compact
card, a thumbnail beside the title, whatever the image is. Confirmed by testing
1200×627 and 1600×836: both compact, in a clean composer, after a Post Inspector
re-scrape. The Post Inspector still shows the old large format, so it disagrees
with what actually posts; trust the composer. To get a full-width image on
LinkedIn, upload `portrait-card.png` as a native image and leave the URL in the
body text. `og:image` still matters for every other platform, and for anyone
pasting the link elsewhere.

Portrait can carry the citation lines that the social card cannot: at 1200 wide
displayed near 550px, 28px mono lands around 13px.

## The rules that matter

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

The sources are laid out at CSS sizes; the device scale factor is what makes the
social card come out at 1600 wide from a 1200px layout.

```bash
CHROME=/path/to/chrome   # or: chromium, google-chrome
R="--headless --disable-gpu --hide-scrollbars --virtual-time-budget=4000"

# social 1600x836   layout 1200x627, dsf 1.3333, window 627+87=714, crop 627*1.3333
"$CHROME" $R --force-device-scale-factor=1.3333 --window-size=1200,714 \
  --screenshot=raw.png "file://$PWD/social-card.html"
python3 crop-png.py raw.png ../../images/<slug>-social-1600.png 836

# portrait 1200x1500   window 1500+87=1587
"$CHROME" $R --force-device-scale-factor=1 --window-size=1200,1587 \
  --screenshot=raw.png "file://$PWD/portrait-card.html"
python3 crop-png.py raw.png ../../images/<slug>-portrait.png 1500

# in-article 1400x440   window 440+87=527
"$CHROME" $R --force-device-scale-factor=1 --window-size=1400,527 \
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
