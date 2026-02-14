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
      />

      <div
        class="z-[100] mt-32 w-full flex flex-col items-center justify-start text-center px-8"
      >
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
          {{ $t("login.banner_title") }}
        </h1>
        <p class="text-white text-xl opacity-90">
          {{ $t("login.banner_subtitle") }}
        </p>
      </div>
    </div>

    <!-- Form Section -->
    <div
      class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900"
    >
      <div class="w-full max-w-md space-y-8">
        <!-- Logo -->

        <div
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
        >
          <h2
            class="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white"
          >
            {{ $t("login.form_title") }}
          </h2>

          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField :label="$t('login.username')" name="username">
              <UInput
                v-model="state.username"
                type="text"
                :placeholder="$t('login.username_placeholder')"
                size="lg"
                icon="i-heroicons-user"
              />
            </UFormField>

            <UFormField :label="$t('login.password')" name="password">
              <UInput
                v-model="state.password"
                type="password"
                :placeholder="$t('login.password_placeholder')"
                size="lg"
                icon="i-heroicons-lock-closed"
              />
            </UFormField>

            <div class="flex justify-end">
              <NuxtLink
                to="/verify-way"
                class="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                {{ $t("login.forgot_password") }}
              </NuxtLink>
            </div>

            <UButton type="submit" block size="lg" :loading="loading">
              {{ $t("login.submit") }}
            </UButton>

            <div class="text-center mt-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("login.no_account") }}
                <NuxtLink
                  to="/register"
                  class="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  {{ $t("login.register") }}
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
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthService } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth";
import { useRedirect } from "@/composables/useRedirect";

definePageMeta({
  layout: "fullscreen",
  middleware: "guest",
});

const { t } = useI18n();

useSeoMeta({
  title: t("login.meta.title"),
  description: t("login.meta.description"),
});

const { login, loading } = useAuthService();
const authStore = useAuthStore();
const { redirectByRole } = useRedirect();

const schema = z.object({
  username: z
    .string()
    .min(1, t("validation.required", { field: t("login.username") })),
  password: z
    .string()
    .min(1, t("validation.required", { field: t("login.password") })),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  username: "",
  password: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // Adapter to match backend expected payload if it differs,
    // assuming backend can handle 'username' as 'email' or generic identifier
    // If backend STRICTLY requires 'email', we might need to change this.
    // Given previous code used 'email', let's preserve 'email' key if possible,
    // or send 'username' if updated types support it.
    // We updated types to support 'username', so we send state directly.
    const response = await login(event.data);
    await authStore.storeUser(response);
    redirectByRole(response.user);
  } catch (error) {
    console.error("Login error:", error);
  }
}
</script>
