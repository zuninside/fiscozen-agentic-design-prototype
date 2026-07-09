# Atomic Design — Developer Guide

## 1. Why this repo exists

`tool.fiscozen.agentic-design` is a **tool for designers** to create, validate and share pre-production UI/UX designs of the Fiscozen application on feature branches, and merge approved ones into `main` so the repo becomes a **living catalogue of approved designs**. Three audiences meet here:

- **Designers / non-tech stakeholders** create designs in Claude Design (claude.ai) and hand them off via the "hand off to Claude Code" feature, then prompt Claude Code in this repo to implement them.
- **Claude Code** brings those designs into this repo as runnable Vue 3 code, composed **exclusively** out of `@fiscozen/*` components — no custom components, no custom HTML, no custom styles.
- **Software engineers** assist with design-system gaps (filing `@fiscozen/<package>` tickets when no component matches) and review/merge the resulting PRs.

A "living design" is significantly more than a Figma file: it is **runnable Vue code using the actual production component library**, organized by atomic design.

## 2. The Layer Hierarchy

```
    pages             (level 4 — route targets)
      |
  templates           (level 3 — layout wireframes)
      |
  organisms           (level 2 — complex composed components)
      |
  molecules           (level 1 — small UI building blocks)
      |
composables / types   (level 0 — logic and type definitions)
```

**How to read this:**

- Each level can import from any level **below** it (not just the adjacent one).
- Same-level imports are allowed (a molecule can use another molecule).
- **composables/types** are at the base — importable by **all** levels above.
- **No `.vue` component** can import API modules directly — API calls must go through composables.
- **Pages do not require a template wrapper** — a page can compose organisms directly if a layout wireframe is not needed.

**Atoms are not in this repo.** They live in `@fiscozen/*` packages: `FzButton`, `FzTable`, `FzBadge`, `FzInput`, `FzSelect`, `FzDatepicker`, etc. Treat them as your atomic primitives.

## 3. Domain Structure

This repo has exactly four domains:

| Domain       | Type           | Port | Purpose                                       |
| ------------ | -------------- | ---- | --------------------------------------------- |
| `accounting` | Vue + Vite app | 5174 | Invoices, journal, accounting flows           |
| `customers`  | Vue + Vite app | 5175 | Customer onboarding, profiles, communications |
| `duties`     | Vue + Vite app | 5176 | Tax duties, deadlines, payment flows          |
| `shared`     | Library        | —    | Cross-domain entities only                    |

Each domain app is **independent** — `pnpm --filter @fz-design/accounting dev` runs only that domain. There is no host app aggregating them; every domain has its own URL and its own router.

**Domain shape:**

```
packages/<domain>/src/
+-- molecules/           # level 1
|   +-- index.ts         #   barrel
+-- organisms/           # level 2
|   +-- index.ts         #   barrel
+-- templates/           # level 3
|   +-- index.ts         #   barrel
+-- pages/               # level 4 (omitted in shared/)
|   +-- index.ts         #   barrel
+-- composables/         # level 0 — domain-wide stateful logic
|   +-- index.ts
+-- types/               # level 0 — domain-wide types
|   +-- index.ts
+-- router.ts            # routes (omitted in shared/)
+-- App.vue              # app shell (omitted in shared/)
+-- main.ts              # Vite entry (omitted in shared/)
+-- style.css            # Tailwind + design tokens (omitted in shared/)
```

`shared/` omits `pages/`, `router.ts`, and the app entry files — it is a workspace library imported by domain apps via `@fz-design/shared`.

## 4. Entity Structure — The Recursive Pattern

The architecture is built on **one recursive pattern** that repeats at every level.

### The Entity pattern

Every component lives inside its own **entity directory**. An entity directory always has the same structure:

```
<EntityName>/
+-- <EntityName>.vue             # required — component (same name as directory)
+-- index.ts                     # required — barrel export
+-- components/                  # optional — sub-entities (recursive)
|   +-- <SubEntity>/
|   +-- index.ts                 #   barrel
+-- composables/                 # optional — entity-local composables
|   +-- index.ts                 #   barrel
+-- types/                       # optional — entity-scoped types
|   +-- index.ts
+-- utils/                       # optional — entity-scoped pure functions
    +-- someHelper.ts
```

The barrel `index.ts` re-exports the component:

```typescript
export { default as EntityName } from './EntityName.vue'
```

**This is the same pattern at every level.** A sub-component in `components/` is a full entity directory — with its own `index.ts`, `types/`, `composables/`, and even its own `components/` if needed.

### Why recursive?

The recursive structure is an **intentional architectural constraint**:

1. **One pattern to learn.** Whether you're looking at a top-level organism or a sub-component nested 3 levels deep, the structure is identical.
2. **Verbosity as a guardrail.** Creating a sub-component requires a full entity directory. The cost is intentional — it discourages packing too many sub-components inside a single entity.
3. **No shortcuts to bypass rules.** Sub-components follow the same layer rules as their parent. If a sub-component needs Tailwind, it must be extracted as a proper molecule.
4. **Promotion is trivial.** Moving a sub-component to an independent entity is just `mv` — the directory structure is already identical.

### Where does logic go?

| Scope                                            | Where to put it                                                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Used by **1 entity** only                        | Inside the entity's `composables/` directory (e.g. `InvoiceForm/composables/useFormValidation/index.ts`) |
| Used by **multiple entities** in the same domain | `<domain>/composables/` (e.g. `accounting/composables/useInvoicesApi/`)                                  |
| Used by **multiple domains**                     | `shared/composables/`                                                                                    |

Same logic applies to types: entity-local in `EntityName/types/`, domain-wide in `<domain>/types/`, cross-domain in `shared/types/`.

## 5. The `shared/` Domain

`packages/shared/` is the **only** way to share code between domains.

```
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │  accounting  │     │  customers   │     │    duties    │
    └───────┬──────┘     └───────┬──────┘     └───────┬──────┘
            │ ❌ direct          │ ❌ direct          │
            │                    │                    │
            └──────────┬─────────┴────────────────────┘
                       │ ✅ only via
                ┌──────┴──────┐
                │   shared/   │  No pages/, no router.ts
                │             │
                │  molecules/ │
                │  organisms/ │
                │  templates/ │
                │  composable/│
                │  types/     │
                └─────────────┘
```

**Rules:**

- Same structure as a domain, minus `pages/` and `router.ts`.
- Entities in `shared/` follow the same dependency hierarchy and rules as domain entities.
- Only move an entity to `shared/` when it is genuinely used by **two or more** domains. Do not preemptively share.
- `shared/` may import from other `shared/` entities (respecting the hierarchy) but never from any domain.

The `fz/domain-boundary` ESLint rule enforces this.

## 6. Rules Matrix

| Layer           | `class` / `:class` | `style` / `:style` / `<style>` | Direct API calls   | Custom components |
| --------------- | ------------------ | ------------------------------ | ------------------ | ----------------- |
| **molecules**   | ❌ blocked         | ❌ blocked                     | ❌ never           | ❌ never          |
| **organisms**   | ❌ blocked         | ❌ blocked                     | ✅ via composables | ❌ never          |
| **templates**   | ❌ blocked         | ❌ blocked                     | ❌ never           | ❌ never          |
| **pages**       | ❌ blocked         | ❌ blocked                     | ✅ via composables | ❌ never          |
| **composables** | N/A                | N/A                            | ✅ free            | N/A               |
| **types**       | N/A                | N/A                            | N/A                | N/A               |

**Why these constraints?**

- **No custom styles, anywhere.** Designs in this repo are composed entirely out of `@fiscozen/*` components. Use [`FzContainer`](../.cache/design_system/packages/container/src/) for layout (never `<div class="flex …">`). For text emphasis, use bare semantic tags (`<p>`, `<strong>`, `<em>`, `<code>`, `<pre>`) — when they need any visual styling, use the [`@fiscozen/style`](../.cache/design_system/packages/style/src/custom-directives/) directives (`v-bold`, `v-color:<token>`, …), never a class or inline style.
- **No custom components.** When a design has no matching `@fiscozen/*` component, that's a **DS gap** — Claude Code stops and reports it. The engineer files a `@fiscozen/<package>` ticket; a new release lands; the design is unblocked. The design system never bends to fit a single design.
- **API calls live in composables.** Components stay declarative; data shape, error handling, retries, and caching are abstracted in a `useFooApi` composable. A designer-iterated page (running with fixtures) and an engineer-promoted page (running against the real API) share the same composable contract.

## 7. Atoms Live in the Design System

This repo composes `@fiscozen/*` packages as its atomic primitives. Examples:

| Need              | Use                                                        |
| ----------------- | ---------------------------------------------------------- |
| A button          | `import { FzButton } from '@fiscozen/button'`              |
| A table           | `import { FzTable } from '@fiscozen/table'`                |
| A status pill     | `import { FzBadge } from '@fiscozen/badge'`                |
| A form field      | `import { FzInput } from '@fiscozen/input'`                |
| A dropdown        | `import { FzSelect } from '@fiscozen/select'`              |
| A date picker     | `import { FzDatepicker } from '@fiscozen/datepicker'`      |
| A modal           | `import { FzDialog } from '@fiscozen/dialog'`              |
| Layout primitives | `import { FzContainer, FzLayout } from '@fiscozen/layout'` |

**If a design needs an atom that doesn't exist or a variation that isn't supported, Claude Code stops immediately and reports a design-system gap.** No custom approximation, no hand-rolled molecule, no `TODO`. The engineer files a `@fiscozen/<package>` ticket; once a new release lands and is bumped here, the design is unblocked. That's the loop this repo is built for.

## 8. Data Strategy: Fixtures by Default, MSW Opt-In

Living designs need realistic data without hitting prod APIs.

**Default — fixtures:**
Every entity that needs data ships a `fixtures.ts` file alongside it. The page or organism imports the fixture directly.

```
pages/InvoiceList/
+-- InvoiceList.vue
+-- index.ts
+-- fixtures.ts             # export const invoices: Invoice[] = [...]
+-- composables/
|   +-- useInvoiceListData/
|       +-- index.ts        # returns ref(invoices) — swap with composable later
+-- types/
    +-- index.ts
```

**Opt-in — MSW:**
For flows that need realistic loading / error / success states, a domain can adopt [Mock Service Worker](https://mswjs.io/) by adding a `packages/<domain>/src/mocks/` directory with `handlers.ts` and `browser.ts`, then bootstrapping it from `main.ts` in dev mode only.

```
packages/<domain>/src/
+-- mocks/
|   +-- handlers.ts         # MSW handlers (GET /invoices etc.)
|   +-- browser.ts          # setupWorker for dev
```

This way the same `useInvoicesApi` composable that the engineer eventually wires to `@fiscozen/data` runs unchanged here — MSW intercepts the network call and serves the fixture.

Pick MSW when realistic async behavior matters (loading skeletons, retries, error toasts). Otherwise keep it simple with fixtures.

## 9. Tooling Enforcement

Three layers catch violations:

| When                                  | What                                                                                                                | Catches                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Write time** (Claude Code)          | Hook `enforce-atomic-structure.sh`                                                                                  | `.vue` files outside `<EntityName>/<EntityName>.vue` pattern                     |
| **Lint time** (`pnpm lint` / IDE)     | ESLint rules `fz/atomic-import-direction`, `fz/domain-boundary`, `fz/no-api-in-components` + Vue style restrictions | Import direction, domain boundaries, API encapsulation, layer style restrictions |
| **Review time** (`/review` or manual) | Agent `atomic-design-reviewer`                                                                                      | Holistic compliance check across all 6 rules                                     |

The ESLint rules are **error-level** — violations break the lint run. This is a deliberate choice: warnings get ignored, and there is no legacy code in this repo to grandfather.

## 10. FAQ

**Q: Can I put a button styled with Tailwind in a page?**
A: No — and not in a molecule either. **No layer in this repo allows `class` / `:class` / `style`.** Use `FzButton` from `@fiscozen/button` with the appropriate variant. If `FzButton` doesn't expose the look you need, that's a DS gap — stop and report it.

**Q: My page renders fine but ESLint blocks the `class` attribute. What now?**
A: That's the rule working. Replace the styled wrapper with `FzContainer` (for layout) or with the right `@fiscozen/*` component (for everything else). If no DS component fits, stop and report a DS gap — never silence the rule.

**Q: How do I share a molecule between accounting and customers?**
A: Move it to `packages/shared/src/molecules/<MoleculeName>/` and import it as `import { MoleculeName } from '@fz-design/shared/molecules'`. Only do this if it's actually used by both domains — premature sharing is worse than duplication.

**Q: My organism needs to fetch data. Can I import `@fiscozen/data` in the `.vue` file?**
A: No. Create a composable in `<domain>/composables/use<Name>Api/` that imports `@fiscozen/data` and exposes a clean Vue API. Then import the composable from your organism. Type-only imports (`import type { Invoice } from '@fiscozen/data'`) are fine anywhere.

**Q: Where do I put a TypeScript helper that two molecules use?**
A: Domain-level — `packages/<domain>/src/types/index.ts`. If only one molecule uses it, scope it to the entity (`<EntityName>/types/index.ts`).

**Q: Can a template call APIs?**
A: No. Templates are wireframes. They receive data via props and emit events upward. The page composing the template wires API → template via composables.

**Q: Do I need to write tests?**
A: For living designs, optional. The repo provides Vitest setup so designs that develop into reusable molecules can grow tests when promoted toward production. Engineers writing production-bound code should test.

**Q: What about Storybook?**
A: Each domain's running app **is** the showcase. Designers and engineers navigate to the relevant page directly via the dev server. We deliberately don't ship a separate Storybook here — that's the design system's job.

**Q: How do I add a new domain?**
A: Use `/scaffold` → "Create a new domain". This is rare — only when carving out a new business area. Most work goes into existing `accounting`, `customers`, `duties`.
