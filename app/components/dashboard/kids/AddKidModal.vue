<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-2xl' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <UIcon
                name="i-heroicons-user-plus"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ labels.addAction }} جديد
              </h3>
              <p class="text-xs text-gray-500">
                أنشئ حساب أحد {{ labels.yourPlural }} للانضمام إلى المنصة
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            @click="onOpenChange(false)"
          />
        </div>

        <form
          class="px-6 py-5 space-y-5"
          @submit.prevent="onSubmit"
        >
          <!-- Name + Gender -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                الاسم الكامل <span class="text-error-500">*</span>
              </label>
              <UInput
                v-model="form.name"
                placeholder="أحمد محمد"
                :disabled="submitting"
                size="lg"
              />
              <p
                v-if="errors.name"
                class="mt-1 text-xs text-error-600"
              >
                {{ errors.name[0] }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                النوع <span class="text-error-500">*</span>
              </label>
              <USelect
                v-model="form.gender"
                :items="genderOptions"
                placeholder="اختر النوع"
                :disabled="submitting"
                size="lg"
              />
              <p
                v-if="errors.gender"
                class="mt-1 text-xs text-error-600"
              >
                {{ errors.gender[0] }}
              </p>
            </div>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              اسم المستخدم <span class="text-error-500">*</span>
            </label>
            <UInput
              v-model="form.user_name"
              placeholder="ahmed_2024"
              icon="i-heroicons-at-symbol"
              :disabled="submitting"
              size="lg"
            />
            <p class="mt-1 text-xs text-gray-500">
              يستخدمه {{ labels.hisFor }} لتسجيل الدخول
            </p>
            <p
              v-if="errors.user_name"
              class="mt-1 text-xs text-error-600"
            >
              {{ errors.user_name[0] }}
            </p>
          </div>

          <!-- Password + Confirm -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                كلمة المرور <span class="text-error-500">*</span>
              </label>
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :disabled="submitting"
                size="lg"
                :ui="{ trailing: 'pe-2' }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
              <p
                v-if="errors.password"
                class="mt-1 text-xs text-error-600"
              >
                {{ errors.password[0] }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                تأكيد كلمة المرور <span class="text-error-500">*</span>
              </label>
              <UInput
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :disabled="submitting"
                size="lg"
              />
              <p
                v-if="passwordMismatch"
                class="mt-1 text-xs text-error-600"
              >
                كلمتا المرور غير متطابقتين
              </p>
            </div>
          </div>

          <!-- Exam + Exam date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                الاختبار <span class="text-error-500">*</span>
              </label>
              <USelect
                v-model="form.exam_id"
                :items="examOptions"
                :loading="examsLoading"
                :disabled="submitting || examsLoading"
                placeholder="اختر الاختبار"
                size="lg"
              />
              <p
                v-if="errors.exam_id"
                class="mt-1 text-xs text-error-600"
              >
                {{ errors.exam_id[0] }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                تاريخ الاختبار
              </label>
              <UInput
                v-model="form.exam_date"
                type="date"
                :min="todayIso"
                :disabled="submitting"
                size="lg"
              />
              <p
                v-if="errors.exam_date"
                class="mt-1 text-xs text-error-600"
              >
                {{ errors.exam_date[0] }}
              </p>
              <p
                v-else
                class="mt-1 text-xs text-gray-500"
              >
                اختياري — التاريخ المتوقع لأداء الاختبار
              </p>
            </div>
          </div>

          <!-- Optional: email + phone -->
          <details class="group">
            <summary class="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer select-none">
              <UIcon
                name="i-heroicons-chevron-left"
                class="w-4 h-4 transition-transform group-open:-rotate-90"
              />
              بيانات اختيارية (بريد، هاتف)
            </summary>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="ahmed@example.com"
                  icon="i-heroicons-envelope"
                  :disabled="submitting"
                  size="lg"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                  رقم الهاتف
                </label>
                <UInput
                  v-model="form.phone"
                  placeholder="0512345678"
                  icon="i-heroicons-phone"
                  :disabled="submitting"
                  size="lg"
                />
              </div>
            </div>
          </details>

          <!-- Footer actions -->
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-gray-100">
            <UButton
              color="neutral"
              variant="ghost"
              :disabled="submitting"
              @click="onOpenChange(false)"
            >
              إلغاء
            </UButton>
            <UButton
              type="submit"
              color="primary"
              icon="i-heroicons-check"
              :loading="submitting"
              :disabled="!canSubmit"
            >
              إنشاء الحساب
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'
import { examService } from '@/services/api/exam.service'

const labels = useEntityLabels()

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'created': [student: any]
}>()

const initialForm = () => ({
  name: '',
  user_name: '',
  password: '',
  password_confirmation: '',
  gender: 'male' as 'male' | 'female',
  exam_id: undefined as number | undefined,
  exam_date: '',
  email: '',
  phone: ''
})

const todayIso = new Date().toISOString().slice(0, 10)

const form = ref(initialForm())
const errors = ref<Record<string, string[]>>({})
const submitting = ref(false)
const showPassword = ref(false)
const examsLoading = ref(false)
const exams = ref<Array<{ id: number, name: string }>>([])

const genderOptions = [
  { label: 'ذكر', value: 'male' },
  { label: 'أنثى', value: 'female' }
]

const examOptions = computed(() =>
  exams.value.map(e => ({ label: e.name, value: e.id }))
)

const passwordMismatch = computed(() =>
  !!form.value.password
  && !!form.value.password_confirmation
  && form.value.password !== form.value.password_confirmation
)

const canSubmit = computed(() => {
  const f = form.value
  return f.name.trim()
    && f.user_name.trim()
    && f.password
    && f.password.length >= 6
    && !passwordMismatch.value
    && f.gender
    && f.exam_id
})

const onOpenChange = (val: boolean) => {
  emit('update:open', val)
  if (!val) {
    form.value = initialForm()
    errors.value = {}
    showPassword.value = false
  }
}

async function loadExams() {
  if (exams.value.length) return
  examsLoading.value = true
  try {
    const res = await examService.list({ per_page: 100 })
    const payload = res.data?.data ?? res.data
    const list = Array.isArray(payload) ? payload : (payload?.data ?? payload?.exams ?? [])
    exams.value = list.map((e: any) => ({ id: e.id, name: e.name }))
  } catch (err) {
    console.error('Failed to load exams', err)
  } finally {
    examsLoading.value = false
  }
}

async function onSubmit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  errors.value = {}
  try {
    const res = await studentsService.createStudent({
      name: form.value.name.trim(),
      user_name: form.value.user_name.trim(),
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      gender: form.value.gender,
      exam_id: form.value.exam_id,
      exam_date: form.value.exam_date || undefined,
      email: form.value.email.trim() || undefined,
      phone: form.value.phone.trim() || undefined
    })
    const created = res.data?.data ?? res.data
    emit('created', created)
    onOpenChange(false)
  } catch (err: any) {
    if (err?.response?.status === 422 && err.response.data?.errors) {
      errors.value = err.response.data.errors
    }
  } finally {
    submitting.value = false
  }
}

watch(() => props.open, (val) => {
  if (val) loadExams()
})
</script>
