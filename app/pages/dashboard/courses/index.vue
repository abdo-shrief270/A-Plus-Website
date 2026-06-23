<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          الكورسات
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="fetchCourses"
      >
        تحديث
      </UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-6 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="ابحث باسم الكورس..."
          size="lg"
          class="sm:col-span-2"
        />
        <USelect
          v-model="levelFilter"
          :items="levelOptions"
          placeholder="المستوى"
          size="lg"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !courses.length"
      class="flex items-center justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && !courses.length"
      class="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <UIcon
          name="i-heroicons-academic-cap"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        لا توجد كورسات مطابقة
      </h2>
      <p class="text-sm text-gray-500">
        {{ searchQuery || levelFilter ? 'جرب تعديل الفلاتر أعلاه.' : 'لم يتم نشر أي كورسات بعد.' }}
      </p>
    </div>

    <!-- Cards grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      <article
        v-for="course in courses"
        :key="course.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all overflow-hidden flex flex-col"
      >
        <!-- Cover -->
        <NuxtLink
          :to="`/dashboard/courses/${course.id}`"
          class="relative aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden block group/cover"
        >
          <img
            v-if="course.image"
            :src="course.image"
            :alt="course.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-105"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-16 h-16 text-primary-400"
            />
          </div>
          <div class="absolute top-3 right-3 flex flex-wrap items-center gap-1.5">
            <span
              v-if="course.level"
              class="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold text-primary-700 shadow-sm"
            >
              {{ levelLabel(course.level) }}
            </span>
            <span
              v-if="course.rating"
              class="px-2.5 py-1 rounded-full bg-secondary-500 text-[11px] font-bold text-white shadow-sm flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-star-solid"
                class="w-3 h-3"
              />
              {{ course.rating }}
            </span>
          </div>
        </NuxtLink>

        <!-- Body -->
        <div class="p-5 flex-1 flex flex-col">
          <NuxtLink
            :to="`/dashboard/courses/${course.id}`"
            class="font-bold text-gray-900 line-clamp-2 mb-1.5 hover:text-primary-700 transition-colors"
          >
            {{ course.title }}
          </NuxtLink>
          <p
            v-if="course.description"
            class="text-xs text-gray-500 line-clamp-2 mb-3"
          >
            {{ course.description }}
          </p>

          <!-- Stats row -->
          <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              <UIcon
                name="i-heroicons-clock"
                class="w-3.5 h-3.5"
              />
              {{ course.total_hours || 0 }} ساعة
            </span>
            <span class="flex items-center gap-1">
              <UIcon
                name="i-heroicons-play-circle"
                class="w-3.5 h-3.5"
              />
              {{ course.lectures_count || 0 }} محاضرة
            </span>
            <span
              v-if="course.enrollments_count != null"
              class="flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-users"
                class="w-3.5 h-3.5"
              />
              {{ formatNumber(course.enrollments_count) }}
            </span>
          </div>

          <!-- Exam tags -->
          <div
            v-if="course.exams?.length"
            class="flex flex-wrap items-center gap-1 mb-4"
          >
            <UBadge
              v-for="exam in course.exams"
              :key="exam.id"
              color="primary"
              variant="soft"
              size="sm"
            >
              {{ exam.name }}
            </UBadge>
          </div>

          <!-- Footer row -->
          <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 gap-3">
            <div class="min-w-0">
              <p class="text-[11px] text-gray-500">
                السعر
              </p>
              <p class="text-base font-bold text-primary-700">
                {{ formatPrice(course.price) }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <UButton
                :to="`/dashboard/courses/${course.id}`"
                color="neutral"
                variant="soft"
                icon="i-heroicons-eye"
                size="sm"
              >
                تفاصيل
              </UButton>
              <UButton
                v-if="authStore.isStudent && enrollments.isEnrolled(course.id)"
                to="/dashboard/enrollments"
                color="success"
                variant="soft"
                icon="i-heroicons-check-badge"
                size="sm"
              >
                مسجّل بالفعل
              </UButton>
              <UButton
                v-else
                color="primary"
                icon="i-heroicons-user-plus"
                size="sm"
                @click="openEnroll(course)"
              >
                {{ authStore.isStudent ? 'سجّل الآن' : 'اشتراك' }}
              </UButton>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div
      v-if="meta && meta.last_page > 1"
      class="mt-8 flex justify-center"
    >
      <UPagination
        v-model:page="page"
        :total="meta.total"
        :items-per-page="meta.per_page"
      />
    </div>

    <!-- Enroll modal (role-aware) -->
    <DashboardCoursesEnrollStudentModal
      v-if="authStore.isStudent"
      v-model:open="enrollOpen"
      :course="selectedCourse"
      @enrolled="onEnrolled"
    />
    <DashboardCoursesEnrollKidsModal
      v-else
      v-model:open="enrollOpen"
      :course="selectedCourse"
      @enrolled="onEnrolled"
    />
  </div>
</template>

<script setup lang="ts">
import { coursesService } from '@/services/api/courses.service'
import { useAuthStore } from '@/stores/auth'

interface CourseExam {
  id: number
  name: string
}

interface CourseCard {
  id: number
  title: string
  image?: string | null
  description?: string | null
  level?: string | null
  rating?: string | number | null
  total_hours?: number | null
  lectures_count?: number | null
  enrollments_count?: number | null
  price?: string | number | null
  exams?: CourseExam[]
  [key: string]: unknown
}

const { formatPrice } = useCurrency()
const authStore = useAuthStore()
const enrollments = useStudentEnrollments()

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'الكورسات'
})
useSeoMeta({ title: 'الكورسات | A Plus' })

const courses = ref<CourseCard[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const searchQuery = ref('')
const levelFilter = ref<string | null>(null)
const page = ref(1)

const enrollOpen = ref(false)
const selectedCourse = ref<CourseCard | null>(null)

const levelOptions = [
  { label: 'جميع المستويات', value: null },
  { label: 'مبتدئ', value: 'beginner' },
  { label: 'متوسط', value: 'intermediate' },
  { label: 'متقدم', value: 'advanced' }
]

const subtitle = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) {
    return authStore.isStudent ? 'تصفّح الكورسات المتاحة وسجّل فيما يناسبك' : 'تصفح الكورسات وأشرك أبناءك بسهولة'
  }
  if (total === 0) return 'لا توجد كورسات حالياً'
  return `${total} كورس متاح`
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchCourses()
  }, 300)
})

watch(levelFilter, () => {
  page.value = 1
  fetchCourses()
})

watch(page, () => fetchCourses())

onMounted(() => {
  fetchCourses()
  if (authStore.isStudent) enrollments.ensureLoaded()
})

async function fetchCourses() {
  loading.value = true
  try {
    const res = await coursesService.list({
      page: page.value,
      search: searchQuery.value || undefined,
      level: levelFilter.value || undefined,
      per_page: 12
    })
    const body = res.data?.data ?? res.data
    courses.value = Array.isArray(body) ? body : (body?.data ?? [])
    meta.value = res.data?.meta ?? (body as { meta?: typeof meta.value })?.meta ?? null
  } catch (err) {
    console.error('Failed to load courses', err)
    courses.value = []
  } finally {
    loading.value = false
  }
}

function openEnroll(course: CourseCard) {
  selectedCourse.value = course
  enrollOpen.value = true
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
  return level
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}
</script>
