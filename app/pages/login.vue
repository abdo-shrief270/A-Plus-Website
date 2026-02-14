<template>
  <div class="w-full max-w-md mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      {{ $t("login.title") }}
    </h2>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        :label="$t('login.email')"
        name="email"
      >
        <UInput
          v-model="state.email"
          type="email"
          :placeholder="$t('login.email_placeholder')"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('login.password')"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
          :placeholder="$t('login.password_placeholder')"
          size="lg"
        />
      </UFormGroup>

      <UButton
        type="submit"
        block
        size="lg"
        :loading="loading"
      >
        {{ $t("login.submit") }}
      </UButton>
    </UForm>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        {{ $t("login.no_account") }}
        <NuxtLink
          to="/register"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          {{ $t("login.register") }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthService } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useRedirect } from '@/composables/useRedirect'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { t } = useI18n()

useSeoMeta({
  title: t('login.meta.title'),
  description: t('login.meta.description')
})

const { login, loading } = useAuthService()
const authStore = useAuthStore()
const { redirectByRole } = useRedirect()

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const { data } = await login(event.data)
    await authStore.storeUser(data)
    redirectByRole(data.user)
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
