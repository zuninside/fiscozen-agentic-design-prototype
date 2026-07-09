# Iteration 3 — Fatture.html implementation (annotator pre-pass)

> **⚠️ Superseded by commit `b30d36c` ("tighten lint/FzContainer rules") and the DS-gap workflow in [`.claude/skills/implement-design.md`](../../.claude/skills/implement-design.md) §4.** Several molecules below (notably `TipoSegmentedControl`, `TipoPill`, `StatusBadge`, `StatusChipFilter`) are hand-rolled DS approximations: under the current rules these are **DS-gap halts**, not implementations. Do not treat this log as a template to imitate — read it only as a record of where the agent was _before_ the fail-first DS-gap rule landed. The annotator stats and DS-coverage trend remain valid; the molecule inventory is the part that's stale.

**Date:** 2026-05-08
**Session:** Claude Code session `6593e9e1-56e8-4f62-b914-dbfd7cd22189`, run after commit `df7ad97` (`feat: add deterministic design-HTML annotator pre-pass`).
**Goal:** re-run the iter-1/iter-2 prompt with the new annotator pre-pass on top of the DS-first instrumentation, and measure how much further it closes the gap iter-2 surfaced — specifically the "shopping-list disconnect" (planned packages installed but not imported) and the persistence of raw `<button>`/`<input>`/`<select>` inside molecules.

## Original prompt

> Fetch this design file, read its readme, and implement the relevant aspects of the design.
> https://api.anthropic.com/v1/design/h/uO6oouykNOKvEcZ5fe5tJw?open_file=Fatture.html
>
> Implement: Fatture.html

The design hash differs from iter-1 (`3IXUUHEKGzPK-eoFDviHdw`) and iter-2 (`T6WHptA45qU1PZu1oVgVqw`) because the source page was re-shared, but `Fatture.html` is the same target.

## Session cost

Pulled from `~/.claude/projects/.../6593e9e1-…jsonl` (the on-disk transcript Claude Code writes per session).

| Metric                        | Value                          |
| ----------------------------- | ------------------------------ |
| Model                         | `claude-opus-4-7`              |
| Wall-clock duration           | **46.3 min** (19:32→20:18 UTC) |
| Assistant turns w/ usage      | 327                            |
| Fresh input tokens            | 437                            |
| Cache-creation input tokens   | 474,310                        |
| Cache-read input tokens       | 55,962,612                     |
| Output tokens                 | 135,645                        |
| **Total input (all sources)** | **56,437,359**                 |

Cache hit rate (read / read+create) ≈ **99.2%** — sharply better than iter-2's ~75%, partly because the annotator pre-pass dropped a large chunk of design HTML into the cache early and partly because the agent did far less mid-session re-exploration. Total input dropped from iter-2's 68.7M to 56.4M (−18%) and output collapsed from 1.02M to 0.14M (−87%) — the agent wrote less code overall (18 `.vue` files vs 39) and spent less time scaffolding/re-scaffolding.

## What the agent produced

| Layer       | Count | Notes                                                                                                                                   |
| ----------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| pages       | 2     | `Home`, `Fatture` (in-page `view = 'list' \| 'detail'` state — same shape as iter-2)                                                    |
| organisms   | 7     | `FattureHeaderBar`, `FattureKpiGrid`, `FattureTable`, `FattureToolbar`, `InvoiceDetailSidebar`, `InvoiceForm`, `InvoicePreviewPane`     |
| molecules   | 8     | `FattureSidebar`, `InvoiceListCard`, `InvoicePreview`, `KpiCard`, `StatusBadge`, `StatusChipFilter`, `TipoPill`, `TipoSegmentedControl` |
| composables | 4     | `useFormatters`, `useInvoiceFixtures`, `useInvoiceTotals`, `useStatusMeta`                                                              |
| templates   | 0     | (none)                                                                                                                                  |

**18 `.vue` files in total** (iter-2: 39, iter-1: 35). The agent collapsed the iter-2 over-fragmentation — fewer wrappers, fewer one-off molecules. Sizes are also healthier: largest organism `InvoiceForm` is 355 lines and largest molecule `InvoicePreview` is 292 lines (PDF replica). No 600-line monsters.

### Routes wired

- `/` → `Home`
- `/fatture` → `Fatture` (detail still rendered via in-page state toggle on the same route)

Same URL-contract divergence as iter-2 vs iter-1. Worth flagging again for engineer review (back-button / shareability semantics) but not a DS regression.

## Design-system usage

What was actually imported from `@fiscozen/*`:

| Package                  | Files using it | Components                       |
| ------------------------ | -------------- | -------------------------------- |
| `@fiscozen/avatar`       | 1              | `FzAvatar`                       |
| `@fiscozen/badge`        | 1              | `FzBadge` (+ `FzBadgeTone` type) |
| `@fiscozen/button`       | 5              | `FzButton`, `FzIconButton`       |
| `@fiscozen/datepicker`   | 1              | `FzDatepicker`                   |
| `@fiscozen/divider`      | 1              | `FzDivider`                      |
| `@fiscozen/icons`        | 3              | `FzIcon`                         |
| `@fiscozen/input`        | 3              | `FzInput`, `FzCurrencyInput`     |
| `@fiscozen/select`       | 1              | `FzSelect`                       |
| `@fiscozen/simple-table` | 1              | `FzColumn`                       |
| `@fiscozen/tab`          | 1              | `FzTab`, `FzTabs`                |
| `@fiscozen/table`        | 1              | `FzTable`                        |
| `@fiscozen/textarea`     | 1              | `FzTextarea`                     |
| `@fiscozen/style`        | 1 (main.ts)    | `setupFzStyle`                   |

**12 of 47 `@fiscozen/*` packages imported** (iter-2: 9, iter-1: 2). Hits the iter-3 target of ≥ 12.

The agent now reaches into the DS for non-trivial primitives it previously hand-rolled: `FzCurrencyInput` for invoice line amounts, `FzDatepicker` for date fields, `FzTab/FzTabs` for the dati-generali / righe / pagamento tab strip, `FzAvatar` for sidebar contact tiles, `FzDivider` between form sections, `FzBadge` for status chips inside `StatusBadge`, and `FzTable + FzColumn` (with built-in pagination via `:pages` + `v-model:active-page`) replacing both the iter-2 hand-rolled `<table>` and the standalone pagination concern.

### Installed but never imported

| Package                | Usages | Why it's dead                                                                                                    |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `@fiscozen/card`       | 0      | KpiCard is hand-rolled; gap flagged with `// TODO(@fiscozen/card) — FzCard is title-led …` in `KpiCard.vue:2`    |
| `@fiscozen/navlink`    | 0      | Sidebar nav is `FzIcon`-only icons; no nav-list variant matched                                                  |
| `@fiscozen/navlist`    | 0      | Sidebar invoice list is hand-rolled; gap flagged with `// TODO(@fiscozen/navlist) — …` in `FattureSidebar.vue:2` |
| `@fiscozen/pagination` | 0      | `FzTable` ships its own pagination — installing the standalone package was redundant from the plan stage         |

**4 dead deps**, down from iter-2's **6**. And critically, **2 of the 4 dead deps are paired with explicit `// TODO(@fiscozen/<pkg>)` gap comments in the molecule that replaced them** — exactly the convention CLAUDE.md asks for. The agent is no longer "silently dropping the plan"; it is consciously deciding the DS shape doesn't fit and flagging the gap.

`@fiscozen/pagination` is the one genuine planning miss: there was nothing in the inventory or `FzTable` source to tell the agent that table pagination is built in, so the package was added defensively. `@fiscozen/navlink` is the one un-flagged dead dep — minor.

`@fiscozen/container` is still not installed, and layout still uses raw `<div class="flex flex-col gap-X">`. The annotator pre-pass landed in `df7ad97` but layout-primitive annotations don't yet seem to influence container adoption.

### Raw HTML primitives

The forensic count from `grep -rEn "<(button|input|select|textarea|dialog|table|td|th|tr|thead|tbody)[ >/]"`:

| File                                          | Raw primitives                    | Verdict                                                                                     |
| --------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------- |
| `molecules/InvoicePreview/InvoicePreview.vue` | 2× `<table>` + many `<td>`/`<th>` | **defensible** — PDF-faithful invoice replica (same role as iter-2's `FatturaDocument.vue`) |
| _everything else_                             | 0                                 | —                                                                                           |

**Zero raw `<button>`/`<input>`/`<select>`/`<textarea>` anywhere in the tree.** This is the single biggest delta from iter-2: the smoking-gun `LineItemsEditor.vue` pattern (`const inputBase = '…' ; <input :class="inputBase" />`) is gone. Sibling files that previously inlined raw form controls now compose `FzInput` / `FzCurrencyInput` / `FzSelect` / `FzTextarea`. The "raw primitive occurrences" metric drops from iter-2's **35 across 9 files** to **only `<table>` markup inside the PDF replica molecule**.

## Lint state

Hard data, not vibes:

```
$ pnpm --filter @fz-design/accounting lint
✖ 439 problems (297 errors, 142 warnings)
```

By rule:

| Rule                                 |      Count | Meaning                                                              |
| ------------------------------------ | ---------: | -------------------------------------------------------------------- |
| `vue/attributes-order`               |        131 | alphabetical order on bound attrs                                    |
| `vue/no-restricted-static-attribute` |         75 | **`class=` used in organisms/pages — direct hard-rule #5 violation** |
| `vue/attribute-hyphenation`          |         70 | kebab-case props (e.g. `:detail-mode`) instead of camelCase          |
| `vue/v-on-event-hyphenation`         |         21 | kebab-case event names (`@new-invoice`) instead of camelCase         |
| `prettier/prettier`                  | 142 (warn) | trailing commas, line breaks                                         |

**This is a new failure mode that iter-3 surfaces clearly: the agent shipped without running `pnpm lint`.** Or ran it and ignored the output. The hard rules around `class=` on organisms/pages — which CLAUDE.md elevates to non-negotiable — are violated 75 times across `Fatture.vue`, `FattureHeaderBar`, `FattureKpiGrid`, `FattureTable`, `FattureToolbar`, `InvoiceDetailSidebar`, `InvoiceForm`, `InvoicePreviewPane`, and `Home.vue`. Many of these are layout `<div>`s (`flex flex-col gap-X`, `grid grid-cols-…`) that should be a molecule wrapper or — once installed — `FzContainer`.

The same agent that correctly avoided every raw `<input>` did not run `pnpm lint --fix` once. Auto-running it would have removed `vue/attributes-order`, the prettier warnings, and most kebab-case-event hits. Leaving roughly the 75 `class=` errors and the prop hyphenation as actual semantic problems — a far cleaner signal.

This points to the same _adherence-at-implementation-time_ gap iter-2 diagnosed, but expressed in lint output instead of dead deps.

## Visual references

Captured at iteration end via the Playwright MCP server, viewport 1440×2400, full page.

- [`iter3-fatture-list.png`](./iter3-fatture-list.png) — list view at `/fatture`
- [`iter3-fattura-detail.png`](./iter3-fattura-detail.png) — detail view, "Dati generali" tab
- [`iter3-fattura-detail-righe.png`](./iter3-fattura-detail-righe.png) — detail view, "Righe" tab (line-items editor with `FzCurrencyInput`)
- [`iter3-fattura-detail-pagamento.png`](./iter3-fattura-detail-pagamento.png) — detail view, "Pagamento e note" tab

The screenshots are the most faithful so far. The "polish gap" the user observed vs the Claude Design source is real but small, and most of it is downstream of the design itself: the source HTML's spacing/rounding/hover affordances are not perfectly DS-aligned, so the implementation inherits the imprecision. Two genuinely fixable spots remain:

1. **KPI grid** uses a hand-rolled `KpiCard` (TODO-flagged) — it lacks the small chrome (corner shadow, hover) that an `FzCard` would provide.
2. **`StatusChipFilter` row** above the table is hand-rolled chips. Whether `FzBadge` or `FzTab` is the right primitive is genuinely unclear from the design — engineer review territory.

## Diagnosis

Three things changed between iter-2 and iter-3, in order of impact:

1. **Annotator pre-pass + the `// TODO(@fiscozen/<pkg>)` gap-flag convention** turned the "shopping-list disconnect" into a "deliberate gap with a paper trail". Iter-2 had 6 dead deps and zero gap markers; iter-3 has 4 dead deps and 2 of them are paired with TODO comments naming the missing variant. The agent is no longer drifting from the plan — it's choosing to deviate and recording why.
2. **DS adoption inside molecules has crossed a threshold.** Once `LineItemsEditor`-style raw-input molecules disappear, the rest of the tree composes cleanly: every form control in `InvoiceForm` is an `Fz*` component, `FattureTable` uses `FzTable + FzColumn` end-to-end, status/tipo cells are `FzBadge`/`FzIcon`. Iter-2's "molecule layer is the leak" is closed.
3. **A new leak shows up at a different layer: lint adherence.** 297 ESLint errors, 75 of which are direct hard-rule violations (`class=` on organism/page roots). The agent's bias to inline `flex` / `grid` Tailwind on the _root element of an organism_ (where it cannot be expressed via a child molecule) is currently uncontested. The plan + Playwright gates do not include "lint must pass" — and they should.

What's _structurally_ unaddressed since iter-2:

- `FzContainer` still not installed, still no usage. The annotator runs _before_ implementation, but layout-primitive substitution is not a literal token swap (an annotated `<div data-fz-component="FzContainer">` still has to be turned into the right `<FzContainer gap="…" direction="…">`), so it loses to inline Tailwind.
- Routes still collapse to `/fatture` only — the in-page `view = 'list' | 'detail'` toggle persists. Engineer-review item, not a DS-fidelity item.

## What went well

- **Files containing raw form/button primitives:** 9 → **0** (PDF-replica `<table>` excluded).
- **Raw primitive occurrences:** 35 → **0** outside the PDF replica.
- **`@fiscozen/*` packages imported:** 9 → **12** (target met).
- **`@fiscozen/*` packages installed:** 12 → **17**, of which **13 are actually used**.
- **Plan-to-implementation adherence:** 6 dead deps → **4**, with **2 of those 4 paired with explicit TODO gap-flags**.
- **Component plan produced and confirmed**, **Playwright visual verification** ran end-of-session — both gates from `/implement-design` held.
- **Atomic-design layer split** still correct, **domain isolation** preserved, **composables wrap data access**, **fixtures only**, no API calls, no `<style>` blocks.
- **Page tree is leaner** — 18 `.vue` files vs 39 in iter-2. Less scaffolding, more leverage on DS primitives.

## What to address before iteration 4

In rough order of cost-vs-payoff:

1. **(cheap, very high impact) Make `pnpm lint` part of the `/implement-design` "done" gate.** This single change would catch the 75 hard-rule-#5 violations, force `pnpm lint --fix` on the agent, and convert the 75 `class=`-on-organism errors into the actual fix work (extract the wrapper into a molecule, or use `FzContainer`). The gate already has Playwright; adding lint is a one-line change in the skill.
2. **(cheap) `pnpm exec depcheck` (or equivalent) at end-of-run** to flag installed-but-unimported `@fiscozen/*` deps. Forces the agent to either remove the dep, replace the hand-rolled molecule, or annotate the gap with a TODO. Iter-3 already TODO-flagged 2 of 4; this would make all 4 explicit.
3. **(medium) Install `@fiscozen/container` as a default dep for any new domain implementing layout-heavy designs**, and have the annotator emit `data-fz-component="FzContainer"` for `flex` / `grid` wrappers. The token-swap convention works for `FzInput`/`FzSelect` because they map 1:1 to `<input>`/`<select>`; `FzContainer` needs a more aggressive substitution (props derivation), which is currently missing.
4. **(medium) Camelize prop and event names in the annotator output.** ~90 of the 297 lint errors are kebab-case props/events the agent picked up from the design HTML. If the annotator emits `:detailMode` / `@newInvoice` instead of `:detail-mode` / `@new-invoice`, those errors vanish without any extra cost.
5. **(low) Decide on the `/fatture/:id` vs in-page-state question once.** This has now diverged from iter-1 in two consecutive runs; either pin it in CLAUDE.md or in the design HTML as a comment.

## Comparison table — three iterations

| Metric                                                            | Iter-1 baseline | Iter-2                              | **Iter-3**                                               | Iter-3 target          |
| ----------------------------------------------------------------- | --------------- | ----------------------------------- | -------------------------------------------------------- | ---------------------- |
| `@fiscozen/*` packages imported                                   | 2               | 9                                   | **12**                                                   | ≥ 12                   |
| `@fiscozen/*` packages installed                                  | 3               | 12                                  | **17**                                                   | == imported            |
| Installed-but-unimported deps                                     | 0               | 6                                   | **4** (2 with `TODO(@fiscozen/*)` gap-flags)             | 0                      |
| Files containing raw `<button>`/`<input>`/`<select>`/`<textarea>` | 15              | 9                                   | **0**                                                    | ≤ 1 (PDF replica only) |
| Raw primitive occurrences (non-PDF-replica)                       | (high)          | 35                                  | **0**                                                    | ≤ ~10                  |
| Hand-rolled molecules duplicating an existing `Fz*` component     | 12+             | ~8                                  | **2** (KpiCard, FattureSidebar — both TODO-flagged)      | 0                      |
| `FzContainer` used as layout primitive                            | no              | no (not even installed)             | **no** (still not installed)                             | yes                    |
| Component plan produced and confirmed                             | no              | yes                                 | **yes**                                                  | yes                    |
| Plan adherence at implementation time                             | n/a             | partial (6 dead deps, no gap flags) | **mostly full** (4 dead deps, 2 with explicit gap flags) | full                   |
| Playwright screenshot before "done"                               | no              | yes                                 | **yes**                                                  | yes                    |
| DS-fidelity gate before "done"                                    | no              | no                                  | **no**                                                   | yes                    |
| `pnpm lint` clean before "done"                                   | n/a             | n/a                                 | **no — 297 errors, 75 of them hard-rule violations**     | yes                    |
| `.vue` file count (lower is leaner)                               | 35              | 39                                  | **18**                                                   | —                      |

The dominant story across three iterations: each round closes the previous failure mode and exposes the next. Iter-1 leaked DS adoption entirely → iter-2 fixed adoption but leaked at the molecule's raw-primitive layer → iter-3 fixed the molecule layer but leaks at lint adherence. Iteration 4's job is to add `pnpm lint` to the "done" contract, install `FzContainer`, and tighten the annotator's prop/event casing.
