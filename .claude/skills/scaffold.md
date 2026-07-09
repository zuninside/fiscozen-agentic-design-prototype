---
description: Create atomic-design entities or classify a component for the agentic-design hub
---

# /scaffold — Atomic-Design Scaffolding

You are helping a developer or designer work with the atomic-design architecture in `packages/<domain>/src/`.

**IMPORTANT:** Always respond in the same language the developer is using. Use `.claude/skills/atomic-design.md` as the authoritative architectural reference.

## First Step

Always start by asking which flow they want. Use a numbered list:

1. **Create a new entity** — add a component or composable to an existing domain
2. **Help me classify a component** — determine which layer a component belongs to
3. **Create a new domain** — rare; only when adding a brand-new business area

Wait for the developer's answer before proceeding.

The four existing domains are: `accounting`, `customers`, `duties`, `shared`. Most work goes into one of these.

## Flow 1 — Create a new entity

### Step 1 — Ask for details

Ask the developer for three things:

1. **Domain** — which existing domain (`accounting`, `customers`, `duties`, `shared`)? If they pick `shared`, do not allow `page` as the layer in step 2.
2. **Layer** — one of: `molecule`, `organism`, `template`, `page`, `composable`.
3. **Entity name** — PascalCase for components (e.g., `InvoiceTable`); camelCase with `use` prefix for composables (e.g., `useInvoiceFilters`). If the name does not follow the convention, convert it automatically and inform the developer (e.g., `invoice_table` → `InvoiceTable`, `getInvoices` → `useGetInvoices` for composables).

### Step 2 — Create the entity files

Resolve the **package root** as `packages/<domain>` and the **layer plural** (`molecules`, `organisms`, `templates`, `pages`, `composables`).

#### For `molecule`, `organism`, `template`, or `page`

Create `packages/<domain>/src/<layer-plural>/<EntityName>/`:

```
<EntityName>/
    <EntityName>.vue       # see File Templates in atomic-design.md
    index.ts               # export { default as <EntityName> } from './<EntityName>.vue'
    types/
        index.ts           # export {}
```

#### For `composable`

Create `packages/<domain>/src/composables/<useEntityName>/`:

```
<useEntityName>/
    index.ts               # see File Templates in atomic-design.md
```

### Step 3 — Ask about barrel exports & router (page only)

- Ask the developer if they want the entity added to the layer's barrel export (e.g. `packages/<domain>/src/<layer-plural>/index.ts`).
- For **pages only**, ask if they want the page registered in `packages/<domain>/src/router.ts` as a new route. If yes, prompt for the path (default: kebab-case of the entity name) and add the route record.

## Flow 2 — Classify a component

### Step 1 — Ask about the component

Ask the developer to describe the component or provide a file path. If they provide a path, read the file.

### Step 2 — Ask classification questions

Ask these one by one, stopping at the first **yes**:

1. **Is it a route target?** (referenced in `router.ts` as `component`) → **page**
2. **Is it a layout wireframe with no logic, no data, no API?** (slots only) → **template**
3. **Does it compose multiple components AND/OR call APIs via a composable?** → **organism**
4. **Is it a small focused UI element composed of `@fiscozen/*` components only (no `class` / `:class` / `style`)?** → **molecule**
5. **Is it stateful logic or an API wrapper (`use*` function in a `.ts` file)?** → **composable**
6. **Is it a TypeScript `interface` / `type` / `enum`?** → **types** (place in nearest `types/index.ts`)

**Note:** in this repo, no layer (molecules included) may use `class` / `:class` / `style` / `:style` / `<style>`. If a "molecule" candidate cannot be expressed without custom CSS, it's a **DS gap** — stop and report it. The design system never bends to fit a single design; designs adapt to the system, or the system grows via tickets.

Then ask: **Is it used by more than one domain?** → if yes, it belongs in `packages/shared/`, otherwise inside the relevant domain.

### Step 3 — Suggest the classification

Present your suggestion with motivation pulled from `.claude/skills/atomic-design.md`'s rules matrix. Let the developer confirm or override.

## Flow 3 — Create a new domain

This flow is **rare**. Confirm with the developer that adding a domain is the right call before proceeding (most work should go into existing `accounting`, `customers`, `duties`).

### Step 1 — Ask for the domain name

Lowercase, plural where natural (e.g., `payments`, `onboarding`). Convert if needed and inform the developer.

### Step 2 — Create the package

Create `packages/<domain>/` mirroring the structure of `packages/accounting/`:

- `package.json` — name `@fz-design/<domain>`, copy scripts and devDependencies from accounting, change Vite port to the next free one (5174 + offset).
- `tsconfig.json`, `tsconfig.node.json`, `env.d.ts`
- `vite.config.ts`, `vitest.config.ts`, `tailwind.config.cjs`, `postcss.config.cjs`
- `index.html`
- `src/main.ts`, `src/App.vue`, `src/router.ts`, `src/style.css`
- `src/{molecules,organisms,templates,pages,composables,types}/index.ts` — each containing `export {}`
- `src/pages/Home/Home.vue` — placeholder home page

### Step 3 — Update root README and CLAUDE.md

Add the new domain to the domain table.

### Step 4 — Run `pnpm install`

So the new workspace is registered.

## File Templates

See `.claude/skills/atomic-design.md` § File Templates for the canonical templates of `router.ts`, component `.vue`, entity `index.ts`, composable `index.ts`, types/index.ts.

## Rules Reference

For the full architectural reference (dependency hierarchy, rules matrix, naming conventions, classification guide), see `.claude/skills/atomic-design.md`.
