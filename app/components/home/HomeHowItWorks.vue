<template>
  <section dir="rtl" class="bg-[#F5F7FA] py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto mb-14 max-w-2xl text-center">
        <h2 class="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          كيف تبدأ؟
        </h2>
        <p class="text-lg text-gray-600">
          ثلاث خطوات بسيطة تفصلك عن خطة استعداد كاملة لاختبارك
        </p>
      </div>

      <div class="relative grid gap-8 md:grid-cols-3">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100"
        >
          <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <UIcon :name="step.icon" class="h-8 w-8" />
          </div>
          <span class="absolute right-6 top-6 text-5xl font-extrabold text-primary-50">
            {{ i + 1 }}
          </span>
          <h3 class="mb-2 text-xl font-bold text-gray-900">
            {{ step.title }}
          </h3>
          <p class="text-gray-600">
            {{ step.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    icon: 'i-heroicons-user-plus',
    title: 'أنشئ حسابك مجاناً',
    body: 'سجّل في دقيقة واحدة واحصل تلقائياً على ٣ أيام وصول كامل لكل المحتوى.'
  },
  {
    icon: 'i-heroicons-map',
    title: 'اختر هدفك وخطّتك',
    body: 'حدّد اختبارك وتاريخه لتبني المنصة لك خطة دراسية يومية مرتّبة.'
  },
  {
    icon: 'i-heroicons-rocket-launch',
    title: 'تدرّب وتابع تقدّمك',
    body: 'حلّ الأسئلة، اخض الاختبارات المحاكية، وراقب أداءك لحظة بلحظة.'
  }
]
</script>
