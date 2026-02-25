<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <NuxtLink to="/dashboard/students">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ student?.user?.name || 'تفاصيل الطالب' }}
      </h1>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-primary-500 animate-spin" />
    </div>

    <div v-else-if="student" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info Card -->
      <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-center">
        <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl font-bold text-primary-600">
            {{ student.user?.name?.charAt(0) || '?' }}
          </span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {{ student.user?.name }}
        </h2>
        <p class="text-gray-500 text-sm mb-4">
          @{{ student.user?.user_name }}
        </p>
        <div class="space-y-2 text-sm text-right">
          <div class="flex justify-between">
            <span class="text-gray-500">رقم الهوية:</span>
            <span class="font-medium">{{ student.id_number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">الاختبار:</span>
            <span class="font-medium">{{ student.exam?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">تاريخ الاختبار:</span>
            <span class="font-medium">{{ student.exam_date }}</span>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 class="font-bold text-gray-900 dark:text-white mb-5">
          تعديل بيانات الطالب
        </h3>
        <UForm :state="editState" class="space-y-4" @submit.prevent="onUpdate">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="الاسم" name="name" class="col-span-2">
              <UInput v-model="editState.name" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="رقم الهاتف" name="phone">
              <UInput v-model="editState.phone" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="البريد الإلكتروني" name="email">
              <UInput v-model="editState.email" type="email" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="رقم الهوية" name="id_number" class="col-span-2">
              <UInput v-model="editState.id_number" size="lg" class="w-full" />
            </UFormField>
          </div>
          <div class="flex gap-3 pt-2">
            <UButton type="submit" :loading="saving">
              حفظ التعديلات
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentService } from '@/services/api/student.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth', 'role'] })

const route = useRoute()
const loading = ref(true)
const saving = ref(false)
const student = ref<any>(null)

useSeoMeta({ title: computed(() => `${student.value?.user?.name || 'طالب'} | A Plus`) })

const editState = reactive({ name: '', phone: '', email: '', id_number: '' })

onMounted(async () => {
  try {
    const res = await studentService.detail(route.params.id as string)
    student.value = res.data?.data
    const u = student.value?.user
    editState.name = u?.name || ''
    editState.phone = u?.phone || ''
    editState.email = u?.email || ''
    editState.id_number = student.value?.id_number || ''
  } catch {
    //
  } finally {
    loading.value = false
  }
})

async function onUpdate() {
  saving.value = true
  try {
    await studentService.update(route.params.id as string, editState)
    showToast('نجح', 'تم حفظ التعديلات', 'success')
  } catch {
    //
  } finally {
    saving.value = false
  }
}
</script>
