<template>
  <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen rtl:text-right">
    <!-- Image Section -->
    <div
      class="hidden md:flex relative items-start justify-center bg-primary-600 overflow-hidden"
    >
      <img
        src="~/assets/images/auth/authBg.png"
        class="absolute w-full h-full object-cover"
        alt="Background"
      >

      <div
        class="z-[100] mt-32 w-full flex flex-col items-center justify-start text-center px-8"
      >
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
          {{ $t("signup.banner_title") }}
        </h1>
        <p class="text-white text-xl opacity-90">
          {{ $t("signup.banner_subtitle") }}
        </p>
      </div>
    </div>

    <!-- Form Section -->
    <div
      class="flex flex-col items-center justify-start p-4 bg-white dark:bg-gray-900 overflow-y-auto"
    >
      <div class="w-full max-w-xl py-12 space-y-8">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
        >
          <h2
            class="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white"
          >
            {{ $t("signup.title") }}
          </h2>

          <div class="mb-6">
            <label class="block text-sm font-medium mb-2 opacity-80">{{
              $t("signup.role_selection")
            }}</label>
            <div class="flex gap-4">
              <BButton
                v-for="role in roles"
                :key="role.value"
                :variant="state.role === role.value ? 'solid' : 'outline'"
                class="flex-1 justify-center rounded-xl"
                @click="state.role = role.value"
              >
                {{ $t(`signup.role_${role.value}`) }}
              </BButton>
            </div>
          </div>

          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BInput
                v-model="state.name"
                label="signup.name"
                placeholder="signup.name_placeholder"
                icon="i-heroicons-user"
              />

              <BInput
                v-if="state.role === 'student'"
                v-model="state.user_name"
                label="signup.username"
                name="user_name"
                placeholder="signup.username_placeholder"
                icon="i-heroicons-at-symbol"
                :loading="isCheckingUsername"
                :color="
                  usernameStatus === 'taken'
                    ? 'error'
                    : usernameStatus === 'available'
                      ? 'success'
                      : undefined
                "
                @blur="onCheckUsername"
              >
                <template #trailing>
                  <UIcon
                    v-if="usernameStatus === 'available'"
                    name="i-heroicons-check-circle-20-solid"
                    class="text-green-500"
                  />
                  <UIcon
                    v-else-if="usernameStatus === 'taken'"
                    name="i-heroicons-x-circle-20-solid"
                    class="text-red-500"
                  />
                </template>
              </BInput>

              <UFormField
                :label="$t('signup.email')"
                name="email"
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  :placeholder="$t('signup.email_placeholder')"
                  icon="i-heroicons-envelope"
                />
              </UFormField>

              <BPhoneInput
                v-model="state.phone"
                label="signup.phone"
                placeholder="signup.phone_placeholder"
                @country="(code) => (state.country_code = code)"
              />

              <BInput
                v-model="state.password"
                label="signup.password"
                type="password"
                placeholder="signup.password_placeholder"
                icon="i-heroicons-lock-closed"
              />

              <BInput
                v-model="state.password_confirmation"
                label="signup.password_confirmation"
                type="password"
                placeholder="signup.password_confirmation_placeholder"
                icon="i-heroicons-lock-closed"
              />

              <BSelect
                v-model="state.gender"
                label="signup.gender"
                :options="genderOptions"
              />

              <template v-if="state.role === 'student'">
                <BSelect
                  v-model="state.exam_id"
                  label="signup.exam"
                  :options="examOptions"
                  placeholder="signup.exam_placeholder"
                />

                <BInput
                  v-model="state.exam_date"
                  label="signup.exam_date"
                  type="date"
                  icon="i-heroicons-calendar"
                />
              </template>
            </div>

            <BButton
              type="submit"
              block
              size="lg"
              :loading="loading"
              class="mt-6"
            >
              {{ $t("signup.submit") }}
            </BButton>

            <div class="text-center mt-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("signup.already_have_account") }}
                <NuxtLink
                  to="/auth/login"
                  class="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  {{ $t("signup.login") }}
                </NuxtLink>
              </p>
            </div>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthService } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'
import { useDeviceId } from '@/utils/device'

definePageMeta({
  layout: 'fullscreen',
  middleware: 'guest'
})

const { t } = useI18n()

useSeoMeta({
  title: t('signup.meta.title'),
  description: t('signup.meta.description')
})

const { registerStudent, registerParent, checkUsername, loading }
  = useAuthService()
const authStore = useAuthStore()
const { redirectByRole } = useRedirect()

const roles = [
  { value: 'student', label: t('signup.role_student') },
  { value: 'parent', label: t('signup.role_parent') }
] as const

const genderOptions = [
  { value: 'male', label: t('signup.gender_male') },
  { value: 'female', label: t('signup.gender_female') }
]

// Placeholder exam options
const examOptions = [
  { value: 1, label: 'Exam 1' },
  { value: 2, label: 'Exam 2' }
]

const usernameStatus = ref<'none' | 'checking' | 'available' | 'taken'>('none')
const isCheckingUsername = computed(() => usernameStatus.value === 'checking')

const state = reactive({
  role: 'student' as 'student' | 'parent',
  name: '',
  user_name: '',
  email: '',
  country_code: '+20',
  phone: '',
  password: '',
  password_confirmation: '',
  gender: 'male' as 'male' | 'female',
  exam_id: 1,
  exam_date: new Date().toISOString().split('T')[0],
  device_id: useDeviceId()
})

const schemas = {
  student: z
    .object({
      role: z.literal('student'),
      name: z
        .string()
        .min(3, t('validation.required', { field: t('signup.name') })),
      user_name: z
        .string()
        .min(3, t('validation.required', { field: t('signup.username') })),
      email: z.string().email(t('validation.invalid_email')),
      country_code: z.string().min(2),
      phone: z
        .string()
        .min(8, t('validation.required', { field: t('signup.phone') })),
      password: z
        .string()
        .min(8, t('validation.required', { field: t('signup.password') })),
      password_confirmation: z.string().min(
        8,
        t('validation.required', {
          field: t('signup.password_confirmation')
        })
      ),
      gender: z.enum(['male', 'female']),
      exam_id: z.number().int(),
      exam_date: z.string().min(1),
      device_id: z.string().min(1)
    })
    .refine(data => data.password === data.password_confirmation, {
      message: t('validation.password_mismatch'),
      path: ['password_confirmation']
    }),
  parent: z
    .object({
      role: z.literal('parent'),
      name: z
        .string()
        .min(3, t('validation.required', { field: t('signup.name') })),
      email: z.string().email(t('validation.invalid_email')),
      country_code: z.string().min(2),
      phone: z
        .string()
        .min(8, t('validation.required', { field: t('signup.phone') })),
      password: z
        .string()
        .min(8, t('validation.required', { field: t('signup.password') })),
      password_confirmation: z.string().min(
        8,
        t('validation.required', {
          field: t('signup.password_confirmation')
        })
      ),
      gender: z.enum(['male', 'female']),
      device_id: z.string().min(1)
    })
    .refine(data => data.password === data.password_confirmation, {
      message: t('validation.password_mismatch'),
      path: ['password_confirmation']
    })
}

const schema = computed(() => {
  return state.role === 'student' ? schemas.student : schemas.parent
})

async function onCheckUsername() {
  if (
    state.role !== 'student'
    || !state.user_name
    || state.user_name.length < 3
  ) {
    usernameStatus.value = 'none'
    return
  }

  usernameStatus.value = 'checking'
  try {
    const response = await checkUsername({ user_name: state.user_name })
    // Handle both wrapped and flat responses based on actual backend behavior observed
    const available
      = (response as any)?.data?.available ?? response?.available ?? false
    usernameStatus.value = available ? 'available' : 'taken'
  } catch {
    usernameStatus.value = 'none'
  }
}

async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    const response
      = state.role === 'student'
        ? await registerStudent(event.data)
        : await registerParent(event.data)

    // Handle potential data wrapper: { status, message, data: { user, token } }
    const authData = (response as any)?.data || response
    await authStore.storeUser(authData)
    redirectByRole(authData.user)
  } catch (error) {
    console.error('Registration error:', error)
  }
}
</script>
