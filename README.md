# tool.fiscozen.agentic-design

Living designs hub for the Fiscozen application.

This repo bridges three audiences:

- **Designers / non-tech stakeholders** — iterate on ideas in Claude (claude.ai) using the Fiscozen design system as context
- **Claude Code** — implements those designs here with real Vue 3 components from `@fiscozen/*`
- **Software engineers** — review the implementation, identify missing design-system components or variations, then bring the design to production

A "living design" is significantly more than a Figma file: it is runnable Vue code using the actual production component library, organized by atomic design.

## Quick start

```bash
nvm use                              # Node 22.12
pnpm install                         # requires FONTAWESOME_PACKAGE_TOKEN (see below)
pnpm dev:accounting                  # → http://localhost:5174
pnpm dev:customers                   # → http://localhost:5175
pnpm dev:duties                      # → http://localhost:5176
```

### FontAwesome token

`@fiscozen/icons` (a transitive peer of most `@fiscozen/*` packages) depends on the FontAwesome kit `@awesome.me/kit-8137893ad3`, which requires authentication.

Export `FONTAWESOME_PACKAGE_TOKEN` in your shell **before** running `pnpm install`:

```bash
export FONTAWESOME_PACKAGE_TOKEN=<token>
```

Ask a Fiscozen engineer for the value or copy it from the design system repo's `.env`.

## Workspace layout

```
packages/
  accounting/   Vue 3 + Vite app (port 5174)
  customers/    Vue 3 + Vite app (port 5175)
  duties/       Vue 3 + Vite app (port 5176)
  shared/       Library — cross-domain molecules / organisms / templates / composables / types
tools/
  eslint-plugin-fz/   Custom atomic-design ESLint rules
.claude/        Claude Code skills, agents, hooks
docs/           Architecture, ADR, designer→engineer workflow
```

Each domain package is a standalone Vue + Vite application following atomic design (`molecules → organisms → templates → pages`, with `composables` and `types` at level 0).

## Architecture

This repo enforces the same atomic-design rules used by the Fiscozen frontoffice. See:

- [docs/atomic-design.md](docs/atomic-design.md) — full developer guide
- [docs/atomic-design-adr.md](docs/atomic-design-adr.md) — architectural decision record
- [docs/workflow.md](docs/workflow.md) — designer→Claude Code→engineer flow

## Working with Claude Code

This repo ships Claude Code skills, an atomic-design reviewer agent, and a write-time hook. See [CLAUDE.md](CLAUDE.md) for project-specific instructions.

The `/scaffold` slash command (defined in `.claude/skills/scaffold.md`) creates entities and helps classify components.
