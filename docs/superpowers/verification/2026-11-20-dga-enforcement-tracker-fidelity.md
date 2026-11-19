# DGA tracker delivery verification

## Reference targets

- Delivery structure follows the adjacent DMA/DSA trackers: Vite app, typed local registry, `public/data/updates.json`, Python monitor, GitHub Pages workflow, daily monitor workflow, static share page, and README.
- Legal/data boundary follows the [DGA regulation](https://eur-lex.europa.eu/eli/reg/2022/868/oj) and the Commission's [DGA explanation](https://digital-strategy.ec.europa.eu/en/policies/data-governance-act-explained).
- No accepted design-concept image was provided. Visual fidelity was therefore judged against the existing DMA/DSA delivery language and the requested research dashboard behavior.

## Verified behavior

- Chinese-first UI with EN toggle and language persisted in local storage.
- Dashboard shows 19 implementation matters, 10 reasoned-opinion matters, 41 data-intermediation entries, and Article 31 as `未定位到` / `Not located`, with no zero inference.
- Implementation detail view preserves event chain, evidence boundary, next review action and official source links.
- Data-intermediation and Article 31 are separate tracks; the Netherlands filter returns 11 register entries.
- Current-view JSON, CSV and Markdown export controls are present.
- `public/data/updates.json` is loaded as a review queue; the monitor only stages that file and never rewrites `src/data/registry.ts`.
- The monitor combines the official Press Corner RSS with a small allowlist of official Digital Strategy DGA pages; same-link title/summary/date changes refresh the feed without touching the reviewed registry.
- Dashboard and implementation view had no document-level horizontal overflow at the available browser viewport; tables use an internal horizontal scroll region for narrow layouts.

## Verification commands

```text
npm test                         14 passed
python3 -m unittest discover -s tests -v   5 passed
npm run lint                     passed
npm run build                    passed
python3 scripts/check_updates.py --feed-file tests/fixtures/dga-feed.xml --dry-run   passed
```

The TypeScript test runner needs permission to create its temporary local IPC pipe in this managed workspace; the tests were rerun with that narrow permission and passed.

The browser smoke assertions were run through the available CUA browser. A committed Playwright/Puppeteer smoke test was not added because neither a viewport setter nor those browser-test dependencies are available in the managed workspace; the responsive CSS and available-viewport overflow behavior were inspected instead.
