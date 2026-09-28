"""Check that every guide chapter's prose survived conversion into src/content/guide.

Usage: python3 scripts/check-fidelity.py <master.pdf>

Compares 6-word shingles of the PDF text for pages 5-45 against the markdown.
Diagram labels are expected to be missing because widgets replace the ASCII art.
"""

import re
import subprocess
import sys
from pathlib import Path

GUIDE = Path(__file__).resolve().parent.parent / "src/content/guide"


def words(text):
    text = text.replace("**", "").replace("|", " ")
    text = re.sub(r"-\n", "-", text)
    return re.findall(r"[a-z0-9]+", text.lower())


def shingles(ws, n=6):
    return {" ".join(ws[i : i + n]) for i in range(len(ws) - n + 1)}


def main():
    pdf = sys.argv[1]
    source = subprocess.run(["pdftotext", "-f", "5", "-l", "45", pdf, "-"], capture_output=True, text=True, check=True).stdout
    source = re.sub(r"STUDY NOTES \| \d+|PSYCH 5612 / MIDTERM 1", " ", source)
    md = " ".join(p.read_text() for p in sorted(GUIDE.glob("*.md")))
    meta = (GUIDE / "meta.json").read_text()
    have = shingles(words(md + " " + meta))
    for page in range(5, 46):
        text = subprocess.run(["pdftotext", "-f", str(page), "-l", str(page), pdf, "-"], capture_output=True, text=True, check=True).stdout
        text = re.sub(r"STUDY NOTES \| \d+|PSYCH 5612 / MIDTERM 1", " ", text)
        want = shingles(words(text))
        missing = want - have
        ratio = 1 - len(missing) / max(len(want), 1)
        flag = "" if ratio > 0.97 else "  <-- check"
        print(f"page {page:2d}: {ratio:6.1%} of {len(want):4d} shingles present{flag}")
        if flag:
            for s in sorted(missing)[:12]:
                print("    missing:", s)


if __name__ == "__main__":
    main()
