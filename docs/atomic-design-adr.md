# ADR-001: Atomic Design as the structural backbone of the agentic-design hub

## Status

Accepted

## Date

2026-05-08

## Context

`tool.fiscozen.agentic-design` is a new repository whose purpose is to host **living designs** of the Fiscozen application — runnable Vue code that designers (working in Claude with the design system) can hand to engineers as a starting point for production work, more advanced than a static Figma file.

The hub needs:

- **Predictable structure** so a designer-led prompt to Claude Code produces code that engineers recognise.
- **Architectural symmetry** with the production frontoffice (which has adopted atomic design — see [PR #13977](https://github.com/fiscozen/it.fiscozen.app/pull/13977)) so promoting a living design to production is a copy-with-tweaks, not a rewrite.
- **Boundaries** between business areas (accounting / customers / duties) so designs evolve in parallel without entangling.
- **Lint-time enforcement** because conventions that rely on review get drifted.

The frontoffice atomic-design PR provides a proven template: 5 layers, fractal entity directories, custom ESLint rules, a `/scaffold` skill, a reviewer agent, a write-time hook. We adopt it here — adapted for the fact that this repo has no legacy code to coexist with and uses a different package boundary (multiple domain apps in a Nx + pnpm monorepo, rather than a single Vite app with domain folders inside `src/`).

## Decision

Adopt **Atomic Design** with the following structure:

```
packages/<domain>/src/<layer>/<entity>/
```

### Domains (fixed, plural where natural)

| Domain       | Kind           |
| ------------ | -------------- |
| `accounting` | Vue + Vite app |
| `customers`  | Vue + Vite app |
| `duties`     | Vue + Vite app |
| `shared`     | Library        |

Each app domain is **independent** — its own dev server, its own URL, its own router. There is no host shell aggregating domains. This matches the user-facing definition of a "living design": you launch the relevant domain and see the design exactly as a designer would in production.

### Layers (5 levels + 1 exception)

| Level | Layer          | Purpose                                                                     |
| ----- | -------------- | --------------------------------------------------------------------------- |
| 0     | `types/`       | TypeScript types and interfaces (exception: not a layer, always importable) |
| 0     | `composables/` | Stateful logic, API integration, business rules                             |
| 1     | `molecules/`   | Pure UI components — Tailwind allowed, no API calls                         |
| 2     | `organisms/`   | Data-connected components — orchestrate molecules + composables             |
| 3     | `templates/`   | Page wireframes — compose organisms, no direct data fetching                |
| 4     | `pages/`       | Route targets — bind a template to a route, minimal logic                   |

### Key rules

- **Atoms are not in this repo.** Atomic primitives are `@fiscozen/*` design-system packages — `FzButton`, `FzTable`, `FzBadge`, etc. — installed from npmjs. The hub composes them; it does not redefine them.
- **Dependency direction:** top-down only (`pages → templates → organisms → molecules → composables/types`). Skipping levels and same-level imports are allowed.
- **Domain boundaries:** domain X cannot import from domain Y. Cross-domain sharing goes through `packages/shared/`.
- **API encapsulation:** no `.vue` file imports `@fiscozen/data` or any `*Api` module directly — only domain-level composables can. Type-only imports allowed everywhere.
- **Inline styles forbidden** in every layer. Tailwind classes only in molecules.
- **Recursive entity structure:** sub-components inside an entity are full entity directories. Verbosity is intentional — it prevents over-nesting and bypassing layer rules.
- **ESLint enforcement** at error level — three custom rules in `tools/eslint-plugin-fz` plus Vue style-restriction rules per layer.
- **Claude Code integration:** a `/scaffold` skill creates entities, an `atomic-design-reviewer` agent checks compliance, a write-time hook blocks loose `.vue` files outside the entity-directory pattern.

## Consequences

### Positive

- **Design-to-production parity.** Engineers reviewing a living design see the same architecture they'll be working in — no translation layer.
- **Tight feedback on design-system gaps.** A design that can't be expressed cleanly with `@fiscozen/*` components surfaces a missing component or variation early, not in a sprint planning meeting six weeks later.
- **Parallel work without entanglement.** Three independent domain apps mean three teams (or three Claude Code sessions) can iterate without merge friction.
- **Lint catches drift.** Designers running `pnpm lint:fix` get the rules applied automatically; engineers reviewing PRs see violations as red errors, not as "Hmm, should this be a molecule?" debates.

### Negative

- **More boilerplate per entity** than a flat structure would have. The recursive pattern is verbose by design.
- **Learning curve for designers** unfamiliar with atomic design. Mitigated by the `/scaffold` skill and `docs/atomic-design.md`.
- **Workspace tooling complexity.** Nx + pnpm + per-package Vite/Tailwind/PostCSS configs is more moving parts than a single Vite app. We accept this in exchange for true domain isolation.

### Neutral

- The four domains are **fixed for now**; new domains require adding a workspace package (rare). Most work flows into the existing four.
- ESLint rules apply uniformly — there is no legacy carve-out, since this repo has no legacy code.

## Alternatives Considered

### Single host shell with domains as library packages

One `apps/showcase` runs the dev server; each `packages/<domain>` is a library exporting its router segment. **Rejected:** does not match the user-facing definition of a living design (a designer should be able to launch _just_ `accounting`). Also creates a host coupling that has no production-app equivalent.

### N independent apps with no `shared/` library

Skip `packages/shared/` and force domains to duplicate cross-cutting molecules. **Rejected:** designs that span domains (e.g., a generic empty-state) would diverge across domains, defeating the "design hub" goal. `shared/` keeps the cost of duplication low.

### Lightweight atomic-design (docs only, no ESLint, no skill)

Rely on conventions and code review rather than tooling. **Rejected:** drift is the enemy of architectural patterns. The frontoffice PR demonstrates that ESLint + a write-time hook + a reviewer agent catch ~90% of violations before they land. Cheap to port, expensive to retrofit later.

### Flow-folder structure (`flows/2026-q2-redesign/{step1,step2}`) instead of pages

Group multi-page redesigns under a flow folder, decoupling living-design iteration from production page structure. **Rejected:** breaks symmetry with the production app. A page in production maps 1:1 to a page here. Versioning is handled by git branches and folder naming inside `pages/` if needed.

## Adapted from

- Fiscozen frontoffice atomic-design PR: [LIB-2570 / PR #13977](https://github.com/fiscozen/it.fiscozen.app/pull/13977)
- Brad Frost, _Atomic Design_ (2016)

---

## Addendum (2026-05-18): No custom styles, ever — supersedes the molecules-may-use-Tailwind rule

### Context

The original decision allowed Tailwind utility classes in `molecules/` as the place where styling decisions could "absorb" into the codebase. In practice this opened a loophole: any time a `@fiscozen/*` component didn't quite match a design, the path of least resistance was to write a molecule with custom Tailwind, leave a `TODO(@fiscozen/...)` comment, and ship. The design system never received the upstream pressure, and divergent visual variants accumulated in this repo.

Meanwhile the repo's primary user shifted: this is now a **tool for designers** (non-technical) to create, validate and share pre-production designs on feature branches and merge approved ones into `main` as a living catalogue. For that audience, "the design system handles all styling" is the only sustainable rule — there is no engineer in the inner loop to evaluate when a Tailwind escape hatch is justified.

### Decision

The original rule **"Tailwind utility classes only in molecules"** is replaced with:

> **No `class` / `:class` / `style` / `:style` / `<style>` blocks — anywhere, every layer included.**
>
> The only raw HTML allowed is bare semantic text tags (`<p>`, `<pre>`, `<strong>`, `<em>`, `<code>`, …). When such a tag needs any visual styling, use the `@fiscozen/style` directives (`v-bold`, `v-color:<token>`, …) — never a class or inline style. Use `FzContainer` for layout (never a `<div class="flex …">`).
>
> When a design has no matching `@fiscozen/*` component, **stop and report a DS gap**. No custom molecule, no raw-HTML approximation, no `TODO(@fiscozen/...)`. When a component is close but not exact, propose adjusting the **design**, never the component.

### Consequences

- **Tighter feedback loop with `fiscozen/design_system`.** Every DS gap surfaces as a halted design rather than a silently-divergent molecule. The design system grows on real demand.
- **Designs become more consistent.** Two designs implementing the same status pill cannot diverge — they must both use the same `@fiscozen/badge` variant or both halt with a gap.
- **More designs will halt at first attempt.** This is expected and desirable; it's the price of a clean catalogue. Designs reblock once the missing `@fiscozen/<package>` ships.
- **Molecules become rarer** — they remain useful as composition primitives over `@fiscozen/*` components and `FzContainer`, but never as the home of custom CSS.
- **ESLint and the reviewer agent** are updated to flag any `class=` / `style=` / `<style>` regardless of layer, and to flag any `TODO(@fiscozen/...)` as a violation rather than a marker.
