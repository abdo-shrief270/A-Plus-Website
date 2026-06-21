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
                name="i-heroicons-pencil-square"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                تعديل بيانات {{ labels.one }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ kid?.name || '—' }}
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

        <form
          class="px-6 py-5 space-y-5"
          @submit.prevent="onSubmit"
        >
          <!-- Name + Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                الاسم الكامل
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
                رقم الهاتف
              </label>
              <UInput
                v-model="form.phone"
                placeholder="0512345678"
                icon="i-heroicons-phone"
                :disabled="submitting"
                size="lg"
              />
              <p
                v-if="errors.phone"
                class="mt-1 text-xs text-error-600"
              >
                {{ errors.phone[0] }}
              </p>
            </div>
          </div>

          <!-- Email -->
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
            <p
              v-if="errors.email"
              class="mt-1 text-xs text-error-600"
            >
              {{ errors.email[0] }}
            </p>
          </div>

          <!-- Exam + Exam date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                الاختبار
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
            </div>
          </div>

          <!-- ID Number -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              رقم الهوية الوطنية
            </label>
            <UInput
              v-model="form.id_number"
              placeholder="1234567890"
              :disabled="submitting"
              size="lg"
            />
            <p
              v-if="errors.id_number"
              class="mt-1 text-xs text-error-600"
            >
              {{ errors.id_number[0] }}
            </p>
          </div>

          <!-- Footer -->
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
              :disabled="!isDirty"
            >
              حفظ التغييرات
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

const props = defineProps<{
  open: boolean
  kid: any | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'updated': [kid: any]
}>()

const buildFormFromKid = (k: any | null) => ({
  name: k?.name ?? '',
  email: k?.email ?? '',
  phone: k?.phone ?? '',
  exam_id: k?.exam_id ?? undefined,
  exam_date: k?.exam_date ?? '',
  id_number: k?.id_number ?? ''
})

const todayIso = new Date().toISOString().slice(0, 10)

const form = ref(buildFormFromKid(props.kid))
const original = ref(buildFormFromKid(props.kid))
const errors = ref<Record<string, string[]>>({})
const submitting = ref(false)

const examsLoading = ref(false)
const exams = ref<Array<{ id: number, name: string }>>([])
const examOptions = computed(() =>
  exams.value.map(e => ({ label: e.name, value: e.id }))
)

const isDirty = computed(() => {
  const a = form.value, b = original.value
  return a.name !== b.name
    || a.email !== b.email
    || a.phone !== b.phone
    || a.exam_id !== b.exam_id
    || a.exam_date !== b.exam_date
    || a.id_number !== b.id_number
})

watch(() => props.open, (val) => {
  if (val) {
    form.value = buildFormFromKid(props.kid)
    original.value = buildFormFromKid(props.kid)
    errors.value = {}
    loadExams()
  }
})

watch(() => props.kid, (k) => {
  if (props.open) {
    form.value = buildFormFromKid(k)
    original.value = buildFormFromKid(k)
  }
})

const onOpenChange = (val: boolean) => {
  emit('update:open', val)
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
  if (!isDirty.value || submitting.value || !props.kid?.id) return
  submitting.value = true
  errors.value = {}

  const payload: Record<string, any> = {}
  const keys = ['name', 'email', 'phone', 'exam_id', 'exam_date', 'id_number'] as const
  for (const k of keys) {
    const a = (form.value as any)[k]
    const b = (original.value as any)[k]
    if (a !== b && a !== '' && a !== undefined && a !== null) {
      payload[k] = a
    }
  }

  try {
    const res = await studentsService.updateStudentProfile(props.kid.id, payload)
    const updated = res.data?.data ?? res.data
    emit('updated', updated)
    onOpenChange(false)
  } catch (err: any) {
    if (err?.response?.status === 422 && err.response.data?.errors) {
      errors.value = err.response.data.errors
    }
  } finally {
    submitting.value = false
  }
}
</script>
