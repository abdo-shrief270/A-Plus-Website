<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-xl' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <UIcon
                name="i-heroicons-chat-bubble-left-right"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                رسالة تواصل جديدة
              </h3>
              <p class="text-xs text-gray-500">
                صف لنا مشكلتك أو سؤالك وسنرد عليك في أقرب وقت
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
          class="px-6 py-5 space-y-4"
          @submit.prevent="submit"
        >
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              الموضوع <span class="text-error-500">*</span>
            </label>
            <UInput
              v-model="form.subject"
              placeholder="مثال: استفسار عن الاشتراك"
              size="lg"
              :disabled="submitting"
            />
            <p
              v-if="errors.subject"
              class="mt-1 text-xs text-error-600"
            >
              {{ errors.subject[0] }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              الفئة
            </label>
            <USelect
              v-model="form.category"
              :items="categoryOptions"
              size="lg"
              :disabled="submitting || lockCategory"
            />
            <p
              v-if="lockCategory"
              class="mt-1 text-[11px] text-gray-500"
            >
              الفئة محددة تلقائياً حسب سياق الفتح.
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              تفاصيل الرسالة <span class="text-error-500">*</span>
            </label>
            <UTextarea
              v-model="form.description"
              placeholder="اكتب رسالتك هنا..."
              :rows="6"
              size="lg"
              :disabled="submitting"
              class="w-full"
              :ui="{ base: 'w-full' }"
            />
            <p
              v-if="errors.description"
              class="mt-1 text-xs text-error-600"
            >
              {{ errors.description[0] }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              {{ form.description.length }} / 5000
            </p>
          </div>

          <!-- Attachments -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              صور مرفقة (اختياري)
            </label>
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50/40 text-sm text-gray-700 transition-colors"
                :disabled="submitting || files.length >= 10"
                @click="fileInput?.click()"
              >
                <UIcon
                  name="i-heroicons-photo"
                  class="w-4 h-4"
                />
                إضافة صور ({{ files.length }}/10)
              </button>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="onFilesPicked"
              >
            </div>

            <ul
              v-if="files.length"
              class="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2"
            >
              <li
                v-for="(f, idx) in files"
                :key="idx"
                class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  :src="f.preview"
                  :alt="f.file.name"
                  class="w-full h-full object-cover"
                >
                <button
                  type="button"
                  class="absolute top-1 left-1 w-6 h-6 rounded-full bg-error-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  :disabled="submitting"
                  @click="removeFile(idx)"
                >
                  <UIcon
                    name="i-heroicons-x-mark"
                    class="w-3.5 h-3.5"
                  />
                </button>
              </li>
            </ul>

            <p
              v-if="errors.attachments"
              class="mt-1 text-xs text-error-600"
            >
              {{ errors.attachments[0] }}
            </p>
            <p class="mt-1 text-[11px] text-gray-500">
              JPG / PNG / WEBP / GIF — حد أقصى 5MB لكل صورة، 10 صور كحد أقصى.
            </p>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-gray-100">
            <UButton
              type="button"
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
              icon="i-heroicons-paper-airplane"
              :loading="submitting"
              :disabled="!canSubmit"
            >
              إرسال
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ticketsService, type TicketCategory } from '@/services/api/tickets.service'

interface TicketPrefill {
  subject?: string
  description?: string
  category?: TicketCategory
}

const props = defineProps<{
  open: boolean
  /** Optional starter values when the modal is opened from a feature page. */
  prefill?: TicketPrefill | null
  /** When true, the user can't change the prefilled category. */
  lockCategory?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'created': [ticket: any]
}>()

const initial = () => ({
  subject: props.prefill?.subject ?? '',
  description: props.prefill?.description ?? '',
  category: (props.prefill?.category ?? 'inquiry') as TicketCategory
})

const form = ref(initial())
const errors = ref<Record<string, string[]>>({})
const submitting = ref(false)

// When the parent opens the modal with new prefill data, refresh the form so
// each "report this question" click starts from the question-specific values.
watch(() => props.open, (val) => {
  if (val) form.value = initial()
})

interface PickedFile { file: File, preview: string }
const files = ref<PickedFile[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

function onFilesPicked(e: Event) {
  const input = e.target as HTMLInputElement
  const picked = Array.from(input.files ?? [])
  for (const f of picked) {
    if (files.value.length >= 10) break
    if (!f.type.startsWith('image/')) continue
    if (f.size > 5 * 1024 * 1024) continue
    files.value.push({ file: f, preview: URL.createObjectURL(f) })
  }
  // Reset so picking the same file again triggers change.
  input.value = ''
}

function removeFile(idx: number) {
  const removed = files.value.splice(idx, 1)[0]
  if (removed) URL.revokeObjectURL(removed.preview)
}

const categoryOptions = [
  { label: 'استفسار', value: 'inquiry' },
  { label: 'شكوى', value: 'complaint' },
  { label: 'اقتراح', value: 'suggestion' },
  { label: 'مشكلة تقنية', value: 'technical' },
  { label: 'الدفع والفواتير', value: 'billing' },
  { label: 'الإبلاغ عن سؤال', value: 'question_report' },
  { label: 'أخرى', value: 'other' }
]

const canSubmit = computed(() =>
  form.value.subject.trim().length >= 2
  && form.value.description.trim().length >= 5
  && !submitting.value
)

const onOpenChange = (val: boolean) => {
  if (submitting.value) return
  emit('update:open', val)
  if (!val) {
    form.value = initial()
    errors.value = {}
    files.value.forEach(f => URL.revokeObjectURL(f.preview))
    files.value = []
  }
}

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  errors.value = {}
  try {
    const res = await ticketsService.create({
      subject: form.value.subject.trim(),
      description: form.value.description.trim(),
      category: form.value.category,
      attachments: files.value.map(f => f.file)
    })
    const ticket = res.data?.data ?? res.data
    emit('created', ticket)
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
