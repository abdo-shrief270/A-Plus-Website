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

  /**
   * ❌ شيلنا تحميل السكربت من هنا
   * عشان ما يتحملش أثناء SSR
   */

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://beon.chat/',
    name: 'Beon'
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

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  compatibilityDate: '2024-07-11',

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.VITE_API_BASE_URL || 'https://api.example.com/api'
    }
  },

  nitro: {
    /**
     * ✅ تفعيل الضغط لتحسين الأداء
     */
    compressPublicAssets: true,

    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
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
  },

  /**
   * ✅ Icons will be loaded on-demand for better performance
   * Instead of bundling all icon collections in the server bundle
   */

  /**
   * ✅ Removed aggressive prefetch/preload disabling
   * Nuxt's smart prefetching will handle resource hints automatically
   */
})
