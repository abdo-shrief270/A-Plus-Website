<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <NuxtLink to="/dashboard/students">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        إضافة طالب جديد
      </h1>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-w-2xl">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="الاسم الكامل" name="name" class="col-span-2">
            <UInput v-model="state.name" placeholder="اسم الطالب" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="اسم المستخدم" name="user_name" class="col-span-2">
            <UInput v-model="state.user_name" placeholder="user_name" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="كود الدولة" name="country_code">
            <UInput v-model="state.country_code" placeholder="+966" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="رقم الهاتف" name="phone">
            <UInput v-model="state.phone" placeholder="05xxxxxxxx" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="البريد الإلكتروني" name="email" class="col-span-2">
            <UInput v-model="state.email" type="email" placeholder="email@example.com" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="كلمة المرور" name="password">
            <UInput v-model="state.password" type="password" placeholder="••••••••" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="الجنس" name="gender">
            <USelect v-model="state.gender" :options="genderOptions" size="lg" class="w-full" placeholder="اختر" />
          </UFormField>
          <UFormField label="رقم الهوية" name="id_number" class="col-span-2">
            <UInput v-model="state.id_number" placeholder="رقم الهوية" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="الاختبار" name="exam_id" class="col-span-2">
            <USelect v-model="state.exam_id" :options="examOptions" size="lg" class="w-full" :loading="examsLoading" placeholder="اختر الاختبار" />
          </UFormField>
          <UFormField label="تاريخ الاختبار" name="exam_date" class="col-span-2">
            <UInput v-model="state.exam_date" type="date" size="lg" class="w-full" />
          </UFormField>
        </div>
        <div class="flex gap-3 pt-2">
          <UButton type="submit" :loading="loading">
            إضافة الطالب
          </UButton>
          <NuxtLink to="/dashboard/students">
            <UButton color="neutral" variant="outline">
              إلغاء
            </UButton>
          </NuxtLink>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { studentService } from '@/services/api/student.service'
import { examService } from '@/services/api/exam.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth', 'role'] })
useSeoMeta({ title: 'إضافة طالب | A Plus' })

const loading = ref(false)
const examsLoading = ref(false)
const examOptions = ref<any[]>([])

const genderOptions = [
  { label: 'ذكر', value: 'male' },
  { label: 'أنثى', value: 'female' }
]

const schema = z.object({
  name: z.string().min(2),
  user_name: z.string().min(3),
  country_code: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(8),
  gender: z.enum(['male', 'female']),
  id_number: z.string().min(5),
  exam_id: z.number(),
  exam_date: z.string().min(1)
})

const state = reactive<any>({ name: '', user_name: '', country_code: '+966', phone: '', email: '', password: '', gender: undefined, id_number: '', exam_id: undefined, exam_date: '' })

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true
  try {
    await studentService.create(event.data)
    showToast('نجح', 'تم إضافة الطالب', 'success')
    navigateTo('/dashboard/students')
  } catch {
    //
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  examsLoading.value = true
  try {
    const res = await examService.list()
    examOptions.value = (res.data?.data?.exams || []).map((e: any) => ({ label: e.name, value: e.id }))
  } catch {
    //
  } finally {
    examsLoading.value = false
  }
})
</script>
