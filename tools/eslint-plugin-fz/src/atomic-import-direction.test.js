import { RuleTester } from 'eslint'
import tsparser from '@typescript-eslint/parser'
import rule from './atomic-import-direction.js'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsparser,
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const ACCOUNTING_PAGE = '/repo/packages/accounting/src/pages/InvoiceList/InvoiceList.vue'
const ACCOUNTING_MOLECULE = '/repo/packages/accounting/src/molecules/InvoiceBadge/InvoiceBadge.vue'
const ACCOUNTING_ORGANISM = '/repo/packages/accounting/src/organisms/InvoiceTable/InvoiceTable.vue'

ruleTester.run('atomic-import-direction', rule, {
  valid: [
    // page importing from organism (downward)
    {
      filename: ACCOUNTING_PAGE,
      code: "import { InvoiceTable } from '@/organisms/InvoiceTable'"
    },
    // molecule importing from another molecule (same level)
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import { Other } from '@/molecules/Other'"
    },
    // organism importing from level 0 composables
    {
      filename: ACCOUNTING_ORGANISM,
      code: "import { useFoo } from '@/composables/useFoo'"
    },
    // type-only import is exempt
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import type { Foo } from '@/organisms/Bar'"
    },
    // unrelated bare specifier ignored
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import { FzButton } from '@fiscozen/button'"
    },
    // shared molecule (level 1) importable by molecule (level 1) — same level
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import { X } from '@fz-design/shared/molecules'"
    },
    // pages can bare-import a workspace package (barrel = max level)
    {
      filename: ACCOUNTING_PAGE,
      code: "import { FrontofficeLayout } from '@fz-design/shared'"
    },
    // dynamic import of a same-level entity
    {
      filename: ACCOUNTING_ORGANISM,
      code: "const m = await import('@/organisms/Other')"
    }
  ],
  invalid: [
    // molecule importing from organism (upward)
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import { InvoiceTable } from '@/organisms/InvoiceTable'",
      errors: [{ messageId: 'invalidDirection' }]
    },
    // organism importing from page (upward, big jump)
    {
      filename: ACCOUNTING_ORGANISM,
      code: "import { Page } from '@/pages/Foo'",
      errors: [{ messageId: 'invalidDirection' }]
    },
    // relative upward import
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import { X } from '../../organisms/SomeOrganism'",
      errors: [{ messageId: 'invalidDirection' }]
    },
    // bare-package import from a non-page layer — barrel reaches pages-level
    {
      filename: ACCOUNTING_MOLECULE,
      code: "import { X } from '@fz-design/shared'",
      errors: [{ messageId: 'invalidDirection' }]
    },
    // dynamic upward import is flagged like static
    {
      filename: ACCOUNTING_MOLECULE,
      code: "const m = await import('@/organisms/InvoiceTable')",
      errors: [{ messageId: 'invalidDirection' }]
    },
    // re-export upward is also flagged
    {
      filename: ACCOUNTING_MOLECULE,
      code: "export { Foo } from '@/organisms/Bar'",
      errors: [{ messageId: 'invalidDirection' }]
    }
  ]
})

console.log('atomic-import-direction: OK')
