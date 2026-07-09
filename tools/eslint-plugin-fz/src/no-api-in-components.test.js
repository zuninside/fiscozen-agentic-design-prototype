import { RuleTester } from 'eslint'
import tsparser from '@typescript-eslint/parser'
import rule from './no-api-in-components.js'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsparser,
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const ORGANISM_VUE = '/repo/packages/accounting/src/organisms/InvoiceForm/InvoiceForm.vue'
const COMPOSABLE_TS = '/repo/packages/accounting/src/composables/useInvoicesApi/index.ts'

ruleTester.run('no-api-in-components', rule, {
  valid: [
    // composable can import @fiscozen/data freely
    {
      filename: COMPOSABLE_TS,
      code: "import { useFzFetch } from '@fiscozen/data'"
    },
    // organism importing a domain composable that wraps the API
    {
      filename: ORGANISM_VUE,
      code: "import { useInvoicesApi } from '@/composables/useInvoicesApi'"
    },
    // type-only import of @fiscozen/data is allowed everywhere
    {
      filename: ORGANISM_VUE,
      code: "import type { Invoice } from '@fiscozen/data'"
    },
    // package path that merely ends in capital-A `Api` is not flagged
    {
      filename: ORGANISM_VUE,
      code: "import { x } from '@anthropic/Api'"
    },
    {
      filename: ORGANISM_VUE,
      code: "import { x } from 'vue/Api'"
    },
    // unrelated package
    {
      filename: ORGANISM_VUE,
      code: "import { ref } from 'vue'"
    },
    // dynamic import of a non-API package is fine
    {
      filename: ORGANISM_VUE,
      code: "const m = await import('lodash-es')"
    }
  ],
  invalid: [
    // organism cannot import @fiscozen/data directly
    {
      filename: ORGANISM_VUE,
      code: "import { useFzFetch } from '@fiscozen/data'",
      errors: [{ messageId: 'apiInComponent' }]
    },
    // *Api filename pattern is blocked in components
    {
      filename: ORGANISM_VUE,
      code: "import { invoiceApi } from './invoiceApi'",
      errors: [{ messageId: 'apiInComponent' }]
    },
    // *Api with explicit extension
    {
      filename: ORGANISM_VUE,
      code: "import { customerApi } from './customerApi.ts'",
      errors: [{ messageId: 'apiInComponent' }]
    },
    // dynamic import of a *Api module is blocked
    {
      filename: ORGANISM_VUE,
      code: "const m = await import('./invoiceApi')",
      errors: [{ messageId: 'apiInComponent' }]
    }
  ]
})

console.log('no-api-in-components: OK')
