<template>
  <section
    class="relative overflow-hidden bg-gradient-to-b from-primary-50 to-[#F5F7FA]"
    dir="rtl"
  >
    <!-- soft decorative blobs -->
    <div class="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-secondary-200/30 blur-3xl" />

    <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
      <!-- Copy -->
      <div class="flex flex-col items-center text-center lg:items-start lg:text-right">
        <span class="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm ring-1 ring-primary-100">
          <UIcon name="i-heroicons-sparkles" class="h-4 w-4" />
          منصة قدرات وتحصيلي متكاملة
        </span>

        <h1 class="mb-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
          انطلاقتك نحو التفوق
          <span class="block text-primary-600">تبدأ من هنا</span>
        </h1>

        <p class="mb-8 max-w-lg text-lg leading-relaxed text-gray-600">
          كل ما تحتاجه للاستعداد لاختبار القدرات: بنك أسئلة ضخم، اختبارات محاكية،
          خطة دراسية ذكية، ومتابعة لحظية لتقدّمك — في مكان واحد.
        </p>

        <div class="flex flex-col gap-3 sm:flex-row">
          <UButton
            to="/auth/register"
            size="xl"
            trailing-icon="i-heroicons-arrow-left"
            class="px-8 font-bold"
          >
            ابدأ تجربتك المجانية
          </UButton>
          <UButton
            to="/exams"
            size="xl"
            color="neutral"
            variant="outline"
            class="px-8 font-bold"
          >
            تصفّح المنصة
          </UButton>
        </div>

        <p class="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <UIcon name="i-heroicons-gift" class="h-4 w-4 text-secondary-500" />
          ٣ أيام وصول كامل مجاناً — بدون بطاقة بنكية
        </p>
      </div>

      <!-- Visual -->
      <div class="relative flex items-center justify-center">
        <div class="absolute h-[300px] w-[300px] rounded-full border border-primary-300/60 sm:h-[460px] sm:w-[460px]" />
        <div class="absolute h-[240px] w-[240px] rounded-full bg-gradient-to-tr from-primary-500 to-primary-200 sm:h-[380px] sm:w-[380px]" />
        <img
          src="/assets/images/home/hero.png"
          alt="طالب متفوق"
          class="relative z-10 w-[230px] object-contain drop-shadow-2xl sm:w-[330px]"
          @error="hideBrokenImg"
        >

        <!-- floating chips -->
        <div class="absolute left-0 top-10 z-20 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-gray-100">
          <UIcon name="i-heroicons-trophy" class="h-5 w-5 text-secondary-500" />
          <span class="text-sm font-bold text-gray-800">المركز الأول</span>
        </div>
        <div class="absolute bottom-12 right-0 z-20 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-gray-100">
          <UIcon name="i-heroicons-chart-bar" class="h-5 w-5 text-primary-600" />
          <span class="text-sm font-bold text-gray-800">دقّة ٩٢٪</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
function hideBrokenImg(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>
