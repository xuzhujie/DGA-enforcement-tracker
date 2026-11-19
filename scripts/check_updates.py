#!/usr/bin/env python3
"""Monitor official European Commission signals relevant to the DGA.

The reviewed registry in ``src/data/`` is deliberately curated by hand.  This
script only refreshes the bounded, low-confidence news feed at
``public/data/updates.json``; it never changes a matter, phase or legal
conclusion automatically. It combines the official Press Corner RSS with a
small allowlist of Digital Strategy DGA pages.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

RSS_URL = "https://ec.europa.eu/commission/presscorner/api/rss?language=en"
DIGITAL_STRATEGY_URLS = [
    "https://digital-strategy.ec.europa.eu/en/policies/data-governance-act-explained",
    "https://digital-strategy.ec.europa.eu/en/policies/data-intermediary-services",
    "https://digital-strategy.ec.europa.eu/en/library/national-competent-bodies-and-authorities-under-data-governance-act",
    "https://digital-strategy.ec.europa.eu/en/news/commission-calls-18-member-states-comply-eu-data-governance-act",
    "https://digital-strategy.ec.europa.eu/en/news/commission-calls-10-member-states-comply-data-governance-act",
    "https://digital-strategy.ec.europa.eu/en/news/commission-calls-ireland-comply-eu-data-governance-act",
]
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "data" / "updates.json"
MAX_ITEMS = 50

KEYWORD_PATTERNS = [
    re.compile(r"data governance act", re.IGNORECASE),
    re.compile(r"\bDGA\b", re.IGNORECASE),
    re.compile(r"data intermediation", re.IGNORECASE),
    re.compile(r"data altruism", re.IGNORECASE),
    re.compile(r"European Data Innovation Board", re.IGNORECASE),
    re.compile(r"Article\s+31", re.IGNORECASE),
    re.compile(r"non[- ]personal data", re.IGNORECASE),
]


def strip_html(value: str) -> str:
    """Turn a feed description into a compact, readable text summary."""

    without_blocks = re.sub(r"<(?:script|style)\b[^>]*>.*?</(?:script|style)>", " ", value, flags=re.IGNORECASE | re.DOTALL)
    without_tags = re.sub(r"<[^>]+>", " ", without_blocks)
    return re.sub(r"\s+", " ", html.unescape(without_tags)).strip()


def matches_keywords(title: str, summary: str) -> bool:
    text = f"{title} {summary}"
    return any(pattern.search(text) for pattern in KEYWORD_PATTERNS)


def parse_date(value: str) -> str:
    iso_match = re.match(r"^(\d{4}-\d{2}-\d{2})", value or "")
    if iso_match:
        return iso_match.group(1)
    try:
        return parsedate_to_datetime(value).date().isoformat()
    except (TypeError, ValueError, OverflowError):
        return ""


def _find_text(element: ET.Element, local_name: str) -> str:
    for child in element.iter():
        if child.tag.rsplit("}", 1)[-1] == local_name:
            return (child.text or "").strip()
    return ""


def parse_items(xml_bytes: bytes) -> list[dict]:
    """Parse an RSS/Atom-like document and retain only DGA-relevant items."""

    root = ET.fromstring(xml_bytes)
    items: list[dict] = []
    for item in root.iter():
        local_name = item.tag.rsplit("}", 1)[-1]
        if local_name not in {"item", "entry"}:
            continue

        title = strip_html(_find_text(item, "title"))
        link = _find_text(item, "link")
        if not link:
            for child in item.iter():
                if child.tag.rsplit("}", 1)[-1] == "link":
                    link = child.attrib.get("href", "").strip()
                    if link:
                        break
        description = _find_text(item, "description") or _find_text(item, "summary") or _find_text(item, "encoded")
        summary = strip_html(description)
        if not title or not link or not matches_keywords(title, summary):
            continue

        date_value = _find_text(item, "pubDate") or _find_text(item, "published") or _find_text(item, "updated")
        items.append(
            {
                "title": title,
                "link": link,
                "date": parse_date(date_value),
                "summary": summary[:360],
            }
        )
    return items


def parse_page_update(html_bytes: bytes, url: str) -> dict | None:
    """Create one review-queue item from an official Digital Strategy page."""

    document = html_bytes.decode("utf-8", errors="replace")
    title_match = re.search(r"<title\b[^>]*>(.*?)</title>", document, flags=re.IGNORECASE | re.DOTALL)
    title = strip_html(title_match.group(1)) if title_match else ""
    meta_description = ""
    published = ""
    for tag in re.findall(r"<meta\b[^>]*>", document, flags=re.IGNORECASE | re.DOTALL):
        attributes = dict(re.findall(r"([\w:-]+)\s*=\s*['\"]([^'\"]*)['\"]", tag))
        name = attributes.get("name", "").lower()
        property_name = attributes.get("property", "").lower()
        if name in {"description", "og:description"} or property_name == "og:description":
            meta_description = strip_html(attributes.get("content", ""))
        if property_name in {"article:published_time", "article:modified_time"} or name in {"date", "pubdate"}:
            published = attributes.get("content", "")
    time_match = re.search(r"<time\b[^>]*datetime=['\"]([^'\"]+)['\"]", document, flags=re.IGNORECASE)
    if not published and time_match:
        published = time_match.group(1)

    body_summary = strip_html(document)
    summary = meta_description or body_summary
    if not title or not matches_keywords(title, summary):
        return None
    return {"title": title, "link": url, "date": parse_date(published), "summary": summary[:360]}


def fetch_rss(url: str = RSS_URL) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "dga-enforcement-tracker/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def fetch_page(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "dga-enforcement-tracker/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def fetch_official_items(feed_url: str = RSS_URL) -> list[dict]:
    items = parse_items(fetch_rss(feed_url))
    for url in DIGITAL_STRATEGY_URLS:
        try:
            item = parse_page_update(fetch_page(url), url)
        except (OSError, ValueError):
            item = None
        if item:
            items.append(item)
    return items


def merge_items(existing_items: list[dict], incoming_items: list[dict]) -> list[dict]:
    incoming_by_link = {item.get("link"): item for item in incoming_items if item.get("link")}
    known_links = set(incoming_by_link)
    merged = []
    for item in existing_items:
        link = item.get("link")
        if link in incoming_by_link:
            merged.append({**item, **incoming_by_link[link]})
        else:
            merged.append(item)
    for item in incoming_items:
        link = item.get("link")
        if not link or link not in known_links:
            continue
        known_links.remove(link)
        if not any(existing.get("link") == link for existing in existing_items):
            merged.append(item)
    merged.sort(key=lambda item: item.get("date", ""), reverse=True)
    return merged[:MAX_ITEMS]


def build_payload(items: list[dict], source: str = RSS_URL, updated_at: str | None = None) -> dict:
    return {
        "updated_at": updated_at or datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": source,
        "items": items[:MAX_ITEMS],
    }


def write_github_outputs(*, count: int, changed: bool, new_items: list[dict], changed_items: list[dict]) -> None:
    output_path = os.environ.get("GITHUB_OUTPUT")
    if not output_path:
        return
    with Path(output_path).open("a", encoding="utf-8") as output:
        output.write(f"count={count}\n")
        output.write(f"changed={'true' if changed else 'false'}\n")
        output.write(f"new_count={len(new_items)}\n")
        output.write(f"updated_count={len(changed_items) - len(new_items)}\n")
        output.write("changed_items_json<<DGA_ITEMS\n")
        output.write(json.dumps(changed_items, ensure_ascii=False))
        output.write("\nDGA_ITEMS\n")


def _read_existing() -> dict:
    if not OUTPUT.exists():
        return {"items": []}
    try:
        return json.loads(OUTPUT.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"items": []}


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh the DGA official updates feed")
    parser.add_argument("--feed-file", type=Path, help="Read an RSS fixture instead of using the network")
    parser.add_argument("--feed-url", default=RSS_URL, help="Official RSS endpoint")
    parser.add_argument("--dry-run", action="store_true", help="Print results without writing the feed file")
    args = parser.parse_args()

    existing = _read_existing()
    existing_items = existing.get("items", [])
    raw_feed = args.feed_file.read_bytes() if args.feed_file else fetch_rss(args.feed_url)
    incoming_items = parse_items(raw_feed) if args.feed_file else fetch_official_items(args.feed_url)
    existing_links = {item.get("link") for item in existing_items}
    new_items = [item for item in incoming_items if item.get("link") not in existing_links]
    existing_by_link = {item.get("link"): item for item in existing_items if item.get("link")}
    updated_items = [
        item for item in incoming_items
        if item.get("link") in existing_by_link and any(item.get(key) != existing_by_link[item["link"]].get(key) for key in ("title", "date", "summary"))
    ]
    changed_items = new_items + updated_items
    merged = merge_items(existing_items, incoming_items)
    changed = bool(changed_items)
    write_github_outputs(count=len(merged), changed=changed, new_items=new_items, changed_items=changed_items)

    if changed:
        source = existing.get("source") or args.feed_url
        payload = build_payload(merged, source=source)
        if not args.dry_run:
            OUTPUT.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"count": len(merged), "changed": changed, "new_count": len(new_items), "updated_count": len(updated_items)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
