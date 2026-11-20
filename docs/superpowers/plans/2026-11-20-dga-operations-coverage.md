# DGA Operations and Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the published DGA tracker into an operated, source-backed review system with stronger governance data, follow-up coverage, validation, and repeatable smoke checks.

**Architecture:** Keep `src/data/registry.ts` as the reviewed source of truth, add typed authority, data-altruism, procedure-follow-up, and Article 31 case structures, and expose them through a dedicated governance view without merging them into enforcement counts. Add repository review templates and pure validation helpers, then run the official monitor and deployment smoke checks through GitHub Actions.

**Tech Stack:** React 19, TypeScript 5, Vite 7, Node test runner through `tsx`, Python standard library monitor, GitHub Actions, and Playwright-based CI smoke checks.

**Spec:** `docs/superpowers/specs/2026-11-20-dga-enforcement-tracker-design.md`

## Global Constraints

- Keep DGA implementation procedures, data-intermediation registrations, data altruism, national authorities, and Article 31 observations as separate evidence tracks.
- Preserve the reviewed seed counts of 19 implementation matters, 10 reasoned opinions, and 41 data-intermediation records.
- Never convert Article 31 `not_located` or missing public-case evidence into numeric zero.
- Every new reviewed row must keep an official source URL, evidence summary or source note, and `last_verified_at`.
- No monitor or feed job may mutate the reviewed registry or infer closure, escalation, court referral, or legal conclusions.
- The UI remains Chinese-first, bilingual, source-backed, narrow-screen safe, and research-use only.
- GitHub Actions must validate the registry before deployment and must be able to write only the monitor feed when the repository permission is enabled.

## Review Focus

- A blank authority column must render as “未列出/Not listed”, not as a missing table cell or a false authority.
- A data-altruism register row must remain distinct from a data-intermediation registration and from an enforcement matter.
- A procedure with no later public signal must remain explicitly “未定位到后续信号”, not “closed” or “0 updates”.
- An Article 31 watch item must support located cases without changing the current `not_located` semantics.
- Narrow governance and follow-up tables must scroll inside their panels and must not create document-level horizontal overflow.

### Task 1: Add reviewed governance and follow-up data contracts

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/registry.ts`
- Modify: `src/data/metrics.ts`
- Create: `tests/governance.test.ts`

**Interfaces:**
- Produces `AuthoritySnapshot`, `DataAltruismOrganisation`, `ProcedureFollowUp`, and `Article31Case` types.
- Produces `AUTHORITY_SNAPSHOTS`, `DATA_ALTRUISM_ORGANISATIONS`, `FOLLOW_UP_REVIEWS`, and the extended `TRANSFER_WATCH` cases field.
- Produces `getGovernanceMetrics` without changing existing enforcement/intermediation metric semantics.

- [ ] **Step 1: Write failing governance and follow-up tests.**
- [ ] **Step 2: Run `npm test -- tests/governance.test.ts` and observe the expected missing-export failure.**
- [ ] **Step 3: Add official-source-backed records from the Commission authority PDF (last updated 2026-09-15) and the EU recognised data altruism register (last updated 2026-07-23).**
- [ ] **Step 4: Implement the new types, Article 31 case collection, follow-up review records, and `getGovernanceMetrics`.**
- [ ] **Step 5: Run the focused test and the full TypeScript test suite.**

### Task 2: Add the governance and follow-up UI tracks

**Files:**
- Create: `src/components/GovernanceRegister.tsx`
- Create: `src/components/FollowUpTable.tsx`
- Modify: `src/components/AppShell.tsx`
- Modify: `src/components/TopNav.tsx`
- Modify: `src/components/TransferWatch.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Create: `tests/ui-copy.test.ts`

**Interfaces:**
- `GovernanceRegister` consumes `AuthoritySnapshot[]`, `DataAltruismOrganisation[]`, and `Language`.
- `FollowUpTable` consumes `ProcedureFollowUp[]` and `Language`.
- The new `governance` tab is independent from implementation, intermediation, and Article 31 filters.

- [ ] **Step 1: Write failing copy/structure tests for the governance and follow-up labels.**
- [ ] **Step 2: Run the focused test and observe the expected missing component/label failure.**
- [ ] **Step 3: Implement the governance tab, follow-up panel, and located-case rendering path.**
- [ ] **Step 4: Add contained table scrolling and mobile-safe styles.**
- [ ] **Step 5: Run tests, lint, build, and browser smoke checks for the new tab and Article 31 empty-case state.**

### Task 3: Establish the human review and data-validation workflow

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/ISSUE_TEMPLATE/official-signal.yml`
- Create: `src/data/validation.ts`
- Create: `tests/validation.test.ts`
- Create: `scripts/validate_registry.ts`
- Modify: `package.json`
- Modify: `.github/workflows/deploy.yml`
- Modify: `.github/workflows/monitor.yml`
- Modify: `README.md`

**Interfaces:**
- Produces `validateRegistry()` returning deterministic validation errors.
- Produces `npm run validate:data`, which exits non-zero for duplicate IDs, missing sources, invalid dates, or Article 31 count/status contradictions.

- [ ] **Step 1: Write failing validation tests for a valid registry and representative invalid records.**
- [ ] **Step 2: Run the focused test and observe the expected missing validator failure.**
- [ ] **Step 3: Implement the validator and CLI wrapper, then wire it into deploy and monitor workflows.**
- [ ] **Step 4: Add the PR/issue review checklist and document the manual source-review protocol.**
- [ ] **Step 5: Run the validation test, CLI, full suite, lint, and build.**

### Task 4: Add automated accessibility/mobile/static smoke coverage and notification documentation

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/dga.smoke.spec.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Produces `npm run test:e2e` for desktop and mobile smoke checks against the production preview.
- Smoke checks cover page identity, DGA definition, governance tab, Article 31 `not_located`, language switch, and document overflow.

- [ ] **Step 1: Add the Playwright smoke test and run it once to observe the expected missing-dependency or missing-behavior failure.**
- [ ] **Step 2: Add the minimal Playwright dependency/configuration and make the smoke suite pass locally.**
- [ ] **Step 3: Add the e2e job to Pages deployment and document the optional webhook secret/variable setup.**
- [ ] **Step 4: Run the complete test, validation, lint, build, and e2e suite.**

### Task 5: Operate and verify the GitHub delivery loop

**Files:**
- No repository files; GitHub repository settings and Actions run state.

- [ ] **Step 1: Confirm the Actions workflow permission setting is read/write.**
- [ ] **Step 2: Manually dispatch the official monitor workflow.**
- [ ] **Step 3: Verify the monitor summary, feed behavior, and any resulting Pages deployment.**
- [ ] **Step 4: Verify the live dashboard and report exact URLs/statuses.**
