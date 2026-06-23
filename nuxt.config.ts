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
    '@nuxtjs/sitemap',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },
  css: ['~/assets/css/main.css', '~/assets/css/global.css'],

  // Drives canonical URLs, OG images, robots.txt and sitemap.xml.
  // Set NUXT_PUBLIC_SITE_URL to the production domain at deploy time.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://aplus.test/',
    name: 'A Plus'
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'error', 'warning', 'success', 'info'],
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

  vite: {
    server: {
      allowedHosts: true
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
    langDir: '../locales',
    strategy: 'no_prefix'
  }
})
