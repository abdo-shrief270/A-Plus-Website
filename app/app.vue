<script setup lang="ts">
const { locale, locales } = useI18n();

const currentLocale = computed(() => {
  return (locales.value as { code: string; dir?: string }[]).find(
    (l) => l.code === locale.value,
  );
});

useHead({
  htmlAttrs: {
    lang: locale,
    dir: computed(
      () => (currentLocale.value?.dir || "ltr") as "ltr" | "rtl" | "auto",
    ),
  },
  link: [
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
    { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
  ],
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - APlus` : "APlus";
  },
});
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
