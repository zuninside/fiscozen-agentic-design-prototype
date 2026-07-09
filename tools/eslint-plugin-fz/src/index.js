/**
 * eslint-plugin-fz — atomic-design rules for the agentic-design hub.
 *
 * See `docs/atomic-design.md` for the full architecture reference.
 */
import atomicImportDirection from './atomic-import-direction.js'
import domainBoundary from './domain-boundary.js'
import noApiInComponents from './no-api-in-components.js'

export default {
  meta: {
    name: 'eslint-plugin-fz',
    version: '0.0.0'
  },
  rules: {
    'atomic-import-direction': atomicImportDirection,
    'domain-boundary': domainBoundary,
    'no-api-in-components': noApiInComponents
  }
}
