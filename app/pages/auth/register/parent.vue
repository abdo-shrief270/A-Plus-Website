<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-x-hidden bg-gray-50 dark:bg-gray-950"
  >
    <!-- Premium Background Effects -->
    <div
      class="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none"
    />
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"
    />
    <div
      class="absolute -bottom-24 -left-24 w-96 h-96 bg-success-500/20 rounded-full blur-3xl pointer-events-none"
    />

    <div class="w-full max-w-lg relative z-10 my-8">
      <div
        class="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl"
      >
        <div
          class="px-8 py-6 sm:px-10 border-b border-gray-100 dark:border-gray-800"
        >
          <div class="flex items-center gap-3">
            <NuxtLink to="/auth/register">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-arrow-right"
                class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                padded
              />
            </NuxtLink>
            <div>
              <h1
                class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
              >
                تسجيل ولي أمر جديد
              </h1>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium"
              >
                أنشئ حسابك لمتابعة أبنائك بسهولة
              </p>
            </div>
          </div>
        </div>

        <div class="p-8 sm:p-10">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="الاسم الكامل" name="name" class="col-span-2">
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
                  @input="() => usernameCheck.checkUsername(state.user_name)"
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
                  :label="''"
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

              <UFormField label="كلمة المرور" name="password">
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

              <UFormField label="الجنس" name="gender" class="col-span-2">
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
                :ui="{ rounded: 'rounded-xl' }"
              >
                إنشاء الحساب
              </UButton>
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
import { authService } from "@/services/api/auth.service";
import { useAuthStore } from "@/stores/auth";
import { useRedirect } from "@/composables/useRedirect";
import { useUsernameCheck } from "@/composables/useUsernameCheck";

definePageMeta({ layout: "fullscreen", middleware: "guest" });
useSeoMeta({ title: "تسجيل ولي أمر | A Plus" });

const authStore = useAuthStore();
const { redirectByRole } = useRedirect();
const usernameCheck = useUsernameCheck();

const loading = ref(false);

const genderOptions = [
  { label: "ذكر", value: "male" },
  { label: "أنثى", value: "female" },
];

const schema = z
  .object({
    name: z.string().min(2, "الاسم مطلوب"),
    user_name: z.string().min(3, "اسم المستخدم مطلوب"),
    country_code: z.string().min(1, "كود الدولة مطلوب"),
    phone: z.string().min(7, "رقم الهاتف مطلوب"),
    email: z
      .string()
      .email("بريد إلكتروني غير صالح")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "كلمة المرور ٨ أحرف على الأقل"),
    password_confirmation: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
    gender: z.enum(["male", "female"], { message: "الجنس مطلوب" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  user_name: "",
  country_code: "+20",
  phone: "",
  email: "",
  password: "",
  password_confirmation: "",
  gender: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (usernameCheck.status.value !== "available") {
    return;
  }

  loading.value = true;
  try {
    const res = await authService.registerParent(event.data);
    await authStore.storeUser(res.data);
    redirectByRole(res.data.data.user);
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
}
</script>
