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
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
              <UIcon
                name="i-heroicons-arrow-up-tray"
                class="w-5 h-5 text-secondary-600"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">
                {{ labels.importAction }}
              </h3>
              <p class="text-xs text-gray-500">
                أنشئ عدة حسابات دفعة واحدة من ملف CSV
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
          <!-- Step 1: pick exam -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              الاختبار الافتراضي <span class="text-error-500">*</span>
            </label>
            <USelect
              v-model="examId"
              :items="examOptions"
              :loading="examsLoading"
              :disabled="examsLoading || submitting"
              placeholder="اختر الاختبار"
              size="lg"
            />
            <p class="mt-1.5 text-xs text-gray-500 leading-relaxed">
              يُستخدم هذا الاختبار لكل صف بالملف لا يحتوي على عمود <code class="font-mono text-[11px] bg-gray-100 px-1 py-0.5 rounded">exam_id</code>.
            </p>
          </div>

          <!-- Exam IDs reference -->
          <details class="group bg-gray-50 border border-gray-200 rounded-xl">
            <summary class="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer select-none">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="w-5 h-5 text-primary-600"
                />
                قائمة معرفات الاختبارات (exam_id)
              </span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180"
              />
            </summary>
            <div class="px-4 pb-3 pt-1 border-t border-gray-200">
              <p class="text-xs text-gray-500 mb-2">
                استخدم الرقم الموجود في عمود <strong>المعرف</strong> داخل ملف CSV لتعيين اختبار مختلف لكل {{ labels.singular }}.
              </p>
              <div
                v-if="examsLoading"
                class="py-4 text-center text-xs text-gray-500"
              >
                جاري التحميل...
              </div>
              <div
                v-else-if="!exams.length"
                class="py-4 text-center text-xs text-gray-500"
              >
                لا توجد اختبارات متاحة.
              </div>
              <ul
                v-else
                class="max-h-44 overflow-y-auto divide-y divide-gray-200 rounded-lg bg-white border border-gray-200"
              >
                <li
                  v-for="e in exams"
                  :key="e.id"
                  class="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-primary-50/40"
                >
                  <span class="text-gray-700 truncate">{{ e.name }}</span>
                  <code class="font-mono text-[11px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded shrink-0">
                    {{ e.id }}
                  </code>
                </li>
              </ul>
            </div>
          </details>

          <!-- Step 2: example download -->
          <div class="bg-primary-50/60 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
            <UIcon
              name="i-heroicons-document-arrow-down"
              class="w-6 h-6 text-primary-600 shrink-0 mt-0.5"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900">
                نموذج جاهز للاستخدام
              </p>
              <p class="text-xs text-gray-600 mt-0.5">
                نزّل الملف، عبّئ بيانات {{ labels.plural }}، ثم ارفعه أدناه.
              </p>
            </div>
            <UButton
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-arrow-down-tray"
              @click="downloadTemplate"
            >
              تحميل النموذج
            </UButton>
          </div>

          <!-- Step 3: file picker -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              ملف {{ labels.plural }} (CSV) <span class="text-error-500">*</span>
            </label>
            <div
              class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
              :class="file
                ? 'border-primary-400 bg-primary-50/40'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'"
              @click="triggerFile"
              @dragover.prevent
              @drop.prevent="onDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".csv,text/csv"
                class="hidden"
                @change="onFileChange"
              >

              <div v-if="!file">
                <UIcon
                  name="i-heroicons-cloud-arrow-up"
                  class="w-10 h-10 text-gray-400 mx-auto mb-2"
                />
                <p class="text-sm font-semibold text-gray-700">
                  اسحب الملف هنا أو اضغط للاختيار
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  يدعم صيغة CSV فقط
                </p>
              </div>

              <div
                v-else
                class="text-right"
              >
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-document-text"
                    class="w-9 h-9 text-primary-500 shrink-0"
                  />
                  <div class="flex-1 min-w-0 text-right">
                    <p class="text-sm font-bold text-gray-900 truncate">
                      {{ file.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ (file.size / 1024).toFixed(1) }} KB
                      <span
                        v-if="parsedRows.length"
                        class="mx-1"
                      >·</span>
                      <span v-if="parsedRows.length">{{ parsedRows.length }} سجل تم التعرف عليه</span>
                    </p>
                  </div>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-x-mark"
                    size="xs"
                    :disabled="submitting"
                    @click.stop="clearFile"
                  />
                </div>
              </div>
            </div>

            <p
              v-if="parseError"
              class="mt-2 text-xs text-error-600 flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-4 h-4"
              />
              {{ parseError }}
            </p>
          </div>

          <!-- Result summary after submit -->
          <div
            v-if="result"
            class="rounded-xl border p-4 space-y-2"
            :class="result.total_failed > 0
              ? 'bg-warning-50/60 border-warning-200'
              : 'bg-success-50/60 border-success-200'"
          >
            <p class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <UIcon
                :name="result.total_failed > 0 ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'"
                class="w-5 h-5"
                :class="result.total_failed > 0 ? 'text-warning-600' : 'text-success-600'"
              />
              {{ result.total_failed > 0 ? 'تم الاستيراد جزئياً' : 'تم الاستيراد بنجاح' }}
            </p>
            <p class="text-xs text-gray-700">
              تم إنشاء <strong>{{ result.total_created }}</strong> حساب،
              فشل <strong>{{ result.total_failed }}</strong>.
            </p>
            <details
              v-if="result.failed?.length"
              class="text-xs"
            >
              <summary class="cursor-pointer text-warning-700 font-semibold">
                عرض تفاصيل الأسطر التي فشلت
              </summary>
              <ul class="mt-2 space-y-1.5 max-h-40 overflow-y-auto pr-2">
                <li
                  v-for="(item, i) in result.failed"
                  :key="i"
                  class="bg-white rounded-md px-2 py-1.5 border border-gray-100"
                >
                  <span class="font-bold">سطر {{ (item.index ?? 0) + 1 }}:</span>
                  <span class="text-error-700">{{ item.error }}</span>
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
            icon="i-heroicons-paper-airplane"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="submit"
          >
            بدء الاستيراد ({{ parsedRows.length }})
          </UButton>
          <UButton
            v-else
            color="primary"
            icon="i-heroicons-arrow-path"
            @click="reset"
          >
            استيراد ملف آخر
          </UButton>
        </div>
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
  'imported': [result: { total_created: number, total_failed: number }]
}>()

const examId = ref<number | undefined>(undefined)
const examsLoading = ref(false)
const exams = ref<Array<{ id: number, name: string }>>([])
const examOptions = computed(() =>
  exams.value.map(e => ({ label: e.name, value: e.id }))
)

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const parsedRows = ref<Record<string, string>[]>([])
const parseError = ref('')

const submitting = ref(false)
const result = ref<{ total_created: number, total_failed: number, failed?: Array<{ index?: number, error: string }> } | null>(null)

const canSubmit = computed(() =>
  !!examId.value && parsedRows.value.length > 0 && !parseError.value && !submitting.value
)

const onOpenChange = (val: boolean) => {
  if (submitting.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  file.value = null
  parsedRows.value = []
  parseError.value = ''
  result.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function clearFile() {
  reset()
}

function triggerFile() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const selected = target.files?.[0]
  if (selected) handleFile(selected)
}

function onDrop(e: DragEvent) {
  const dropped = e.dataTransfer?.files?.[0]
  if (dropped) handleFile(dropped)
}

async function handleFile(f: File) {
  result.value = null
  parseError.value = ''
  parsedRows.value = []

  if (!/\.csv$/i.test(f.name)) {
    parseError.value = 'يرجى رفع ملف بصيغة CSV.'
    return
  }
  file.value = f

  try {
    const text = await f.text()
    const rows = parseCsv(text)
    if (!rows.length) {
      parseError.value = 'الملف فارغ أو لا يحتوي على بيانات صالحة.'
      return
    }
    const firstRow = rows[0] ?? {}
    const required = ['name', 'user_name']
    const missing = required.filter(k => !(k in firstRow))
    if (missing.length) {
      parseError.value = `الأعمدة المطلوبة مفقودة: ${missing.join(', ')}`
      return
    }
    parsedRows.value = rows
  } catch (err) {
    parseError.value = 'تعذّر قراءة الملف.'
    console.error(err)
  }
}

/**
 * Minimal CSV parser supporting quoted fields with embedded commas, newlines,
 * and escaped quotes ("" -> "). Returns an array of objects keyed by header.
 */
function parseCsv(text: string): Record<string, string>[] {
  const stripped = text.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  const endField = () => {
    row.push(field)
    field = ''
  }
  const endRow = () => {
    endField()
    rows.push(row)
    row = []
  }

  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i]
    if (inQuotes) {
      if (ch === '"' && stripped[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      endField()
    } else if (ch === '\n') {
      endRow()
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (field.length || row.length) {
    endRow()
  }

  const headerRow = rows[0]
  if (!headerRow) return []
  const headers = headerRow.map(h => h.trim().toLowerCase())
  return rows.slice(1)
    .filter(r => r.some(cell => cell.trim() !== ''))
    .map((r) => {
      const obj: Record<string, string> = {}
      headers.forEach((h, idx) => {
        obj[h] = (r[idx] ?? '').trim()
      })
      return obj
    })
}

function downloadTemplate() {
  const headers = ['name', 'user_name', 'password', 'gender', 'exam_id', 'exam_date', 'email', 'phone', 'id_number']
  const samples = [
    ['أحمد محمد', 'ahmed_2024', 'Password123', 'male', '', '', 'ahmed@example.com', '0512345678', ''],
    ['سارة علي', 'sara_2024', 'Password123', 'female', '', '', '', '0598765432', '']
  ]
  const lines = [headers, ...samples].map(row =>
    row.map(cell => /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell).join(',')
  )
  const csv = '\uFEFF' + lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'kids-import-template.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    const students = parsedRows.value.map((row) => {
      const payload: Record<string, any> = {
        name: row.name,
        user_name: row.user_name,
        password: row.password || undefined,
        password_confirmation: row.password || undefined,
        gender: row.gender || undefined,
        email: row.email || undefined,
        phone: row.phone || undefined,
        exam_date: row.exam_date || undefined,
        id_number: row.id_number || undefined,
        exam_id: row.exam_id ? Number(row.exam_id) : examId.value
      }
      // Drop undefined fields without dynamic delete.
      return Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      )
    })

    const res = await studentsService.bulkCreateStudents({ students })
    const data = res.data?.data ?? res.data
    result.value = {
      total_created: data.total_created ?? 0,
      total_failed: data.total_failed ?? 0,
      failed: data.failed ?? []
    }
    emit('imported', { total_created: result.value.total_created, total_failed: result.value.total_failed })
  } catch (err: any) {
    parseError.value = err?.response?.data?.message || 'حدث خطأ أثناء إرسال البيانات.'
    console.error(err)
  } finally {
    submitting.value = false
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

watch(() => props.open, (val) => {
  if (val) loadExams()
})
</script>
