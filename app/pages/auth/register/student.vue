<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <NuxtLink to="/auth/register">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-right"
        />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          تسجيل طالب جديد
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          ابدأ رحلتك التعليمية معنا
        </p>
      </div>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-2 gap-4">
        <UFormField
          label="الاسم الكامل"
          name="name"
          class="col-span-2"
        >
          <UInput
            v-model="state.name"
            placeholder="أدخل اسمك الكامل"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="اسم المستخدم"
          name="user_name"
          class="col-span-2"
          :error="
            usernameCheck.status.value === 'taken'
              ? 'اسم المستخدم مستخدم بالفعل'
              : undefined
          "
        >
          <UInput
            v-model="state.user_name"
            placeholder="أدخل اسم المستخدم"
            size="lg"
            class="w-full"
            :trailing-icon="
              usernameCheck.status.value === 'available'
                ? 'i-heroicons-check-circle'
                : usernameCheck.status.value === 'taken'
                  ? 'i-heroicons-x-circle'
                  : undefined
            "
            :loading="usernameCheck.loading.value"
            @update:model-value="
              (val) => usernameCheck.checkUsername(String(val))
            "
          />
          <p
            v-if="usernameCheck.status.value === 'available'"
            class="text-xs text-green-600 mt-1"
          >
            اسم المستخدم متاح ✓
          </p>
        </UFormField>

        <UFormField
          label="رقم الهاتف"
          name="phone"
          class="col-span-2 relative z-50"
        >
          <BPhoneInput
            v-model="state.phone"
            :required="true"
            :error="false"
            label=""
            @country="(code) => (state.country_code = code)"
          />
        </UFormField>

        <UFormField
          label="البريد الإلكتروني (اختياري)"
          name="email"
          class="col-span-2 relative z-40"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="email@example.com"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="كلمة المرور"
          name="password"
        >
          <PasswordField
            v-model="state.password"
            @generate="state.password_confirmation = $event"
          />
        </UFormField>

        <UFormField
          label="تأكيد كلمة المرور"
          name="password_confirmation"
        >
          <UInput
            v-model="state.password_confirmation"
            type="password"
            placeholder="••••••••"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="الجنس"
          name="gender"
        >
          <USelect
            v-model="state.gender"
            :items="genderOptions"
            value-attribute="value"
            option-attribute="label"
            size="lg"
            class="w-full"
            placeholder="اختر الجنس"
          />
        </UFormField>

        <UFormField
          label="الاختبار"
          name="exam_id"
        >
          <USelect
            v-model="state.exam_id"
            :items="examOptions"
            value-attribute="value"
            option-attribute="label"
            size="lg"
            class="w-full"
            :loading="examsLoading"
            placeholder="اختر الاختبار"
          />
        </UFormField>

        <UFormField
          label="تاريخ الاختبار"
          name="exam_date"
          class="col-span-2"
        >
          <UPopover>
            <UButton
              color="neutral"
              variant="subtle"
              size="lg"
              class="w-full justify-start text-right bg-transparent border-gray-300 dark:border-gray-700/50 hover:bg-transparent"
              :class="[
                !state.exam_date && 'text-gray-500 dark:text-gray-400'
              ]"
            >
              <UIcon
                name="i-heroicons-calendar"
                class="w-5 h-5 text-gray-500 ml-2"
              />
              {{
                state.exam_date
                  ? formatter.format(
                    state.exam_date.toDate(getLocalTimeZone())
                  )
                  : "اختر تاريخ الاختبار"
              }}
            </UButton>

            <template #content>
              <UCalendar v-model="examDateValue" />
            </template>
          </UPopover>
        </UFormField>
      </div>

      <div class="pt-4">
        <UButton
          type="submit"
          block
          size="xl"
          :loading="loading"
          class="w-full font-bold text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400"
          :ui="{ base: 'rounded-xl' }"
        >
          إنشاء الحساب
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { authService } from '@/services/api/auth.service'
import { examService } from '@/services/api/exam.service'
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'
import { useUsernameCheck } from '@/composables/useUsernameCheck'
import { studentRegisterSchema, type StudentRegisterInput } from '@/schemas/auth'
import {
  getLocalTimeZone,
  DateFormatter,
  type DateValue
} from '@internationalized/date'

definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'تسجيل طالب | A Plus' })

const authStore = useAuthStore()
const { redirectByRole } = useRedirect()
const usernameCheck = useUsernameCheck()

const loading = ref(false)
const examsLoading = ref(false)

// خيارات الجنس المعدلة لتناسب الـ Schema
const genderOptions = [
  { label: 'ذكر', value: 'male' },
  { label: 'أنثى', value: 'female' }
]

const examOptions = ref<{ label: string, value: number }[]>([])

const schema = studentRegisterSchema
type Schema = StudentRegisterInput

const state = reactive({
  name: '',
  user_name: '',
  country_code: '+20',
  phone: '',
  email: '',
  password: '',
  password_confirmation: '',
  gender: undefined as 'male' | 'female' | undefined,
  exam_id: undefined as number | undefined,
  exam_date: undefined as DateValue | undefined
})

// Writable bridge for UCalendar so the union cast stays out of the template
// (a bare `|` there is misparsed as a deprecated Vue filter).
const examDateValue = computed({
  // Reactive unwrapping widens the branded DateValue union; cast it back here
  // (contained in script, never in the template).
  get: () => state.exam_date as DateValue | undefined,
  set: (v: DateValue | undefined) => {
    state.exam_date = v
  }
})

const formatter = new DateFormatter('ar-EG', { dateStyle: 'long' })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (usernameCheck.status.value !== 'available') {
    return
  }

  loading.value = true
  try {
    const dataToSend = {
      ...event.data,
      exam_date: event.data.exam_date.toString()
    }
    const res = await authService.registerStudent(dataToSend)
    const authData = res?.data || res
    await authStore.storeUser(authData)
    redirectByRole(authData.user)
  } catch (err) {
    console.error('Register Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  examsLoading.value = true
  try {
    const res = await examService.list()
    // تأكد من مسار البيانات في الـ Response الخاص بك
    const exams: { id: number | string, name: string }[] = res.data?.data?.exams || res.data?.data || []
    examOptions.value = exams.map(e => ({
      label: e.name,
      value: Number(e.id)
    }))
  } catch (err) {
    console.error('Fetch Exams Error:', err)
  } finally {
    examsLoading.value = false
  }
})
</script>
