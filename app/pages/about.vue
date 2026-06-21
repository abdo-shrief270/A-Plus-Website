<template>
  <StaticPage
    slug="about"
    fallback-title="من نحن"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'website' })
useSeoMeta({
  title: 'من نحن | A+',
  description: 'تعرّف على منصة A+ التعليمية ورسالتها.'
})
</script>
