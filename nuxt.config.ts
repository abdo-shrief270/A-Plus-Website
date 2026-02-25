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
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://aplus.test/api'
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    /**
     * ✅ تفعيل الضغط لتحسين الأداء
     */
    compressPublicAssets: true

    /**
     * ❌ تعطيل الـ prerendering مؤقتاً
     * عشان الـ build يكمل على الـ server
     */
    // prerender: {
    //   routes: ['/'],
    //   crawlLinks: true
    // }
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

  /**
   * ✅ Icons will be loaded on-demand for better performance
   * Instead of bundling all icon collections in the server bundle
   */

  /**
   * ✅ Removed aggressive prefetch/preload disabling
   * Nuxt's smart prefetching will handle resource hints automatically
   */
})
