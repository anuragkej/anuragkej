"""Convert the study-guide pages of the master PDF into per-chapter markdown drafts.

Usage: python3 scripts/convert-guide.py <master.pdf> <out-dir>

Headings come from the PDF bookmarks, so section titles match the guide exactly.
Tables and ASCII diagrams are emitted inside ```raw fences for hand conversion.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

from pypdf import PdfReader

GUIDE_LAST_PAGE = 45
NOISE = [
    re.compile(r"^\s*STUDY NOTES \| \d+\s*$"),
    re.compile(r"^\s*PSYCH 5612 / MIDTERM 1\s*$"),
]
LEAD = re.compile(r"^([A-Z][^.:\[\]]{2,48}):\s")
SENTENCE_END = tuple('.:?!”")]')


def outline(reader):
    chapters = []

    def walk(items, depth):
        for item in items:
            if isinstance(item, list):
                walk(item, depth + 1)
                continue
            page = reader.get_destination_page_number(item)
            if page is None or page + 1 > GUIDE_LAST_PAGE:
                continue
            if depth == 0:
                m = re.match(r"^(\d+)\. (.*)$", item.title)
                if m:
                    chapters.append({"number": int(m[1]), "title": m[2], "sections": []})
            elif depth == 1 and chapters:
                chapters[-1]["sections"].append(item.title)

    walk(reader.outline, 0)
    return chapters


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def is_table_line(line):
    return len(re.findall(r"\S {3,}\S", line.rstrip())) >= 1 and not line.startswith("  ") or bool(
        re.search(r"\S {6,}\S", line.rstrip())
    )


def split_chapters(text, chapters):
    lines = [l for l in text.split("\n") if not any(p.match(l) for p in NOISE)]
    starts = []
    for ch in chapters:
        head = f"{ch['number']}. "
        first_words = ch["title"].split()[:3]
        for i, l in enumerate(lines):
            if l.startswith(head) and norm(l[len(head):]).split()[:3] == first_words and "  " not in l.strip():
                if i > 60:
                    starts.append(i)
                    break
        else:
            raise SystemExit(f"chapter start not found: {ch['number']} {ch['title']}")
    bodies = []
    for idx, start in enumerate(starts):
        end = starts[idx + 1] if idx + 1 < len(starts) else len(lines)
        body = lines[start:end]
        title_words = len(chapters[idx]["title"].split())
        consumed = len(body[0][len(f"{chapters[idx]['number']}. "):].split())
        k = 1
        while consumed < title_words:
            consumed += len(body[k].split())
            k += 1
        bodies.append(body[k:])
    return bodies


def blocks(body, sections):
    heading_set = {norm(s) for s in sections}
    out = []
    buf = []
    kind = None

    def flush():
        nonlocal buf, kind
        if buf:
            out.append((kind, buf))
        buf, kind = [], None

    for raw in body:
        line = raw.rstrip()
        s = line.strip()
        if not s:
            flush()
            continue
        if norm(s) in heading_set and kind != "table":
            flush()
            out.append(("heading", [norm(s)]))
            continue
        if kind != "table" and is_table_line(line) and not s.startswith(("•",)) and not re.match(r"^\d+\. ", s):
            if kind != "table":
                flush()
                kind = "table"
            buf.append(line)
            continue
        if kind == "table":
            buf.append(line)
            continue
        if s.startswith("• "):
            flush()
            kind = "bullet"
            buf = [s[2:]]
            continue
        m = re.match(r"^(\d+)\. (.*)$", s)
        if m and not line.startswith(" "):
            flush()
            kind = "number"
            buf = [s]
            continue
        if kind in ("bullet", "number") and line.startswith(" "):
            buf.append(s)
            continue
        if kind in ("bullet", "number"):
            flush()
        kind = kind or "para"
        buf.append(s)
    flush()
    return out


def join(lines):
    text = ""
    for l in lines:
        l = re.sub(r" {2,}", " ", l.strip())
        if not text:
            text = l
        elif text.endswith("-") and text[-2:-1].isalpha():
            text += l
        else:
            text += " " + l
    return text


def merge_page_breaks(bs):
    merged = []
    for kind, lines in bs:
        if (
            merged
            and kind == "para"
            and merged[-1][0] in ("para", "bullet", "number")
            and not join(merged[-1][1]).endswith(SENTENCE_END)
            and lines[0][:1].islower()
        ):
            merged[-1] = (merged[-1][0], merged[-1][1] + lines)
            continue
        merged.append((kind, lines))
    return merged


def bold_lead(text):
    m = LEAD.match(text)
    if not m or len(m[1].split()) > 4 or m[1].startswith(("This ", "The video", "Its ")):
        return text
    return f"**{m[1]}:** " + text[m.end():]


def column_starts(header):
    return [0] + [m.end() for m in re.finditer(r" {2,}", header.rstrip()) if m.end() < len(header.rstrip())]


def to_table(lines):
    lines = [l for l in lines if l.strip()]
    starts = column_starts(lines[0])
    rows = []
    for line in lines:
        cells = [line[a:b].strip() if b else line[a:].strip() for a, b in zip(starts, starts[1:] + [None])]
        if rows and not cells[0]:
            rows[-1] = [f"{p} {c}".strip() for p, c in zip(rows[-1], cells)]
        else:
            rows.append(cells)
    head, *body = rows
    fmt = lambda r: "| " + " | ".join(c.replace("|", "\\|") for c in r) + " |"
    return "\n".join([fmt(head), "| " + " | ".join("---" for _ in head) + " |"] + [fmt(r) for r in body])


def merge_tables(bs):
    merged = []
    for kind, lines in bs:
        if kind == "table" and merged and merged[-1][0] == "table":
            merged[-1] = ("table", merged[-1][1] + lines)
            continue
        merged.append((kind, lines))
    return merged


def render(chapter, body):
    bs = merge_tables(merge_page_breaks(blocks(body, chapter["sections"])))
    sources = ""
    recall = ""
    md = []
    for kind, lines in bs:
        text = join(lines)
        if kind == "para" and text.startswith("[Source") and not md:
            sources = text.strip("[]")
            continue
        if kind == "para" and text.startswith("Recall:"):
            recall = text[len("Recall:"):].strip()
            continue
        if kind == "heading":
            md.append(f"## {text}")
        elif kind == "table":
            md.append(to_table(lines))
        elif kind == "bullet":
            md.append(f"- {bold_lead(text)}")
        elif kind == "number":
            md.append(text)
        else:
            md.append(bold_lead(text))
    out = []
    for i, block in enumerate(md):
        is_item = block.startswith("- ") or re.match(r"^\d+\. ", block)
        prev_item = i > 0 and (md[i - 1].startswith("- ") or re.match(r"^\d+\. ", md[i - 1]))
        out.append(("\n" if is_item and prev_item else "\n\n") + block if out else block)
    return "".join(out).strip() + "\n", sources, recall


def main():
    pdf, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(pdf))
    chapters = outline(reader)
    text = subprocess.run(
        ["pdftotext", "-f", "1", "-l", str(GUIDE_LAST_PAGE), "-layout", str(pdf), "-"],
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    meta = []
    for chapter, body in zip(chapters, split_chapters(text, chapters)):
        md, sources, recall = render(chapter, body)
        name = f"{chapter['number']:02d}.md"
        (out_dir / name).write_text(md)
        meta.append({"number": chapter["number"], "title": chapter["title"], "sources": sources, "recall": recall, "sections": chapter["sections"]})
    (out_dir / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    print(f"wrote {len(meta)} chapters to {out_dir}")


if __name__ == "__main__":
    main()
