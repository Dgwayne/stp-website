#!/usr/bin/env python3
"""Turn an announcement body.md into a Facebook comment thread.

Facebook comments are plain text (markdown shows up as literal asterisks and
hashes), cap at 8000 characters, and take exactly ONE image each. So a body
with 14 screenshots cannot be one comment - it has to be a thread, split so
that every image gets its own comment alongside the text it illustrates.

    python scripts/announcement-to-facebook.py "path/to/body.md"

Writes a facebook-thread/ folder holding NN.txt + NN-image.jpg pairs. Post
them in order: paste NN.txt, attach NN-image.jpg. Images are emitted as JPEG
because Facebook's uploader does not reliably accept WebP.

Reads the LOCAL body.md (the one with media/ paths), not body.published.md,
because it needs the image files on disk to copy alongside each comment.
"""
import argparse
import io
import os
import re
import shutil
import sys

from PIL import Image

COMMENT_CAP = 8000  # Facebook's per-comment character limit


def strip_markdown(text):
    """Flatten inline markdown - Facebook renders none of it."""
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"\[(.+?)\]\((.+?)\)", r"\1 (\2)", text)
    return text.strip()


def parse(md):
    """Walk the body into blocks: ('head'|'text'|'bullet'|'image', value)."""
    blocks = []
    for line in md.splitlines():
        line = line.rstrip()
        if not line:
            continue
        m = re.match(r"!\[\]\(media/([^)]+)\)", line)
        if m:
            blocks.append(("image", m.group(1)))
        elif line.startswith("#"):
            level = len(line) - len(line.lstrip("#"))
            blocks.append(("head", (level, strip_markdown(line.lstrip("# ")))))
        elif line.startswith("- "):
            blocks.append(("bullet", strip_markdown(line[2:])))
        else:
            blocks.append(("text", strip_markdown(line)))
    return blocks


def build_comments(blocks):
    """One comment per image, plus a comment for any trailing imageless text.

    A comment breaks when a heading starts a new section, or when a second
    image turns up in a comment that already has one.
    """
    comments = []
    cur = {"section": None, "lines": [], "image": None}

    def flush():
        if cur["lines"] or cur["image"]:
            comments.append(
                {"section": cur["section"], "lines": list(cur["lines"]), "image": cur["image"]}
            )
        cur["lines"] = []
        cur["image"] = None

    for kind, val in blocks:
        if kind == "head":
            level, txt = val
            flush()
            if level == 1:
                cur["section"] = None
                cur["lines"] = [txt.upper()]
            else:
                cur["section"] = txt.upper()
                cur["lines"] = [txt.upper()]
        elif kind == "image":
            if cur["image"] is not None:
                # already carrying an image, so this one starts a new comment
                carried = cur["section"]
                flush()
                cur["section"] = carried
            cur["image"] = val
        elif kind == "bullet":
            cur["lines"].append("• " + val)
        else:
            cur["lines"].append(val)
    flush()

    # A section that ENDS on an image leaves that image with no text of its
    # own, because text accumulates until an image closes the comment. Pull
    # the previous comment's last line down to it: in practice that line is
    # exactly the sentence the trailing image illustrates. Never take a
    # section title, and never strip a comment down to nothing.
    for i in range(1, len(comments)):
        c, prev = comments[i], comments[i - 1]
        if c["image"] and not c["lines"] and len(prev["lines"]) > 1:
            candidate = prev["lines"][-1]
            if candidate != (prev["section"] or ""):
                c["lines"].append(prev["lines"].pop())
    return comments


def render(c):
    out, prev_bullet = [], False
    for ln in c["lines"]:
        bullet = ln.startswith("•")
        # blank line between paragraphs, but keep bullet runs tight
        if out and not (bullet and prev_bullet):
            out.append("")
        out.append(ln)
        prev_bullet = bullet
    return "\n".join(out).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("body", help="body.md with local media/ paths")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    src_dir = os.path.dirname(os.path.abspath(args.body))
    out = args.out or os.path.join(src_dir, "facebook-thread")
    media = os.path.join(src_dir, "media")
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)

    md = io.open(args.body, encoding="utf-8").read()
    comments = build_comments(parse(md))

    total = 0
    over = []
    for i, c in enumerate(comments, 1):
        text = render(c)
        if not text and c["image"]:
            text = (c["section"] or "").strip()
        body = "%s\n\n(%d/%d)" % (text, i, len(comments))
        io.open(os.path.join(out, "%02d.txt" % i), "w", encoding="utf-8", newline="\r\n").write(body)

        img = ""
        if c["image"]:
            src = os.path.join(media, c["image"])
            if os.path.exists(src):
                # Facebook's uploader accepts JPEG and PNG reliably; WebP
                # support is inconsistent and fails at the attach step, so
                # hand it a JPEG. Facebook re-encodes everything anyway.
                dest = "%02d-image.jpg" % i
                Image.open(src).convert("RGB").save(
                    os.path.join(out, dest), "JPEG", quality=92, optimize=True
                )
                img = "  + " + dest
            else:
                img = "  + MISSING " + c["image"]

        if len(body) > COMMENT_CAP:
            over.append(i)
        total += len(body)
        first = text.splitlines()[0] if text else ""
        print("%02d  %5d chars  %-46s%s" % (i, len(body), first[:46], img))

    print("\n%d comments, %d chars total -> %s" % (len(comments), total, out))
    if over:
        print("OVER the %d-char cap: %s" % (COMMENT_CAP, over))
        sys.exit(1)
    print("all comments under the %d-char cap" % COMMENT_CAP)


if __name__ == "__main__":
    main()
