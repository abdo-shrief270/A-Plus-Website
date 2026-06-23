<script setup lang="ts">
// Arabic-only, RTL-only platform — no locale switching, no LTR.
useHead({
  htmlAttrs: {
    lang: 'ar',
    dir: 'rtl'
  },
  link: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }
  ],
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - APlus` : 'APlus'
  }
})

// Global SEO defaults — individual pages override title/description via useSeoMeta.
useSeoMeta({
  description: 'منصة A+ التعليمية — بنك أسئلة، اختبارات محاكية، وخطة دراسية ذكية للاستعداد لاختبارات القدرات والتحصيلي.',
  ogSiteName: 'A+',
  ogType: 'website',
  ogLocale: 'ar_AR',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
