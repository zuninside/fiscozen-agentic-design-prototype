/**
 * @fileoverview Enforces domain boundaries in atomic design.
 *
 * Files in domain X cannot import from domain Y. Cross-domain sharing must
 * go through the `shared/` domain. The `shared/` domain can import from
 * other `shared/` entities but never from any domain.
 *
 * Type-only imports are always allowed (not checked here).
 * Checks static imports, dynamic imports, and re-exports.
 */
import { parsePackagePath, resolveImport } from './atomic-constants.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces domain boundaries: files in domain X cannot import from domain Y, only from shared/'
    },
    schema: [],
    messages: {
      crossDomainImport:
        'Cross-domain import not allowed: "{{sourceDomain}}" cannot import from "{{targetDomain}}". Use "@fz-design/shared" for cross-domain dependencies.'
    }
  },
  create(context) {
    const current = parsePackagePath(context.filename)
    if (!current) return {}

    const sourceDomain = current.domain

    function check(node, source) {
      const target = resolveImport(source, context.filename)
      if (!target) return

      if (target.domain === sourceDomain) return
      if (target.domain === 'shared') return

      context.report({
        node,
        messageId: 'crossDomainImport',
        data: {
          sourceDomain,
          targetDomain: target.domain
        }
      })
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
