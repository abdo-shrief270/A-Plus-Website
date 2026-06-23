<template>
  <div class="min-h-screen bg-[#F5F7FA] dark:bg-gray-950">
    <!-- Hero Section -->
    <CoursesHero @search="searchQuery = $event" />

    <!-- Filters Section (Sticky) -->
    <CourseFilters
      v-model="filters"
      :total-results="filteredCourses.length"
    />

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Loading State -->
      <div
        v-if="status === 'pending'"
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="flex flex-col gap-4 rounded-2xl bg-white p-4 dark:bg-gray-900"
        >
          <USkeleton class="aspect-[16/9] w-full rounded-xl" />
          <USkeleton class="h-6 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <div class="mt-4 flex justify-between">
            <USkeleton class="h-8 w-20" />
            <USkeleton class="h-8 w-20" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="mb-4 h-16 w-16 text-error-500"
        />
        <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          حدث خطأ أثناء تحميل الدورات
        </h2>
        <p class="mb-6 text-gray-600 dark:text-gray-400">
          يرجى المحاولة مرة أخرى لاحقاً
        </p>
        <UButton
          color="primary"
          @click="() => refresh()"
        >
          إعادة المحاولة
        </UButton>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredCourses.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <img
          src="/logo.svg"
          alt="No results"
          class="mb-6 h-32 opacity-20 grayscale"
        >
        <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          لا توجد نتائج تطابق بحثك
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          جرب البحث بكلمات مختلفة أو تغيير الفلاتر
        </p>
      </div>

      <!-- Courses Grid -->
      <div
        v-else
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        <CourseCard
          v-for="course in filteredCourses"
          :key="course.id"
          :course="course"
          @enroll="handleEnroll"
        />
      </div>
    </UContainer>

    <!-- Footer Space -->
    <div class="h-20" />
  </div>
</template>

<script setup lang="ts">
import { coursesService } from '@/services/api/courses.service'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/helpers/toast.helper'
import type { Course } from '@/types/course'

// Public: guests can browse the catalog. Interactive actions prompt sign-up.
definePageMeta({
  layout: 'website'
})

const authStore = useAuthStore()

useSeoMeta({
  title: 'الدورات التدريبية - A+',
  description: 'اكتشف أفضل الدورات التدريبية لتطوير مهاراتك والتميز في اختباراتك'
})

// State
const searchQuery = ref('')
const filters = ref({
  level: 'all',
  sortBy: 'popular'
})

// Fetch Data
const { data: response, status, error, refresh } = await useAsyncData(
  'public-courses',
  () => coursesService.list({ per_page: 24 }),
  {
    lazy: true,
    server: false
  }
)

const courses = computed<Course[]>(() => {
  const env = response.value?.data as
    | (Course[] & { data?: Course[] | { data?: Course[] } })
    | { data?: Course[] | { data?: Course[] } }
    | undefined
  const inner = env?.data ?? env // unwrap { status, message, data }
  if (Array.isArray(inner)) return inner
  const innerData = inner?.data // unwrap pagination
  return Array.isArray(innerData) ? innerData : []
})

// Computed Filtered Courses
const filteredCourses = computed(() => {
  let result = [...courses.value]

  // Filter by Search Query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.title.toLowerCase().includes(query)
      || c.description.toLowerCase().includes(query)
    )
  }

  // Filter by Level
  if (filters.value.level !== 'all') {
    result = result.filter(c => c.level === filters.value.level)
  }

  // Sort
  switch (filters.value.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''))
      break
    case 'popular':
    default:
      result.sort((a, b) => b.enrollments_count - a.enrollments_count)
      break
  }

  return result
})

// Actions
const handleEnroll = (course: Course) => {
  // Guests must start a free trial / sign in before enrolling.
  if (!authStore.isLoggedIn) {
    showToast('ابدأ مجاناً', 'أنشئ حسابك للحصول على ٣ أيام وصول كامل ثم سجّل في الدورة', 'info')
    return navigateTo('/auth/register')
  }
  navigateTo(`/dashboard/courses/${course.id}`)
}
</script>
