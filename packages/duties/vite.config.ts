import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Full build so custom-code templates can be compiled at runtime
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5176,
    strictPort: false
  },
  preview: {
    port: process.env.PORT ? Number(process.env.PORT) : 5176
  }
})
