"""Validate source contracts and (optionally) the generated Jekyll site."""
import argparse
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
START = "<!--START_SECTION:activity-->"
END = "<!--END_SECTION:activity-->"


def validate_source(require_activity=False):
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    assert readme.count(START) == readme.count(END) == 1, "Need exactly one pair of activity markers"
    assert readme.index(START) < readme.index(END), "Activity markers are reversed"
    section = readme.split(START)[1].split(END)[0].strip()
    assert section, "Activity section is empty"
    if require_activity:
        assert "Activity collection has not run yet" not in section, "Activity action did not replace seed text"
        assert re.search(r"(?m)^\s*(?:\d+\.|[-*])\s+", section), "No generated activity list found"
    index = (ROOT / "index.md").read_text(encoding="utf-8")
    assert index.startswith("---\n"), "Homepage needs YAML front matter"
    assert "{% include_relative README.md %}" in index, "Homepage must include README"
    assert not (ROOT / "index.html").exists(), "index.html would override index.md"
    for target in re.findall(r"\]\(([^)]+)\)", readme):
        if not re.match(r"(?:https?://|#|mailto:)", target):
            assert (ROOT / target.split("#")[0]).is_file(), f"Broken source link: {target}"
    for path in ["_config.yml", "_layouts/default.html", "assets/site.css", ".github/workflows/activity-log.yml"]:
        assert (ROOT / path).is_file(), f"Missing required file: {path}"
    return section


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])


def validate_site(folder):
    text = (folder / "index.html").read_text(encoding="utf-8")
    assert "include_relative" not in text, "Liquid include was not expanded"
    assert "DevOps Activity Observatory" in text and "Recent activity" in text
    assert (folder / "assets/site.css").is_file()
    assert "<html lang=\"en\">" in text and 'name="viewport"' in text
    page = Page()
    page.feed(text)
    for link in page.links:
        if link.startswith("#"):
            assert link[1:] in page.ids, f"Broken fragment: {link}"
    assert START in text and END in text, "Activity section missing in rendered site"
    print("Generated HTML, navigation and assets: PASS")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--require-activity", action="store_true")
    parser.add_argument("--site", type=Path)
    args = parser.parse_args()
    validate_source(args.require_activity)
    print("README markers, content, include and source links: PASS")
    if args.site:
        validate_site(args.site)
