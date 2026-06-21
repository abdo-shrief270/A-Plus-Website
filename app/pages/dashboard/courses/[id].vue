<template>
  <div>
    <!-- Top bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <UButton
          to="/dashboard/courses"
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-right"
          class="rtl:[&>span:first-child]:rotate-180"
          square
        />
        <div>
          <p class="text-xs text-gray-500">
            <NuxtLink
              to="/dashboard/courses"
              class="hover:text-primary-600"
            >
              الكورسات
            </NuxtLink>
            <span class="mx-1">›</span>
            <span>تفاصيل الكورس</span>
          </p>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 truncate max-w-2xl">
            {{ course?.title ?? '...' }}
          </h1>
        </div>
      </div>

      <div
        v-if="course"
        class="flex items-center gap-2"
      >
        <UButton
          v-if="authStore.isStudent && enrollments.isEnrolled(course.id)"
          to="/dashboard/enrollments"
          color="success"
          variant="soft"
          icon="i-heroicons-check-badge"
        >
          مسجّل بالفعل
        </UButton>
        <UButton
          v-else
          color="primary"
          icon="i-heroicons-user-plus"
          @click="enrollOpen = true"
        >
          {{ authStore.isStudent ? 'سجّل في الكورس' : 'اشتراك للأبناء' }}
        </UButton>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-24"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!course"
      class="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-error-50 flex items-center justify-center mb-4">
        <UIcon
          name="i-heroicons-academic-cap"
          class="w-10 h-10 text-error-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        لم نعثر على هذا الكورس
      </h2>
      <p class="text-sm text-gray-500 mb-5">
        قد يكون الكورس محذوفاً أو غير متاح حالياً.
      </p>
      <UButton
        to="/dashboard/courses"
        color="primary"
      >
        العودة لقائمة الكورسات
      </UButton>
    </div>

    <!-- Content -->
    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      <!-- Main column -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Cover -->
        <div class="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 shadow-sm">
          <img
            v-if="course.image"
            :src="course.image"
            :alt="course.title"
            class="w-full h-full object-cover"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-20 h-20 text-primary-400"
            />
          </div>
          <div class="absolute top-4 right-4 flex flex-wrap items-center gap-2">
            <span
              v-if="course.level"
              class="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-primary-700 shadow-sm"
            >
              {{ levelLabel(course.level) }}
            </span>
            <span
              v-if="course.rating"
              class="px-3 py-1 rounded-full bg-secondary-500 text-xs font-bold text-white shadow-sm flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-star-solid"
                class="w-3.5 h-3.5"
              />
              {{ course.rating }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-primary-600"
            />
            عن الكورس
          </h3>
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {{ course.description || 'لا يوجد وصف لهذا الكورس بعد.' }}
          </p>
        </div>

        <!-- Exams (target stages) -->
        <div
          v-if="course.exams?.length"
          class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-5 h-5 text-primary-600"
            />
            الاختبارات المستهدفة
          </h3>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="exam in course.exams"
              :key="exam.id"
              color="primary"
              variant="soft"
            >
              {{ exam.name }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Sidebar info -->
      <aside class="space-y-4">
        <!-- Price card -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p class="text-xs text-gray-500 mb-1">
            السعر
          </p>
          <p class="text-3xl font-bold text-primary-700 mb-4">
            {{ formatPrice(course.price) }}
          </p>
          <UButton
            v-if="authStore.isStudent && enrollments.isEnrolled(course.id)"
            to="/dashboard/enrollments"
            color="success"
            variant="soft"
            size="lg"
            block
            icon="i-heroicons-check-badge"
          >
            مسجّل بالفعل — عرض تسجيلاتي
          </UButton>
          <UButton
            v-else
            color="primary"
            size="lg"
            block
            icon="i-heroicons-user-plus"
            @click="enrollOpen = true"
          >
            {{ authStore.isStudent ? 'سجّل في الكورس' : 'اشتراك للأبناء' }}
          </UButton>
        </div>

        <!-- Quick stats -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          <div class="px-5 py-3.5 flex items-center justify-between">
            <span class="text-sm text-gray-500 flex items-center gap-2">
              <UIcon
                name="i-heroicons-clock"
                class="w-4 h-4"
              />
              عدد الساعات
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ course.total_hours || 0 }} ساعة
            </span>
          </div>
          <div class="px-5 py-3.5 flex items-center justify-between">
            <span class="text-sm text-gray-500 flex items-center gap-2">
              <UIcon
                name="i-heroicons-play-circle"
                class="w-4 h-4"
              />
              عدد المحاضرات
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ course.lectures_count || 0 }}
            </span>
          </div>
          <div
            v-if="course.enrollments_count != null"
            class="px-5 py-3.5 flex items-center justify-between"
          >
            <span class="text-sm text-gray-500 flex items-center gap-2">
              <UIcon
                name="i-heroicons-users"
                class="w-4 h-4"
              />
              عدد المشتركين
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ formatNumber(course.enrollments_count) }}
            </span>
          </div>
          <div
            v-if="course.start_date"
            class="px-5 py-3.5 flex items-center justify-between"
          >
            <span class="text-sm text-gray-500 flex items-center gap-2">
              <UIcon
                name="i-heroicons-calendar"
                class="w-4 h-4"
              />
              يبدأ في
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ formatDate(course.start_date) }}
            </span>
          </div>
          <div
            v-if="course.end_date"
            class="px-5 py-3.5 flex items-center justify-between"
          >
            <span class="text-sm text-gray-500 flex items-center gap-2">
              <UIcon
                name="i-heroicons-flag"
                class="w-4 h-4"
              />
              ينتهي في
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ formatDate(course.end_date) }}
            </span>
          </div>
          <div class="px-5 py-3.5 flex items-center justify-between">
            <span class="text-sm text-gray-500 flex items-center gap-2">
              <UIcon
                name="i-heroicons-chart-bar"
                class="w-4 h-4"
              />
              المستوى
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ levelLabel(course.level) }}
            </span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Enroll modal (role-aware) -->
    <DashboardCoursesEnrollStudentModal
      v-if="authStore.isStudent"
      v-model:open="enrollOpen"
      :course="course"
      @enrolled="onEnrolled"
    />
    <DashboardCoursesEnrollKidsModal
      v-else
      v-model:open="enrollOpen"
      :course="course"
      @enrolled="onEnrolled"
    />
  </div>
</template>

<script setup lang="ts">
import { coursesService } from '@/services/api/courses.service'
import { useAuthStore } from '@/stores/auth'

const { formatPrice } = useCurrency()
const authStore = useAuthStore()
const enrollments = useStudentEnrollments()

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'تفاصيل الكورس'
})

const route = useRoute()
const id = computed(() => route.params.id as string)

const course = ref<any | null>(null)
const loading = ref(true)
const enrollOpen = ref(false)

useSeoMeta({
  title: () => `${course.value?.title ? course.value.title + ' | ' : ''}كورس | A Plus`
})

onMounted(() => {
  fetchCourse()
  if (authStore.isStudent) enrollments.ensureLoaded()
})
watch(id, () => fetchCourse())

async function fetchCourse() {
  loading.value = true
  try {
    const res = await coursesService.show(id.value)
    course.value = res.data?.data ?? res.data
  } catch (err) {
    console.error('Failed to load course', err)
    course.value = null
  } finally {
    loading.value = false
  }
}

function onEnrolled(result: { total_created: number, total_skipped: number }) {
  if (authStore.isStudent && result?.total_created > 0) {
    enrollments.refresh()
  }
}

function levelLabel(level?: string) {
  if (level === 'beginner') return 'مبتدئ'
  if (level === 'intermediate') return 'متوسط'
  if (level === 'advanced') return 'متقدم'
  return level || ''
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return iso
  }
}
</script>
