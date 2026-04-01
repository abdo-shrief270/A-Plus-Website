<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          دوراتي المشترك بها
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          تابع تقدمك في الدورات والمواد التي قمت بالاشتراك بها مؤخراً
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث عن دورة..."
        class="w-full sm:max-w-md"
        size="lg"
      />
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="enrollments.length === 0"
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center"
    >
      <div
        class="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center mx-auto mb-6"
      >
        <UIcon
          name="i-heroicons-video-camera"
          class="w-10 h-10"
        />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        لست مشتركاً في أي دورة بعد
      </h3>
      <p class="text-gray-500 max-w-md mx-auto mb-6">
        تصفح الدورات الأكثر إقبالاً وابدأ رحلتك التعليمية معنا الآن.
      </p>
      <UButton
        to="/dashboard/trending-courses"
        size="lg"
        color="primary"
      >
        تصفح الدورات المتاحة
      </UButton>
    </div>

    <!-- Enrollments Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <NuxtLink
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        :to="
          enrollment.course ? `/dashboard/courses/${enrollment.course.id}` : '#'
        "
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg group"
      >
        <!-- Course Image Fallback -->
        <div class="h-40 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <img
            v-if="enrollment.course?.image"
            :src="enrollment.course.image"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-primary-600/20 group-hover:scale-105 transition-transform duration-500"
          >
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-16 h-16 text-primary-500/30"
            />
          </div>

          <!-- Status Badge -->
          <UBadge
            v-if="enrollment.status === 'active'"
            color="success"
            variant="solid"
            class="absolute top-4 right-4 shadow-sm"
          >
            نشط
          </UBadge>
          <UBadge
            v-else-if="enrollment.status === 'completed'"
            color="primary"
            variant="solid"
            class="absolute top-4 right-4 shadow-sm"
          >
            مكتمل
          </UBadge>
          <UBadge
            v-else
            color="neutral"
            variant="solid"
            class="absolute top-4 right-4 shadow-sm"
          >
            {{ enrollment.status || "غير معروف" }}
          </UBadge>
        </div>

        <div class="p-6 flex flex-col flex-1">
          <p
            class="text-xs text-primary-600 dark:text-primary-400 font-bold mb-2"
          >
            تم الانضمام:
            {{
              enrollment.enrolled_at
                || enrollment.created_at?.split("T")[0]
                || "مؤخراً"
            }}
          </p>

          <h3
            class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2"
          >
            {{
              enrollment.course?.title
                || enrollment.course?.name
                || "اسم الدورة غير متوفر"
            }}
          </h3>

          <p class="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
            {{
              enrollment.course?.description
                || "شاهد محتوى هذه الدورة لتحسين مستواك الدراسي."
            }}
          </p>

          <!-- Progress -->
          <div class="mt-auto">
            <div
              class="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2"
            >
              <span>التقدم في الدورة</span>
              <span>{{ enrollment.progress || 0 }}%</span>
            </div>
            <UProgress
              :value="enrollment.progress || 0"
              color="primary"
              class="h-2"
            />
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination Mockup -->
    <div
      v-if="enrollments.length > 0"
      class="flex justify-center mt-8"
    >
      <UPagination
        v-model="page"
        :page-count="15"
        :total="meta?.total || enrollments.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useSeoMeta({ title: 'دوراتي | A Plus' })

const loading = ref(true)
const enrollments = ref<any[]>([])
const meta = ref<any>(null)

const searchQuery = ref('')
const page = ref(1)

onMounted(async () => {
  await fetchEnrollments()
})

watch(page, () => {
  fetchEnrollments()
})

async function fetchEnrollments() {
  loading.value = true
  try {
    const res = await studentsService.getEnrollments({
      page: page.value,
      search: searchQuery.value || undefined
    })

    const data = res.data?.data || res.data
    enrollments.value = Array.isArray(data) ? data : data?.enrollments || []
    meta.value = res.data?.meta || data?.meta || null
  } catch (error) {
    console.error('Failed to load enrollments', error)
  } finally {
    loading.value = false
  }
}
</script>
