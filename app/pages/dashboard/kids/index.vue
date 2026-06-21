<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          أبنائي
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
          @click="fetchKids"
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
          إضافة ابن
        </UButton>
      </div>
    </div>

    <!-- Weekly summary (this week's activity per child) -->
    <div
      v-if="weeklySummary.length"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
    >
      <div class="px-5 py-4 border-b border-gray-100 bg-gradient-to-l from-primary-50/40 to-white flex items-center gap-2">
        <UIcon
          name="i-heroicons-chart-bar"
          class="w-5 h-5 text-primary-600"
        />
        <h2 class="text-base font-bold text-gray-900">
          ملخص هذا الأسبوع
        </h2>
      </div>
      <div class="divide-y divide-gray-50">
        <div
          v-for="child in weeklySummary"
          :key="child.student_id"
          class="flex items-center gap-3 px-5 py-3.5"
        >
          <div
            :class="[
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0',
              child.was_active ? 'bg-success-50 text-success-600' : 'bg-gray-100 text-gray-400'
            ]"
          >
            {{ child.name?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-900 truncate">
              {{ child.name }}
            </p>
            <p class="text-[11px] text-gray-500 mt-0.5">
              <template v-if="child.was_active">
                {{ child.answered }} سؤال · دقّة {{ child.accuracy }}% · {{ child.lessons_completed }} درس · {{ child.points_earned }} نقطة
              </template>
              <template v-else>
                لا نشاط هذا الأسبوع
              </template>
            </p>
          </div>
          <span
            v-if="child.was_active"
            class="text-[11px] px-2 py-0.5 rounded-full bg-success-50 text-success-700 font-bold shrink-0"
          >نشِط</span>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div
      v-if="hasAnyKids || searchQuery"
      class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-6 flex items-center gap-3 shadow-sm"
    >
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث باسم الابن أو اسم المستخدم..."
        size="lg"
        class="flex-1"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !kids.length"
      class="flex items-center justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && !kids.length && !searchQuery"
      class="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <UIcon
          name="i-heroicons-user-group"
          class="w-10 h-10 text-primary-500"
        />
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">
        لم تقم بإضافة أي ابن بعد
      </h2>
      <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">
        ابدأ بإنشاء حساب لأحد أبنائك لمتابعة تقدمهم الدراسي وإدارة تسجيلاتهم في الكورسات.
      </p>
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-user-plus"
        @click="addOpen = true"
      >
        إضافة أول ابن
      </UButton>
    </div>

    <!-- No results for search -->
    <div
      v-else-if="!loading && !kids.length && searchQuery"
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
        v-for="kid in kids"
        :key="kid.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group overflow-hidden"
      >
        <!-- Card top: avatar + name -->
        <div class="p-5 flex items-start gap-4">
          <div class="relative shrink-0">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
              :class="kid.gender === 'female'
                ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                : 'bg-gradient-to-br from-primary-500 to-primary-700'"
            >
              {{ initial(kid.name) }}
            </div>
            <div
              v-if="kid.league?.icon"
              class="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-white ring-2 ring-white flex items-center justify-center shadow-sm"
            >
              <img
                :src="kid.league.icon"
                :alt="kid.league.name"
                class="w-5 h-5 object-contain"
              >
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="font-bold text-gray-900 truncate">
                  {{ kid.name || '—' }}
                </h3>
                <p class="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                  <UIcon
                    name="i-heroicons-at-symbol"
                    class="w-3.5 h-3.5"
                  />
                  {{ kid.user_name || '—' }}
                </p>
              </div>
              <UDropdownMenu
                :items="actionItems(kid)"
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
                v-if="kid.exam_name"
                color="primary"
                variant="soft"
                size="sm"
              >
                {{ kid.exam_name }}
              </UBadge>
              <UBadge
                v-if="kid.league?.name"
                color="warning"
                variant="soft"
                size="sm"
              >
                <UIcon
                  name="i-heroicons-trophy"
                  class="w-3 h-3 ml-1"
                />
                {{ kid.league.name }}
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
              :class="kid.has_unlimited_points ? 'text-success-600' : 'text-gray-900'"
            >
              <span
                v-if="kid.has_unlimited_points"
                class="text-xl"
                title="غير محدود — اشتراك نشط"
              >∞</span>
              <span v-else>{{ formatNumber(kid.total_points ?? 0) }}</span>
            </p>
          </div>
          <div class="p-4 text-center">
            <p class="text-xs text-gray-500 mb-0.5">
              الدرجة
            </p>
            <p class="text-base font-bold text-gray-900">
              {{ formatNumber(kid.total_score ?? 0) }}
            </p>
          </div>
        </div>

        <!-- Card actions -->
        <div class="px-4 pb-4 pt-2 flex items-center gap-2">
          <UButton
            :to="`/dashboard/kids/${kid.id}`"
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
            @click="openEdit(kid)"
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

    <!-- Add modal -->
    <DashboardKidsAddKidModal
      v-model:open="addOpen"
      @created="onCreated"
    />

    <!-- Import modal -->
    <DashboardKidsImportKidsModal
      v-model:open="importOpen"
      @imported="onImported"
    />

    <!-- Edit modal -->
    <DashboardKidsEditKidModal
      v-model:open="editOpen"
      :kid="editingKid"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'
import { parentDigestService } from '@/services/api/parentDigest.service'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'أبنائي'
})
useSeoMeta({ title: 'أبنائي | A Plus' })

interface WeeklyChild {
  student_id: number
  name: string
  answered: number
  accuracy: number
  lessons_completed: number
  quizzes_completed: number
  points_earned: number
  was_active: boolean
}
const weeklySummary = ref<WeeklyChild[]>([])

async function loadWeeklySummary() {
  try {
    const res = await parentDigestService.weekly(7)
    weeklySummary.value = res.data?.data?.children ?? []
  } catch {
    weeklySummary.value = []
  }
}

const kids = ref<any[]>([])
const meta = ref<{ total: number, per_page: number, last_page: number } | null>(null)
const loading = ref(true)
const searchQuery = ref('')
const page = ref(1)
const addOpen = ref(false)
const importOpen = ref(false)
const editOpen = ref(false)
const editingKid = ref<any | null>(null)

const hasAnyKids = computed(() => kids.value.length > 0 || (meta.value?.total ?? 0) > 0)

const totalLabel = computed(() => {
  const total = meta.value?.total
  if (total === undefined || total === null) return 'إدارة حسابات أبنائك ومتابعة تقدمهم'
  if (total === 0) return 'لا يوجد أبناء مسجلين بعد'
  return `لديك ${total} ${total === 1 ? 'ابن' : total === 2 ? 'ابنين' : 'أبناء'} مسجلين`
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchKids()
  }, 300)
})

watch(page, () => fetchKids())

onMounted(() => {
  fetchKids()
  loadWeeklySummary()
})

async function fetchKids() {
  loading.value = true
  try {
    const res = await studentsService.getStudents({
      page: page.value,
      search: searchQuery.value || undefined,
      per_page: 12
    })
    const body = res.data?.data ?? res.data
    kids.value = Array.isArray(body) ? body : (body?.data ?? [])
    meta.value = res.data?.meta ?? body?.meta ?? null
  } catch (err) {
    console.error('Failed to load kids', err)
    kids.value = []
  } finally {
    loading.value = false
  }
}

function onCreated() {
  page.value = 1
  searchQuery.value = ''
  fetchKids()
}

function onImported({ total_created }: { total_created: number, total_failed: number }) {
  if (total_created > 0) {
    page.value = 1
    fetchKids()
  }
}

function actionItems(kid: any) {
  return [
    [
      {
        label: 'معلومات الطالب',
        icon: 'i-heroicons-identification',
        to: `/dashboard/kids/${kid.id}`
      },
      {
        label: 'تعديل',
        icon: 'i-heroicons-pencil-square',
        onSelect: () => openEdit(kid)
      }
    ],
    [
      {
        label: 'طلب حذف الحساب',
        icon: 'i-heroicons-trash',
        color: 'error' as const,
        onSelect: () => requestDeletion(kid)
      }
    ]
  ]
}

function openEdit(kid: any) {
  editingKid.value = kid
  editOpen.value = true
}

function onUpdated(updated: any) {
  if (!updated) return
  const idx = kids.value.findIndex(k => k.id === updated.id)
  if (idx !== -1) kids.value[idx] = { ...kids.value[idx], ...updated }
  else fetchKids()
}

async function requestDeletion(kid: any) {
  const ok = confirm(`هل تريد طلب حذف حساب ${kid.name}؟\nسيتم تعليق الحساب بانتظار مراجعة الإدارة.`)
  if (!ok) return
  try {
    await studentsService.requestStudentDeletion(kid.id, 'طلب من ولي الأمر')
    await fetchKids()
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
