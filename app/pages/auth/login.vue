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
            :schema="usernameSchema"
            :state="state"
            class="space-y-4"
            @submit="onUsernameSubmit"
          >
            <UFormField :label="$t('login.username')" name="user_name">
              <UInput
                v-model="state.user_name"
                type="text"
                placeholder="أدخل اسم المستخدم"
                size="lg"
                icon="i-heroicons-user"
                class="w-full"
                autofocus
              />
            </UFormField>

            <UButton type="submit" block size="lg" :loading="loading">
              التالي
            </UButton>

            <div
              class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              ليس لديك حساب؟
              <div class="mt-2 flex justify-center gap-4">
                <NuxtLink
                  to="/auth/register/student"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  تسجيل طالب
                </NuxtLink>
                <span class="text-gray-300 dark:text-gray-700">|</span>
                <NuxtLink
                  to="/auth/register/parent"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  تسجيل ولي أمر
                </NuxtLink>
              </div>
            </div>
          </UForm>
        </div>

        <!-- Step 2: Password Authentication -->
        <div
          v-if="step === 2"
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
        >
          <div class="flex items-center gap-3 mb-6">
            <UButton
              icon="i-heroicons-arrow-right"
              color="gray"
              variant="ghost"
              @click="step = 1"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              أهلاً، {{ state.user_name }}
            </h2>
          </div>

          <UForm
            :schema="passwordSchema"
            :state="state"
            class="space-y-4"
            @submit="onPasswordSubmit"
          >
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
                autofocus
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

        <!-- Step 3: Choose OTP Method -->
        <div
          v-if="step === 3"
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm text-center"
        >
          <div class="flex items-center justify-between mb-6">
            <UButton
              icon="i-heroicons-arrow-right"
              color="gray"
              variant="ghost"
              @click="authCheckData.has_password ? (step = 2) : (step = 1)"
            />
          </div>
          <UIcon
            name="i-heroicons-shield-check"
            class="w-16 h-16 text-primary-600 mx-auto mb-4"
          />
          <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            التحقق الثنائي مطلوب
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            الرجاء اختيار طريقة استلام رمز التحقق
          </p>
          <div class="flex flex-col gap-3">
            <UButton
              block
              size="lg"
              color="primary"
              variant="outline"
              icon="i-heroicons-envelope"
              :loading="loading"
              @click="onSendOtp('email')"
            >
              إرسال رمز عبر البريد الإلكتروني
            </UButton>
            <UButton
              block
              size="lg"
              color="primary"
              variant="outline"
              icon="i-heroicons-device-phone-mobile"
              :loading="loading"
              @click="onSendOtp('sms')"
            >
              إرسال رمز عبر SMS
            </UButton>
            <UButton
              block
              size="lg"
              color="success"
              variant="outline"
              icon="i-simple-icons-whatsapp"
              :loading="loading"
              @click="onSendOtp('whatsapp')"
            >
              إرسال رمز عبر WhatsApp
            </UButton>
          </div>
        </div>

        <!-- Step 4: Verify OTP code -->
        <div
          v-if="step === 4"
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
        >
          <div class="flex items-center gap-3 mb-6">
            <UButton
              icon="i-heroicons-arrow-right"
              color="gray"
              variant="ghost"
              @click="step = 3"
            />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              أدخل رمز التحقق
            </h2>
          </div>

          <p
            class="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium leading-relaxed"
          >
            تم إرسال رمز التحقق إليك. يرجى إدخاله في الحقل أدناه لإكمال الدخول.
          </p>

          <UForm
            :schema="otpSchema"
            :state="state"
            class="space-y-4"
            @submit="onVerifyOtpSubmit"
          >
            <UFormField label="رمز التحقق (OTP)" name="otp">
              <UInput
                v-model="state.otp"
                type="text"
                placeholder="أدخل الرمز المكون من 6 أرقام"
                size="lg"
                class="w-full text-center tracking-[0.5em] text-lg font-bold"
                :maxlength="6"
                autofocus
              />
            </UFormField>

            <UButton type="submit" block size="lg" :loading="loading">
              تأكيد الرمز والدخول
            </UButton>
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

const { loginCheck, login, sendOtp, verifyOtp, loading } = useAuthService();
const authStore = useAuthStore();
const { redirectByRole } = useRedirect();
const toast = useToast();

const step = ref(1);
const showPassword = ref(false);

const authCheckData = reactive({
  has_2fa: false,
  exists: false,
});

const usernameSchema = z.object({
  user_name: z
    .string()
    .min(1, t("validation.required", { field: t("login.username") })),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, t("validation.required", { field: t("login.password") })),
});

const otpSchema = z.object({
  otp: z.string().min(6, "رمز التحقق يجب أن يكون 6 أرقام على الأقل"),
});

const state = reactive({
  user_name: "",
  password: "",
  otp: "",
  device_id: useDeviceId(),
});

// Step 1: Handle Username Form Submit
async function onUsernameSubmit(
  event: FormSubmitEvent<z.output<typeof usernameSchema>>,
) {
  try {
    const response = await loginCheck({ user_name: event.data.user_name });
    const authData = response?.data || response;

    // Store returned flags
    authCheckData.exists = authData.exists;
    authCheckData.has_2fa = authData.has_2fa;

    if (!authCheckData.exists) {
      toast.add({
        title: "خطأ",
        description: "اسم المستخدم غير موجود",
        color: "error",
      });
      return;
    }

    if (authCheckData.has_2fa) {
      step.value = 3; // Proceed directly to OTP choice
    } else {
      step.value = 2; // Proceed to Password input
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      toast.add({
        title: "خطأ",
        description: "اسم المستخدم غير موجود",
        color: "error",
      });
    }
    console.error("Login Check error:", error);
  }
}

// Step 2: Handle Password Form Submit
async function onPasswordSubmit(
  event: FormSubmitEvent<z.output<typeof passwordSchema>>,
) {
  try {
    // Attempt standard login
    const response = await login({
      user_name: state.user_name,
      password: event.data.password,
      device_id: state.device_id,
    });

    const authData = response?.data || response;

    // If successful but 2FA is required, go to OTP options
    if (authData.requires_2fa) {
      step.value = 3;
      return;
    }

    // Otherwise, we got the token and user!
    await authStore.storeUser(authData);
    redirectByRole(authData.user);
  } catch (error) {
    console.error("Login password error:", error);
  }
}

// Step 3: Handle OTP Request
async function onSendOtp(method: "sms" | "whatsapp" | "email") {
  try {
    await sendOtp({
      user_name: state.user_name,
      method,
    });
    step.value = 4; // Proceed to Verify OTP input
  } catch (error) {
    console.error("Send OTP error:", error);
  }
}

// Step 4: Verify OTP
async function onVerifyOtpSubmit(
  event: FormSubmitEvent<z.output<typeof otpSchema>>,
) {
  try {
    const response = await verifyOtp({
      token: state.user_name, // Typically the username is the token for login 2FA
      otp: event.data.otp,
      type: "login",
    });

    const authData = response?.data || response;
    await authStore.storeUser(authData);
    redirectByRole(authData.user);
  } catch (error) {
    console.error("Verify OTP error:", error);
  }
}
</script>
