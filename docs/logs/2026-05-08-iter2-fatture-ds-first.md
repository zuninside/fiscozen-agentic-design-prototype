# Iteration 2 — Fatture.html implementation (DS-first instrumentation)

**Date:** 2026-05-08
**Session:** Claude Code session `a1ca6f04-165b-4d95-a22d-d4a5223d3353`, run after commit `0e23bb3` (`feat: enforce DS-first design implementation flow`).
**Goal:** re-run the iter-1 prompt with the new instrumentation in place — refreshable inventory, `/implement-design` skill, autonomous package install, mandatory Playwright verification — and measure how much of the gap that closes.

## Original prompt

> Fetch this design file, read its readme, and implement the relevant aspects of the design.
> https://api.anthropic.com/v1/design/h/T6WHptA45qU1PZu1oVgVqw?open_file=Fatture.html
>
> Implement: Fatture.html

The design hash differs from iter-1 (`3IXUUHEKGzPK-eoFDviHdw` → `T6WHptA45qU1PZu1oVgVqw`) because the source page was re-shared, but `Fatture.html` is the same target.

## Session cost

Pulled from `~/.claude/projects/.../a1ca6f04-…jsonl` (the on-disk transcript Claude Code writes per session).

| Metric                        | Value                          |
| ----------------------------- | ------------------------------ |
| Model                         | `claude-opus-4-7`              |
| Wall-clock duration           | **61.2 min** (16:37→17:38 UTC) |
| Assistant turns w/ usage      | 362                            |
| Fresh input tokens            | 437                            |
| Cache-creation input tokens   | 16,907,917                     |
| Cache-read input tokens       | 51,760,846                     |
| Output tokens                 | 1,019,185                      |
| **Total input (all sources)** | **68,669,200**                 |

Cache hit rate (read / read+create) ≈ 75% — the long single-session implementation amortized the system prompt + repo context well.

## What the agent produced

| Layer       | Count | Notes                                                                             |
| ----------- | ----- | --------------------------------------------------------------------------------- |
| pages       | 2     | `Home`, `Fatture` (single page; in-page `view = 'list' \| 'detail'` state toggle) |
| organisms   | 2     | `InvoiceListView`, `InvoiceDetailView`                                            |
| molecules   | 34    | see "DS-component reuse" below                                                    |
| composables | 4     | `useInvoiceFixtures`, `useInvoiceFormatters`, `useInvoiceTotals`, `useStatusMeta` |
| templates   | 0     | (none)                                                                            |

39 `.vue` files in total.

### Routes wired

- `/` → `Home`
- `/fatture` → `Fatture` (no `/fatture/:id` — detail is shown via in-page state toggle on the same route)

This is a divergence from iter-1, which used a real `/fatture/:id` route. Worth flagging because it changes the URL contract for engineer review and back-button semantics, but it isn't directly a DS-first regression.

## Design-system usage

What was actually imported from `@fiscozen/*`:

| Package                | Files using it | Components                 |
| ---------------------- | -------------- | -------------------------- |
| `@fiscozen/icons`      | 6              | `FzIcon`                   |
| `@fiscozen/button`     | 3              | `FzButton`, `FzIconButton` |
| `@fiscozen/input`      | 2              | `FzInput`                  |
| `@fiscozen/select`     | 1              | `FzSelect`                 |
| `@fiscozen/textarea`   | 1              | `FzTextarea`               |
| `@fiscozen/pagination` | 1              | `FzPagination`             |
| `@fiscozen/style`      | 1 (main.ts)    | `setupFzStyle`             |

**9 of 47 available `@fiscozen/*` packages imported** (iter-1: 2). Real progress.

### Installed but never imported

The agent followed the `/implement-design` skill's "install missing packages" step and added these to `accounting/package.json`, then never imported them in any `.vue` or `.ts` file:

| Package                  | Usages |
| ------------------------ | ------ |
| `@fiscozen/avatar`       | 0      |
| `@fiscozen/badge`        | 0      |
| `@fiscozen/card`         | 0      |
| `@fiscozen/datepicker`   | 0      |
| `@fiscozen/simple-table` | 0      |
| `@fiscozen/tab`          | 0      |

**Six packages of pure dead weight.** This is a new failure mode that didn't exist in iter-1: the agent "knew" what it needed (planned + installed) but lost adherence at implementation time.

Additionally, `@fiscozen/container@0.4.2` is in the live inventory and would replace many `<div class="flex flex-col gap-X">` blocks, but it was **not even installed**. Layout primitives are invisible from a class-name diff — nothing in the design HTML says "container" — so the shape-matcher never fires.

### Raw HTML primitives still present

35 raw `<button>`/`<input>`/`<select>`/`<table>` lines remain across **9 files**:

| File                      | Raw primitives                                                             | Should have used                                  |
| ------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| `LineItemsEditor.vue`     | 3× `<input>`, 1× `<select>`, 2× `<button>` + `inputBase` Tailwind constant | `FzInput`, `FzSelect`, `FzIconButton`, `FzButton` |
| `InvoicesTable.vue`       | `<table>` + 7× `<td>`                                                      | `FzSimpleTable` (already installed)               |
| `FatturaDocument.vue`     | 2× `<table>` + many `<td>`                                                 | **defensible** — PDF-faithful invoice replica     |
| `TipoToggle.vue`          | 3× `<button>` (segmented control)                                          | `FzTab`                                           |
| `StatusFilterChip.vue`    | `<button>`                                                                 | `FzBadge` or `FzTab`                              |
| `StatusSelectButtons.vue` | `<button>`                                                                 | `FzTab` / `FzButton` group                        |
| `FormColHead.vue`         | `<button>` (sort header)                                                   | `FzButton` (link variant) or table column API     |
| `BackofficeSidebar.vue`   | `<button>` (nav item)                                                      | nav item from `@fiscozen/navlist` (not installed) |
| `DateField.vue`           | `<input type="date">`                                                      | `FzDatepicker` (already installed)                |

The smoking gun is `LineItemsEditor.vue:16-17`:

```vue
const inputBase = 'h-32 bg-core-white border border-grey-300 rounded px-10 …' …
<input :class="inputBase" :value="it.desc" … />
<select :class="[inputBase, …]" …></select>
```

`FzInput` and `FzSelect` are installed _and imported by sibling files in the same session_. The agent literally declared a Tailwind constant to reinvent `FzInput`.

## Visual references

Captured at iteration end via the Playwright MCP server, viewport 1440×2400, full page.

- [`iter2-fatture-list.png`](./iter2-fatture-list.png) — list view at `http://localhost:5174/fatture`
- [`iter2-fattura-detail.png`](./iter2-fattura-detail.png) — detail view (same route, after clicking the first row)

## Diagnosis

The iter-1 hypothesis ("the agent doesn't know what exists") is now resolved by the inventory. Iter-2 reveals a **sharper, downstream failure mode**:

1. **Shopping-list disconnect.** The `/implement-design` skill produced an explicit component plan and the agent autonomously installed the listed packages. Then, during the per-component implementation phase, adherence to that plan dropped: 6 of the installed packages were never imported anywhere. The plan was treated as a one-shot intent capture, not a contract.
2. **Layout primitives are invisible.** `FzContainer` was never even considered because nothing in the design HTML signals "container" — it's a `<div>` with a flex class, indistinguishable from any other layout div. Same logic applies to `FzCard` for `KpiCard` / `TotalsCard` / `TableCard` — without a structural marker, the agent shape-matches the inner content, not the wrapper.
3. **Per-write enforcement is still soft.** ESLint rule #5 only blocks `class` attributes in **organisms**, **templates**, and **pages**. Inside molecules — which is exactly where 35 raw primitives sit — Tailwind is allowed and raw `<input>`/`<button>` are unblocked. The hard-rule #1 about "Use `@fiscozen/*` as atoms" is prose-only, not lint-enforced. The agent's bias toward "just write the Tailwind" wins because nothing fails at write-time.
4. **No mid-implementation gate.** Visual verification at the end fires once the page renders, but it doesn't check DS fidelity (it can't — a screenshot looks fine whether it's `FzInput` or a hand-rolled `<input>` with the same border).

## What went well

- **9× DS package adoption** vs iter-1 (2 → 9 imports).
- **3× DS package install** vs iter-1 (3 → 12 in `package.json`).
- **Files containing raw primitives:** 15 → 9 (-40%).
- **Component plan produced and confirmed before any `.vue` write** — the skill enforced this.
- **Playwright visual verification** ran end-of-session and the agent iterated on the screenshot.
- **Atomic-design layer split** still correct: pages → organisms → molecules → composables, every entity in its own directory.
- **Domain isolation** preserved — everything stays in `accounting/`.
- **No raw `<style>` blocks, no API calls in components.**
- **Composables wrap data access** cleanly (`useInvoiceFixtures`, `useInvoiceFormatters`, `useInvoiceTotals`, `useStatusMeta`).

## What to address before iteration 3

In rough order of cost-vs-payoff:

1. **(cheap, high impact) ESLint rule** blocking raw `<button>`/`<input>`/`<select>`/`<table>`/`<textarea>`/`<dialog>` _inside molecules too_, with an autofix-comment hint pointing to the matching `Fz*` component. A lint failure at write-time is the only enforcement strong enough to compete with the agent's instinct to inline Tailwind. This alone would catch `LineItemsEditor`, `InvoicesTable`, `DateField`, `TipoToggle`, `StatusFilterChip`, `StatusSelectButtons`, `FormColHead`, `BackofficeSidebar` on the next run.
2. **(medium) Design-HTML annotation pre-pass.** Take the Claude Design HTML and inject `data-fz-component` hints (`<input data-fz-component="FzInput">`, `<div data-fz-component="FzContainer" data-gap="base">`). The agent then does literal substitution rather than shape inference. This is the local equivalent of Figma's `add_code_connect_map` — it's the missing piece that we hypothesized in iter-1 and that iter-2 confirms is necessary for layout/semantic primitives the shape-matcher can't see.
3. **(medium) Post-implementation DS-fidelity gate** in `/implement-design`: re-read the component plan, grep the produced `.vue` files, fail the run if any planned `Fz*` is missing, or if any unplanned raw primitive appears. Currently the visual gate exists but the DS-fidelity gate doesn't.
4. **(cheap) `pnpm lint` autofix on dead deps.** A `depcheck`/`knip` step in CI would have flagged the 6 installed-but-unimported packages immediately. Even a manual `pnpm why` round-trip during the skill's wrap-up phase would catch these.

## What to compare in iteration 3

| Metric                                                         | Iter-1 baseline | Iter-2                                          | Iter-3 target            |
| -------------------------------------------------------------- | --------------- | ----------------------------------------------- | ------------------------ |
| `@fiscozen/*` packages imported                                | 2               | **9**                                           | ≥ 12                     |
| `@fiscozen/*` packages installed                               | 3               | **12**                                          | == imported              |
| Files containing raw `<button>`/`<input>`/`<select>`/`<table>` | 15              | **9**                                           | ≤ 1 (PDF replica only)   |
| Raw primitive occurrences                                      | (high)          | **35**                                          | ≤ ~10 (PDF replica only) |
| Hand-rolled molecules duplicating an existing `Fz*` component  | 12+             | ~8 (badge, card, tab, datepicker, simple-table) | 0                        |
| `FzContainer` used as layout primitive                         | no              | no (not even installed)                         | yes                      |
| Component plan produced and confirmed                          | no              | yes                                             | yes                      |
| Plan adherence at implementation time                          | n/a             | partial (6 dead deps)                           | full                     |
| Playwright screenshot before "done"                            | no              | yes                                             | yes                      |
| DS-fidelity gate before "done"                                 | no              | no                                              | yes                      |

Capture the iteration 3 screenshots to `docs/logs/iter3-*.png` for side-by-side comparison.
