<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-3xl mx-auto">
      <!-- Back / Header -->
      <div class="mb-10 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 mb-6"
        >
          <UIcon name="i-heroicons-envelope-open" class="w-8 h-8" />
        </div>
        <h1
          class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
        >
          تواصل معنا
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          نحن هنا للإجابة على جميع استفساراتك ومساعدتك في رحلتك التعليمية. في
          حالة وجود مشكلة أو اقتراح، لا تتردد في مراسلتنا.
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div class="p-8 sm:p-12">
          <div
            v-if="successFlash"
            class="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl mb-8 text-center animate-fade-in border border-emerald-100 dark:border-emerald-800"
          >
            <UIcon
              name="i-heroicons-check-badge"
              class="w-16 h-16 text-emerald-500 mx-auto mb-4"
            />
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              تم الإرسال بنجاح!
            </h3>
            <p class="text-emerald-700 dark:text-emerald-400">
              شكراً لتواصلك معنا. استلمنا رسالتك وسيقوم فريق الدعم بالرد عليك في
              أقرب وقت ممكن.
            </p>
            <UButton
              class="mt-6"
              color="neutral"
              variant="soft"
              @click="resetForm"
              >إرسال رسالة أخرى</UButton
            >
          </div>

          <UForm
            v-else
            :state="state"
            :schema="schema"
            @submit="onSubmit"
            class="space-y-6"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormField label="الاسم الكامل" name="name" required>
                <UInput
                  v-model="state.name"
                  icon="i-heroicons-user"
                  placeholder="مثال: أحمد محمد"
                />
              </UFormField>

              <UFormField label="رقم الجوال" name="phone" required>
                <UInput
                  v-model="state.phone"
                  type="tel"
                  icon="i-heroicons-phone"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                />
              </UFormField>
            </div>

            <UFormField label="البريد الإلكتروني" name="email">
              <UInput
                v-model="state.email"
                type="email"
                icon="i-heroicons-envelope"
                placeholder="example@domain.com"
              />
            </UFormField>

            <UFormField label="موضوع الرسالة" name="subject" required>
              <USelectMenu
                v-model="state.subject"
                :options="[
                  'استفسار عام',
                  'مشكلة تقنية',
                  'اقتراح',
                  'شكوى',
                  'أخرى',
                ]"
                placeholder="اختر نوع الاستفسار..."
                icon="i-heroicons-tag"
              />
            </UFormField>

            <UFormField label="نص الرسالة" name="message" required>
              <UTextarea
                v-model="state.message"
                :rows="5"
                placeholder="اكتب رسالتك أو استفسارك هنا بكل وضوح وتفصيل..."
              />
            </UFormField>

            <div class="pt-4">
              <UButton
                type="submit"
                color="primary"
                size="xl"
                block
                icon="i-heroicons-paper-airplane"
                :loading="loading"
                class="justify-center"
              >
                إرسال الرسالة
              </UButton>
            </div>

            <p class="text-center text-xs text-gray-500 mt-4">
              بالنقر على إرسال، أنت توافق على معالجة بياناتك ตาม
              <NuxtLink to="/terms" class="text-primary-600 hover:underline"
                >سياسة الخصوصية</NuxtLink
              >
              الخاصة بنا.
            </p>
          </UForm>
        </div>

        <div
          class="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 border-t border-gray-100 dark:border-gray-700"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-start"
          >
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">
                الدعم الفني
              </h4>
              <p
                class="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                support@aplus.com
              </p>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">
                أوقات العمل
              </h4>
              <p
                class="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2"
              >
                <UIcon name="i-heroicons-clock" class="w-4 h-4" /> الأحد -
                الخميس | 9 ص - 5 م
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { contactService } from "@/services/api/contact.service";
import type { FormSubmitEvent } from "@nuxt/ui";

useSeoMeta({ title: "تواصل معنا | A Plus" });

const loading = ref(false);
const successFlash = ref(false);

const schema = z.object({
  name: z.string().min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(8, "رقم الجوال مطلوب").max(20, "رقم الهاتف طويل جداً"),
  subject: z.string().min(2, "يرجى تحديد الموضوع"),
  message: z
    .string()
    .min(10, "النص قصير جداً. يرجى كتابة 10 أحرف على الأقل بوضوح"),
});
type Schema = z.output<typeof schema>;

const state = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

function resetForm() {
  state.name = "";
  state.email = "";
  state.phone = "";
  state.subject = "";
  state.message = "";
  successFlash.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const payload = { ...event.data };
    if (!payload.email) delete payload.email; // Don't send empty optional fields

    await contactService.submitContactForm(payload);
    successFlash.value = true;
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      "حدث خطأ أثناء الإرسال، نرجو المحاولة لاحقاً";
    alert(msg); // Optional: Use a toast system instance if available outside the dashboard layout
  } finally {
    loading.value = false;
  }
}
</script>
