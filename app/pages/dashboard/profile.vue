<template>
  <div>
    <!-- Top bar -->
    <div class="mb-6">
      <p class="text-xs text-gray-500">
        <NuxtLink
          to="/dashboard"
          class="hover:text-primary-600"
        >
          الرئيسية
        </NuxtLink>
        <span class="mx-1">›</span>
        <span>الملف الشخصي</span>
      </p>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
        الملف الشخصي
      </h1>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else
      class="space-y-5"
    >
      <!-- Hero -->
      <div class="relative bg-gradient-to-l from-primary-600 to-primary-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-md">
        <div class="absolute top-0 left-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div class="absolute bottom-0 right-1/3 w-48 h-48 bg-secondary-400/30 rounded-full translate-y-1/2 blur-2xl" />

        <div class="relative flex flex-col md:flex-row md:items-center gap-6">
          <div class="relative shrink-0">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg ring-4 ring-white/20 bg-gradient-to-br from-secondary-400 to-secondary-600">
              {{ initial(user?.name) }}
            </div>
            <div class="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-success-500 ring-4 ring-primary-700 flex items-center justify-center">
              <UIcon
                name="i-heroicons-check"
                class="w-4 h-4 text-white"
              />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h2 class="text-2xl sm:text-3xl font-bold text-white mb-1 truncate drop-shadow-sm">
              {{ user?.name || '—' }}
            </h2>
            <p class="text-sm text-white/90 flex items-center gap-1.5 mb-3 font-medium">
              <UIcon
                name="i-heroicons-at-symbol"
                class="w-4 h-4 text-white/80"
              />
              {{ user?.user_name || '—' }}
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-500 ring-1 ring-white/40 text-xs font-bold text-white shadow-sm">
                <UIcon
                  :name="roleIcon"
                  class="w-3.5 h-3.5 text-white"
                />
                {{ roleLabel }}
              </span>
              <span
                v-if="user?.gender"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur text-xs font-semibold text-white"
              >
                <UIcon
                  name="i-heroicons-user"
                  class="w-3.5 h-3.5 text-white"
                />
                {{ user.gender === 'female' ? 'أنثى' : 'ذكر' }}
              </span>
              <span
                v-if="memberSince"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur text-xs font-semibold text-white"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="w-3.5 h-3.5 text-white"
                />
                عضو منذ {{ memberSince }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <!-- Main column -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Personal info -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-primary-50/40 to-white">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-heroicons-identification"
                    class="w-5 h-5 text-primary-600"
                  />
                </div>
                <div class="min-w-0">
                  <h3 class="text-base font-bold text-gray-900">
                    البيانات الشخصية
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    يمكنك تعديل بياناتك في أي وقت
                  </p>
                </div>
              </div>
            </div>

            <UForm
              :schema="profileSchema"
              :state="profileState"
              class="space-y-5"
              @submit="onUpdateProfile"
            >
              <div class="px-6 py-5 space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UFormField
                    label="الاسم الكامل"
                    name="name"
                    required
                  >
                    <UInput
                      v-model="profileState.name"
                      icon="i-heroicons-user"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField
                    label="اسم المستخدم"
                    name="user_name"
                  >
                    <UInput
                      :model-value="user?.user_name"
                      icon="i-heroicons-at-symbol"
                      size="lg"
                      class="w-full"
                      disabled
                    />
                    <template #help>
                      <span class="text-[11px] text-gray-500">لا يمكن تعديل اسم المستخدم</span>
                    </template>
                  </UFormField>
                </div>

                <UFormField
                  label="البريد الإلكتروني"
                  name="email"
                >
                  <UInput
                    v-model="profileState.email"
                    type="email"
                    icon="i-heroicons-envelope"
                    size="lg"
                    class="w-full"
                    placeholder="example@domain.com"
                  />
                </UFormField>

                <UFormField
                  label="رقم الهاتف"
                  name="phone"
                >
                  <UInput
                    v-model="profileState.phone"
                    type="tel"
                    icon="i-heroicons-phone"
                    size="lg"
                    class="w-full"
                    placeholder="0512345678"
                    dir="ltr"
                  />
                </UFormField>
              </div>

              <div class="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-end gap-2">
                <UButton
                  type="button"
                  color="neutral"
                  variant="ghost"
                  :disabled="!isDirty || savingProfile"
                  @click="resetProfile"
                >
                  إلغاء التغييرات
                </UButton>
                <UButton
                  type="submit"
                  color="primary"
                  icon="i-heroicons-check"
                  :loading="savingProfile"
                  :disabled="!isDirty"
                >
                  حفظ
                </UButton>
              </div>
            </UForm>
          </div>

          <!-- Exam settings (student only) -->
          <div
            v-if="authStore.isStudent"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-secondary-50/40 to-white">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-secondary-50 border border-secondary-100 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-heroicons-academic-cap"
                    class="w-5 h-5 text-secondary-600"
                  />
                </div>
                <div class="min-w-0">
                  <h3 class="text-base font-bold text-gray-900">
                    بيانات الاختبار
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    يمكنك تغيير الاختبار أو موعده في أي وقت
                  </p>
                </div>
              </div>
            </div>

            <div class="px-6 py-5 space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormField
                  label="نوع الاختبار"
                  name="exam_id"
                  required
                >
                  <USelect
                    v-model="examState.exam_id"
                    :items="examOptions"
                    :loading="loadingExams"
                    :disabled="loadingExams || savingExam"
                    placeholder="اختر الاختبار"
                    size="lg"
                    class="w-full"
                  />
                  <template #help>
                    <span
                      v-if="currentExamName"
                      class="text-[11px] text-gray-500"
                    >
                      الحالي: {{ currentExamName }}
                    </span>
                  </template>
                </UFormField>

                <UFormField
                  label="تاريخ الاختبار"
                  name="exam_date"
                  :error="examDateError"
                >
                  <UInput
                    v-model="examState.exam_date"
                    type="date"
                    icon="i-heroicons-calendar-days"
                    size="lg"
                    class="w-full"
                    :min="todayIso"
                    :disabled="savingExam"
                  />
                  <template #help>
                    <span class="text-[11px] text-gray-500">
                      اختياري — لا يمكن اختيار تاريخ في الماضي
                    </span>
                  </template>
                </UFormField>
              </div>
            </div>

            <div class="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-end gap-2">
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                :disabled="!isExamDirty || savingExam"
                @click="resetExam"
              >
                إلغاء التغييرات
              </UButton>
              <UButton
                type="button"
                color="primary"
                icon="i-heroicons-check"
                :loading="savingExam"
                :disabled="!isExamDirty || !!examDateError"
                @click="onUpdateExam"
              >
                حفظ
              </UButton>
            </div>
          </div>
        </div>

        <!-- Sidebar: account + security -->
        <div class="space-y-5">
          <!-- Account quick info -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div class="px-5 py-5 border-b border-gray-100 bg-gradient-to-l from-success-50/40 to-white">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-success-50 border border-success-100 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-heroicons-shield-check"
                    class="w-5 h-5 text-success-600"
                  />
                </div>
                <div class="min-w-0">
                  <h3 class="text-base font-bold text-gray-900">
                    الحساب
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    معلومات أساسية وإعدادات الحساب
                  </p>
                </div>
              </div>
            </div>
            <dl class="divide-y divide-gray-100">
              <div class="px-5 py-3 flex items-center justify-between">
                <dt class="text-sm text-gray-500">
                  النوع
                </dt>
                <dd class="text-sm font-bold text-gray-900">
                  {{ roleLabel }}
                </dd>
              </div>
              <div class="px-5 py-3 flex items-center justify-between">
                <dt class="text-sm text-gray-500">
                  معرف الحساب
                </dt>
                <dd
                  class="text-sm font-mono text-gray-900"
                  dir="ltr"
                >
                  #{{ user?.id || '—' }}
                </dd>
              </div>
              <div class="px-5 py-3 flex items-center justify-between">
                <dt class="text-sm text-gray-500">
                  تاريخ الانضمام
                </dt>
                <dd class="text-sm font-semibold text-gray-900">
                  {{ formatDate(user?.created_at) }}
                </dd>
              </div>
              <div class="px-5 py-3 flex items-center justify-between gap-3">
                <dt class="text-sm text-gray-500">
                  الأجهزة المتصلة
                </dt>
                <dd>
                  <UButton
                    to="/dashboard/devices"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-device-phone-mobile"
                  >
                    إدارة
                  </UButton>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Change password -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div class="px-5 py-5 border-b border-gray-100 bg-gradient-to-l from-warning-50/40 to-white">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-warning-50 border border-warning-100 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-heroicons-lock-closed"
                    class="w-5 h-5 text-warning-600"
                  />
                </div>
                <div class="min-w-0">
                  <h3 class="text-base font-bold text-gray-900">
                    كلمة المرور
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    حافظ على كلمة مرور قوية لحماية حسابك
                  </p>
                </div>
              </div>
            </div>
            <UForm
              :schema="passwordSchema"
              :state="passwordState"
              class="px-5 py-5 space-y-4"
              @submit="onChangePassword"
            >
              <UFormField
                label="كلمة المرور الحالية"
                name="old_password"
                required
              >
                <UInput
                  v-model="passwordState.old_password"
                  :type="showCurrent ? 'text' : 'password'"
                  icon="i-heroicons-key"
                  size="lg"
                  class="w-full"
                  :ui="{ trailing: 'pe-2' }"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="showCurrent ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                      @click="showCurrent = !showCurrent"
                    />
                  </template>
                </UInput>
              </UFormField>

              <UFormField
                label="كلمة المرور الجديدة"
                name="password"
                required
              >
                <UInput
                  v-model="passwordState.password"
                  :type="showNew ? 'text' : 'password'"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  class="w-full"
                  :ui="{ trailing: 'pe-2' }"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="showNew ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                      @click="showNew = !showNew"
                    />
                  </template>
                </UInput>
              </UFormField>

              <UButton
                type="submit"
                color="primary"
                icon="i-heroicons-arrow-path"
                :loading="savingPassword"
                :disabled="!passwordState.old_password || !passwordState.password"
                block
              >
                تحديث كلمة المرور
              </UButton>

              <p class="text-[11px] text-gray-500 text-center">
                يجب ألا تقل كلمة المرور عن 6 أحرف
              </p>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { authService } from '@/services/api/auth.service'
import { examsService } from '@/services/api/exams.service'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/helpers/toast.helper'
import {
  profileSchema,
  passwordChangeSchema as passwordSchema,
  type ProfileInput as ProfileSchema,
  type PasswordChangeInput as PasswordSchema
} from '@/schemas/profile'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الملف الشخصي' })
useSeoMeta({ title: 'الملف الشخصي | A Plus' })

const authStore = useAuthStore()
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const user = ref<any>(null)

// Student exam settings
const exams = ref<any[]>([])
const loadingExams = ref(false)
const savingExam = ref(false)
const examState = reactive<{ exam_id: number | null, exam_date: string }>({
  exam_id: null,
  exam_date: ''
})
const originalExam = ref<{ exam_id: number | null, exam_date: string }>({ exam_id: null, exam_date: '' })

const profileState = reactive<ProfileSchema>({
  name: '',
  email: '',
  phone: ''
})

const passwordState = reactive<PasswordSchema>({
  old_password: '',
  password: ''
})

const original = ref<ProfileSchema>({ name: '', email: '', phone: '' })

const isDirty = computed(() =>
  profileState.name !== original.value.name
  || (profileState.email || '') !== (original.value.email || '')
  || (profileState.phone || '') !== (original.value.phone || '')
)

const examOptions = computed(() =>
  exams.value.map(e => ({ label: e.name, value: e.id }))
)

const currentExamName = computed(() => {
  const id = originalExam.value.exam_id
  if (!id) return user.value?.student?.exam_name || ''
  return exams.value.find(e => e.id === id)?.name || user.value?.student?.exam_name || ''
})

const isExamDirty = computed(() =>
  examState.exam_id !== originalExam.value.exam_id
  || (examState.exam_date || '') !== (originalExam.value.exam_date || '')
)

const todayIso = computed(() => new Date().toISOString().slice(0, 10))

const examDateError = computed(() => {
  if (!examState.exam_date) return undefined
  return examState.exam_date < todayIso.value ? 'لا يمكن اختيار تاريخ في الماضي' : undefined
})

const roleLabel = computed(() => {
  if (authStore.isSchool) return 'مدرسة'
  if (authStore.isParent) return 'ولي أمر'
  if (authStore.isStudent) return 'طالب'
  return '—'
})

const roleIcon = computed(() => {
  if (authStore.isSchool) return 'i-heroicons-building-library'
  if (authStore.isParent) return 'i-heroicons-users'
  if (authStore.isStudent) return 'i-heroicons-academic-cap'
  return 'i-heroicons-user'
})

const memberSince = computed(() => {
  const iso = user.value?.created_at
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
  } catch {
    return null
  }
})

onMounted(async () => {
  try {
    const res = await authService.me()
    user.value = res.data?.data?.user ?? res.data?.user ?? res.data

    profileState.name = user.value?.name || ''
    profileState.email = user.value?.email || ''
    profileState.phone = user.value?.phone || ''
    Object.assign(original.value, { ...profileState })

    if (user.value) authStore.user = user.value

    if (authStore.isStudent) {
      hydrateExamState()
      loadExams()
    }
  } catch (error) {
    console.error('Failed to load profile', error)
    showToast('خطأ', 'فشل في تحميل بيانات الملف الشخصي', 'error')
  } finally {
    loading.value = false
  }
})

function hydrateExamState() {
  const student = user.value?.student
  examState.exam_id = student?.exam_id ?? null
  examState.exam_date = toDateInput(student?.exam_date)
  originalExam.value = { exam_id: examState.exam_id, exam_date: examState.exam_date }
}

function toDateInput(value?: string | null): string {
  if (!value) return ''
  // Backend may return YYYY-MM-DD or full ISO timestamp; the <input type="date"> needs YYYY-MM-DD.
  return String(value).slice(0, 10)
}

async function loadExams() {
  loadingExams.value = true
  try {
    const res = await examsService.getExams({ per_page: 100 })
    const body = res.data?.data ?? res.data ?? {}
    exams.value = body.exams ?? []
  } catch (error) {
    console.error('Failed to load exams', error)
    exams.value = []
  } finally {
    loadingExams.value = false
  }
}

function resetExam() {
  examState.exam_id = originalExam.value.exam_id
  examState.exam_date = originalExam.value.exam_date
}

async function onUpdateExam() {
  if (!isExamDirty.value || !examState.exam_id || examDateError.value) return
  savingExam.value = true
  try {
    const payload: Record<string, any> = { exam_id: examState.exam_id }
    if (examState.exam_date) payload.exam_date = examState.exam_date
    else payload.exam_date = null

    const res = await authService.updateProfile(payload)
    const updatedUser = res.data?.data?.user ?? res.data?.user
    if (updatedUser) {
      user.value = updatedUser
      authStore.user = updatedUser
      hydrateExamState()
    } else {
      originalExam.value = { exam_id: examState.exam_id, exam_date: examState.exam_date }
    }

    showToast('نجاح', 'تم تحديث بيانات الاختبار بنجاح', 'success')
  } catch (error: any) {
    const msg = error.response?.data?.message || 'حدث خطأ أثناء التحديث'
    showToast('خطأ', msg, 'error')
  } finally {
    savingExam.value = false
  }
}

function resetProfile() {
  profileState.name = original.value.name
  profileState.email = original.value.email || ''
  profileState.phone = original.value.phone || ''
}

async function onUpdateProfile(event: FormSubmitEvent<ProfileSchema>) {
  savingProfile.value = true
  try {
    const payload: Record<string, any> = { ...event.data }
    if (!payload.email) delete payload.email
    if (!payload.phone) delete payload.phone

    const res = await authService.updateProfile(payload)

    const updatedUser = res.data?.data?.user ?? res.data?.user
    if (updatedUser) {
      user.value = updatedUser
      authStore.user = updatedUser
      Object.assign(original.value, {
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || ''
      })
    } else {
      Object.assign(original.value, { ...profileState })
    }

    showToast('نجاح', 'تم تحديث بيانات الملف الشخصي بنجاح', 'success')
  } catch (error: any) {
    const msg = error.response?.data?.message || 'حدث خطأ أثناء التحديث'
    showToast('خطأ', msg, 'error')
  } finally {
    savingProfile.value = false
  }
}

async function onChangePassword(event: FormSubmitEvent<PasswordSchema>) {
  savingPassword.value = true
  try {
    await authService.updateProfile({
      old_password: event.data.old_password,
      password: event.data.password
    })
    showToast('نجاح', 'تم تغيير كلمة المرور بنجاح', 'success')
    passwordState.old_password = ''
    passwordState.password = ''
    showCurrent.value = false
    showNew.value = false
  } catch (error: any) {
    const msg = error.response?.data?.message || 'تأكد من صحة كلمة المرور الحالية'
    showToast('خطأ', msg, 'error')
  } finally {
    savingPassword.value = false
  }
}

function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'A').toUpperCase()
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
