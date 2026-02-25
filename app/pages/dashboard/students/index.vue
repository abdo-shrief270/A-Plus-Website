<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        الطلاب
      </h1>
      <div class="flex gap-3">
        <NuxtLink to="/dashboard/students/import">
          <UButton color="neutral" variant="outline" icon="i-heroicons-arrow-up-tray">
            استيراد
          </UButton>
        </NuxtLink>
        <NuxtLink to="/dashboard/students/create">
          <UButton icon="i-heroicons-plus">
            إضافة طالب
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-5">
      <UInput v-model="filters.search" placeholder="بحث بالاسم..." icon="i-heroicons-magnifying-glass" class="w-56" @input="debouncedFetch" />
      <UInput v-model="filters.exam_id" placeholder="ID الاختبار" class="w-36" @input="debouncedFetch" />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin" />
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="text-right px-4 py-3 text-gray-600 dark:text-gray-300 font-semibold">
              الاسم
            </th>
            <th class="text-right px-4 py-3 text-gray-600 dark:text-gray-300 font-semibold">
              اسم المستخدم
            </th>
            <th class="text-right px-4 py-3 text-gray-600 dark:text-gray-300 font-semibold">
              رقم الهوية
            </th>
            <th class="text-right px-4 py-3 text-gray-600 dark:text-gray-300 font-semibold">
              الاختبار
            </th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="student in students"
            :key="student.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {{ student.user?.name || student.name }}
            </td>
            <td class="px-4 py-3 text-gray-500">
              {{ student.user?.user_name || student.user_name }}
            </td>
            <td class="px-4 py-3 text-gray-500">
              {{ student.id_number }}
            </td>
            <td class="px-4 py-3 text-gray-500">
              {{ student.exam?.name }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2 justify-end">
                <NuxtLink :to="`/dashboard/students/${student.id}`">
                  <UButton size="xs" color="neutral" variant="ghost" icon="i-heroicons-pencil-square" />
                </NuxtLink>
                <UButton size="xs" color="error" variant="ghost" icon="i-heroicons-trash" @click="confirmDelete(student)" />
              </div>
            </td>
          </tr>
          <tr v-if="students.length === 0">
            <td colspan="5" class="text-center py-12 text-gray-400">
              لا يوجد طلاب
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700">
        <span class="text-sm text-gray-500">{{ pagination.total }} طالب</span>
        <div class="flex items-center gap-3">
          <UButton :disabled="pagination.current_page <= 1" color="neutral" variant="outline" size="xs" icon="i-heroicons-chevron-right" @click="changePage(pagination.current_page - 1)" />
          <span class="text-sm">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
          <UButton :disabled="pagination.current_page >= pagination.last_page" color="neutral" variant="outline" size="xs" icon="i-heroicons-chevron-left" @click="changePage(pagination.current_page + 1)" />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
            طلب حذف الطالب
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            هذا الإجراء يحتاج موافقة المشرف. أدخل سبب الحذف:
          </p>
          <UInput v-model="deleteReason" placeholder="سبب الحذف..." class="w-full mb-4" />
          <div class="flex gap-3 justify-end">
            <UButton color="neutral" variant="outline" @click="deleteModal = false">
              إلغاء
            </UButton>
            <UButton color="error" :loading="deleting" @click="onDelete">
              إرسال الطلب
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { studentService } from '@/services/api/student.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role']
})
useSeoMeta({ title: 'الطلاب | A Plus' })

const loading = ref(true)
const students = ref<any[]>([])
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })
const filters = reactive({ search: '', exam_id: '' })

const deleteModal = ref(false)
const deleteReason = ref('')
const deleting = ref(false)
const selectedStudent = ref<any>(null)

async function fetchStudents(page = 1) {
  loading.value = true
  try {
    const res = await studentService.list({ ...filters, page })
    students.value = res.data?.data?.data || res.data?.data || []
    const meta = res.data?.data?.meta || {}
    pagination.value = {
      current_page: meta.current_page || 1,
      last_page: meta.last_page || 1,
      total: meta.total || students.value.length
    }
  } catch {
    //
  } finally {
    loading.value = false
  }
}

const debouncedFetch = useDebounceFn(() => fetchStudents(), 400)

function changePage(page: number) { fetchStudents(page) }

function confirmDelete(student: any) {
  selectedStudent.value = student
  deleteReason.value = ''
  deleteModal.value = true
}

async function onDelete() {
  if (!selectedStudent.value) return
  deleting.value = true
  try {
    await studentService.destroy(selectedStudent.value.id, deleteReason.value)
    showToast('نجح', 'تم إرسال طلب الحذف للمشرف', 'success')
    deleteModal.value = false
    fetchStudents(pagination.value.current_page)
  } catch {
    //
  } finally {
    deleting.value = false
  }
}

onMounted(() => fetchStudents())
</script>
