<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      إنشاء حساب جديد
    </h2>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          الاسم
        </label>
        <UInput v-model="formData.name" placeholder="الاسم الكامل" size="lg" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <UInput
          v-model="formData.email"
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
          v-model="formData.password"
          type="password"
          placeholder="••••••••"
          size="lg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          نوع الحساب
        </label>
        <USelect v-model="formData.role" :options="roleOptions" size="lg" />
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        :loading="loading"
        :disabled="
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.role
        "
      >
        إنشاء حساب
      </UButton>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        لديك حساب بالفعل؟
        <NuxtLink
          to="/login"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          تسجيل الدخول
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
  title: "إنشاء حساب",
  description: "أنشئ حسابك الجديد",
});

const { register, loading } = useAuthService();
const authStore = useAuthStore();
const { redirectByRole } = useRedirect();

const formData = ref({
  name: "",
  email: "",
  password: "",
  role: "student",
});

const roleOptions = [
  { value: "student", label: "طالب" },
  { value: "teacher", label: "معلم" },
  { value: "parent", label: "ولي أمر" },
];

const handleRegister = async () => {
  try {
    const { data } = await register(formData.value);
    await authStore.storeUser(data);
    redirectByRole(data.user);
  } catch (error) {
    console.error("Register error:", error);
  }
};
</script>
