// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Pervasive pre-existing usage across services/stores. Type safety is
    // enforced by `nuxt typecheck` (which is clean); keep this visible as a
    // warning rather than failing CI on legacy `any`.
    '@typescript-eslint/no-explicit-any': 'warn',
    // Markdown/HTML is rendered intentionally (admin-supplied content, sanitized
    // upstream); flag for review without failing the build.
    'vue/no-v-html': 'warn'
  }
})
