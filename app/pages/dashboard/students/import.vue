<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <NuxtLink to="/dashboard/students">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        استيراد الطلاب
      </h1>
    </div>

    <UTabs :items="tabs" class="mb-6">
      <!-- JSON Bulk Tab -->
      <template #bulk>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            الصق مصفوفة JSON تحتوي بيانات الطلاب. مثال:
          </p>
          <pre class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 mb-4 overflow-auto">[
  {
    "name": "أحمد محمد",
    "user_name": "ahmed_m",
    "country_code": "+966",
    "phone": "0501234567",
    "password": "password123",
    "gender": "male",
    "exam_id": 1,
    "exam_date": "2026-06-01",
    "id_number": "1234567890"
  }
]</pre>
          <UTextarea
            v-model="bulkJson"
            placeholder="الصق JSON هنا..."
            :rows="8"
            class="w-full mb-4 font-mono text-sm"
          />
          <UButton :loading="bulkLoading" :disabled="!bulkJson.trim()" @click="onBulkImport">
            استيراد من JSON
          </UButton>
        </div>
      </template>

      <!-- File Upload Tab -->
      <template #file>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <div
            class="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors"
            :class="isDragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
          >
            <UIcon name="i-heroicons-arrow-up-tray" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              اسحب ملف هنا أو انقر للاختيار
            </p>
            <p class="text-sm text-gray-400">
              CSV أو Excel (.xlsx) — حد أقصى 10MB
            </p>
            <input ref="fileInput" type="file" accept=".csv,.xlsx,.xls" class="hidden" @change="onFileSelect">
          </div>

          <div v-if="selectedFile" class="mt-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-600" />
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">{{ selectedFile.name }}</span>
            <UButton size="xs" color="error" variant="ghost" icon="i-heroicons-x-mark" @click="selectedFile = null" />
          </div>

          <UButton v-if="selectedFile" class="mt-4" :loading="fileLoading" @click="onFileImport">
            رفع واستيراد
          </UButton>
        </div>
      </template>
    </UTabs>

    <!-- Import Result -->
    <div v-if="importResult" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 mt-4">
      <h3 class="font-bold text-gray-900 dark:text-white mb-4">
        نتيجة الاستيراد
      </h3>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 text-center">
          <p class="text-3xl font-bold text-success-600">
            {{ importResult.total_created }}
          </p>
          <p class="text-sm text-success-700">
            تم الإنشاء
          </p>
        </div>
        <div class="bg-error-50 dark:bg-error-900/20 rounded-lg p-4 text-center">
          <p class="text-3xl font-bold text-error-600">
            {{ importResult.total_failed }}
          </p>
          <p class="text-sm text-error-700">
            فشل
          </p>
        </div>
      </div>
      <div v-if="importResult.errors?.length" class="mt-3">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          الأخطاء:
        </p>
        <ul class="text-sm text-error-600 space-y-1">
          <li v-for="(err, idx) in importResult.errors" :key="idx" class="flex items-start gap-2">
            <UIcon name="i-heroicons-x-circle" class="w-4 h-4 flex-shrink-0 mt-0.5" />
            {{ err }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentService } from '@/services/api/student.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth', 'role'] })
useSeoMeta({ title: 'استيراد الطلاب | A Plus' })

const tabs = [
  { label: 'JSON (جماعي)', slot: 'bulk', icon: 'i-heroicons-code-bracket' },
  { label: 'ملف CSV/Excel', slot: 'file', icon: 'i-heroicons-document-arrow-up' }
]

// Bulk JSON state
const bulkJson = ref('')
const bulkLoading = ref(false)

// File upload state
const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const fileLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const importResult = ref<any>(null)

async function onBulkImport() {
  try {
    const students = JSON.parse(bulkJson.value)
    if (!Array.isArray(students)) throw new Error('يجب أن تكون البيانات مصفوفة JSON')
    bulkLoading.value = true
    const res = await studentService.bulkCreate(students)
    importResult.value = res.data?.data
    showToast('نجح', res.data?.message || 'اكتمل الاستيراد', 'success')
    bulkJson.value = ''
  } catch (e: any) {
    showToast('خطأ', e.message || 'JSON غير صالح', 'error')
  } finally {
    bulkLoading.value = false
  }
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) selectedFile.value = file
}

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) selectedFile.value = file
}

async function onFileImport() {
  if (!selectedFile.value) return
  fileLoading.value = true
  try {
    const res = await studentService.importFile(selectedFile.value)
    importResult.value = res.data?.data
    showToast('نجح', res.data?.message || 'اكتمل الاستيراد', 'success')
    selectedFile.value = null
  } catch {
    //
  } finally {
    fileLoading.value = false
  }
}
</script>
