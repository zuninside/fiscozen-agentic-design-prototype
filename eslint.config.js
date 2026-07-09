import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

import fz from 'eslint-plugin-fz'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nx/**',
      '**/coverage/**',
      '**/.vite/**',
      '**/*.timestamp-*'
    ]
  },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettierConfig,

  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        defineModel: true,
        defineProps: true,
        defineEmits: true,
        defineExpose: true,
        defineOptions: true
      },
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        parser: tsparser,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      fz,
      prettier,
      vue
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { caughtErrors: 'none', argsIgnorePattern: '^_' }
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['vue'],
              importNames: [
                'defineProps',
                'defineEmits',
                'defineExpose',
                'defineOptions',
                'defineModel'
              ],
              message: 'Vue macros can be used within <script setup> without importing.'
            }
          ]
        }
      ],
      'prettier/prettier': 'warn',

      // Vue conventions — error level (consistent with FO pages config)
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/block-order': ['error', { order: ['script[setup]', 'script', 'template', 'style'] }],
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': 'error',
      'vue/first-attribute-linebreak': 'error',
      'vue/html-self-closing': [
        'error',
        {
          html: { component: 'always', normal: 'always', void: 'always' },
          math: 'always',
          svg: 'always'
        }
      ],
      'vue/multi-word-component-names': 'off',
      'vue/no-deprecated-delete-set': 'error',
      'vue/no-mutating-props': 'error',

      // Style restrictions: no class, :class, style, :style, <style> — anywhere.
      // Every layer (molecules included) must compose @fiscozen/* components only.
      // Use FzContainer for layout and @fiscozen/style directives (v-bold, v-color) for text.
      'vue/no-restricted-block': [
        'error',
        { element: 'style', message: '<style> tag is not allowed in any layer' }
      ],
      'vue/no-restricted-static-attribute': [
        'error',
        {
          key: 'class',
          message:
            '`class` is not allowed in any layer. Use @fiscozen/* components and FzContainer.'
        },
        { key: 'style', message: '`style` attribute is not allowed' }
      ],
      'vue/no-restricted-v-bind': [
        'error',
        {
          argument: 'class',
          message:
            '`:class` is not allowed in any layer. Use @fiscozen/* components and FzContainer.'
        },
        { argument: 'style', message: '`:style` binding is not allowed' }
      ],
      'vue/order-in-components': 'error',
      'vue/prop-name-casing': 'error',
      'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }]
    }
  },

  // Atomic design — architectural rules across all layers + types
  {
    files: [
      'packages/*/src/composables/**/*.{js,ts}',
      'packages/*/src/molecules/**/*.{js,ts,vue}',
      'packages/*/src/organisms/**/*.{js,ts,vue}',
      'packages/*/src/templates/**/*.{js,ts,vue}',
      'packages/*/src/pages/**/*.{js,ts,vue}',
      'packages/*/src/types/**/*.{js,ts}'
    ],
    rules: {
      'fz/atomic-import-direction': 'error',
      'fz/domain-boundary': 'error',
      'fz/no-api-in-components': 'error'
    }
  },

  // (No molecule override — molecules follow the same no-class / no-style rule as every layer.)

  // ESLint plugin tests run with Node's test runner
  {
    files: ['tools/eslint-plugin-fz/**/*.test.js'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },

  // Node-side config files (CommonJS or ESM)
  {
    files: [
      '**/vite.config.*',
      '**/vitest.config.*',
      '**/tailwind.config.*',
      '**/tailwind.preset.*',
      '**/postcss.config.*',
      '**/*.cjs'
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node }
    }
  }
]
