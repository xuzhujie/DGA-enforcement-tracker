import importlib.util
import textwrap
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "check_updates.py"
SPEC = importlib.util.spec_from_file_location("check_updates", MODULE_PATH)
assert SPEC and SPEC.loader
check_updates = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check_updates)


class CheckUpdatesTests(unittest.TestCase):
    def test_strip_html_collapses_markup_and_whitespace(self):
        self.assertEqual(
            check_updates.strip_html("<p>DGA <b>update</b></p><p>Next&nbsp;step</p>"),
            "DGA update Next step",
        )

    def test_keyword_matching_requires_a_dga_signal(self):
        self.assertTrue(check_updates.matches_keywords("Data Governance Act explained", ""))
        self.assertTrue(check_updates.matches_keywords("National authority", "data intermediation service"))
        self.assertTrue(check_updates.matches_keywords("Non-personal data", "Article 31"))
        self.assertFalse(check_updates.matches_keywords("Digital Markets Act", "gatekeeper"))

    def test_parse_date_handles_rfc822_and_unknown_values(self):
        self.assertEqual(
            check_updates.parse_date("Mon, 20 Nov 2026 08:30:00 GMT"),
            "2026-11-20",
        )
        self.assertEqual(check_updates.parse_date("not a date"), "")
        self.assertEqual(check_updates.parse_date("2026-11-20T08:30:00+00:00"), "2026-11-20")

    def test_parse_page_update_extracts_an_official_dga_page(self):
        html = b"""
        <html><head>
          <title>Data Governance Act explained</title>
          <meta name=\"description\" content=\"The Commission explains data intermediation and data altruism.\" />
          <meta property=\"article:published_time\" content=\"2026-11-20T08:30:00+00:00\" />
        </head><body>Data Governance Act</body></html>
        """

        item = check_updates.parse_page_update(html, "https://example.test/dga-page")

        self.assertIsNotNone(item)
        assert item is not None
        self.assertEqual(item["date"], "2026-11-20")
        self.assertIn("data intermediation", item["summary"].lower())

    def test_parse_items_filters_and_normalizes_feed_items(self):
        xml = textwrap.dedent(
            """
            <rss><channel>
              <item>
                <title>Commission publishes Data Governance Act update</title>
                <link>https://example.test/dga</link>
                <description><![CDATA[<p>The DGA and data intermediation framework.</p>]]></description>
                <pubDate>Mon, 20 Nov 2026 08:30:00 GMT</pubDate>
              </item>
              <item>
                <title>Unrelated policy news</title>
                <link>https://example.test/nope</link>
                <description>Digital markets only.</description>
              </item>
            </channel></rss>
            """
        ).encode("utf-8")

        items = check_updates.parse_items(xml)

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["date"], "2026-11-20")
        self.assertEqual(items[0]["link"], "https://example.test/dga")
        self.assertIn("data intermediation", items[0]["summary"].lower())

    def test_build_payload_has_stable_feed_contract(self):
        payload = check_updates.build_payload(
            [{"title": "DGA", "link": "https://example.test/dga", "date": "2026-11-20", "summary": "Update"}],
            source="https://example.test/feed",
        )

        self.assertIn("updated_at", payload)
        self.assertEqual(payload["source"], "https://example.test/feed")
        self.assertEqual(payload["items"][0]["title"], "DGA")

    def test_merge_items_refreshes_an_existing_link_when_content_changes(self):
        existing = [{"title": "Old DGA title", "link": "https://example.test/dga", "date": "2026-11-19", "summary": "Old"}]
        incoming = [{"title": "New DGA title", "link": "https://example.test/dga", "date": "2026-11-20", "summary": "New"}]

        merged = check_updates.merge_items(existing, incoming)

        self.assertEqual(merged, incoming)


if __name__ == "__main__":
    unittest.main()
