<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900">
    <div class="w-full max-w-lg">
      <div class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <NuxtLink to="/auth/register">
            <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right" />
          </NuxtLink>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            تسجيل طالب جديد
          </h1>
        </div>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="الاسم الكامل" name="name" class="col-span-2">
              <UInput v-model="state.name" placeholder="أدخل اسمك الكامل" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="اسم المستخدم" name="user_name" class="col-span-2">
              <UInput
                v-model="state.user_name"
                placeholder="أدخل اسم المستخدم"
                size="lg"
                class="w-full"
                :trailing-icon="usernameStatus === 'available' ? 'i-heroicons-check-circle' : usernameStatus === 'taken' ? 'i-heroicons-x-circle' : undefined"
                @input="debouncedCheckUsername"
              />
              <p v-if="usernameStatus === 'available'" class="text-xs text-success-600 mt-1">
                اسم المستخدم متاح ✓
              </p>
              <p v-if="usernameStatus === 'taken'" class="text-xs text-error-600 mt-1">
                اسم المستخدم مستخدم بالفعل
              </p>
            </UFormField>

            <UFormField label="كود الدولة" name="country_code">
              <UInput v-model="state.country_code" placeholder="+966" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="رقم الهاتف" name="phone">
              <UInput v-model="state.phone" placeholder="05xxxxxxxx" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="البريد الإلكتروني (اختياري)" name="email" class="col-span-2">
              <UInput v-model="state.email" type="email" placeholder="email@example.com" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="كلمة المرور" name="password">
              <UInput v-model="state.password" type="password" placeholder="••••••••" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="الجنس" name="gender">
              <USelect
                v-model="state.gender"
                :options="genderOptions"
                size="lg"
                class="w-full"
                placeholder="اختر الجنس"
              />
            </UFormField>

            <UFormField label="الاختبار" name="exam_id" class="col-span-2">
              <USelect
                v-model="state.exam_id"
                :options="examOptions"
                size="lg"
                class="w-full"
                :loading="examsLoading"
                placeholder="اختر الاختبار"
              />
            </UFormField>

            <UFormField label="تاريخ الاختبار" name="exam_date" class="col-span-2">
              <UInput v-model="state.exam_date" type="date" size="lg" class="w-full" />
            </UFormField>

            <UFormField label="رقم الهوية" name="id_number" class="col-span-2">
              <UInput v-model="state.id_number" placeholder="أدخل رقم الهوية" size="lg" class="w-full" />
            </UFormField>
          </div>

          <UButton type="submit" block size="lg" :loading="loading" class="mt-4">
            إنشاء الحساب
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useDebounceFn } from '@vueuse/core'
import { authService } from '@/services/api/auth.service'
import { examService } from '@/services/api/exam.service'
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'

definePageMeta({ layout: 'fullscreen', middleware: 'guest' })
useSeoMeta({ title: 'تسجيل طالب | A Plus' })

const authStore = useAuthStore()
const { redirectByRole } = useRedirect()

const loading = ref(false)
const examsLoading = ref(false)
const usernameStatus = ref<'idle' | 'available' | 'taken'>('idle')
const examOptions = ref<{ label: string; value: number }[]>([])

const genderOptions = [
  { label: 'ذكر', value: 'male' },
  { label: 'أنثى', value: 'female' }
]

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب (٢ أحرف على الأقل)'),
  user_name: z.string().min(3, 'اسم المستخدم مطلوب'),
  country_code: z.string().min(1, 'كود الدولة مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  password: z.string().min(8, 'كلمة المرور ٨ أحرف على الأقل'),
  gender: z.enum(['male', 'female'], { message: 'الجنس مطلوب' }),
  exam_id: z.number({ required_error: 'الاختبار مطلوب' }),
  exam_date: z.string().min(1, 'تاريخ الاختبار مطلوب'),
  id_number: z.string().min(5, 'رقم الهوية مطلوب')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  user_name: '',
  country_code: '+966',
  phone: '',
  email: '',
  password: '',
  gender: undefined,
  exam_id: undefined,
  exam_date: '',
  id_number: ''
})

const debouncedCheckUsername = useDebounceFn(async () => {
  if (!state.user_name || state.user_name.length < 3) {
    usernameStatus.value = 'idle'
    return
  }
  try {
    const res = await authService.checkUsername(state.user_name!)
    usernameStatus.value = res.data?.data?.available ? 'available' : 'taken'
  } catch {
    usernameStatus.value = 'idle'
  }
}, 500)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const res = await authService.registerStudent(event.data)
    await authStore.storeUser(res.data)
    redirectByRole(res.data.data.user)
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  examsLoading.value = true
  try {
    const res = await examService.list()
    const exams = res.data?.data?.exams || []
    examOptions.value = exams.map((e: any) => ({ label: e.name, value: e.id }))
  } catch {
    // handled
  } finally {
    examsLoading.value = false
  }
})
</script>
