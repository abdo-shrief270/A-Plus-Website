<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-lg' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900 truncate">
                التسجيل في كورس
              </h3>
              <p class="text-xs text-gray-500 truncate">
                {{ effectiveCourse?.title || 'اختر الكورس الذي تود الاشتراك فيه' }}
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
          <!-- Course picker -->
          <div v-if="!course">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              اختر الكورس <span class="text-error-500">*</span>
            </label>
            <USelect
              v-model="pickedCourseId"
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

          <!-- Already enrolled banner -->
          <div
            v-if="effectiveCourse && alreadyEnrolled"
            class="rounded-xl border border-info-200 bg-info-50/60 p-4 flex items-start gap-3"
          >
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-info-600 shrink-0 mt-0.5"
            />
            <div class="text-sm text-gray-700">
              أنت مشترك بالفعل في هذا الكورس. يمكنك متابعته من صفحة <NuxtLink
                to="/dashboard/enrollments"
                class="text-primary-700 font-bold hover:underline"
              >
                تسجيلاتي
              </NuxtLink>.
            </div>
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
              {{ result.total_skipped > 0 ? 'تعذّر التسجيل' : 'تم التسجيل بنجاح' }}
            </p>
            <p
              v-if="result.total_created > 0"
              class="text-xs text-gray-700"
            >
              تم تسجيلك في الكورس. تابع عملية الدفع لتفعيل المحتوى.
            </p>
            <p
              v-else
              class="text-xs text-gray-700"
            >
              {{ result.skipped?.[0]?.reason === 'already enrolled' ? 'أنت مسجل بالفعل في هذا الكورس.' : 'لم يتم التسجيل، حاول مرة أخرى.' }}
            </p>
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
            تأكيد التسجيل
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
import { coursesService, enrollmentsService } from '@/services/api/courses.service'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const sharedEnrollments = useStudentEnrollments()

const props = defineProps<{
  open: boolean
  course: any | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'enrolled': [result: { total_created: number, total_skipped: number }]
}>()

const submitting = ref(false)
const result = ref<{ total_created: number, total_skipped: number, skipped?: Array<{ student_id: number, reason: string }> } | null>(null)

const checkoutOpen = ref(false)
const pendingPayment = ref<any | null>(null)

const courses = ref<any[]>([])
const coursesLoading = ref(false)
const pickedCourseId = ref<number | null>(null)

const enrollments = ref<any[]>([])

const studentId = computed<number | null>(() => {
  const user: any = authStore.getUser
  return user?.student?.id ?? null
})

const courseOptions = computed(() =>
  courses.value.map(c => ({ label: c.title, value: c.id }))
)

const effectiveCourse = computed(() => {
  if (props.course) return props.course
  return courses.value.find(c => c.id === pickedCourseId.value) ?? null
})

const alreadyEnrolled = computed(() => {
  const cid = effectiveCourse.value?.id
  if (!cid) return false
  return enrollments.value.some(e =>
    Number(e.course_id) === Number(cid) && e.status === 'active'
  )
})

const canSubmit = computed(() =>
  !!effectiveCourse.value?.id && !!studentId.value && !alreadyEnrolled.value && !submitting.value
)

const onOpenChange = (val: boolean) => {
  if (submitting.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  result.value = null
  if (!props.course) pickedCourseId.value = null
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
  try {
    const res = await enrollmentsService.list({ per_page: 200 })
    const body = res.data?.data ?? res.data
    enrollments.value = body?.data ?? body ?? []
  } catch (err) {
    console.error('Failed to load enrollments', err)
    enrollments.value = []
  }
}

async function submit() {
  if (!canSubmit.value || !effectiveCourse.value?.id || !studentId.value) return
  submitting.value = true
  try {
    const res = await enrollmentsService.create({
      course_id: effectiveCourse.value.id,
      student_ids: [studentId.value]
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
  loadEnrollments()
  sharedEnrollments.refresh()
}

function onCancelled() {
  loadEnrollments()
}

watch(() => props.open, async (val) => {
  if (val) {
    reset()
    if (!studentId.value) {
      await authStore.refreshUser()
    }
    loadEnrollments()
    if (!props.course) loadCourses()
  }
})
</script>
