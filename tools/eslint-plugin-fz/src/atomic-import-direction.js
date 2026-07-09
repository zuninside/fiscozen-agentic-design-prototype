/**
 * @fileoverview Enforces atomic-design dependency direction.
 *
 * A file at level N can only import from levels <= N (same-level allowed,
 * upward forbidden). Level 0 (composables, types) is always importable.
 *
 * Levels:
 *   0 — composables, types
 *   1 — molecules
 *   2 — organisms
 *   3 — templates
 *   4 — pages
 *
 * Type-only imports are always allowed (not checked here).
 * Checks static imports, dynamic imports, and re-exports.
 */
import { getAtomicLevel, getLayer, parsePackagePath, resolveImport } from './atomic-constants.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces atomic design dependency direction: a file at level N can only import from levels <= N (same-level allowed, upward forbidden)'
    },
    schema: [],
    messages: {
      invalidDirection:
        'Invalid import direction: {{layer}} (level {{level}}) cannot import from {{targetLayer}} (level {{targetLevel}}). Dependencies must flow downward: pages → templates → organisms → molecules → composables.'
    }
  },
  create(context) {
    const current = parsePackagePath(context.filename)
    if (!current) return {}

    const currentLevel = getAtomicLevel(current.pathFromSrc)
    if (currentLevel === -1) return {}

    const currentLayer = getLayer(current.pathFromSrc)

    function check(node, source) {
      const target = resolveImport(source, context.filename)
      if (!target) return

      const targetLevel = getAtomicLevel(target.pathFromSrc)
      if (targetLevel === -1) return

      // Level 0 (composables, types) is always allowed
      if (targetLevel === 0) return

      if (targetLevel > currentLevel) {
        context.report({
          node,
          messageId: 'invalidDirection',
          data: {
            layer: currentLayer,
            level: String(currentLevel),
            targetLayer: getLayer(target.pathFromSrc),
            targetLevel: String(targetLevel)
          }
        })
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.importKind === 'type') return
        check(node, node.source.value)
      },
      ImportExpression(node) {
        check(node, node.source.type === 'Literal' ? node.source.value : null)
      },
      ExportNamedDeclaration(node) {
        if (node.exportKind === 'type') return
        check(node, node.source?.value ?? null)
      }
    }
  }
}
