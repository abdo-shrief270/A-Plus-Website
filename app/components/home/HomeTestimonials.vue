<template>
  <section dir="rtl" class="bg-[#F5F7FA] py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto mb-14 max-w-2xl text-center">
        <h2 class="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          ماذا يقول طلابنا؟
        </h2>
        <p class="text-lg text-gray-600">
          تجارب حقيقية من طلاب وصلوا لأهدافهم مع المنصة
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="t in testimonials"
          :key="t.name"
          class="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <UIcon name="i-heroicons-user" class="h-6 w-6 text-primary-600" />
          </div>
          <h3 class="mb-1 font-bold text-gray-900">
            {{ t.name }}
          </h3>
          <div class="mb-4 flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
            <span>{{ t.rating }}</span>
            <UIcon name="i-heroicons-star-16-solid" class="h-4 w-4 text-secondary-500" />
          </div>
          <p class="text-sm leading-relaxed text-gray-600">
            {{ t.quote }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  { name: 'يمنى عبدالله', rating: '4.7', quote: 'الخطة التعليمية ساعدتني أذاكر منظم لأول مرة، وبنك الأسئلة خلاني أدخل الامتحان وأنا واثق' },
  { name: 'فهد سلمان', rating: '4.2', quote: 'الكورسات المتنوعة وسهولة الوصول لها خلتني أتعلم أشياء جديدة مع دراستي، وبسعر مرة مناسب' },
  { name: 'سعود عبدالعزيز', rating: '4.4', quote: 'أكثر شي عجبني إن المنصة مو بس تعلم، بعد تخليك تختبر نفسك وتعرف نقاط ضعفك' },
  { name: 'نورة عبدالله', rating: '4.1', quote: 'كنت دايماً أتوتر قبل الاختبارات، بس مع الخطة وبنك الأسئلة حسيت كأني أذاكر خطوة بخطوة' }
]
</script>
