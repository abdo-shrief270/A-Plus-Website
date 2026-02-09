<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      تسجيل الدخول
    </h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <UInput
          v-model="credentials.email"
          type="email"
          placeholder="example@email.com"
          size="lg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          كلمة المرور
        </label>
        <UInput
          v-model="credentials.password"
          type="password"
          placeholder="••••••••"
          size="lg"
        />
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        :loading="loading"
        :disabled="!credentials.email || !credentials.password"
      >
        تسجيل الدخول
      </UButton>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        ليس لديك حساب؟
        <NuxtLink
          to="/register"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          إنشاء حساب جديد
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthService } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth";
import { useRedirect } from "@/composables/useRedirect";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

useSeoMeta({
  title: "تسجيل الدخول",
  description: "سجل دخولك إلى حسابك",
});

const { login, loading } = useAuthService();
const authStore = useAuthStore();
const { redirectByRole } = useRedirect();

const credentials = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const { data } = await login(credentials.value);
    await authStore.storeUser(data);
    redirectByRole(data.user);
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>
