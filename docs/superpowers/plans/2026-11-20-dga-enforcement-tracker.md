# DGA Enforcement Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (native) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chinese-first React + Vite DGA implementation and enforcement tracker with separate tracks for Member State procedures, data intermediation services, and Article 31 non-personal-data international access/transfer monitoring.

**Architecture:** Use a typed local registry as the reviewed source of truth, pure metric/filter helpers for deterministic dashboard behavior, and small React components for the shell, dashboard, matter register, intermediary register, Article 31 watchlist, timeline, sources, and exports. Keep the official update monitor in `public/data/updates.json` and Python/GitHub Actions; it never mutates the reviewed registry automatically.

**Tech Stack:** React 19, TypeScript 5, Vite 7, `lucide-react`, native CSS, Node test runner through `tsx`, Python standard library for the official feed monitor, GitHub Pages Actions.

**Spec:** `docs/superpowers/specs/2026-11-20-dga-enforcement-tracker-design.md`

## Global Constraints

- DGA means Regulation (EU) 2022/868 and has applied since `2023-09-24`; explain its boundary with DMA and DSA in the first viewport.
- The reviewed seed contains 19 Member State implementation matters, 10 reasoned-opinion transitions, and 41 public data-intermediation registry records.
- Data intermediation registration is not a fine, case, or enforcement count; keep it in a separate track and view.
- Article 31 `not_located` is not zero and must remain visibly distinct from a located case or a positive count.
- Every reviewed fact keeps an official URL, source type, evidence summary, and `last_verified_at = 2026-11-20`.
- UI defaults to Chinese and includes a complete English switch for interface and derived summaries; official institution names, legal names, INFR numbers, and provider names remain source-faithful.
- The official update monitor can update only `public/data/updates.json`; it must not rewrite the reviewed registry or case status.
- All visible UI labels, tables, filters, and exports are code-native; the product contains a research-use / not-legal-advice notice.
- Narrow screens must not create page-level horizontal overflow; wide tables use contained scrolling or a stacked alternative.
- No GitHub repository or deployment URL is assumed; workflows must be ready for Pages and README must explain the one-time Pages setup.

## Review Focus

- A matter that has both formal notice and reasoned opinion must count once while preserving both events; test metric counts and event rendering in Task 1/Task 3.
- A source-backed `not_located` Article 31 watch item must never render as a numeric zero; test formatter and dashboard metric semantics in Task 1.
- A filtered view with no matching matters or intermediary records must show an empty state without changing the global counts; test filter helpers in Task 1/Task 2.
- The 41 registry records include punctuation, organization suffixes, and repeated country groupings; test country grouping and provider count in Task 1/Task 3.
- Narrow viewports must keep the main document within the viewport while allowing table inspection; test with browser viewport checks in Task 5.

---

### Task 1: Scaffold the Vite app and build the reviewed DGA registry

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/vite-env.d.ts`
- Create: `src/main.tsx`
- Create: `src/data/types.ts`
- Create: `src/data/registry.ts`
- Create: `src/data/metrics.ts`
- Create: `tests/metrics.test.ts`
- Create: `.gitignore`

**Interfaces:**
- Produces `Language`, `Bilingual`, `DgaTrack`, `MatterPhase`, `VerificationStatus`, `DgaMatter`, `MatterEvent`, `IntermediaryRecord`, `NonPersonalTransferWatch`, `SourceRef`, `OfficialSource`, and `UpdateItem` from `src/data/types.ts`.
- Produces `DATA_AS_OF`, `MATTERS`, `INTERMEDIARIES`, `TRANSFER_WATCH`, `TIMELINE_EVENTS`, `OFFICIAL_SOURCES`, and `DGA_OVERVIEW` from `src/data/registry.ts`.
- Produces pure `getDashboardMetrics`, `getMatterMetrics`, `getIntermediaryMetrics`, `filterMatters`, `filterIntermediaries`, and `dedupeMatters` from `src/data/metrics.ts`.

- [x] **Step 1: Initialize the local feature branch and create the minimal Vite/TypeScript package.**

  Initialize Git in the empty project directory with branch `feat/dga-enforcement-tracker`; use scripts `dev`, `test`, `build`, `lint`, and `preview`. Dependencies are React, React DOM, Vite, TypeScript, `lucide-react`, and `tsx` as a dev dependency. Add a `.gitignore` for `node_modules`, `dist`, `.superpowers`, and local logs.

- [x] **Step 2: Write failing registry and metric tests.**

  Add tests asserting:

  ```ts
  assert.equal(MATTERS.length, 19)
  assert.equal(MATTERS.filter((item) => item.phase === 'reasoned_opinion').length, 10)
  assert.equal(INTERMEDIARIES.length, 41)
  assert.equal(getDashboardMetrics(MATTERS, INTERMEDIARIES, TRANSFER_WATCH).formalNoticeMatterCount, 19)
  assert.equal(getDashboardMetrics(MATTERS, INTERMEDIARIES, TRANSFER_WATCH).reasonedOpinionCount, 10)
  assert.equal(getDashboardMetrics(MATTERS, INTERMEDIARIES, TRANSFER_WATCH).article31Status, 'not_located')
  assert.equal(dedupeMatters([MATTERS[0], MATTERS[0]]).length, 1)
  assert.equal(filterMatters(MATTERS, { country: 'DE', phase: 'all', query: '' }).length, 1)
  ```

- [x] **Step 3: Run the focused test and confirm it fails for missing registry/metrics.**

  Run `npm test -- tests/metrics.test.ts`.

  Expected: FAIL because the typed registry and metric functions do not yet exist.

- [x] **Step 4: Implement the typed domain model in `src/data/types.ts`.**

  Use explicit unions for tracks and statuses. `DgaMatter` must store one row per Member State, an optional `infr_number`, one current public phase, an event array, legal basis, status note, and source refs. `NonPersonalTransferWatch` must carry a nullable public-case count/status so `not_located` cannot be coerced into `0`.

- [x] **Step 5: Implement the reviewed seed registry in `src/data/registry.ts`.**

  Add 19 Member State matters: the 18 countries and INFR numbers from the 2024-05-23 formal notice; Ireland `INFR(2024)2189` from 2024-07-25; set the 10 specified countries to `reasoned_opinion` dated 2024-12-16 and the other 9 to `formal_notice`. Preserve the formal-notice event for all 10 transitioned matters. Add 41 intermediary provider records grouped by the official EU register’s listed countries and names. Add one Article 31 watch item with `status: 'not_located'`, `publicCaseCount: null`, and an explicit scope note. Add the DGA overview, legal boundary notes, timeline milestones, and official source refs.

- [x] **Step 6: Implement pure metrics, filters, and de-duplication in `src/data/metrics.ts`.**

  `getDashboardMetrics` returns the 19/10/41 counts and the Article 31 status; it must preserve `null` for the unlocated public-case count. `filterMatters` supports `country`, `phase`, and case-insensitive `query`; `filterIntermediaries` supports `country` and `query`; `dedupeMatters` keeps the first record by `matter_id`.

- [x] **Step 7: Run the focused tests and full compile checks.**

  Run `npm test -- tests/metrics.test.ts`, `npm run lint`, and `npm run build`.

  Expected: all registry assertions pass, TypeScript checks, and Vite builds an empty shell.

---

### Task 2: Build the app shell, bilingual controls, and dashboard overview

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/TopNav.tsx`
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/MetricStrip.tsx`
- Create: `src/components/DefinitionPanel.tsx`
- Create: `src/components/AttentionPanel.tsx`
- Create: `src/components/FreshnessPanel.tsx`
- Create: `src/lib/format.ts`
- Create: `src/lib/filters.ts`
- Create: `src/lib/filters.test.ts`

**Interfaces:**
- `AppShell` owns selected tab, language, filters, selected matter, and data-intermediary country selection.
- `FilterBar` consumes `MatterFilters` and emits immutable filter updates.
- `MetricStrip` consumes `DashboardMetrics` and renders the four key indicators.
- `format.ts` provides `text`, `formatDate`, `formatStatus`, `formatTrack`, `formatPhase`, and `formatCountOrUnknown`.

- [x] **Step 1: Write failing filter and formatter tests.**

  Test that an empty query matches all matters, `reasoned_opinion` returns 10 matters, a no-match query returns an empty list, English/Chinese phase labels differ, and `formatCountOrUnknown(null, 'zh')` returns `未定位到` rather than `0`.

- [x] **Step 2: Run `npm test -- tests/metrics.test.ts tests/filters.test.ts` and confirm the new helper tests fail.**

- [x] **Step 3: Implement `src/lib/format.ts` and `src/lib/filters.ts` minimally.**

  Keep all label mappings in one place so metric cards, tables, source panels, and exports use identical semantics.

- [x] **Step 4: Run the helper tests and confirm they pass.**

- [x] **Step 5: Implement `AppShell` and `App.tsx` local state.**

  Default to Chinese, `dashboard` tab, all tracks, all phases, all countries, and empty query. Persist only language in `localStorage`; keep identity-bearing filters out of URLs. Tabs are Dashboard, Implementation, Data intermediation, Article 31, Timeline, and Sources.

- [x] **Step 6: Implement the first viewport.**

  Render a dark-blue title band with the exact product title `DGA enforcement tracker`, a concise DGA explanation, a visible DMA/DSA boundary note, a four-card metric strip, filter controls, an attention panel for the 10 reasoned opinions, and a freshness panel showing `2026-11-20`.

- [x] **Step 7: Run `npm test`, `npm run lint`, and `npm run build`, then start `npm run dev` to verify the shell is non-blank.**

---

### Task 3: Build the three evidence tracks, detail drawer, timeline, sources, and exports

**Files:**
- Create: `src/components/MatterTable.tsx`
- Create: `src/components/MatterDrawer.tsx`
- Create: `src/components/IntermediaryTable.tsx`
- Create: `src/components/TransferWatch.tsx`
- Create: `src/components/Timeline.tsx`
- Create: `src/components/SourceList.tsx`
- Create: `src/components/ExportActions.tsx`
- Create: `src/lib/export.ts`
- Create: `src/lib/export.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- `MatterTable` consumes filtered `DgaMatter[]`, language, and `onSelectMatter`.
- `MatterDrawer` consumes one `DgaMatter | null` and renders event history, legal basis, status semantics, next action, and source links.
- `IntermediaryTable` consumes `IntermediaryRecord[]` and selected country/query.
- `TransferWatch` consumes `NonPersonalTransferWatch[]` and renders law vs. located public cases separately.
- `Timeline` consumes `TimelineEvent[]`.
- `export.ts` exposes `exportMatterViewJson`, `exportMatterViewCsv`, and `exportMatterViewMarkdown`.

- [x] **Step 1: Write failing export tests.**

  Assert that JSON export includes selected filters and the Article 31 `not_located` status, CSV escapes provider names containing commas/quotes, and Markdown includes the DGA definition, selected matter ID, and source URL.

- [x] **Step 2: Run the export tests and confirm they fail because export functions are missing.**

- [x] **Step 3: Implement pure export helpers and run the export tests to green.**

  Browser download wiring stays in the React component; pure helpers return strings so they are deterministic and testable.

- [x] **Step 4: Implement the Implementation tab and matter drawer.**

  The table shows country, INFR number, current public phase, latest public signal, date, and status note. A row opens a drawer/panel with the phase event chain; it must not show a final fine when the source only supports a formal notice/reasoned opinion.

- [x] **Step 5: Implement the Data intermediation tab.**

  Group providers by country, show 41 total records, allow country and keyword filtering, and render a plain note that registration is not a fine or a compliance certification.

- [x] **Step 6: Implement the Article 31 tab.**

  Render the Article 31 legal rule, scope and official source; show the public-case status as `未定位到` / `Not located in the reviewed source set`, keep the nullable count hidden behind that status, and provide a watchlist next action.

- [x] **Step 7: Implement Timeline, Sources, and current-view JSON/CSV/Markdown exports.**

  Reuse the same source objects across drawer, Sources tab, and exports. Export only the current filtered track and preserve source URLs.

- [x] **Step 8: Run the full test/build suite and verify the core UI path.**

  Verify tab changes, matter selection, filters, language toggle, Article 31 status, and three export buttons in the browser.

---

### Task 4: Add official update monitoring and delivery artifacts

**Files:**
- Create: `public/data/updates.json`
- Create: `scripts/check_updates.py`
- Create: `tests/test_check_updates.py`
- Create: `.github/workflows/deploy.yml`
- Create: `.github/workflows/monitor.yml`
- Create: `public/static/index.html`
- Create: `README.md`

**Interfaces:**
- `check_updates.py` writes only `public/data/updates.json` and GitHub outputs `count`, `changed`, and `new_count`.
- The React updates panel reads `public/data/updates.json` but never mutates reviewed registry state.

- [x] **Step 1: Write failing Python monitor tests.**

  Test HTML stripping, keyword matching for DGA terms, date parsing, and that a generated payload has `updated_at`, `source`, and `items`.

- [x] **Step 2: Run `python3 -m unittest discover -s tests -v` and confirm the new monitor tests fail because the script is missing.**

- [x] **Step 3: Implement the standard-library RSS monitor.**

  Monitor the official Commission Press Corner RSS and Digital Strategy DGA pages/keywords. Keep the curated registry untouched; write a bounded update feed with source links and summaries only. Support GitHub Actions output variables and local execution.

- [x] **Step 4: Run Python tests and a local monitor dry run with network-independent fixture input.**

- [x] **Step 5: Add the Pages deployment workflow.**

  Follow the DSA/DMA delivery pattern: `npm ci`, `npm test`, `python3 -m unittest discover -s tests -v`, `npm run lint`, `npm run build`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`; use Node 22 and `configure-pages` where needed.

- [x] **Step 6: Add the daily monitor workflow.**

  Run at a non-round UTC time, support manual dispatch, write an Actions Summary, commit only when `public/data/updates.json` changes, and keep optional webhook notification non-blocking.

- [x] **Step 7: Add `public/static/index.html` and `README.md`.**

  The static page includes the DGA definition, the 19/10/41 indicators, Article 31 `not_located` wording, official source links, and a research-use disclaimer. The README documents setup, data model, source policy, manual registry review/PR workflow, monitor limitations, Pages setup, and local commands.

- [x] **Step 8: Run all tests/build checks and inspect the static page locally.**

---

### Task 5: Apply the visual system, responsive behavior, and browser verification

**Files:**
- Create: `src/index.css`
- Create: `src/App.css`
- Modify: `index.html`
- Modify: component files only where semantic wrappers/classes are required.

**Interfaces:**
- Shared CSS tokens define the navy title band, blue controls, white panels, slate text, teal/amber status colors, spacing, borders, and responsive table behavior.

- [x] **Step 1: Write a failing responsive smoke test or scripted browser assertion for page overflow and visible DGA identity.**

  The test must assert that the page title contains `DGA enforcement tracker` and `document.documentElement.scrollWidth <= window.innerWidth` at a mobile viewport after the app loads.

- [x] **Step 2: Run the browser smoke check and confirm it fails before styling/app completion.**

- [x] **Step 3: Implement desktop and mobile CSS.**

  Use the DSA/DMA visual language without copying their domain labels: dark-blue title band, compact filter bar, dense tables, status tags, clear selected states, contained table overflow, accessible focus rings, and no marketing hero.

- [x] **Step 4: Run the browser smoke check to green at desktop and mobile sizes.**

- [x] **Step 5: Perform manual browser QA.**

  Check first viewport, scroll, each tab, a reasoned-opinion matter drawer, a no-match filter, data-intermediary country filter, Article 31 `not_located`, language switch, exports, source links, and static速览页. Capture screenshots for the final handoff and record any intentional deviations in `docs/superpowers/verification/2026-11-20-dga-enforcement-tracker-fidelity.md`.

- [x] **Step 6: Run the complete verification suite.**

**Smoke-check note:** Browser assertions were executed through the Codex CUA browser against the running Vite app (identity, tab navigation, filters, detail drawer, Article 31 status, data-intermediation counts, exports, and document-level overflow). The managed environment does not expose a viewport setter or include a Playwright/Puppeteer dependency, so the narrow-layout behavior is covered by the responsive CSS media queries plus the available-viewport overflow assertion and manual code review.

  Run `npm test`, `python3 -m unittest discover -s tests -v`, `npm run lint`, and `npm run build`; read all output and confirm zero failures before claiming completion.

