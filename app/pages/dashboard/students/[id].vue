<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        icon="i-heroicons-arrow-right"
        color="neutral"
        variant="ghost"
        class="rtl:-scale-x-100"
        @click="$router.back()"
      />
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
        >
          الملف الشخصي للطالب
          <UBadge
            v-if="student?.status"
            :color="student.status === 'suspended' ? 'error' : 'success'"
            variant="subtle"
          >
            {{ student.status === "suspended" ? "معلق" : "نشط" }}
          </UBadge>
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          عرض وتعديل تفاصيل حساب الطالب وحالته الأكاديمية
        </p>
      </div>
    </div>

    <!-- loading state -->
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
      v-else-if="!student"
      class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
    >
      <UIcon
        name="i-heroicons-user-minus"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        الطالب غير موجود
      </h3>
      <p class="text-gray-500">
        لا يمكن العثور على بيانات هذا الطالب في النظام.
      </p>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Profile Header Summary -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm"
      >
        <UAvatar
          :src="student.avatar || student.profile_image"
          :alt="student.name_ar || student.name"
          size="3xl"
          :ui="{ rounded: 'rounded-2xl' }"
          class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-bold"
        >
          {{ (student.name_ar || student.name || "ط").charAt(0).toUpperCase() }}
        </UAvatar>

        <div class="flex-1 text-center md:text-start">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ student.name_ar || student.name || student.username }}
          </h2>
          <p class="text-gray-500 mb-4">
            {{ student.email || "البريد الإلكتروني غير متوفر" }}
          </p>

          <div
            class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium"
          >
            <span
              class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <UIcon
                name="i-heroicons-phone"
                class="w-4 h-4 text-gray-400"
              />
              {{ student.phone || "غير مدرج" }}
            </span>
            <span
              v-if="student.parent_phone"
              class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <UIcon
                name="i-heroicons-users"
                class="w-4 h-4 text-gray-400"
              />
              ولي الأمر: {{ student.parent_phone }}
            </span>
            <span
              v-if="student.grade || student.exam?.name_ar"
              class="flex items-center gap-1.5 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/30"
            >
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-4 h-4 text-primary-500"
              />
              {{ student.grade || student.exam?.name_ar }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2 min-w-[140px]">
          <UButton
            v-if="student.status === 'active'"
            color="red"
            variant="soft"
            icon="i-heroicons-no-symbol"
            class="justify-center w-full"
            :loading="isStatusUpdating"
            @click="suspendStudent"
          >
            تعليق الحساب
          </UButton>
          <UButton
            v-if="student.status === 'suspended'"
            color="emerald"
            variant="soft"
            icon="i-heroicons-check-circle"
            class="justify-center w-full"
            :loading="isStatusUpdating"
            @click="activateStudent"
          >
            تفعيل الحساب
          </UButton>
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-chart-bar"
            class="justify-center w-full"
            :to="`/dashboard/student-stats?student=${student.id}`"
          >
            عرض درجات الطالب
          </UButton>
        </div>
      </div>

      <!-- Edit Student Form -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm"
      >
        <h3
          class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          تعديل تفاصيل الطالب
        </h3>

        <UForm
          :state="editState"
          :schema="updateSchema"
          class="space-y-6"
          @submit="onUpdateStudent"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField
              label="الاسم الكامل"
              name="name"
              required
            >
              <UInput
                v-model="editState.name"
                icon="i-heroicons-user"
                placeholder="الاسم الكامل للطالب"
              />
            </UFormField>

            <UFormField
              label="البريد الإلكتروني"
              name="email"
            >
              <UInput
                v-model="editState.email"
                type="email"
                icon="i-heroicons-envelope"
                placeholder="example@domain.com"
              />
            </UFormField>

            <UFormField
              label="رقم الجوال الخاص بالطالب"
              name="phone"
            >
              <UInput
                v-model="editState.phone"
                type="tel"
                icon="i-heroicons-phone"
                placeholder="05XXXXXXXX"
                dir="ltr"
              />
            </UFormField>

            <UFormField
              label="رقم هاتف ولي الأمر"
              name="parent_phone"
              required
            >
              <UInput
                v-model="editState.parent_phone"
                type="tel"
                icon="i-heroicons-users"
                placeholder="05XXXXXXXX"
                dir="ltr"
              />
            </UFormField>
          </div>

          <!-- Academic selection -->
          <UFormField
            label="المرحلة الدراسية"
            name="exam_id"
            required
          >
            <USelectMenu
              v-model="editState.exam_id"
              :options="academicStore.exams"
              value-attribute="id"
              option-attribute="name_ar"
              placeholder="اختر المرحلة الدراسية"
              icon="i-heroicons-academic-cap"
            />
          </UFormField>

          <UFormField
            label="ملاحظات إضافية (خاصة بالإدارة)"
            name="admin_notes"
          >
            <UTextarea
              v-model="editState.admin_notes"
              :rows="3"
              placeholder="أضف أي ملاحظات لمتابعة هذا الطالب..."
            />
          </UFormField>

          <div
            class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700 gap-3"
          >
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              @click="requestDeletion"
            >
              طلب الحذف
            </UButton>

            <div class="flex-1" />

            <UButton
              type="submit"
              color="primary"
              variant="solid"
              icon="i-heroicons-check"
              :loading="isSaving"
              class="px-8"
            >
              حفظ التعديلات
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { studentsService } from '@/services/api/students.service'
import { useAcademicStore } from '@/stores/academic'
import { showToast } from '@/utils/helpers/toast.helper'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const route = useRoute()
const studentId = route.params.id as string

const loading = ref(true)
const isSaving = ref(false)
const isStatusUpdating = ref(false)

const student = ref<any>(null)
const academicStore = useAcademicStore()

const updateSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z
    .string()
    .email('البريد الإلكتروني غير صالح')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  parent_phone: z.string().min(8, 'رقم ولي الأمر متطلب ضروري'),
  exam_id: z.number().nullable(),
  admin_notes: z.string().optional()
})
type UpdateSchema = z.output<typeof updateSchema>

const editState = reactive({
  name: '',
  email: '',
  phone: '',
  parent_phone: '',
  exam_id: null as number | null,
  admin_notes: ''
})

onMounted(async () => {
  await Promise.all([fetchStudent(), academicStore.fetchExams()])
})

async function fetchStudent() {
  loading.value = true
  try {
    const res = await studentsService.getStudentProfile(studentId)
    const data = res.data?.data || res.data
    student.value = data?.student || data

    useSeoMeta({
      title: `${student.value?.name_ar || student.value?.name || 'تفاصيل الطالب'} | A Plus`
    })

    // Populate form
    editState.name = student.value.name_ar || student.value.name || ''
    editState.email = student.value.email || ''
    editState.phone = student.value.phone || ''
    editState.parent_phone = student.value.parent_phone || ''
    editState.exam_id = student.value.exam_id || student.value.exam?.id || null
    editState.admin_notes = student.value.admin_notes || ''
  } catch (error) {
    console.error('Failed to load student details', error)
  } finally {
    loading.value = false
  }
}

async function onUpdateStudent(event: FormSubmitEvent<UpdateSchema>) {
  isSaving.value = true
  try {
    // Delete empty optional strings so validation doesn't fail on backend
    const payload = { ...event.data }
    if (!payload.email) delete payload.email
    if (!payload.phone) delete payload.phone

    await studentsService.updateStudentProfile(studentId, payload)

    showToast('نجاح', 'تم تحديث بيانات الطالب بنجاح', 'success')
    await fetchStudent() // Refresh data
  } catch (error: any) {
    const msg
      = error.response?.data?.message || 'حدث خطأ أثناء تعديل بيانات الطالب'
    showToast('خطأ', msg, 'error')
  } finally {
    isSaving.value = false
  }
}

async function suspendStudent() {
  isStatusUpdating.value = true
  try {
    // A minimal payload to toggle status if the API supports it,
    // otherwise we fallback to update properties.
    // Depending on Swagger mapping for PUT /v2/students/{id}, status updates might be via PUT.
    await studentsService.updateStudentProfile(studentId, {
      status: 'suspended'
    })
    student.value.status = 'suspended'
    showToast('تنبيه', 'تم تعليق حساب الطالب', 'warning')
  } catch {
    showToast('خطأ', 'لم يتم تعليق الحساب', 'error')
  } finally {
    isStatusUpdating.value = false
  }
}

async function activateStudent() {
  isStatusUpdating.value = true
  try {
    await studentsService.updateStudentProfile(studentId, { status: 'active' })
    student.value.status = 'active'
    showToast('نجاح', 'تم تنشيط حساب الطالب', 'success')
  } catch {
    showToast('خطأ', 'فشل تنشيط الحساب', 'error')
  } finally {
    isStatusUpdating.value = false
  }
}

async function requestDeletion() {
  if (confirm('هل أنت متأكد من تقديم طلب لحذف حساب هذا الطالب؟')) {
    try {
      await studentsService.requestStudentDeletion(
        studentId,
        'حذف يدوي من الملف الشخصي'
      )
      showToast('تم', 'تم إرسال طلب الحذف بنجاح إلى الإدارة.', 'success')
    } catch (e) {
      showToast('خطأ', 'حدث خطأ أثناء إرسال طلب الحذف.', 'error')
    }
  }
}
</script>
