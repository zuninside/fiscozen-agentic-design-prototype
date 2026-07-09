---
description: Implement a design (Anthropic Claude design URL, Figma, screenshot, or HTML) into the agentic-design hub using @fiscozen/* atoms with a mandatory component plan and Playwright visual verification
---

# /implement-design — Design implementation flow

You have been asked to implement a design as living code in `tool.fiscozen.agentic-design`. The user is most likely a **designer (non-technical)**. This skill enforces the things that go wrong without it:

1. **Branch + team first** — before any code, get the **Jira key** (used verbatim as the branch name `design/<JIRA-KEY>`) and the **team / domain** (`accounting`, `customers`, `duties`, `shared`). Create and check out the branch from `main` before writing any file.
2. **DS-only — fail first** — every visual primitive must map to a `@fiscozen/*` component. **No custom components, no hand-rolled molecules, no raw HTML approximations, no `TODO(@fiscozen/...)`.** When something has no DS match, stop and report a DS gap. When a DS component is close but not exact, propose adjusting the **design**, never the component.
3. **No custom styles, ever** — no `class` / `:class` / `style` / `:style` / `<style>` blocks **anywhere** (molecules included). The only raw HTML allowed is bare semantic text tags (`<p>`, `<pre>`, `<strong>`, `<em>`, `<code>`, …); when they need any visual styling, use `@fiscozen/style` directives (`v-bold`, `v-color:<token>`).
4. **Plan before code** — no `.vue` files until you've written and the designer has confirmed a component plan.
5. **Visual verification** — the rendered page must be opened in Playwright and the screenshot compared against the design source. No "done" without it.
6. **Auto-push + open PR** — once visual + lint pass, commit, push `design/<JIRA-KEY>`, and `gh pr create` against `main` (non-draft). Guide the designer through `gh` install/auth if missing.

**IMPORTANT:** Always respond in the same language the designer is using, and keep explanations plain — designers are typically non-technical. Reference `.claude/skills/atomic-design.md` for layer rules and `.claude/design-system-inventory.md` for the available `@fiscozen/*` components.

## Step 1 — Gather the design source, Jira key, and team

Before doing anything else, get three things from the designer (ask one at a time, in plain language):

1. **Design source.** If they haven't already provided one, ask for it:
   - **Claude Design hand-off link** (from the "hand off to Claude Code" feature in claude.ai) — fetch with WebFetch and save the HTML to a local path so step 3 can annotate it
   - **Anthropic Claude design URL** (`api.anthropic.com/v1/design/...`) — same treatment
   - **Figma URL** (`figma.com/design/...`, `figma.com/board/...`) — use the Figma MCP server (`get_design_context`, `get_screenshot`)
   - **Screenshot or local file path** — read with the Read tool
   - **Plain HTML / CSS** — read directly
2. **Jira card key.** Ask: *"What's the Jira key for this design? (e.g., FZ-1234)"* If they don't know, stop and ask them to get it from the engineer — do **not** invent one.
3. **Team / domain.** Ask: *"Which team owns this design?"* and offer the current `packages/` subfolders (`accounting`, `customers`, `duties`, `shared`). For now, *team* and *domain* are synonymous. If unclear, stop and ask the engineer.
4. **Layout.** Every design in this hub renders inside one of the two shared layouts:
   - **`FrontofficeLayout`** (`@fz-design/shared` → `templates/FrontofficeLayout`) — FO surface (app clienti, mobile-first). Slots: `#sidebar` (left navigation), default (main content), optional `#chat` (right). Use when the design clearly targets FO, or when the Claude Design hand-off indicates an FO context.
   - **`BackofficeLayout`** (`@fz-design/shared` → `templates/BackofficeLayout`) — BO surface (tool team interno, desktop-first). Slots: `#sidebar` (left), default (main content). Use when the design clearly targets BO.

   **Layout selection rule:** if the layout is unambiguous from the design (e.g., the hand-off explicitly shows a left+main+right shell with mobile collapse → FO; a dense desktop left+main shell with no chat → BO), pick it and announce the pick to the designer ("I'll wrap this in `FrontofficeLayout` — that's the FO standard shell."). If it's **not** apparent, **ask explicitly**:

   > *"I can't tell which standard layout this design uses. Should I wrap it in `FrontofficeLayout` (FO — app clienti, mobile-first) or `BackofficeLayout` (BO — tool interno, desktop-first)?"*

   Treat the two layouts as **valid DS components** for plan-building purposes — they live in `packages/shared/src/templates/` and are composed exclusively out of `FzContainer`. The page template you scaffold in step 7 always wraps its content in the chosen layout.

Once all four are in hand, **create and check out the branch from `main` before writing any file**:

    git checkout main && git pull --ff-only
    git checkout -b design/<JIRA-KEY>      # e.g., design/FZ-1234

Then extract from the design:

- Target **layer** of the deliverable — typically a **page** that composes organisms. Confirm with the designer if unclear.
- Visual structure — list every distinct region (header, side nav, table, form, dialog, status pill, …).

If the design already carries `data-fz-component="Fz..."` annotations (designer-authored or upstream-tool-emitted), **trust them as authoritative**. The annotator in step 3 is non-destructive and will preserve them.

## Step 2 — Confirm the DS inventory is fresh

Read `.claude/design-system-inventory.md`. The SessionStart hook refreshes it on every session, so it should be current. If it's missing or older than 24 hours, force a refresh:

    DS_INVENTORY_FORCE=1 scripts/refresh-ds-inventory.sh

## Step 3 — Annotate the design HTML (deterministic pre-pass)

**Skip this step if the source isn't HTML** (Figma capture rendered as JSX, screenshot, etc.) — the annotator only runs on HTML.

For HTML sources, run the deterministic annotator on the file you saved in step 1:

    pnpm annotate-design <path-to-source.html>

It writes a `<path>.annotated.html` next to the source with `data-fz-component` hints for unambiguous tag-level mappings:

| Tag                                                               | Annotation      |
| ----------------------------------------------------------------- | --------------- |
| `<input type="date" \| "datetime-local" \| "month">`              | `FzDatepicker`  |
| `<input>` (other, except `hidden` / `file`)                       | `FzInput`       |
| `<textarea>`                                                      | `FzTextarea`    |
| `<select>`                                                        | `FzSelect`      |
| `<button>` (only `svg`/`i`/`img`/`span`/`path` children, no text) | `FzIconButton`  |
| `<button>` (anything else)                                        | `FzButton`      |
| `<table>`                                                         | `FzSimpleTable` |
| `<dialog>`                                                        | `FzDialog`      |

Read the stderr summary to know what was mapped:

    annotated 14 element(s):
      FzInput              5
      FzButton             3
      FzDatepicker         2
      ...

**Use the `*.annotated.html` file as the source of truth from here on** — read it when building the plan in step 4 instead of the original.

The annotator is **deliberately conservative**. It does **not** annotate:

- **Compound patterns** — `FzCard` wrapping a header+body+footer, `FzContainer` as a layout primitive (especially nested), `FzTab` formed from a group of `<button>`s as a segmented control, `FzBadge` for status pills (a `<div>` with rounded-full + colour utilities). You must still recognize these from shape and surrounding context in step 4.
- **PDF-faithful replicas** — if the design contains a printed-document mock (e.g., an invoice preview meant to look like paper), the deterministic pass will annotate the inner `<table>` with `FzSimpleTable`, but you should override that in the plan: PDF replicas keep raw HTML for fidelity.

The annotator is **idempotent and non-destructive**: re-running on the output adds nothing, and existing `data-fz-component` attributes are never overwritten.

If the annotator surfaces a count of `0` for a category you expected, that's a signal — either the source is JSX-rendered (use Figma route instead) or the design uses non-standard tags. Investigate before proceeding.

## Step 4 — Build the component plan

For **every visible region** in the (annotated) design, produce a row in this table. The annotator's hints handle the unambiguous primitives — this step is where you make the harder calls (compound patterns, layout primitives, semantic-only badges, gaps).

```
| Region in design          | @fiscozen/* component       | Notes / props / fit                              |
| ------------------------- | --------------------------- | ------------------------------------------------ |
| Top app bar               | @fiscozen/navbar            | Read FzNavbar.vue for slot names                  |
| Vertical sidebar          | @fiscozen/navlist           | + @fiscozen/navlink for items                     |
| KPI summary cards         | @fiscozen/card              |                                                   |
| Invoice table             | @fiscozen/table             | or simple-table if no row selection               |
| Status pill               | @fiscozen/badge             | Map status enum → variant                         |
| New invoice dialog        | @fiscozen/dialog            | FzDialog with confirm slot                        |
| Currency input            | @fiscozen/input             | FzCurrencyInput specifically                      |
| Tipo segmented control    | DS GAP — STOP               | No matching component — report and halt          |
```

Cross-check the plan against step 3's annotation summary: every annotated category should show up at least once in your plan as the corresponding `@fiscozen/*` package. If you decide to _override_ an annotation (e.g., a PDF replica's `<table>`), say so explicitly in the Notes column.

For each component you intend to use, **read its source** to learn props/slots/events:

    .cache/design_system/packages/<name>/src/

Do not guess prop names. The npm README is incomplete — the source is authoritative.

### Fit assessment for each region

For every region, decide which of the three categories it falls into:

- **Exact fit.** `@fiscozen/X` matches the design visually and functionally. Use it.
- **Close fit (needs a *design* change).** `@fiscozen/X` is almost right, but the design uses a variant/slot/prop the component doesn't expose. **Propose the design change to the designer** (e.g., *"FzBadge has no outlined variant. The design system will not be changed. Proposed design change: use the filled `info` variant instead. OK to proceed?"*). Wait for explicit acceptance, then update the plan. We never change the component.
- **DS gap (STOP).** No `@fiscozen/*` component fits visually **and** functionally. **Stop here.** Do not invent a molecule, do not approximate with raw HTML, do not add a `TODO`. Tell the designer in plain language: *"Design system gap: `<element>` has no matching `@fiscozen/*` component. Required behaviour: `<…>`. Cannot proceed — please review with the engineer."* Leave the branch as-is.

Identify the **organisms / pages** that will compose the DS components. There are **no custom molecules** for DS gaps — gaps halt the flow.

## Step 5 — Confirm the plan with the designer

Present the plan as a markdown table along with a short rendering of the layer breakdown. Keep the language plain — designers are non-technical.

> Plan:
>
> - Layout: `FrontofficeLayout` or `BackofficeLayout` (from `@fz-design/shared/templates`) — and which slots are used
> - Page: `<EntityName>` in `<domain>/pages/`
> - Organisms: `<list>` — one per major region, mapped to the layout slots
> - `@fiscozen/*` components to install: `<list>` — packages not yet in the domain's `package.json`
> - Proposed design changes (close-fit components needing a design tweak): `<list with explanation>`
> - DS gaps blocking implementation: `<list>` (if any → we stop here and report)
>
> Does this plan look right?

**Wait for confirmation.** Do not write any `.vue` files yet.

If the designer redirects (e.g., "use simple-table instead of table"), update the plan and re-confirm. If they reject a proposed design change for a close-fit component, treat it as a DS gap and stop.

## Step 6 — Install missing deps

For every `@fiscozen/*` component in the confirmed plan that isn't already in the target domain's `package.json`:

    pnpm add -F @fz-design/<domain> @fiscozen/<name>@<version>

Use the version from `.claude/design-system-inventory.md`. You are explicitly authorized to install `@fiscozen/*` packages without further confirmation when they appear in the inventory.

After installing, run `pnpm install` if pnpm doesn't auto-link, and confirm the import resolves by reading the new entry in `package.json`.

**Do not install packages you don't intend to import.** A package that ships in `package.json` but never appears in any `import` statement is dead weight — and a known iter-2 failure mode. Cross-check at the end of step 7: every package added in this step must have at least one import.

## Step 7 — Scaffold and implement

Create entity directories following `.claude/skills/atomic-design.md` (use `/scaffold` mentally — the conventions are the same). Implement in this order:

1. **Composables** — fixtures, formatters, derived state. Keep API access wrapped here.
2. **Organisms** — compose `@fiscozen/*` atoms. **No raw HTML primitives**, **no `class` / `:class` / `style` / `:style` / `<style>`** — anywhere, ever. Use `FzContainer` for layout (never `<div class="flex …">`). For inline text emphasis, use bare `<p>` / `<strong>` / `<em>` / `<code>` with `@fiscozen/style` directives (`v-bold`, `v-color:<token>`) when styling is needed.
3. **Pages** — compose organisms **inside the chosen layout from step 1**. Import the layout from `@fz-design/shared/templates`, slot organisms into `#sidebar` / default / `#chat` as appropriate. No `class`/`:class`, no direct API calls. Example:

   ```vue
   <script setup lang="ts">
   import { FrontofficeLayout } from '@fz-design/shared/templates'
   import { InvoicesSidebar, InvoicesTable } from '../../organisms'
   </script>

   <template>
     <FrontofficeLayout>
       <template #sidebar><InvoicesSidebar /></template>
       <InvoicesTable />
     </FrontofficeLayout>
   </template>
   ```

4. **Router wiring** — register the page in `packages/<domain>/src/router.ts`.

There are **no custom molecules in this flow**. If a region cannot be built out of existing `@fiscozen/*` components, that's a DS gap and you should have stopped at step 4. If you discover the gap only while implementing, stop now, leave the partial branch as-is, and report the gap to the designer.

The write-time hook (`enforce-atomic-structure.sh`) and ESLint will block layer / structure / domain-boundary / `class` / `style` violations — fix them as they surface by switching to the appropriate `@fiscozen/*` component or `FzContainer`. Do **not** disable or work around the rules.

When you reach a region that the annotator marked with `data-fz-component`, **use that exact component**. If you decide not to (override), justify it in step 9.

## Step 8 — Visual verification with Playwright (mandatory)

This step is **not optional**. The accessibility tree and screenshot are the proof-of-implementation.

1.  Start the dev server in the background:

        pnpm dev:<domain>

    Then wait until it logs the local URL (typically `http://localhost:5174`/`5175`/`5176`). Use the Bash `run_in_background: true` option.

2.  Use the Playwright MCP server:
    - `browser_navigate` to the route you implemented
    - `browser_wait_for` until interactive (wait for a piece of expected text)
    - `browser_snapshot` — read the accessibility tree and check it matches the structural intent of the design (heading hierarchy, landmarks, table semantics)
    - `browser_take_screenshot` — capture the rendered output
    - Read the screenshot file. Compare side-by-side with the design source. Note every divergence: spacing, type scale, color, missing/extra elements, alignment.

3.  Iterate: fix in code → re-snapshot → re-compare. Repeat until the screenshot is a faithful reflection of the design.

4.  Stop the dev server when done.

**If verification cannot run** (Playwright MCP not available, dev server fails to boot, network errors), say so explicitly to the developer and stop. **Never silently skip this step.**

## Step 8.5 — Design-principles review (mandatory)

Once the Playwright screenshot matches the design source, run the design team's principles ruleset against the implementation by invoking the `fiscozen-design-principles-reviewer` agent (defined in `.claude/agents/fiscozen-design-principles-reviewer.md`, backed by the vendored snapshot at `.claude/external/fiscozen-design-principles/`).

Pass the agent:

- **Surface** — `FO` (front-office, app clienti, mobile-first) or `BO` (back-office, tool team interno, desktop-first). Derive from the team/domain chosen in step 1; if ambiguous (e.g., `shared`), **ask the designer** before invoking the agent — surface is required and changes severity + microcopy tone.
- **What's being reviewed** — page name + the entity paths created in step 7 (`packages/<domain>/src/pages/<Name>/...` etc.).
- **User task** — one-line description from the design brief.
- **Hand-off link** from step 1 (so the agent can compare implementation against the original intent if it needs to).

Treat the agent's output as part of the "done" gate:

- **Esito: Approvato** (with or without note) → proceed to step 9 (lint).
- **Esito: Approvato con condizioni** → relay the conditions to the designer in plain language; ask whether to address them now (preferred) or document them as known deviations in the PR body. Proceed only after the designer confirms.
- **Esito: Richiede revisione** → fix the 🟡 findings in code (or, if a finding is functionally justified, get the designer's explicit agreement to leave it and downgrade to "giustificata"). Re-run Playwright if the fix changes the rendering. Re-invoke the reviewer until the esito clears.
- **Esito: Non approvato** → there is at least one 🔴 violation of `confini.md` (non-negotiable). **Stop.** Do not push, do not open a PR. Report the violation to the designer in plain language and wait for direction — the design must be revised before implementation can continue.

If a finding can only be resolved by changing a `@fiscozen/*` component, that's a DS gap — apply the fail-first rule from step 4: stop and report it; do not write a workaround.

Findings carried forward to the PR body in step 11 must include: the agent's verdict, any remaining 🟡 (giustificata) deviations with their justification, and any ⚪ notes.

## Step 9 — Lint gate

Before pushing, run lint on the touched domain and resolve every error:

    pnpm --filter @fz-design/<domain> lint

Auto-fix what you can with `pnpm lint:fix`. The remaining errors — especially `vue/no-restricted-static-attribute` (any `class=` / `style=`) and `fz/*` rules — are real violations and must be resolved by switching to the appropriate `@fiscozen/*` component or `FzContainer`. **Never** report success with a non-zero lint exit code.

## Step 10 — Push the branch and open the PR

Once **visual verification (step 8) and lint (step 9) both pass**, commit, push, and open a non-draft PR:

1. Stage and commit:

       git add -A
       git commit -m "<JIRA-KEY>: <one-line summary>"

2. Push to the remote:

       git push -u origin design/<JIRA-KEY>

   On conflict: walk the designer through resolution in plain language — explain the conflict, propose the resolution, apply it, re-run the push. Designers are not expected to use `git` themselves.

3. Check `gh` (GitHub CLI) is installed and authenticated:

       gh auth status

   If `gh` is missing, guide the designer step by step (copy-pasteable, verify after each):

       brew install gh        # macOS
       gh auth login          # follow the interactive prompts

4. Open the PR (non-draft):

       gh pr create --base main --head design/<JIRA-KEY> \
         --title "<JIRA-KEY> — <design summary>" \
         --body "<PR body, see step 11>"

   Report the PR URL back to the designer.

## Step 11 — PR body / summary

The PR body (and the message you return to the designer) must include:

- **Hand-off link / design source** from step 1
- **Team / domain** chosen in step 1
- **Pages / organisms created** — one bullet each
- **`@fiscozen/*` components used** with versions
- **`@fiscozen/*` packages newly installed** in this run — must equal the set of newly-imported packages (no dead deps)
- **Proposed design changes accepted** in step 4 (close-fit components where the design was adapted to fit the component)
- **Annotator overrides** — list any `data-fz-component` hint from step 3 that you intentionally didn't follow, with the reason (e.g., "PDF-faithful invoice replica — kept raw `<table>`")
- **DS gaps that halted earlier attempts** (if any) — so the engineer can file `@fiscozen/<package>` tickets
- **Screenshot path** from step 8
- **Design-principles review** from step 8.5 — verdict (Approvato / Approvato con condizioni / Approvato con nota), plus any remaining 🟡 giustificata deviations (with justification) and ⚪ notes
- **Open divergences** — anything in the design you couldn't faithfully reproduce, with the reason

Keep it concrete; this is what the reviewer will read first.

## Step 12 — Merge or reject (on designer request)

If the designer asks for help approving or rejecting from the CLI, use `gh` and confirm in plain language before running:

- **Approve & merge:** `gh pr merge <PR-NUMBER> --merge --delete-branch`
- **Reject:** `gh pr close <PR-NUMBER> --delete-branch`

Both can also be done from the GitHub web UI — whichever the designer prefers.
