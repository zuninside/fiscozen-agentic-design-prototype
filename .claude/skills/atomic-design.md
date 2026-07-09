---
description: Atomic-design architecture reference for the agentic-design hub
---

# Atomic Design Architecture Reference

This document defines the architectural rules for the `tool.fiscozen.agentic-design` repository. All code under `packages/<domain>/src/` (and `packages/shared/src/`) must follow these rules. Use this as the authoritative reference when creating, reviewing, or migrating code.

## Domains

This repo has exactly **four domains**:

| Domain       | Type           | Port | Purpose                                                          |
| ------------ | -------------- | ---- | ---------------------------------------------------------------- |
| `accounting` | Vue + Vite app | 5174 | Living designs for invoices, journal, accounting flows           |
| `customers`  | Vue + Vite app | 5175 | Living designs for customer onboarding, profiles, communications |
| `duties`     | Vue + Vite app | 5176 | Living designs for tax duties, deadlines, payment flows          |
| `shared`     | Library        | —    | Cross-domain entities only                                       |

**Adding a new domain** is rare and requires explicit owner approval — typically when a new business area is carved out. Most new work goes into one of the four existing domains.

## Domain Structure

Every domain contains exactly these subdirectories (the "5 layers" plus types):

```
<domain>/src/
    molecules/         # Level 1 — small UI building blocks
        index.ts       #   barrel
    organisms/         # Level 2 — complex composed components
        index.ts       #   barrel
    templates/         # Level 3 — layout/wireframe components
        index.ts       #   barrel
    pages/             # Level 4 — route targets
        index.ts       #   barrel
    composables/       # Level 0 — stateful logic, API integration
        index.ts       #   barrel
    types/             # Level 0 — TypeScript types and enums
        index.ts       #   barrel
    router.ts          # Domain routes (not in shared/)
    App.vue            # App shell (not in shared/)
    main.ts            # Vite entry (not in shared/)
    style.css          # Tailwind + design tokens (not in shared/)
```

The `shared/` package omits `pages/`, `router.ts`, `App.vue`, `main.ts`, `style.css` — it is a library, not a runnable app.

## Entity Structure

Every component lives in its own **entity directory**:

```
<layer-plural>/<EntityName>/
    <EntityName>.vue       # The Vue single-file component
    index.ts               # Barrel: export { default as <EntityName> } from './<EntityName>.vue'
    composables/           # Optional — entity-local composables
    types/
        index.ts           # Types specific to this entity (or `export {}`)
    utils/                 # Optional — entity-local pure functions
```

Composables, when used as standalone entities (not inside a component), live in:

```
composables/<useEntityName>/
    index.ts               # The composable function
    types/                 # Optional
    utils/                 # Optional
```

### Sub-entities (recursive pattern)

An entity may contain sub-entities in a `components/` directory. Sub-entities are **full entity directories**:

```
<layer-plural>/<EntityName>/
    <EntityName>.vue
    index.ts
    components/                    # Sub-entities
        <SubEntityName>/
            <SubEntityName>.vue
            index.ts
            types/
                index.ts
        index.ts                   # Barrel
```

Rules:

- Sub-entities are full entity directories, not loose files. The verbosity is intentional — it discourages over-nesting and prevents sneaking layer-rule violations into sub-components.
- Sub-entities follow the same layer rules as the parent.
- Sub-entities are scoped to the parent — never imported by sibling entities.
- If a sub-entity needs different layer rules or is reused elsewhere, extract it as an independent entity in the appropriate layer.

## Dependency Hierarchy

```
Level 4: pages
   |
Level 3: templates
   |
Level 2: organisms
   |
Level 1: molecules
   |
Level 0: composables, types
```

A component at level N may import from any level ≤ N. Same-level imports are allowed (a molecule can compose another molecule). Composables and types (level 0) are importable by all levels.

Pages do not require a template wrapper — a page can compose organisms directly.

## Rules Matrix

| Level | Layer       | `class` / `style` | Direct API calls           | Can import from                                                                                                 | Imported by                                  |
| ----- | ----------- | ----------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 0     | composables | N/A               | YES                        | composables, types, shared composables, `@fiscozen/*`                                                           | all levels                                   |
| 0     | types       | N/A               | N/A                        | types, shared types                                                                                             | all levels                                   |
| 1     | molecules   | NO                | NO                         | composables, types, shared molecules/composables/types, `@fiscozen/*`                                           | organisms, templates, pages, other molecules |
| 2     | organisms   | NO                | YES, via composables       | molecules, composables, types, shared organisms/molecules/composables/types, `@fiscozen/*`                      | templates, pages, other organisms            |
| 3     | templates   | NO                | NO (delegate to organisms) | organisms, molecules, composables, types, shared templates/organisms/molecules/composables/types, `@fiscozen/*` | pages, other templates                       |
| 4     | pages       | NO                | YES, via composables       | templates, organisms, molecules, composables, types, all shared, `@fiscozen/*`                                  | router only                                  |

### Key constraints

- **Atoms live in the design system, not here.** This repo composes `@fiscozen/*` packages — `FzButton`, `FzTable`, `FzBadge`, `FzInput`, etc. — as its atomic primitives.
- **Pages wrap their content in a shared layout.** Every page imports either `FrontofficeLayout` or `BackofficeLayout` from `@fz-design/shared/templates` and slots its organisms into `#sidebar` / default / `#chat` (FO only). The two layouts are part of the design-system surface for the purposes of this hub — treat them like any other `@fiscozen/*` component when planning. A page that renders organisms directly without a layout wrapper is an error.
- **No `class` / `:class` / `style` / `:style` / `<style>` blocks — anywhere.** Every layer, molecules included. No Tailwind utilities for layout or typography, ever. Use [`FzContainer`](../../.cache/design_system/packages/container/src/) for layout (never `<div class="flex …">`). The only raw HTML allowed is bare semantic text tags (`<p>`, `<pre>`, `<strong>`, `<em>`, `<code>`, …). When such a tag needs any visual styling, use the [`@fiscozen/style`](../../.cache/design_system/packages/style/src/custom-directives/) directives (`v-bold`, `v-color:<token>`, …) — never a class or inline style.
- **No custom components.** When a design has no matching `@fiscozen/*` component, that's a **DS gap** — stop and report it; do not write a hand-rolled molecule, raw HTML approximation, or `TODO(@fiscozen/...)`. When a component is close but not exact, propose adjusting the **design**, never the component.
- **API calls** in organisms and pages must go through composables, never directly. The `fz/no-api-in-components` ESLint rule blocks `@fiscozen/data` imports in `.vue` files. Type-only imports (`import type { Invoice } from '@fiscozen/data'`) are allowed everywhere.
- **Templates** are wireframes. They never make API calls. They receive data via props and emit events.
- **Molecules** never make API calls. Pure UI built only out of `@fiscozen/*` components.

## Cross-Domain Rule

A component or composable in domain A must never import directly from domain B. All cross-domain sharing goes through `shared/`:

```
# WRONG
import { CustomerCard } from '@/customers/molecules/CustomerCard'

# CORRECT (if the component is genuinely shared)
import { CustomerCard } from '@fz-design/shared/molecules'
```

The `shared/` package follows the same structure as a domain, minus `pages/` and `router.ts`. Only move an entity to `shared/` when it is used by **two or more** domains. Do not preemptively share.

The `fz/domain-boundary` ESLint rule enforces this.

## Naming Conventions

### Directories

- **Domain names:** lowercase, plural where natural (`accounting`, `customers`, `duties`, `shared`)
- **Layer directories:** always plural (`molecules/`, `organisms/`, `templates/`, `pages/`, `composables/`, `types/`)
- **Component entity directories:** PascalCase (`InvoiceTable/`, `PaymentSummary/`)
- **Composable entity directories:** camelCase with `use` prefix (`useInvoiceFilters/`, `usePaymentStatus/`)

### Files

- **Component files:** PascalCase matching the entity directory (`InvoiceTable.vue`)
- **Composable entry point:** always `index.ts`
- **Barrel exports:** always `index.ts`
- **Type files:** always `index.ts` inside a `types/` directory
- **Route files:** always `router.ts`

### Exports

- Use barrel exports (`index.ts`) at every level: entity, layer, and domain.
- Components: `export { default as EntityName } from './EntityName.vue';`
- Composables: `export function useEntityName() { ... }`

## Component Classification Guide

Use this decision tree:

1. **Is it a route target?** (referenced as `component` in router) → **page**
2. **Is it a layout wireframe with no logic?** (slots only, no data, no API) → **template**
3. **Does it compose multiple components and/or call APIs (via composables)?** → **organism**
4. **Is it a small focused UI building block, possibly using Tailwind?** → **molecule**
5. **Is it stateful logic or an API wrapper (`use*`)?** → **composable**
6. **Is it a TypeScript interface/type/enum?** → **types**
7. **Is it used by more than one domain?** → it belongs in `shared/`

## File Templates

### `router.ts`

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { Home } from './pages/Home'

const routes: RouteRecordRaw[] = [{ path: '/', name: 'home', component: Home }]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### Domain `index.ts` (re-exports)

```typescript
export {}
```

### Component `.vue`

```vue
<script setup lang="ts">
// <EntityName>
</script>

<template>
  <div />
</template>
```

### Entity `index.ts` (component)

```typescript
export { default as <EntityName> } from './<EntityName>.vue'
```

### Composable `index.ts`

```typescript
export function <useEntityName>() {
  // TODO: implement
}
```

### Entity `types/index.ts`

```typescript
export {}
```
