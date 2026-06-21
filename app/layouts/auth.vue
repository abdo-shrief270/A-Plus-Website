<template>
  <div dir="rtl" class="grid min-h-screen lg:grid-cols-2">
    <!-- Branded panel -->
    <div class="relative hidden overflow-hidden bg-gradient-to-br from-primary-700 to-primary-500 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary-400/20 blur-3xl" />

      <NuxtLink to="/" class="relative flex items-center gap-2">
        <img src="/logo.svg" alt="A+" class="h-12 brightness-0 invert">
      </NuxtLink>

      <div class="relative">
        <h1 class="mb-4 text-4xl font-extrabold leading-tight text-white">
          انطلاقتك نحو التفوق تبدأ من هنا
        </h1>
        <p class="mb-8 max-w-md text-lg text-primary-100">
          بنك أسئلة ضخم، اختبارات محاكية، وخطة دراسية ذكية — كل ما تحتاجه للاستعداد لاختبارك.
        </p>
        <ul class="space-y-3">
          <li v-for="item in highlights" :key="item" class="flex items-center gap-3 text-primary-50">
            <UIcon name="i-heroicons-check-circle" class="h-6 w-6 shrink-0 text-secondary-300" />
            {{ item }}
          </li>
        </ul>
      </div>

      <p class="relative flex items-center gap-2 text-sm text-primary-100">
        <UIcon name="i-heroicons-gift" class="h-5 w-5 text-secondary-300" />
        ٣ أيام وصول كامل مجاناً — بدون بطاقة بنكية
      </p>
    </div>

    <!-- Form side -->
    <div class="flex flex-col items-center justify-center bg-[#F5F7FA] px-6 py-12">
      <div class="w-full max-w-md">
        <!-- mobile logo -->
        <NuxtLink to="/" class="mb-8 flex justify-center lg:hidden">
          <img src="/logo.svg" alt="A+" class="h-12">
        </NuxtLink>

        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <slot />
        </div>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-gray-500 transition-colors hover:text-primary-600">
            العودة للصفحة الرئيسية
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const highlights = [
  'آلاف الأسئلة مع شرح لكل إجابة',
  'اختبارات محاكية وذاتية بتوقيت حقيقي',
  'متابعة لحظية لتقدّمك وتحليل لأدائك'
]
</script>
