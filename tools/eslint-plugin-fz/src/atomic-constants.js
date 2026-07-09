/**
 * Shared constants and helpers for atomic design ESLint rules.
 *
 * In this repo each domain is its own workspace package at
 * `packages/<domain>/src/...`, so the "domain" is the package name and the
 * "layer" is the first segment after `src/`. Imports use the `@/` alias
 * (local to the current package), relative paths, or bare module specifiers
 * — we recognise `@fz-design/<domain>[/...]` as cross-package references.
 */
import path from 'node:path'

/**
 * Atomic design layer levels (same numbering as the FO PR).
 */
export const ATOMIC_LEVELS = {
  composables: 0,
  types: 0,
  molecules: 1,
  organisms: 2,
  templates: 3,
  pages: 4
}

/**
 * The npm scope used for cross-package references in this repo.
 */
export const WORKSPACE_SCOPE = '@fz-design'

const PACKAGE_RE = /\/packages\/([^/]+)\/src\/(.*)$/

/**
 * Parses an absolute file path and returns `{ domain, pathFromSrc }`.
 *
 *   /repo/packages/accounting/src/molecules/Foo/Foo.vue
 *      → { domain: 'accounting', pathFromSrc: 'molecules/Foo/Foo.vue' }
 *
 * Returns null for paths outside any `packages/<name>/src/`.
 */
export function parsePackagePath(absolutePath) {
  if (!absolutePath) return null
  const m = absolutePath.match(PACKAGE_RE)
  if (!m) return null
  return { domain: m[1], pathFromSrc: m[2] }
}

/**
 * Returns the layer of a path-from-src (`molecules`, `organisms`, ...), or
 * null if the first segment is not a known layer.
 */
export function getLayer(pathFromSrc) {
  if (!pathFromSrc) return null
  return pathFromSrc.split('/')[0] ?? null
}

/**
 * Returns the atomic level of a path-from-src, or -1 if the layer is unknown
 * (e.g. files at the package src/ root such as `App.vue`, `main.ts`, `router.ts`).
 */
export function getAtomicLevel(pathFromSrc) {
  return ATOMIC_LEVELS[getLayer(pathFromSrc)] ?? -1
}

/**
 * Resolves an import source to `{ domain, pathFromSrc }` if it can be mapped
 * to a workspace package. Returns null for unrelated bare specifiers
 * (e.g. `@fiscozen/button`, `vue`).
 */
export function resolveImport(importSource, currentFileAbs) {
  if (!importSource) return null

  // `@/` alias — local to the current package
  if (importSource.startsWith('@/')) {
    const current = parsePackagePath(currentFileAbs)
    if (!current) return null
    return { domain: current.domain, pathFromSrc: importSource.slice(2) }
  }

  // Relative import — resolve against current file then re-parse
  if (importSource.startsWith('.')) {
    const currentDir = path.dirname(currentFileAbs)
    const resolved = path.resolve(currentDir, importSource)
    return parsePackagePath(resolved)
  }

  // Bare module specifier `@fz-design/<domain>[/<subpath>]`
  const m = importSource.match(/^@fz-design\/([^/]+)(?:\/(.*))?$/)
  if (m) {
    // A bare `@fz-design/<domain>` (no subpath) reaches the package barrel
    // (`src/index.ts`), which transitively re-exports any layer the package
    // chooses to surface — including pages/templates. Treat the import as if
    // it targeted the highest layer (`pages/`) so atomic-import-direction
    // flags non-page consumers. Anything that needs a specific layer should
    // use `@fz-design/<domain>/<layer>/...` explicitly.
    return { domain: m[1], pathFromSrc: m[2] ?? 'pages/_barrel' }
  }

  return null
}
