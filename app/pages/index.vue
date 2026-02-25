<template>
  <div>
    <HomeHero />
    <HomeAbout />
    <HomeTestimonials />
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'website'
})

useSeoMeta({
  title: 'الرئيسية | A Plus',
  description: 'منصة A Plus التعليمية'
})
</script>
