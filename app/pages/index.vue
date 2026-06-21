<template>
  <div>
    <HomeHero />
    <HomeStats />
    <HomeHowItWorks />
    <HomeAudiences />
    <HomeCoursesPreview />
    <HomePricing />
    <HomeTestimonials />
    <HomeFaq />
    <HomeCta />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'website'
})

useSeoMeta({
  title: 'A+ | منصّتك للتفوق في اختبارات القدرات والتحصيلي',
  description: 'بنك أسئلة ضخم، اختبارات محاكية، خطة دراسية ذكية، ومتابعة لحظية لتقدّمك. ابدأ تجربتك المجانية ٣ أيام بدون بطاقة بنكية.'
})
</script>
