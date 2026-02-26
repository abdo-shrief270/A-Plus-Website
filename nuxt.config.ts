// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/robots',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },
  css: ['~/assets/css/main.css', '~/assets/css/global.css'],

  site: {
    url: 'https://aplus.test/',
    name: 'A Plus'
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  ui: {
    theme: {
      colors: ['primary', 'error', 'warning', 'success', 'info'],
      transitions: true,
      defaultVariants: {
        color: 'neutral',
        size: 'sm'
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://control.apls-edu.com/api'
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    compressPublicAssets: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    locales: [
      { code: 'ar', name: 'العربية', file: 'ar.ts', dir: 'rtl' }
    ],
    defaultLocale: 'ar',
    lazy: true,
    langDir: '../locales',
    strategy: 'no_prefix'
  }
})
