<template>
  <div>
    <!-- Top bar with back + title + actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <UButton
          to="/dashboard/students"
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-right"
          class="rtl:[&>span:first-child]:rotate-180"
          square
        />
        <div>
          <p class="text-xs text-gray-500">
            <NuxtLink
              to="/dashboard/students"
              class="hover:text-primary-600"
            >
              طلابي
            </NuxtLink>
            <span class="mx-1">›</span>
            <span>الملف الشخصي</span>
          </p>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
            {{ kid?.name ?? '...' }}
          </h1>
        </div>
      </div>

      <div
        v-if="kid"
        class="flex items-center gap-2"
      >
        <UButton
          color="primary"
          icon="i-heroicons-pencil-square"
          @click="editOpen = true"
        >
          تعديل
        </UButton>
        <UDropdownMenu
          :items="moreItems"
          :content="{ align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-ellipsis-vertical"
            square
          />
        </UDropdownMenu>
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
      v-else-if="!kid"
      class="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-error-50 flex items-center justify-center mb-4">
        <UIcon
          name="i-heroicons-user-minus"
          class="w-10 h-10 text-error-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        لم نعثر على هذا الحساب
      </h2>
      <p class="text-sm text-gray-500 mb-5">
        قد يكون الحساب محذوفاً أو لا تملك صلاحية الوصول إليه.
      </p>
      <UButton
        to="/dashboard/students"
        color="primary"
      >
        العودة لقائمة الطلاب
      </UButton>
    </div>

    <!-- Profile content -->
    <div
      v-else
      class="space-y-5"
    >
      <!-- Profile hero -->
      <div class="relative bg-gradient-to-l from-primary-600 to-primary-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-md">
        <div class="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div class="absolute bottom-0 right-1/3 w-40 h-40 bg-secondary-400/30 rounded-full translate-y-1/2 blur-2xl" />

        <div class="relative flex flex-col md:flex-row md:items-center gap-6">
          <div
            class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg ring-4 ring-white/20 shrink-0"
            :class="kid.gender === 'female'
              ? 'bg-gradient-to-br from-pink-400 to-pink-600'
              : 'bg-gradient-to-br from-secondary-400 to-secondary-600'"
          >
            {{ initial(kid.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl sm:text-3xl font-bold text-white mb-1 truncate drop-shadow-sm">
              {{ kid.name }}
            </h2>
            <p class="text-sm text-white/90 flex items-center gap-1.5 mb-3 font-medium">
              <UIcon
                name="i-heroicons-at-symbol"
                class="w-4 h-4 text-white/80"
              />
              {{ kid.user_name }}
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="kid.exam_name"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur text-xs font-semibold text-white"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-3.5 h-3.5 text-white"
                />
                {{ kid.exam_name }}
              </span>
              <span
                v-if="kid.league?.name"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-500 ring-1 ring-white/40 text-xs font-semibold text-white shadow-sm"
              >
                <UIcon
                  name="i-heroicons-trophy"
                  class="w-3.5 h-3.5 text-white"
                />
                {{ kid.league.name }}
              </span>
              <span
                v-if="kid.gender"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur text-xs font-semibold text-white"
              >
                <UIcon
                  name="i-heroicons-user"
                  class="w-3.5 h-3.5 text-white"
                />
                {{ kid.gender === 'female' ? 'أنثى' : 'ذكر' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <UIcon
              name="i-heroicons-star"
              class="w-5 h-5 text-primary-600"
            />
          </div>
          <p class="text-xs text-gray-500">
            النقاط
          </p>
          <p
            class="text-xl font-bold mt-0.5"
            :class="kid.has_unlimited_points ? 'text-success-600' : 'text-gray-900'"
          >
            <span
              v-if="kid.has_unlimited_points"
              class="text-2xl"
              title="غير محدود — اشتراك نشط"
            >∞</span>
            <span v-else>{{ formatNumber(kid.total_points ?? 0) }}</span>
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center mb-3">
            <UIcon
              name="i-heroicons-chart-bar"
              class="w-5 h-5 text-success-600"
            />
          </div>
          <p class="text-xs text-gray-500">
            الدرجة الكلية
          </p>
          <p class="text-xl font-bold text-gray-900 mt-0.5">
            {{ formatNumber(kid.total_score ?? 0) }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center mb-3">
            <UIcon
              name="i-heroicons-trophy"
              class="w-5 h-5 text-secondary-600"
            />
          </div>
          <p class="text-xs text-gray-500">
            الدوري الحالي
          </p>
          <p class="text-base font-bold text-gray-900 mt-0.5 truncate">
            {{ kid.league?.name || '—' }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-info-50 flex items-center justify-center mb-3">
            <UIcon
              name="i-heroicons-calendar"
              class="w-5 h-5 text-info-600"
            />
          </div>
          <p class="text-xs text-gray-500">
            تاريخ الانضمام
          </p>
          <p class="text-base font-bold text-gray-900 mt-0.5">
            {{ kid.joined_at || '—' }}
          </p>
        </div>
      </div>

      <!-- Info cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <UIcon
                name="i-heroicons-identification"
                class="w-5 h-5 text-primary-600"
              />
              البيانات الشخصية
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-pencil"
              @click="editOpen = true"
            />
          </div>
          <dl class="divide-y divide-gray-100">
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                الاسم
              </dt>
              <dd class="text-sm font-semibold text-gray-900 text-left truncate">
                {{ kid.name || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                اسم المستخدم
              </dt>
              <dd class="text-sm font-mono text-gray-900 text-left truncate">
                {{ kid.user_name || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                النوع
              </dt>
              <dd class="text-sm font-semibold text-gray-900 text-left">
                {{ kid.gender === 'female' ? 'أنثى' : 'ذكر' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                البريد الإلكتروني
              </dt>
              <dd class="text-sm text-gray-900 text-left truncate">
                {{ kid.email || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                الهاتف
              </dt>
              <dd
                class="text-sm text-gray-900 text-left truncate"
                dir="ltr"
              >
                {{ kid.phone || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                رقم الهوية
              </dt>
              <dd
                class="text-sm font-mono text-gray-900 text-left"
                dir="ltr"
              >
                {{ kid.id_number || '—' }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-5 h-5 text-primary-600"
              />
              البيانات الدراسية
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-pencil"
              @click="editOpen = true"
            />
          </div>
          <dl class="divide-y divide-gray-100">
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                الاختبار
              </dt>
              <dd class="text-sm font-semibold text-gray-900 text-left truncate">
                {{ kid.exam_name || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                تاريخ الاختبار
              </dt>
              <dd class="text-sm text-gray-900 text-left">
                {{ kid.exam_date || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                الدوري الحالي
              </dt>
              <dd class="text-sm font-semibold text-gray-900 text-left flex items-center gap-2 justify-end">
                <img
                  v-if="kid.league?.icon"
                  :src="kid.league.icon"
                  :alt="kid.league.name"
                  class="w-5 h-5"
                >
                {{ kid.league?.name || '—' }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                إجمالي النقاط
              </dt>
              <dd class="text-sm font-bold text-left">
                <span
                  v-if="kid.has_unlimited_points"
                  class="text-success-600 text-base"
                  title="غير محدود — اشتراك نشط"
                >∞ غير محدود</span>
                <span
                  v-else
                  class="text-primary-700"
                >
                  {{ formatNumber(kid.total_points ?? 0) }}
                </span>
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                إجمالي الدرجة
              </dt>
              <dd class="text-sm font-bold text-success-700 text-left">
                {{ formatNumber(kid.total_score ?? 0) }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-4">
              <dt class="text-sm text-gray-500">
                تاريخ الانضمام
              </dt>
              <dd class="text-sm text-gray-900 text-left">
                {{ kid.joined_at || '—' }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <DashboardKidsEditKidModal
      v-model:open="editOpen"
      :kid="kid"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'ملف الطالب'
})

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const kid = ref<any | null>(null)
const loading = ref(true)
const editOpen = ref(false)

useSeoMeta({
  title: () => `${kid.value?.name ? kid.value.name + ' | ' : ''}ملف الطالب | A Plus`
})

onMounted(() => fetchKid())
watch(id, () => fetchKid())

async function fetchKid() {
  loading.value = true
  try {
    const res = await studentsService.getStudentProfile(id.value)
    kid.value = res.data?.data ?? res.data
  } catch (err) {
    console.error('Failed to load kid', err)
    kid.value = null
  } finally {
    loading.value = false
  }
}

function onUpdated(updated: any) {
  if (updated && typeof updated === 'object') {
    kid.value = { ...kid.value, ...updated }
  } else {
    fetchKid()
  }
}

const moreItems = computed(() => [
  [
    {
      label: 'طلب حذف الحساب',
      icon: 'i-heroicons-trash',
      color: 'error' as const,
      onSelect: () => requestDeletion()
    }
  ]
])

async function requestDeletion() {
  if (!kid.value) return
  const ok = confirm(`هل تريد طلب حذف حساب ${kid.value.name}؟\nسيتم تعليق الحساب بانتظار مراجعة الإدارة.`)
  if (!ok) return
  try {
    await studentsService.requestStudentDeletion(kid.value.id, 'طلب من المدرسة')
    router.push('/dashboard/students')
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
