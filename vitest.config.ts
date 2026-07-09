import { defineConfig } from 'vitest/config'

// Root-level Vitest config used for non-package code under scripts/.
// Per-package tests are configured inside each packages/<domain>/ workspace
// and run via `pnpm test` (nx run-many) — this config is invoked only by
// `pnpm test:scripts`.
export default defineConfig({
  test: {
    include: ['scripts/**/*.test.ts'],
    environment: 'node'
  }
})
