<template>
  <div>
    <!-- Welcome -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        مرحباً، {{ authStore.getUser?.name }} 👋
      </h1>
      <p class="text-gray-500 mt-1">
        {{ isSchool ? 'لوحة تحكم المدرسة' : 'لوحة متابعة ولي الأمر' }}
      </p>
    </div>

    <!-- Stat Cards -->
    <div v-if="statsLoading" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin" />
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div :class="`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`">
          <UIcon :name="card.icon" :class="`w-5 h-5 ${card.iconColor}`" />
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ card.value }}
        </p>
        <p class="text-sm text-gray-500 mt-1">
          {{ card.label }}
        </p>
      </div>
    </div>

    <!-- Quick Links (school) -->
    <div v-if="isSchool" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <NuxtLink to="/dashboard/students">
        <div class="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 text-center cursor-pointer hover:bg-primary-100 transition-colors">
          <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p class="font-semibold text-primary-700 dark:text-primary-300 text-sm">
            إدارة الطلاب
          </p>
        </div>
      </NuxtLink>
      <NuxtLink to="/dashboard/students/create">
        <div class="bg-success-50 dark:bg-success-900/20 rounded-xl p-5 text-center cursor-pointer hover:bg-success-100 transition-colors">
          <UIcon name="i-heroicons-user-plus" class="w-8 h-8 text-success-600 mx-auto mb-2" />
          <p class="font-semibold text-success-700 dark:text-success-300 text-sm">
            إضافة طالب
          </p>
        </div>
      </NuxtLink>
      <NuxtLink to="/dashboard/students/import">
        <div class="bg-warning-50 dark:bg-warning-900/20 rounded-xl p-5 text-center cursor-pointer hover:bg-warning-100 transition-colors">
          <UIcon name="i-heroicons-arrow-up-tray" class="w-8 h-8 text-warning-600 mx-auto mb-2" />
          <p class="font-semibold text-warning-700 dark:text-warning-300 text-sm">
            استيراد طلاب
          </p>
        </div>
      </NuxtLink>
      <NuxtLink to="/dashboard/settings">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-8 h-8 text-gray-600 dark:text-gray-300 mx-auto mb-2" />
          <p class="font-semibold text-gray-700 dark:text-gray-300 text-sm">
            الإعدادات
          </p>
        </div>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Tables -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Related Students Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              الطلاب المرتبطين
            </h2>
            <NuxtLink v-if="isSchool" to="/dashboard/students" class="text-sm text-primary-600 hover:text-primary-700">عرض الكل</NuxtLink>
          </div>
          <div class="p-0">
            <UTable
              :loading="tablesLoading"
              :columns="studentColumns"
              :rows="students"
              :empty-state="{ icon: 'i-heroicons-users', label: 'لا يوجد طلاب مرتبطين' }"
            >
              <template #name-data="{ row }">
                <div class="flex items-center gap-3">
                  <UAvatar :alt="row.user?.name" size="sm" class="bg-primary-100 text-primary-600" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ row.user?.name }}</span>
                </div>
              </template>
              <template #contact-data="{ row }">
                <div class="text-sm text-gray-500">
                  <div>{{ row.user?.email }}</div>
                  <div class="text-xs">{{ row.user?.phone }}</div>
                </div>
              </template>
              <template #exam-data="{ row }">
                <UBadge color="gray" variant="soft">{{ row.exam?.name || 'غير محدد' }}</UBadge>
              </template>
            </UTable>
          </div>
        </div>

        <!-- Recent Enrollments Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              أحدث الاشتراكات
            </h2>
          </div>
          <div class="p-0">
            <UTable
              :loading="tablesLoading"
              :columns="enrollmentColumns"
              :rows="enrollments"
              :empty-state="{ icon: 'i-heroicons-rectangle-stack', label: 'لا توجد اشتراكات حديثة' }"
            >
              <template #student-data="{ row }">
                <span class="font-medium text-gray-900 dark:text-white">{{ row.user?.name }}</span>
              </template>
              <template #course-data="{ row }">
                <span class="text-gray-600 dark:text-gray-300">{{ row.course?.title || 'دورة محذوفة' }}</span>
              </template>
              <template #status-data="{ row }">
                <UBadge :color="row.status === 'active' ? 'success' : 'warning'" variant="soft">
                  {{ row.status === 'active' ? 'نشط' : (row.status === 'pending' ? 'قيد الانتظار' : 'ملغى') }}
                </UBadge>
              </template>
              <template #date-data="{ row }">
                <span class="text-sm text-gray-500">{{ new Date(row.enrolled_at).toLocaleDateString('ar-SA') }}</span>
              </template>
            </UTable>
          </div>
        </div>

      </div>

      <!-- Right Column: Trending Courses -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              الدورات الأكثر طلباً
            </h2>
          </div>
          <div class="p-5 flex flex-col gap-4">
            <div
              v-for="course in courses"
              :key="course.id"
              class="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-primary-300 transition-colors"
            >
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                {{ course.name || course.title }}
              </h3>
              <div class="flex items-center justify-between mt-auto">
                <p class="text-xs text-gray-500 flex items-center gap-1">
                  <UIcon name="i-heroicons-users" class="w-4 h-4" />
                  {{ course.enrollments_count }} تسجيل
                </p>
                <div class="text-primary-600 font-bold text-sm">
                  {{ course.price > 0 ? `${course.price} ريال` : 'مجاني' }}
                </div>
              </div>
            </div>
            
            <div v-if="!courses.length && !statsLoading" class="text-center py-8 text-gray-500">
              لا توجد دورات حالياً
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { statsService } from '@/services/api/stats.service'
import { studentService } from '@/services/api/student.service'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role']
})

useSeoMeta({ title: 'لوحة التحكم | A Plus' })

const authStore = useAuthStore()
const isSchool = computed(() => authStore.isSchool)

const statsData = ref<any>(null)
const courses = ref<any[]>([])
const students = ref<any[]>([])
const enrollments = ref<any[]>([])

const statsLoading = ref(true)
const tablesLoading = ref(true)

const statCards = computed(() => [
  {
    label: 'إجمالي الطلاب',
    value: statsData.value?.total_students ?? '–',
    icon: 'i-heroicons-user-group',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600'
  },
  {
    label: 'الدورات النشطة',
    value: statsData.value?.total_courses ?? '–',
    icon: 'i-heroicons-book-open',
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600'
  },
  {
    label: 'متوسط التقدم',
    value: statsData.value?.average_progress ? `${statsData.value.average_progress}%` : '–',
    icon: 'i-heroicons-chart-bar',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600'
  },
  {
    label: 'اشتراكات نشطة',
    value: statsData.value?.active_enrollments ?? '–',
    icon: 'i-heroicons-check-circle',
    iconBg: 'bg-info-100',
    iconColor: 'text-info-600'
  }
])

const studentColumns = [
  { key: 'name', id: 'name', label: 'الطالب' },
  { key: 'contact', id: 'contact', label: 'معلومات التواصل' },
  { key: 'exam', id: 'exam', label: 'نوع الاختبار' }
]

const enrollmentColumns = [
  { key: 'student', id: 'student', label: 'الطالب' },
  { key: 'course', id: 'course', label: 'الدورة' },
  { key: 'status', id: 'status', label: 'الحالة' },
  { key: 'date', id: 'date', label: 'تاريخ الاشتراك' }
]

onMounted(async () => {
  try {
    // 1. Fetch top level stats and courses
    const [statsRes, coursesRes] = await Promise.all([
      statsService.platformStats(),
      statsService.trendingCourses(5) // Get for both parent & school
    ])
    statsData.value = statsRes.data?.data
    courses.value = coursesRes?.data?.data || []
  } catch (err) {
    console.error('Stats Error', err)
  } finally {
    statsLoading.value = false
  }

  try {
    // 2. Fetch tabular data
    const [studentsRes, enrollmentsRes] = await Promise.all([
      studentService.list({ per_page: 5 }), // Show recent 5 students max
      statsService.enrollments(1) // Show page 1 explicitly
    ])
    
    console.log('--- Raw Students Response ---', studentsRes.data)
    console.log('--- Raw Enrollments Response ---', enrollmentsRes.data)
    
    // studentsRes.data.data is the payload from successResponse.
    // Inside it, Resource::collection()->response()->getData(true) creates another 'data' array.
    students.value = studentsRes.data?.data?.data || []
    
    // enrollmentsRes.data.data is the payload from successResponse.
    // Inside it, paginate()->toArray() creates another 'data' array.
    enrollments.value = enrollmentsRes.data?.data?.data || [] 
    
    console.log('=> Parsed Students Array:', students.value)
    console.log('=> Parsed Enrollments Array:', enrollments.value)
    
  } catch (err) {
    console.error('Tables Error', err)
  } finally {
    tablesLoading.value = false
  }
})
</script>
