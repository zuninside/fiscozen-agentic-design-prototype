import { RuleTester } from 'eslint'
import tsparser from '@typescript-eslint/parser'
import rule from './domain-boundary.js'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsparser,
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const ACCOUNTING_FILE = '/repo/packages/accounting/src/organisms/Foo/Foo.vue'
const SHARED_FILE = '/repo/packages/shared/src/molecules/Bar/Bar.vue'

ruleTester.run('domain-boundary', rule, {
  valid: [
    // same package via @/ alias
    {
      filename: ACCOUNTING_FILE,
      code: "import { X } from '@/molecules/X'"
    },
    // @fz-design/shared is allowed from any domain
    {
      filename: ACCOUNTING_FILE,
      code: "import { Z } from '@fz-design/shared/molecules'"
    },
    // unrelated bare specifier ignored
    {
      filename: ACCOUNTING_FILE,
      code: "import { FzButton } from '@fiscozen/button'"
    },
    // type-only import is exempt
    {
      filename: ACCOUNTING_FILE,
      code: "import type { T } from '@fz-design/customers/types'"
    },
    // shared importing from itself via @/ alias
    {
      filename: SHARED_FILE,
      code: "import { X } from '@/composables/useX'"
    }
  ],
  invalid: [
    // accounting importing from customers
    {
      filename: ACCOUNTING_FILE,
      code: "import { X } from '@fz-design/customers/molecules'",
      errors: [{ messageId: 'crossDomainImport' }]
    },
    // shared importing from a domain
    {
      filename: SHARED_FILE,
      code: "import { Y } from '@fz-design/accounting/molecules'",
      errors: [{ messageId: 'crossDomainImport' }]
    }
  ]
})

console.log('domain-boundary: OK')
