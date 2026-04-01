<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-primary-900 py-16 sm:py-24">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-[30%] -right-[10%] w-[700px] h-[700px] rounded-full bg-primary-500/20 blur-[120px]" />
        <div class="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-secondary-500/10 blur-[100px]" />
      </div>

      <div class="relative container mx-auto px-4 text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
          بنك الأسئلة <span class="text-primary-400">A+</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          استعد لتفوقك الدراسي مع أكبر منصة للأسئلة والتدريبات لجميع المراحل التعليمية والاختبارات العامة.
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-300" />
          <UInput
            v-model="search"
            size="xl"
            placeholder="ابحث عن اختبار (مثلاً: الصف الأول الثانوي)"
            icon="i-heroicons-magnifying-glass"
            :ui="{
              base: 'rounded-2xl border-none ring-1 ring-white/10 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:ring-primary-500 text-lg py-4',
              icon: { trailing: { pointer: '' } }
            }"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12 -mt-8 relative z-10">
      <div
        v-if="examsStore.isLoading && examsStore.exams.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 text-primary-500 animate-spin mb-4"
        />
        <span class="text-gray-500 animate-pulse">جاري تحميل الاختبارات...</span>
      </div>

      <div
        v-else-if="filteredExams.length === 0"
        class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <UIcon
          name="i-heroicons-face-frown"
          class="w-16 h-16 text-gray-300 mb-4"
        />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          لا توجد نتائج
        </h3>
        <p class="text-gray-500">
          جرب كلمات بحث أخرى
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <NuxtLink
          v-for="exam in filteredExams"
          :key="exam.id"
          :to="`/exams/${exam.id}`"
          class="group block"
        >
          <div
            class="relative h-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 flex flex-col"
          >
            <!-- Icon/Image Container -->
            <div class="mb-6 relative">
              <div
                class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500"
              >
                <UIcon
                  :name="exam.type === 'entrance' ? 'i-heroicons-academic-cap' : 'i-heroicons-clipboard-document-check'"
                  class="w-8 h-8"
                />
              </div>
              <div
                v-if="exam.type"
                class="absolute -top-2 -right-2"
              >
                <UBadge
                  color="primary"
                  variant="solid"
                  size="xs"
                  class="rounded-lg px-2"
                >
                  {{ exam.type === 'entrance' ? 'اختبار دخول' : 'مرحلة دراسية' }}
                </UBadge>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <h3
                class="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ exam.name }}
              </h3>
              <p
                class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2"
              >
                {{ exam.description || `استكشف أسئلة وتدريبات ${exam.name} المحدثة.` }}
              </p>
            </div>

            <!-- Stats -->
            <div class="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <UIcon
                    name="i-heroicons-book-open"
                    class="w-4 h-4 text-primary-500"
                  />
                  <span>{{ exam.subjects_count || 0 }} مادة</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <UIcon
                    name="i-heroicons-squares-plus"
                    class="w-4 h-4 text-secondary-500"
                  />
                  <span>{{ exam.sections_count || 0 }} قسم</span>
                </div>
              </div>
              <UIcon
                name="i-heroicons-arrow-left"
                class="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-[-4px] transition-all"
              />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamsStore } from '@/stores/useExamsStore'

// Public page, no auth middleware
definePageMeta({ layout: 'default' })
useSeoMeta({
  title: 'بنك الأسئلة - استعرض جميع الاختبارات | A Plus',
  description: 'تصفح قائمة الاختبارات والمراحل الدراسية المتوفرة في بنك الأسئلة A Plus. تدرب على آلاف الأسئلة الموثقة.'
})

const examsStore = useExamsStore()
const search = ref('')

const filteredExams = computed(() =>
  examsStore.exams.filter(e =>
    !search.value
    || e.name?.toLowerCase().includes(search.value.toLowerCase())
    || e.description?.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(async () => {
  if (examsStore.exams.length === 0) {
    await examsStore.fetchExams()
  }
})
</script>
