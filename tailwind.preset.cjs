/**
 * Shared Tailwind preset for all packages in this monorepo.
 *
 * Adopts the design tokens from `@fiscozen/style` (colors, spacing, font sizes,
 * border radii, breakpoints) and adds the content globs every package needs.
 *
 * Per-package `tailwind.config.cjs` should:
 *   1. List this file in `presets`
 *   2. Override `content` if the package has a non-standard layout
 */
const fzStyleConfig = require('@fiscozen/style/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [fzStyleConfig],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // pnpm keeps the real @fiscozen sources under `.pnpm/@fiscozen+<pkg>@<ver>_<hash>/node_modules/@fiscozen/<pkg>/`
    // (the flat `node_modules/@fiscozen/` is a per-package symlink farm, not present at the workspace root),
    // so Tailwind must scan the .pnpm store directly to pick up utility classes used by design-system components.
    '../../node_modules/.pnpm/@fiscozen+*/node_modules/@fiscozen/*/src/**/*.{vue,js,ts}',
    '../../node_modules/.pnpm/@fiscozen+*/node_modules/@fiscozen/*/dist/**/*.{js,mjs,cjs}'
  ]
}
