<template>
  <section dir="rtl" class="bg-white py-12">
    <div class="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex flex-col items-center text-center"
      >
        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <UIcon :name="stat.icon" class="h-7 w-7" />
        </div>
        <p class="text-3xl font-extrabold text-gray-900">
          {{ stat.value }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ stat.label }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '+4000', label: 'طالب وطالبة', icon: 'i-heroicons-user-group' },
  { value: '+15000', label: 'سؤال في بنك الأسئلة', icon: 'i-heroicons-clipboard-document-list' },
  { value: '+300', label: 'دورة واختبار', icon: 'i-heroicons-academic-cap' },
  { value: '٩٢٪', label: 'متوسط رضا الطلاب', icon: 'i-heroicons-face-smile' }
]
</script>
