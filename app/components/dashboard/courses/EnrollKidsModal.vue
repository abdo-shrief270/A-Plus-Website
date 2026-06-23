<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-2xl' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-user-plus"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900 truncate">
                {{ course ? 'اشتراك في الكورس' : 'اشتراك جديد' }}
              </h3>
              <p class="text-xs text-gray-500 truncate">
                {{ effectiveCourse?.title || `اختر الكورس و${labels.plural}` }}
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            :disabled="submitting"
            @click="onOpenChange(false)"
          />
        </div>

        <div class="px-6 py-5 space-y-5">
          <!-- Course picker (only if no course was passed) -->
          <div v-if="!course">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              اختر الكورس <span class="text-error-500">*</span>
            </label>
            <USelect
              v-model="pickedCourseIdModel"
              :items="courseOptions"
              :loading="coursesLoading"
              :disabled="coursesLoading || submitting"
              placeholder="ابحث واختر الكورس"
              size="lg"
            />
          </div>

          <!-- Course summary -->
          <div
            v-if="effectiveCourse"
            class="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
          >
            <div class="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 overflow-hidden">
              <img
                v-if="effectiveCourse.image"
                :src="effectiveCourse.image"
                :alt="effectiveCourse.title"
                class="w-full h-full object-cover"
              >
              <UIcon
                v-else
                name="i-heroicons-academic-cap"
                class="w-7 h-7"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">
                {{ effectiveCourse.title }}
              </p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-3.5 h-3.5"
                  />
                  {{ effectiveCourse.total_hours || 0 }} ساعة
                </span>
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-play-circle"
                    class="w-3.5 h-3.5"
                  />
                  {{ effectiveCourse.lectures_count || 0 }} محاضرة
                </span>
                <span
                  v-if="effectiveCourse.price"
                  class="font-semibold text-primary-700"
                >
                  {{ effectiveCourse.price }} ر.س
                </span>
              </div>
            </div>
          </div>

          <!-- Kids list -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-semibold text-gray-700">
                اختر {{ labels.plural }} للاشتراك <span class="text-error-500">*</span>
              </label>
              <button
                v-if="visibleKids.length"
                type="button"
                class="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                :disabled="submitting"
                @click="toggleAll"
              >
                {{ allSelected ? 'إلغاء التحديد' : 'تحديد الكل' }}
              </button>
            </div>

            <!-- Hidden-already-enrolled banner -->
            <div
              v-if="hiddenCount > 0"
              class="mb-2 px-3 py-2 rounded-lg bg-info-50 border border-info-100 flex items-center gap-2 text-xs text-info-700"
            >
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 shrink-0"
              />
              <span>
                تم إخفاء {{ hiddenCount }} {{ hiddenCount === 1 ? labels.singular : `من ${labels.plural}` }} لأنهم مشتركون بالفعل في هذا الكورس.
              </span>
            </div>

            <div
              v-if="kidsLoading || enrollmentsLoading"
              class="py-8 text-center"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-6 h-6 text-primary-500 animate-spin"
              />
            </div>

            <div
              v-else-if="!kids.length"
              class="py-8 text-center bg-gray-50 rounded-xl border border-gray-100"
            >
              <UIcon
                name="i-heroicons-user-group"
                class="w-8 h-8 text-gray-300 mx-auto mb-2"
              />
              <p class="text-sm text-gray-500 mb-3">
                لا يوجد لديك {{ labels.plural }} مسجلين بعد.
              </p>
              <UButton
                :to="labels.detailRoot"
                color="primary"
                variant="soft"
                size="sm"
              >
                إدارة {{ labels.plural }}
              </UButton>
            </div>

            <div
              v-else-if="effectiveCourse && !visibleKids.length"
              class="py-8 text-center bg-success-50/60 rounded-xl border border-success-100"
            >
              <UIcon
                name="i-heroicons-check-badge"
                class="w-8 h-8 text-success-500 mx-auto mb-2"
              />
              <p class="text-sm text-gray-700">
                جميع {{ labels.yourPlural }} مشتركون بالفعل في هذا الكورس.
              </p>
            </div>

            <ul
              v-else
              class="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-72 overflow-y-auto"
            >
              <li
                v-for="kid in visibleKids"
                :key="kid.id"
                class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-primary-50/40 transition-colors"
                :class="{ 'bg-primary-50/60': isSelected(kid.id) }"
                @click="toggle(kid.id)"
              >
                <UCheckbox
                  :model-value="isSelected(kid.id)"
                  :disabled="submitting"
                  @update:model-value="toggle(kid.id)"
                  @click.stop
                />
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  :class="kid.gender === 'female'
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                    : 'bg-gradient-to-br from-primary-500 to-primary-700'"
                >
                  {{ initial(kid.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {{ kid.name }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    @{{ kid.user_name }}
                    <span
                      v-if="kid.exam_name"
                      class="mx-1"
                    >·</span>
                    <span v-if="kid.exam_name">{{ kid.exam_name }}</span>
                  </p>
                </div>
              </li>
            </ul>
            <p class="mt-2 text-xs text-gray-500">
              {{ selectedIds.length ? `تم اختيار ${selectedIds.length} ${labels.singular}` : 'لم يتم اختيار أحد بعد' }}
            </p>
          </div>

          <!-- Result -->
          <div
            v-if="result"
            class="rounded-xl border p-4 space-y-2"
            :class="result.total_skipped > 0
              ? 'bg-warning-50/60 border-warning-200'
              : 'bg-success-50/60 border-success-200'"
          >
            <p class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <UIcon
                :name="result.total_skipped > 0 ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'"
                class="w-5 h-5"
                :class="result.total_skipped > 0 ? 'text-warning-600' : 'text-success-600'"
              />
              {{ result.total_skipped > 0 ? 'تم الاشتراك جزئياً' : 'تم الاشتراك بنجاح' }}
            </p>
            <p class="text-xs text-gray-700">
              تم اشتراك <strong>{{ result.total_created }}</strong> طالب،
              <span v-if="result.total_skipped">تم تخطي <strong>{{ result.total_skipped }}</strong>.</span>
            </p>
            <details
              v-if="result.skipped?.length"
              class="text-xs"
            >
              <summary class="cursor-pointer text-warning-700 font-semibold">
                عرض التفاصيل
              </summary>
              <ul class="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-2">
                <li
                  v-for="(item, i) in result.skipped"
                  :key="i"
                  class="bg-white rounded-md px-2 py-1.5 border border-gray-100 flex items-center justify-between"
                >
                  <span>{{ kidName(item.student_id) }}</span>
                  <span class="text-warning-700">
                    {{ item.reason === 'already enrolled' ? 'مسجل مسبقاً' : item.reason }}
                  </span>
                </li>
              </ul>
            </details>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="submitting"
            @click="onOpenChange(false)"
          >
            {{ result ? 'إغلاق' : 'إلغاء' }}
          </UButton>
          <UButton
            v-if="!result"
            color="primary"
            icon="i-heroicons-check"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="submit"
          >
            تأكيد الاشتراك
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <DashboardPaymentsCheckoutModal
    v-model:open="checkoutOpen"
    :payment="pendingPayment"
    @paid="onPaid"
    @cancelled="onCancelled"
  />
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'
import { coursesService, enrollmentsService } from '@/services/api/courses.service'

const labels = useEntityLabels()

interface CourseSummary {
  id: number
  title: string
  image?: string | null
  total_hours?: number | null
  lectures_count?: number | null
  price?: string | number | null
  [key: string]: unknown
}

interface KidSummary {
  id: number
  name: string
  user_name?: string
  gender?: 'male' | 'female'
  exam_name?: string
  [key: string]: unknown
}

interface EnrollmentRecord {
  course_id: number | string
  status?: string
  user?: { student?: { id?: number } }
  [key: string]: unknown
}

interface PendingPayment {
  id: number
  amount: number
  currency?: string
  description?: string
  transaction_id?: string
  kind?: string
}

const props = defineProps<{
  open: boolean
  course: CourseSummary | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'enrolled': [result: { total_created: number, total_skipped: number }]
}>()

const kids = ref<KidSummary[]>([])
const kidsLoading = ref(false)
const selectedIds = ref<number[]>([])
const submitting = ref(false)
const result = ref<{ total_created: number, total_skipped: number, skipped?: Array<{ student_id: number, reason: string }> } | null>(null)

const checkoutOpen = ref(false)
const pendingPayment = ref<PendingPayment | null>(null)

const courses = ref<CourseSummary[]>([])
const coursesLoading = ref(false)
const pickedCourseId = ref<number | null>(null)

const enrollments = ref<EnrollmentRecord[]>([])
const enrollmentsLoading = ref(false)

const courseOptions = computed(() =>
  courses.value.map(c => ({ label: c.title, value: c.id }))
)

const pickedCourseIdModel = computed<number | undefined>({
  get: () => pickedCourseId.value ?? undefined,
  set: (val) => { pickedCourseId.value = val ?? null }
})

const effectiveCourse = computed(() => {
  if (props.course) return props.course
  return courses.value.find(c => c.id === pickedCourseId.value) ?? null
})

const enrolledStudentIds = computed<Set<number>>(() => {
  const cid = effectiveCourse.value?.id
  if (!cid) return new Set()
  const ids = enrollments.value
    .filter(e => Number(e.course_id) === Number(cid) && e.status === 'active')
    .map(e => e.user?.student?.id)
    .filter((id): id is number => typeof id === 'number')
  return new Set(ids)
})

const visibleKids = computed(() =>
  kids.value.filter(k => !enrolledStudentIds.value.has(k.id))
)

const hiddenCount = computed(() => kids.value.length - visibleKids.value.length)

const allSelected = computed(() =>
  visibleKids.value.length > 0 && selectedIds.value.length === visibleKids.value.length
)

const canSubmit = computed(() =>
  !!effectiveCourse.value?.id && selectedIds.value.length > 0 && !submitting.value
)

const onOpenChange = (val: boolean) => {
  if (submitting.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  selectedIds.value = []
  result.value = null
  if (!props.course) pickedCourseId.value = null
}

function isSelected(id: number) {
  return selectedIds.value.includes(id)
}

function toggle(id: number) {
  if (submitting.value) return
  const i = selectedIds.value.indexOf(id)
  if (i === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(i, 1)
}

function toggleAll() {
  if (allSelected.value) selectedIds.value = []
  else selectedIds.value = visibleKids.value.map(k => k.id)
}

function kidName(id: number) {
  return kids.value.find(k => k.id === id)?.name || `#${id}`
}

function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'ط').toUpperCase()
}

async function loadKids() {
  if (kids.value.length) return
  kidsLoading.value = true
  try {
    const res = await studentsService.getStudents({ per_page: 100 })
    const body = res.data?.data ?? res.data
    kids.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load kids', err)
  } finally {
    kidsLoading.value = false
  }
}

async function loadCourses() {
  if (courses.value.length) return
  coursesLoading.value = true
  try {
    const res = await coursesService.list({ per_page: 100 })
    const body = res.data?.data ?? res.data
    courses.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load courses', err)
  } finally {
    coursesLoading.value = false
  }
}

async function loadEnrollments() {
  enrollmentsLoading.value = true
  try {
    const res = await enrollmentsService.list({ per_page: 200 })
    const body = res.data?.data ?? res.data
    enrollments.value = body?.data ?? body ?? []
  } catch (err) {
    console.error('Failed to load enrollments', err)
    enrollments.value = []
  } finally {
    enrollmentsLoading.value = false
  }
}

async function submit() {
  if (!canSubmit.value || !effectiveCourse.value?.id) return
  submitting.value = true
  try {
    const res = await enrollmentsService.create({
      course_id: effectiveCourse.value.id,
      student_ids: selectedIds.value
    })
    const data = res.data?.data ?? res.data
    result.value = {
      total_created: data.total_created ?? 0,
      total_skipped: data.total_skipped ?? 0,
      skipped: data.skipped ?? []
    }
    if (data.requires_payment && data.payment) {
      pendingPayment.value = {
        ...data.payment,
        description: 'اشتراك في كورس: ' + (effectiveCourse.value.title ?? ''),
        kind: 'enrollment'
      }
      checkoutOpen.value = true
    }
    emit('enrolled', { total_created: result.value.total_created, total_skipped: result.value.total_skipped })
  } catch (err) {
    console.error('Enrollment failed', err)
  } finally {
    submitting.value = false
  }
}

function onPaid() {
  // Re-fetch enrollments so the auto-hide for active subs reflects the new state.
  loadEnrollments()
}

function onCancelled() {
  loadEnrollments()
}

watch(() => props.open, (val) => {
  if (val) {
    reset()
    loadKids()
    loadEnrollments()
    if (!props.course) loadCourses()
  }
})

// Drop any selected kid that becomes hidden (e.g. after switching course in
// quick-enroll mode) so the submit count stays consistent with the visible list.
watch(enrolledStudentIds, (ids) => {
  selectedIds.value = selectedIds.value.filter(id => !ids.has(id))
})
</script>
