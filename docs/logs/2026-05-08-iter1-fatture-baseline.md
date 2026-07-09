# Iteration 1 — Fatture.html implementation (baseline)

**Date:** 2026-05-08
**Session:** previous Claude Code session, run before any DS-first instrumentation existed.
**Goal:** capture how the agent behaves "out of the box" when given a Claude design link, so a subsequent run with the new instructions can be compared against it.

## Original prompt

> Fetch this design file, read its readme, and implement the relevant aspects of the design.
> https://api.anthropic.com/v1/design/h/3IXUUHEKGzPK-eoFDviHdw?open_file=Fatture.html
>
> Implement: Fatture.html

## What the agent produced

| Layer       | Count | Notes                                                            |
| ----------- | ----- | ---------------------------------------------------------------- |
| pages       | 2     | `FattureList`, `FatturaDetail`                                   |
| organisms   | 3     | `FattureListView`, `FatturaDetailView`, `FatturaEditor`          |
| molecules   | ≈30   | see "DS reinvention" table below                                 |
| composables | 4     | `useInvoices`, `useInvoiceTotals`, `useStatusMeta`, `formatters` |
| templates   | 0     | (none)                                                           |

35 `.vue` files in total, plus composables, types, and a router rewrite.

### Routes wired

- `/` → redirect to `/fatture`
- `/fatture` → `FattureList`
- `/fatture/:id` → `FatturaDetail`

## Design-system usage

What was actually imported from `@fiscozen/*`:

| Package            | Files using it | Components |
| ------------------ | -------------- | ---------- |
| `@fiscozen/icons`  | 10             | `FzIcon`   |
| `@fiscozen/button` | 3              | `FzButton` |

That's it — two packages out of 47 available in `fiscozen/design_system`.

15 of 35 `.vue` files contain raw `<button>`, `<input>`, `<select>`, `<table>`, `<th>`, `<td>` primitives.

### DS components reinvented as molecules

| Hand-rolled molecule(s) in this repo                    | Should have been                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `StatusBadge`                                           | `@fiscozen/badge` → `FzBadge`                                                            |
| `TipoPill`                                              | `@fiscozen/badge`                                                                        |
| `FormField` (raw `<input>`/`<textarea>` + focus rings)  | `@fiscozen/input` → `FzInput`, `FzCurrencyInput`, or `@fiscozen/textarea` → `FzTextarea` |
| `FormSelect` (raw `<select>`)                           | `@fiscozen/select` → `FzSelect`                                                          |
| `SearchField`                                           | `@fiscozen/input`                                                                        |
| `InvoiceTable` (raw `<table>` + ~130 lines of Tailwind) | `@fiscozen/table` → `FzTable` (or `@fiscozen/simple-table` if features minimal)          |
| `Tabs`                                                  | `@fiscozen/tab` → `FzTab`/`FzTabs`                                                       |
| `Pagination`                                            | `@fiscozen/pagination` → `FzPagination`                                                  |
| `KpiCard`, `KpiGrid`, `TotalsCard`                      | `@fiscozen/card` → `FzCard`                                                              |
| `EditorShell` (modal pattern)                           | `@fiscozen/dialog` → `FzDialog`                                                          |
| `VerticalNav`, `BackofficeShell`                        | `@fiscozen/navlist` + `@fiscozen/navlink`, possibly `@fiscozen/navbar`                   |
| `EmptyState`                                            | likely `@fiscozen/alert` or a card                                                       |
| `Toolbar`, `PageHeaderShell`, `SectionHeader`           | mix of `@fiscozen/breadcrumbs`, layout primitives                                        |
| `StatusChipsRow`, `StatusPicker`, `TipoSegmented`       | combinations of `@fiscozen/badge` + `@fiscozen/tab`                                      |

## Visual references

Captured at iteration end via headless Chrome (`Google Chrome --headless=new`, viewport 1440×2400, virtual time budget 4s). The Playwright MCP server declared in `.mcp.json` was not loaded into the agent's tool list during this session, hence the chrome fallback.

- [`iter1-fatture-list.png`](./iter1-fatture-list.png) — list view at `http://localhost:5176/fatture`
- [`iter1-fattura-detail.png`](./iter1-fattura-detail.png) — detail view at `http://localhost:5176/fatture/doc-001`

## Diagnosis (from the analysis session)

1. **Dependency / instruction drift.** `packages/accounting/package.json` declared only `@fiscozen/{button,icons,style}`. `CLAUDE.md` told the agent to use `@fiscozen/{table,badge,input,select,datepicker,dialog,layout}` etc. — but those weren't installed. No compile error, no lint guardrail. Agent silently fell back to raw HTML.
2. **No API discoverability.** The npm README of an `@fiscozen/*` package isn't enough to discover slots / events / variants. With no source pointer, the agent guesses — and guessing has a higher cost than rewriting in Tailwind, so it rewrites.
3. **No visual verification.** The agent declared "done" without ever rendering the page. Soft prose in CLAUDE.md ("run dev to verify") doesn't match the strength of the hard atomic-design rules (write-time hook + ESLint).
4. **No semantic annotations in the design source.** The fetched HTML carries no `data-fz-component` hints — the agent has to do shape matching from a class dump. Even a great agent will miss matches this way.

## What went well

- **Layer split** (page → organism → molecule → composable) is mostly correct and stable.
- **Atomic-design entity directory layout** is respected (every component in its own `<EntityName>/` directory with `index.ts` + `types/`).
- **Composables wrap data access** — no API calls leaked into `.vue` files.
- **Fixtures used** — no production-API drift risk.
- **Domain isolation** — everything stays in `accounting/`, no cross-domain leaks.
- **Pages render and are interactive** — both routes load without error in the browser.

## Changes shipped to address the failure modes

Commit `0e23bb3` — `feat: enforce DS-first design implementation flow`:

- `scripts/refresh-ds-inventory.sh` + `SessionStart` hook produces a live `.claude/design-system-inventory.md` from `fiscozen/design_system` (47 packages with versions, exported `Fz*` components, per-domain installed-deps cross-reference). Sparse blobless clone at `.cache/design_system/` is the agent's source for prop/slot discovery.
- `/implement-design` skill enforces: refresh inventory → **mandatory component plan** with developer confirmation → autonomous `pnpm add -F` of missing packages → scaffold → implement → **mandatory** Playwright visual verification.
- `CLAUDE.md` hard rule #1 rewritten around inventory + on-demand install, with explicit authorization to install packages from the inventory. Workflow promotes Playwright verification from soft prose to a non-skippable step.

## What to compare in iteration 2

Re-run the same prompt in a fresh session with the new instructions in place. The diff that matters:

| Metric                                                               | Iter 1 baseline                | Iter 2 target                                        |
| -------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------- |
| `@fiscozen/*` packages imported                                      | 2 (`button`, `icons`)          | ≥ 8                                                  |
| `@fiscozen/*` packages installed in `accounting/package.json`        | 3 (`button`, `icons`, `style`) | + table, badge, input, select, dialog, navlist, etc. |
| Files containing raw `<button>` / `<input>` / `<select>` / `<table>` | 15                             | 0 (or molecule-internal only)                        |
| Hand-rolled molecules duplicating an existing `Fz*` component        | 12+                            | 0                                                    |
| Component plan produced and confirmed before any `.vue` write        | no                             | yes                                                  |
| Playwright screenshot taken before declaring "done"                  | no                             | yes                                                  |
| Subjective faithfulness to the design source                         | medium (renders, but bespoke)  | higher (DS-backed)                                   |

Capture the iteration 2 screenshots to `docs/logs/iter2-*.png` for side-by-side comparison.
