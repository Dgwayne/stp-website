#!/usr/bin/env python3
"""Turn a Word "What's New" doc into an announcement body, images and all.

Pasting from Word into the admin editor loses every picture: Word puts them on
the clipboard as local file:// temp paths (msohtmlclip) that a browser is not
allowed to read, so only the text survives. This script does what the paste
cannot - it pulls the images straight out of the .docx, shrinks them to card
size, uploads them to B2 through /api/announcements/upload, and emits markdown
whose image links are public URLs.

    $env:STP_ADMIN_PASSWORD = "<admin page password>"
    python scripts/docx-to-announcement.py "C:\\path\\Whats New.docx"

Then open /admin/announcements, switch the body editor to Source mode, and
paste body.published.md over the contents.

Requires: pip install pillow requests   (local authoring only, no Node deps)
"""
import argparse
import io
import mimetypes
import os
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

WORKER_BODY_CAP = 20000  # announcements-worker sanitizeItem rejects longer bodies


def run_is(pr, tag):
    """True when a run property is on. Word writes <w:b w:val="false"/> to
    CANCEL bold inherited from a style, so presence alone is not enough -
    reading it as bold turns the entire document bold."""
    if pr is None:
        return False
    e = pr.find(W + tag)
    if e is None:
        return False
    return (e.get(W + "val") or "true").lower() not in ("0", "false", "off")


def paragraph_text(p):
    """Paragraph text with bold/italic kept, merging adjacent like-formatted
    runs so we emit one bold phrase rather than one bold word each."""
    spans = []
    for r in p.iter(W + "r"):
        txt = "".join(t.text or "" for t in r.iter(W + "t"))
        if not txt:
            continue
        pr = r.find(W + "rPr")
        fmt = (run_is(pr, "b"), run_is(pr, "i"))
        if spans and spans[-1][0] == fmt:
            spans[-1][1] += txt
        else:
            spans.append([fmt, txt])

    out = []
    for (bold, italic), txt in spans:
        mark = ("**" if bold else "") + ("*" if italic else "")
        if not mark or not txt.strip():
            out.append(txt)
            continue
        lead = txt[: len(txt) - len(txt.lstrip())]
        trail = txt[len(txt.rstrip()) :]
        out.append(lead + mark + txt.strip() + mark[::-1] + trail)
    return "".join(out)


def convert(src, outdir):
    """docx -> (markdown with local image paths, image filenames in order)."""
    media = os.path.join(outdir, "media")
    os.makedirs(media, exist_ok=True)
    for f in os.listdir(media):
        os.remove(os.path.join(media, f))

    z = zipfile.ZipFile(src)
    rels = {
        r.get("Id"): r.get("Target")
        for r in ET.fromstring(z.read("word/_rels/document.xml.rels"))
    }

    lines, images = [], []

    def blank():
        if lines and lines[-1] != "":
            lines.append("")

    for p in ET.fromstring(z.read("word/document.xml")).iter(W + "p"):
        for blip in p.iter(A + "blip"):
            target = rels.get(blip.get(R + "embed"))
            if not target:
                continue
            name = "img%02d%s" % (len(images) + 1, os.path.splitext(target)[1])
            with open(os.path.join(media, name), "wb") as fh:
                fh.write(z.read("word/" + target))
            images.append(name)
            blank()
            lines += ["![](media/" + name + ")", ""]

        text = paragraph_text(p).strip()
        if not text:
            continue

        pr = p.find(W + "pPr")
        ps = pr.find(W + "pStyle") if pr is not None else None
        style = ps.get(W + "val") if ps is not None else ""
        listed = pr is not None and pr.find(W + "numPr") is not None

        if style == "Title":
            blank()
            lines += ["# " + text, ""]
        elif style.startswith("Heading"):
            level = min(int(re.sub(r"\D", "", style) or 1) + 1, 6)
            blank()
            lines += ["#" * level + " " + text, ""]
        elif listed or style == "ListParagraph":
            lines.append("- " + text)
        else:
            blank()
            lines += [text, ""]

    md = re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip() + "\n"
    return md, images


def compress(outdir, images, md, max_width, quality):
    """Word embeds full-resolution screenshots, but the announcement card is a
    phone-width modal and these load on app launch, so re-encode to WebP."""
    from PIL import Image

    media = os.path.join(outdir, "media")
    before = after = 0
    out_names = []
    for name in images:
        path = os.path.join(media, name)
        im = Image.open(path).convert("RGB")
        if im.width > max_width:
            height = round(im.height * max_width / im.width)
            im = im.resize((max_width, height), Image.LANCZOS)
        webp = os.path.splitext(name)[0] + ".webp"
        im.save(os.path.join(media, webp), "WEBP", quality=quality, method=6)
        before += os.path.getsize(path)
        after += os.path.getsize(os.path.join(media, webp))
        os.remove(path)
        md = md.replace("](media/" + name + ")", "](media/" + webp + ")")
        out_names.append(webp)
    print("  images %.2f MB -> %.2f MB" % (before / 1048576, after / 1048576))
    return md, out_names


def upload(md, outdir, images, base, password):
    import requests

    media = os.path.join(outdir, "media")
    for i, name in enumerate(images, 1):
        path = os.path.join(media, name)
        ctype = mimetypes.guess_type(path)[0] or "image/webp"
        with open(path, "rb") as fh:
            r = requests.post(
                base + "/api/announcements/upload",
                headers={"x-admin-password": password},
                files={"file": (name, fh, ctype)},
                timeout=120,
            )
        if r.status_code != 200:
            sys.exit(
                "  [%d/%d] %s FAILED %d: %s"
                % (i, len(images), name, r.status_code, r.text[:300])
            )
        md = md.replace("](media/" + name + ")", "](" + r.json()["url"] + ")")
        print("  [%d/%d] %s" % (i, len(images), name))
    return md


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("docx")
    ap.add_argument("--out", default="announcement-build")
    ap.add_argument("--max-width", type=int, default=1200)
    ap.add_argument("--quality", type=int, default=82)
    ap.add_argument(
        "--site", default=os.environ.get("STP_SITE", "https://spottertools.pro")
    )
    ap.add_argument(
        "--no-upload",
        action="store_true",
        help="convert and compress only, leaving local media/ paths",
    )
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    print("converting " + os.path.basename(args.docx))
    md, images = convert(args.docx, args.out)
    print("  %d chars, %d images" % (len(md), len(images)))

    md, images = compress(args.out, images, md, args.max_width, args.quality)
    local = os.path.join(args.out, "body.md")
    io.open(local, "w", encoding="utf-8", newline="\n").write(md)

    if args.no_upload:
        print("\nwrote " + local + " (local image paths, upload skipped)")
        return

    password = os.environ.get("STP_ADMIN_PASSWORD")
    if not password:
        sys.exit("set STP_ADMIN_PASSWORD (the admin page password), or pass --no-upload")

    print("uploading to " + args.site)
    md = upload(md, args.out, images, args.site, password)
    published = os.path.join(args.out, "body.published.md")
    io.open(published, "w", encoding="utf-8", newline="\n").write(md)

    over = "  WARNING: over the %d-char worker cap" % WORKER_BODY_CAP
    print(
        "\nwrote %s (%d chars)%s"
        % (published, len(md), over if len(md) > WORKER_BODY_CAP else "")
    )
    print("paste it into /admin/announcements with the body editor in Source mode")


if __name__ == "__main__":
    main()
