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
          تسجيل ولي أمر جديد
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          أنشئ حسابك لمتابعة أبنائك بسهولة
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
            :model-value="state.phone ?? null"
            :required="true"
            :error="false"
            :label="''"
            @update:model-value="(v) => (state.phone = v)"
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
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            size="lg"
            class="w-full"
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
          class="col-span-2"
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
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'
import { useUsernameCheck } from '@/composables/useUsernameCheck'
import { parentRegisterSchema, type ParentRegisterInput } from '@/schemas/auth'

definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'تسجيل ولي أمر | A Plus' })

const authStore = useAuthStore()
const { redirectByRole } = useRedirect()
const usernameCheck = useUsernameCheck()

const loading = ref(false)

const genderOptions = [
  { label: 'ذكر', value: 'male' },
  { label: 'أنثى', value: 'female' }
]

const schema = parentRegisterSchema
type Schema = ParentRegisterInput

const state = reactive<Partial<Schema>>({
  name: '',
  user_name: '',
  country_code: '+20',
  phone: '',
  email: '',
  password: '',
  password_confirmation: '',
  gender: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (usernameCheck.status.value !== 'available') {
    return
  }

  loading.value = true
  try {
    const res = await authService.registerParent(event.data)
    const authData = res?.data || res
    await authStore.storeUser(authData)
    redirectByRole(authData.user)
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
