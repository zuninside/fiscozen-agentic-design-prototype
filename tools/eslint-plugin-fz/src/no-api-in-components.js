/**
 * @fileoverview Enforces that API calls go through composables only.
 *
 * No `.vue` file and no `.ts` file outside `composables/` may import API
 * modules directly. This ensures all API logic is encapsulated in composables.
 *
 * Blocked patterns:
 *   - `@fiscozen/data`
 *   - Files matching `*Api.ts`, `*Api.js`, `*Api.vue`, or bare `*Api`
 *
 * Type-only imports (`import type { ... }`) are allowed everywhere.
 * Domain-level composables (`@/composables/...`) are exempt — they are the
 * legitimate place to wrap API calls.
 *
 * Checks static imports, dynamic imports, and re-exports.
 */
import { getLayer, parsePackagePath } from './atomic-constants.js'

const COMPONENT_LAYERS = new Set(['molecules', 'organisms', 'templates', 'pages'])

function isApiImport(source) {
  if (source.startsWith('@fiscozen/data')) {
    return true
  }

  // Exempt domain-level composables that wrap APIs (e.g.
  // `@/composables/useInvoicesApi`). Match only when `composables` is the
  // first segment after the alias, NOT entity-local composable dirs (e.g.
  // `@/organisms/InvoiceForm/composables/localHelper`).
  const aliasStripped = source.replace(/^@\//, '')
  if (!source.startsWith('.') && aliasStripped.split('/')[0] === 'composables') {
    return false
  }
  if (source.startsWith('.') && source.includes('/composables/')) {
    return false
  }

  // Catch *Api file imports (e.g. `@/invoiceApi`, `./customerApi.ts`).
  // Match only on the *basename* of the import, and require it to be
  // camelCase ending in `Api` (lowercase letter or digit, then `Api`).
  // This rejects false positives like `@anthropic/Api`, `vue/Api`, or any
  // package path that merely happens to end in the literal string `Api`.
  const basename = source
    .split('/')
    .pop()
    .replace(/\.(ts|js|vue)$/i, '')
  if (/[a-z0-9]Api$/.test(basename)) {
    return true
  }

  return false
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces that .vue component files cannot import API-related modules directly — API calls must go through composables'
    },
    schema: [],
    messages: {
      apiInComponent:
        'API imports are not allowed in components. API calls must go through composables. Move API logic to a composable in the domain\'s composables/ directory. Forbidden import: "{{source}}".'
    }
  },
  create(context) {
    const current = parsePackagePath(context.filename)
    if (!current) return {}

    const layer = getLayer(current.pathFromSrc)
    if (!COMPONENT_LAYERS.has(layer)) return {}

    return {
      ImportDeclaration(node) {
        if (node.importKind === 'type') return
        const importSource = node.source.value
        if (isApiImport(importSource)) {
          context.report({
            node,
            messageId: 'apiInComponent',
            data: { source: importSource }
          })
        }
      },
      ImportExpression(node) {
        if (node.source && node.source.type === 'Literal') {
          const importSource = node.source.value
          if (isApiImport(importSource)) {
            context.report({
              node,
              messageId: 'apiInComponent',
              data: { source: importSource }
            })
          }
        }
      },
      ExportNamedDeclaration(node) {
        if (node.exportKind === 'type') return
        if (node.source) {
          const importSource = node.source.value
          if (isApiImport(importSource)) {
            context.report({
              node,
              messageId: 'apiInComponent',
              data: { source: importSource }
            })
          }
        }
      }
    }
  }
}
