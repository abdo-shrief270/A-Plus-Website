<template>
  <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    <!-- Banner -->
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
          مرحباً بك في A+
        </h1>
        <p class="text-white text-xl opacity-90">
          المنصة التعليمية الأكثر تطوراً
        </p>
      </div>
    </div>

    <!-- Form -->
    <div
      class="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900"
    >
      <div class="w-full max-w-md space-y-6">
        <!-- Step 1: Username check -->
        <div
          v-if="step === 1"
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
        >
          <h2
            class="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white"
          >
            تسجيل الدخول
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
                placeholder="أدخل اسم المستخدم"
                size="lg"
                icon="i-heroicons-user"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="$t('login.password')" name="password">
              <UInput
                v-model="state.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="أدخل كلمة المرور"
                size="lg"
                icon="i-heroicons-lock-closed"
                :trailing-icon="
                  showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                "
                class="w-full"
                @click:trailing="showPassword = !showPassword"
              />
            </UFormField>
            <div class="flex justify-end">
              <NuxtLink
                to="/auth/forgot-password"
                class="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                نسيت كلمة المرور؟
              </NuxtLink>
            </div>

            <UButton type="submit" block size="lg" :loading="loading">
              {{ $t("login.submit") }}
            </UButton>
          </UForm>
        </div>

        <!-- Step 3: 2FA hint -->
        <div
          v-if="step === 3"
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm text-center"
        >
          <UIcon
            name="i-heroicons-shield-check"
            class="w-16 h-16 text-primary-600 mx-auto mb-4"
          />
          <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            التحقق الثنائي مطلوب
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            سيتم إرسال رمز التحقق إلى
            <span v-if="twoFaContact.phone" class="font-semibold">{{
              twoFaContact.phone
            }}</span>
            <span v-if="twoFaContact.email" class="font-semibold">
              أو {{ twoFaContact.email }}</span
            >
          </p>
          <div class="flex flex-col gap-3">
            <UButton
              v-if="twoFaContact.phone"
              block
              size="lg"
              :loading="loading"
              @click="sendOtpAndRedirect('sms')"
            >
              إرسال رمز عبر SMS
            </UButton>
            <UButton
              v-if="twoFaContact.phone"
              block
              size="lg"
              color="success"
              variant="outline"
              :loading="loading"
              @click="sendOtpAndRedirect('whatsapp')"
            >
              إرسال رمز عبر WhatsApp
            </UButton>
            <UButton
              v-if="twoFaContact.email"
              block
              size="lg"
              color="neutral"
              variant="outline"
              :loading="loading"
              @click="sendOtpAndRedirect('email')"
            >
              إرسال رمز عبر البريد الإلكتروني
            </UButton>
          </div>
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
import { useDeviceId } from "@/utils/device";

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

const step = ref(1);
const showPassword = ref(false);
const twoFaContact = reactive({ phone: "", email: "" });
const sendOtpAndRedirect = (type: string) => {
  console.log("OTP type:", type);
};

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
  device_id: useDeviceId(),
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await login(event.data);
    // Handle potential data wrapper: { status, message, data: { user, token } }
    const authData = response?.data || response;
    await authStore.storeUser(authData);
    redirectByRole(authData.user);
  } catch (error) {
    console.error("Login error:", error);
  }
}
</script>
