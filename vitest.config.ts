import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Plain Vitest for pure unit tests (utils, schemas, store logic). Nuxt-runtime
// component tests can be added later with @nuxt/test-utils per-file env.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.{test,spec}.ts'],
    globals: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url))
    }
  }
})
