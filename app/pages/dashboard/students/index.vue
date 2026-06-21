<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          طلابي
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ totalLabel }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-path"
          :loading="loading"
          @click="fetchStudents"
        >
          تحديث
        </UButton>
        <UButton
          color="secondary"
          variant="soft"
          icon="i-heroicons-arrow-up-tray"
          @click="importOpen = true"
        >
          استيراد
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="addOpen = true"
        >
          إضافة طالب
        </UButton>
      </div>
    </div>

    <!-- Search -->
    <div
      v-if="hasAny || searchQuery"
      class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-6 flex items-center gap-3 shadow-sm"
    >
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث باسم الطالب أو اسم المستخدم..."
        size="lg"
        class="flex-1"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !students.length"
      class="flex items-center justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && !students.length && !searchQuery"
      class="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <UIcon
          name="i-heroicons-user-group"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        لم تقم بإضافة أي طالب بعد
      </h2>
      <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        ابدأ بإنشاء حساب لطالب لمتابعة تقدمه الدراسي وإدارة تسجيلاته في الكورسات.
      </p>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-user-plus"
        @click="addOpen = true"
      >
        إضافة أول طالب
      </UButton>
    </div>

    <!-- No results for search -->
    <div
      v-else-if="!loading && !students.length && searchQuery"
      class="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="w-10 h-10 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        لا توجد نتائج مطابقة لـ "{{ searchQuery }}"
      </p>
    </div>

    <!-- Cards grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <article
        v-for="student in students"
        :key="student.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group overflow-hidden"
      >
        <!-- Card top: avatar + name -->
        <div class="p-5 flex items-start gap-4">
          <div class="relative shrink-0">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
              :class="student.gender === 'female'
                ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                : 'bg-gradient-to-br from-primary-500 to-primary-700'"
            >
              {{ initial(student.name) }}
            </div>
            <div
              v-if="student.league?.icon"
              class="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-white ring-2 ring-white flex items-center justify-center shadow-sm"
            >
              <img
                :src="student.league.icon"
                :alt="student.league.name"
                class="w-5 h-5 object-contain"
              >
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="font-bold text-gray-900 truncate">
                  {{ student.name || '—' }}
                </h3>
                <p class="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                  <UIcon
                    name="i-heroicons-at-symbol"
                    class="w-3.5 h-3.5"
                  />
                  {{ student.user_name || '—' }}
                </p>
              </div>
              <UDropdownMenu
                :items="actionItems(student)"
                :content="{ align: 'end' }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-vertical"
                  size="xs"
                />
              </UDropdownMenu>
            </div>

            <div class="flex flex-wrap items-center gap-2 mt-2">
              <UBadge
                v-if="student.exam_name"
                color="primary"
                variant="soft"
                size="sm"
              >
                {{ student.exam_name }}
              </UBadge>
              <UBadge
                v-if="student.league?.name"
                color="warning"
                variant="soft"
                size="sm"
              >
                <UIcon
                  name="i-heroicons-trophy"
                  class="w-3 h-3 ml-1"
                />
                {{ student.league.name }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Card stats -->
        <div class="grid grid-cols-2 border-t border-gray-100 divide-x divide-x-reverse divide-gray-100">
          <div class="p-4 text-center">
            <p class="text-xs text-gray-500 mb-0.5">
              النقاط
            </p>
            <p
              class="text-base font-bold"
              :class="student.has_unlimited_points ? 'text-success-600' : 'text-gray-900'"
            >
              <span
                v-if="student.has_unlimited_points"
                class="text-xl"
                title="غير محدود — اشتراك نشط"
              >∞</span>
              <span v-else>{{ formatNumber(student.total_points ?? 0) }}</span>
            </p>
          </div>
          <div class="p-4 text-center">
            <p class="text-xs text-gray-500 mb-0.5">
              الدرجة
            </p>
            <p class="text-base font-bold text-gray-900">
              {{ formatNumber(student.total_score ?? 0) }}
            </p>
          </div>
        </div>

        <!-- Card actions -->
        <div class="px-4 pb-4 pt-2 flex items-center gap-2">
          <UButton
            :to="`/dashboard/students/${student.id}`"
            color="primary"
            variant="soft"
            size="sm"
            block
            icon="i-heroicons-identification"
          >
            معلومات الطالب
          </UButton>
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            block
            icon="i-heroicons-pencil-square"
            @click="openEdit(student)"
          >
            تعديل
          </UButton>
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

    <!-- Modals (shared, role-aware via composable) -->
    <DashboardKidsAddKidModal
      v-model:open="addOpen"
      @created="onCreated"
    />
    <DashboardKidsImportKidsModal
      v-model:open="importOpen"
      @imported="onImported"
    />
    <DashboardKidsEditKidModal
      v-model:open="editOpen"
      :kid="editing"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'طلابي'
})
useSeoMeta({ title: 'طلابي | A Plus' })

const students = ref<any[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const searchQuery = ref('')
const page = ref(1)
const addOpen = ref(false)
const importOpen = ref(false)
const editOpen = ref(false)
const editing = ref<any | null>(null)

const hasAny = computed(() => students.value.length > 0 || (meta.value?.total ?? 0) > 0)

const totalLabel = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) return 'إدارة حسابات الطلاب ومتابعة تقدمهم'
  if (total === 0) return 'لا يوجد طلاب مسجلين بعد'
  return `لديك ${total} ${total === 1 ? 'طالب' : total === 2 ? 'طالبين' : 'طلاب'} مسجلين`
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchStudents()
  }, 300)
})

watch(page, () => fetchStudents())

onMounted(() => fetchStudents())

async function fetchStudents() {
  loading.value = true
  try {
    const res = await studentsService.getStudents({
      page: page.value,
      search: searchQuery.value || undefined,
      per_page: 12
    })
    const body = res.data?.data ?? res.data
    students.value = Array.isArray(body) ? body : (body?.data ?? [])
    meta.value = res.data?.meta ?? body?.meta ?? null
  } catch (err) {
    console.error('Failed to load students', err)
    students.value = []
  } finally {
    loading.value = false
  }
}

function onCreated() {
  page.value = 1
  searchQuery.value = ''
  fetchStudents()
}

function onImported({ total_created }: { total_created: number, total_failed: number }) {
  if (total_created > 0) {
    page.value = 1
    fetchStudents()
  }
}

function actionItems(student: any) {
  return [
    [
      {
        label: 'معلومات الطالب',
        icon: 'i-heroicons-identification',
        to: `/dashboard/students/${student.id}`
      },
      {
        label: 'تعديل',
        icon: 'i-heroicons-pencil-square',
        onSelect: () => openEdit(student)
      }
    ],
    [
      {
        label: 'طلب حذف الحساب',
        icon: 'i-heroicons-trash',
        color: 'error' as const,
        onSelect: () => requestDeletion(student)
      }
    ]
  ]
}

function openEdit(student: any) {
  editing.value = student
  editOpen.value = true
}

function onUpdated(updated: any) {
  if (!updated) return
  const idx = students.value.findIndex(s => s.id === updated.id)
  if (idx !== -1) students.value[idx] = { ...students.value[idx], ...updated }
  else fetchStudents()
}

async function requestDeletion(student: any) {
  const ok = confirm(`هل تريد طلب حذف حساب ${student.name}؟\nسيتم تعليق الحساب بانتظار مراجعة الإدارة.`)
  if (!ok) return
  try {
    await studentsService.requestStudentDeletion(student.id, 'طلب من المدرسة')
    await fetchStudents()
  } catch (err) {
    console.error('Failed to request deletion', err)
  }
}

function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'ط').toUpperCase()
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}
</script>
