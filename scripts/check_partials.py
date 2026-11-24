#!/usr/bin/env python3
"""Check that the shared header and footer are byte-identical on every page.

The site is plain static HTML, so the <header> and <footer> blocks are copied
into each page by hand. This script fails if any page's copy has drifted.

Usage (from the repo root):
    python scripts/check_partials.py

Exit code 0 means every page matches; 1 means at least one page differs or is
missing a block. Redirect stubs (pages with a meta refresh) are skipped.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BLOCKS = {
    "header": re.compile(rb"<header\b.*?</header>", re.S),
    "footer": re.compile(rb"<footer\b.*?</footer>", re.S),
}
REFERENCE = "index.html"


def is_stub(data: bytes) -> bool:
    return b'http-equiv="refresh"' in data


def main() -> int:
    pages = sorted(p for p in ROOT.glob("*.html"))
    ref_data = (ROOT / REFERENCE).read_bytes()
    reference = {}
    for name, rx in BLOCKS.items():
        m = rx.search(ref_data)
        if not m:
            print(f"FAIL {REFERENCE}: no <{name}> block found")
            return 1
        reference[name] = m.group(0)

    failures = 0
    checked = 0
    for page in pages:
        data = page.read_bytes()
        if is_stub(data):
            continue
        checked += 1
        for name, rx in BLOCKS.items():
            found = rx.findall(data)
            if len(found) != 1:
                print(f"FAIL {page.name}: expected one <{name}> block, found {len(found)}")
                failures += 1
            elif found[0] != reference[name]:
                print(f"FAIL {page.name}: <{name}> differs from {REFERENCE}")
                failures += 1

    if failures:
        print(f"{failures} problem(s) across {checked} pages.")
        return 1
    print(f"OK: header and footer are byte-identical across {checked} pages "
          f"(redirect stubs skipped).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
