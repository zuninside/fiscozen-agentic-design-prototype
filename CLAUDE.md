# CLAUDE.md — instructions for Claude Code

This file is the project-level brief for any Claude Code session working in `tool.fiscozen.agentic-design`. Read it before making changes.

## Repository purpose

This is a **tool for designers** to create, validate and share pre-production UI/UX designs of the Fiscozen application on feature branches, and then merge them into `main` so the repo becomes a **living catalogue of approved designs**. It bridges:

- **Designers / non-tech stakeholders** creating designs in Claude Design (claude.ai) and handing them off via the "hand off to Claude Code" feature.
- **Claude Code (this tool)** implementing those designs here as runnable Vue 3 code composed **exclusively** out of `@fiscozen/*` components — no custom components, no custom HTML, no custom styles.
- **Software engineers** assisting with design-system gaps (filing `@fiscozen/*` tickets when a design cannot be implemented) and reviewing/merging the resulting PRs.

Read [docs/workflow.md](docs/workflow.md) for the end-to-end flow.

## Architecture: atomic design across four domain apps

This repo has exactly **four domains**:

| Domain       | Type             | Port |
| ------------ | ---------------- | ---- |
| `accounting` | Vue + Vite app   | 5174 |
| `customers`  | Vue + Vite app   | 5175 |
| `duties`     | Vue + Vite app   | 5176 |
| `shared`     | Library (no app) | —    |

Each app is independent — `pnpm --filter @fz-design/<domain> dev` runs only that domain.

Inside every domain, code is organized by **atomic-design layers** in a fractal entity-directory pattern:

```
packages/<domain>/src/<layer-plural>/<EntityName>/<EntityName>.vue + index.ts + types/index.ts
```

Layers, in import order (downward only):

```
pages (4) → templates (3) → organisms (2) → molecules (1) → composables / types (0)
```

For the full reference (rules matrix, naming conventions, classification guide, file templates) see:

- [docs/atomic-design.md](docs/atomic-design.md) — developer guide
- [.claude/skills/atomic-design.md](.claude/skills/atomic-design.md) — agent reference

## Hard rules — these are enforced by ESLint and the write-time hook

1. **Use `@fiscozen/*` exclusively — fail first when no component matches.** Never write a raw `<button>`/`<input>`/`<select>`/`<table>`/`<dialog>` when an `Fz*` component exists. The full inventory of available `@fiscozen/*` packages with versions and exported components lives in [.claude/design-system-inventory.md](.claude/design-system-inventory.md), refreshed automatically at every session start (SessionStart hook → `scripts/refresh-ds-inventory.sh`). Read component source directly at `.cache/design_system/packages/<name>/src/` to learn props/slots/events — the npm README is incomplete. **Install on demand:** if a needed component isn't yet in the target domain's `package.json`, run `pnpm add -F @fz-design/<domain> @fiscozen/<name>@<version>` (you are explicitly authorized to do this for any package in the inventory). **Never** create a custom molecule or hand-rolled approximation when no `@fiscozen/*` component fits — **stop and report a DS gap** to the designer (see [docs/workflow.md](docs/workflow.md) §4.1). When a `@fiscozen/*` component is close but not exact, propose adjusting the **design**, never the component (§4.2). The design system never changes to fit a single design.
2. **Imports flow downward.** A page can import an organism; a molecule cannot import an organism. Same-level imports are allowed.
3. **No cross-domain imports.** `accounting/` cannot import from `customers/`. Use `packages/shared/` for cross-domain entities. (`fz/domain-boundary`)
4. **No API in components.** Never `import { useFzFetch } from '@fiscozen/data'` in a `.vue` file. Wrap API calls in a composable in `<domain>/src/composables/use<Name>Api/index.ts`. Type-only imports are fine. (`fz/no-api-in-components`)
5. **No custom styles, no classes — anywhere.** `class` / `:class` / `style` / `:style` / `<style>` blocks are blocked in **every** layer (molecules included). No Tailwind utilities for layout or typography, ever. For layout use [`@fiscozen/container`](.cache/design_system/packages/container/src/) (`FzContainer`) — never `<div class="flex …">` or `<div class="grid …">`. It exposes `direction` (vertical/horizontal via `horizontal`), `gap` (xs/sm/base/lg/xl/2xl/3xl), `main`, `alignItems`, and `tag`. Install with `pnpm add -F @fz-design/<domain> @fiscozen/container@<version>` if missing. The **only** raw HTML allowed is bare semantic text tags (`<p>`, `<pre>`, `<strong>`, `<em>`, `<code>`, …). When such a tag needs any visual styling (bold, colour, weight, …), use the [`@fiscozen/style`](.cache/design_system/packages/style/src/custom-directives/) directives (`v-bold`, `v-color:<token>`, …) — never a class or inline style. Bare semantic tags with no styling are fine; default browser rendering is acceptable.
6. **Every component lives in its own entity directory.** `<EntityName>/<EntityName>.vue` + `index.ts` + `types/index.ts`. Loose `.vue` files at a layer root are blocked at write time by `.claude/hooks/enforce-atomic-structure.sh`.
7. **Pages wrap in a shared layout.** Every page imports either `FrontofficeLayout` (FO — app clienti, mobile-first; slots `#sidebar`, default, optional `#chat`) or `BackofficeLayout` (BO — tool interno, desktop-first; slots `#sidebar`, default) from `@fz-design/shared/templates`, and slots its organisms into them. The two layouts live in [`packages/shared/src/templates/`](packages/shared/src/templates/) and are composed exclusively out of `FzContainer` — treat them as valid DS components for planning. `/implement-design` step 1 picks the layout from the design and **asks the designer if it's not apparent**.

## Workflow inside Claude Code sessions

The canonical end-to-end flow is in [docs/workflow.md](docs/workflow.md). The session-level rules:

1. **A design implementation request always starts with two questions.** Before writing any code, ask the designer for (a) the **Jira card key** (used verbatim as the branch name `design/<JIRA-KEY>` — e.g., `design/FZ-1234`) and (b) the **team / domain** (one of `accounting`, `customers`, `duties`, `shared`). If either is unknown, stop and ask the designer to obtain it from the engineer. Then create and check out the branch from `main` before any file is written.
2. **Implementing a design (hand-off link, HTML, Figma, screenshot)?** After the two questions above, use [`/implement-design`](.claude/skills/implement-design.md). It enforces the DS-first flow: refresh inventory → component plan → designer confirmation → autonomous install of missing `@fiscozen/*` packages → scaffold → implement → **mandatory** Playwright visual verification. Do not start writing `.vue` files for a design without a confirmed component plan.
3. **Adding or classifying entities outside an end-to-end design?** Start with [`/scaffold`](.claude/skills/scaffold.md) — it enforces directory and naming conventions automatically.
4. **Fail first on DS gaps.** If a part of the design has no `@fiscozen/*` component that matches it visually **and** functionally, stop and report a DS gap (hard rule #1, [docs/workflow.md](docs/workflow.md) §4.1). Never create a custom molecule or approximation. When a component is close but not exact, propose adjusting the **design**, never the component.
5. **Visual verification is mandatory.** After implementing a design, navigate the page via the Playwright MCP server, take a screenshot, and compare it with the design source. Iterate until the screenshot is faithful. Never declare work complete on a soft "looks right" — only on a verified screenshot. If Playwright is unavailable, say so explicitly and stop; do not silently skip.
6. **Lint must pass before "done".** Run `pnpm --filter @fz-design/<domain> lint` (or `pnpm lint` for the whole repo) and fix every error. Auto-fixable issues (`vue/attributes-order`, prettier formatting, kebab-case events) go through `pnpm lint:fix`; the remainder — especially `vue/no-restricted-static-attribute` (any `class=`) and `fz/*` rules — are real violations and must be resolved by switching to the appropriate `@fiscozen/*` component or `FzContainer` per hard rule #5. **Visual + lint** together form the "done" gate.
7. **Use fixtures by default.** Co-locate `fixtures.ts` with the entity. If a design needs realistic loading/error states, opt the domain into MSW (see `docs/atomic-design.md` § 8).
8. **Use the `atomic-design-reviewer` agent** before opening a PR. It checks all six hard rules.
8a. **Run the `fiscozen-design-principles-reviewer` agent** as part of `/implement-design` step 8.5 — it evaluates the implementation against the design team's vendored principles ruleset (Essenzialità, Coerenza, Guida, Conversione, Empatia, plus `confini.md`, microcopy, state framework). The ruleset is vendored under [`.claude/external/fiscozen-design-principles/`](.claude/external/fiscozen-design-principles/) and is intentionally **self-isolated** — see its [`PROVENANCE.md`](.claude/external/fiscozen-design-principles/PROVENANCE.md) for source, disabled features, and how to remove or re-sync.
9. **Push and open the PR automatically once visual + lint pass.** Commit on `design/<JIRA-KEY>`, push, then `gh pr create` against `main` (non-draft). The PR body must include the hand-off link, team/domain, Playwright screenshot(s), and any DS gaps surfaced. If `gh` is missing or unauthenticated, guide the designer through `brew install gh` and `gh auth login` step by step (designers are non-technical — copy-pasteable commands, verify after each step). On push conflicts, walk the designer through resolution in plain language; never expect them to use `git` from the terminal themselves.
10. **Assist with merge or reject from the CLI when asked.** Approve: `gh pr merge <PR> --merge --delete-branch`. Reject: `gh pr close <PR> --delete-branch`. Confirm in plain language before running.

## Data strategy

- **Fixtures by default** — co-located `fixtures.ts` next to entities. Pages and organisms import them directly via composables.
- **MSW opt-in per domain** — when a design needs real loading/error semantics, add `packages/<domain>/src/mocks/{handlers,browser}.ts` and bootstrap from `main.ts` in dev mode.
- **Never hit prod APIs** from this repo. Promotion to production is the engineer's job.

## Tooling cheatsheet

```bash
nvm use                              # Node 22.12
pnpm install                         # needs FONTAWESOME_PACKAGE_TOKEN exported
pnpm dev:accounting                  # → http://localhost:5174
pnpm dev:customers                   # → http://localhost:5175
pnpm dev:duties                      # → http://localhost:5176

pnpm lint                            # all packages, ESLint + atomic rules
pnpm lint:fix                        # autofix where possible
pnpm test                            # all Vitest suites (nx run-many)
pnpm test:affected                   # only changed packages (nx affected)
pnpm type-check                      # all packages, vue-tsc
pnpm build                           # all packages
pnpm format                          # Prettier
```

## When the design system genuinely lacks what you need

A "DS gap" is real only after you've checked [.claude/design-system-inventory.md](.claude/design-system-inventory.md) and read the candidate component's source at `.cache/design_system/packages/<name>/src/`. If no `@fiscozen/*` component fits the design (visually **and** functionally):

1. **Stop. Do not implement a workaround.** No custom molecule, no raw HTML, no approximation, no `TODO` left in code.
2. Report the gap to the designer in plain language: *"Design system gap: `<element>` has no matching `@fiscozen/*` component. Required behaviour: `<…>`. Cannot proceed — please review with the engineer."*
3. Leave the `design/<JIRA-KEY>` branch as-is so the engineer can pick it up, file a `@fiscozen/<package>` ticket on [`fiscozen/design_system`](https://github.com/fiscozen/design_system), and unblock the design once the missing component ships.

When a `@fiscozen/*` component is *close* to what the design needs but not exact, propose adjusting the **design** to fit the component — never propose changing the component. Wait for the designer to accept the design change (or escalate) before writing code.

If the inventory looks stale or incomplete, force a refresh: `DS_INVENTORY_FORCE=1 scripts/refresh-ds-inventory.sh`.

## When in doubt about classification

Run `/scaffold` → "Help me classify a component" — answer ~5 questions, get a layer suggestion with motivation. Override if you disagree, but document why.

## What this repo is **not**

- **Not a Storybook.** The running domain apps are the showcase. Storybook for atoms lives in `fiscozen/design_system`.
- **Not a production app.** No real auth, no real API calls, no analytics, no error tracking. Designs use fixtures or MSW mocks.
- **Not a generic Vue playground.** Every component must use `@fiscozen/*` atoms and respect the atomic-design rules. Throwaway code goes in scratch branches, not in domain folders.

## References

- [docs/atomic-design.md](docs/atomic-design.md) — developer guide
- [docs/atomic-design-adr.md](docs/atomic-design-adr.md) — ADR for these decisions
- [docs/workflow.md](docs/workflow.md) — designer→engineer flow
- [.claude/skills/implement-design.md](.claude/skills/implement-design.md) — `/implement-design` skill (DS-first design implementation)
- [.claude/skills/scaffold.md](.claude/skills/scaffold.md) — `/scaffold` skill
- [.claude/skills/atomic-design.md](.claude/skills/atomic-design.md) — architectural reference for agents
- [.claude/design-system-inventory.md](.claude/design-system-inventory.md) — auto-generated `@fiscozen/*` inventory
- [.claude/agents/atomic-design-reviewer.md](.claude/agents/atomic-design-reviewer.md) — review agent
- [scripts/refresh-ds-inventory.sh](scripts/refresh-ds-inventory.sh) — inventory refresh script (SessionStart hook)
- Frontoffice atomic-design source PR: [it.fiscozen.app#13977](https://github.com/fiscozen/it.fiscozen.app/pull/13977)
- Design system: [fiscozen/design_system](https://github.com/fiscozen/design_system)
