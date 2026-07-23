#!/usr/bin/env python3
"""Convert new/changed raster images to WebP and rewrite HTML <img> tags
to <picture> elements with a WebP source and the original as fallback.

Invoked by .github/workflows/optimize-images.yml with the list of
changed image paths (relative to the repo root) on stdin, one per line.
"""
import pathlib
import re
import shutil
import subprocess
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
RASTER_EXTS = {".jpg", ".jpeg", ".png", ".gif"}
QUALITY = "85"


def convert_to_webp(src: pathlib.Path) -> pathlib.Path | None:
    webp_path = src.with_suffix(".webp")
    ext = src.suffix.lower()

    if ext == ".gif":
        tool = shutil.which("gif2webp")
        if not tool:
            print(f"::warning::gif2webp not found, skipping {src}")
            return None
        cmd = [tool, "-q", QUALITY, "-m", "6", str(src), "-o", str(webp_path)]
    else:
        tool = shutil.which("cwebp")
        if not tool:
            print(f"::warning::cwebp not found, skipping {src}")
            return None
        cmd = [tool, "-q", QUALITY, "-quiet", str(src), "-o", str(webp_path)]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"::warning::failed to convert {src}: {result.stderr.strip()}")
        return None

    print(f"Converted {src} -> {webp_path}")
    return webp_path


def update_html_references(original_rel: str, webp_rel: str) -> None:
    original_rel = original_rel.replace("\\", "/")
    webp_rel = webp_rel.replace("\\", "/")
    marker = f'srcset="{webp_rel}"'

    pattern = re.compile(
        r'<img\s+([^>]*?)src="' + re.escape(original_rel) + r'"([^>]*?)\s*/?>'
    )

    for html_file in REPO_ROOT.glob("*.html"):
        text = html_file.read_text(encoding="utf-8")
        if marker in text:
            continue  # already wrapped in a <picture> for this image

        def repl(m: re.Match) -> str:
            pre, post = m.group(1), m.group(2)
            img_tag = f'<img {pre}src="{original_rel}"{post} />'
            return (
                "<picture>\n"
                f'              <source srcset="{webp_rel}" type="image/webp" />\n'
                f"              {img_tag}\n"
                "            </picture>"
            )

        new_text, count = pattern.subn(repl, text)
        if count:
            html_file.write_text(new_text, encoding="utf-8")
            print(f"Updated {count} reference(s) to {original_rel} in {html_file.name}")


def main() -> int:
    changed = [line.strip() for line in sys.stdin if line.strip()]
    if not changed:
        print("No changed raster images to process.")
        return 0

    for rel_path in changed:
        src = REPO_ROOT / rel_path
        if src.suffix.lower() not in RASTER_EXTS:
            continue
        if not src.is_file():
            continue

        webp_path = convert_to_webp(src)
        if webp_path is None:
            continue

        webp_rel = webp_path.relative_to(REPO_ROOT).as_posix()
        update_html_references(rel_path, webp_rel)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
