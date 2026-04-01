<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
      <h1
        class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
      >
        <UIcon
          name="i-heroicons-cog-6-tooth"
          class="w-8 h-8 text-primary-500"
        />
        إعدادات المنصة العامة
      </h1>
      <p class="text-sm text-gray-500 mt-2">
        استعرض شروط الاستخدام، السياسات، روابط التواصل الاجتماعي ومعلومات النظام
        الأساسية.
      </p>
    </div>

    <!-- loading state -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div v-else class="space-y-8">
      <!-- Group 1: General Info -->
      <section
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
      >
        <h2
          class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-gray-400"
          />
          المعلومات الأساسية
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="setting in generalSettings"
            :key="setting.key"
            class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800"
          >
            <span
              class="text-xs text-primary-600 dark:text-primary-400 font-bold mb-1 block"
              >{{ setting.name_ar || setting.key }}</span
            >
            <p
              class="text-gray-900 dark:text-white line-clamp-2"
              :title="setting.value"
            >
              {{ setting.value || "غير محدد" }}
            </p>
          </div>
        </div>
      </section>

      <!-- Group 2: Social Links -->
      <section
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
      >
        <h2
          class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-gray-400" />
          أرقام وروابط التواصل
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a
            v-for="link in socialSettings"
            :key="link.key"
            :href="
              link.value?.includes('http') ? link.value : `tel:${link.value}`
            "
            target="_blank"
            class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors group"
          >
            <UIcon
              :name="getSocialIcon(link.key)"
              class="w-6 h-6 text-gray-400 group-hover:text-primary-500"
            />
            <div class="overflow-hidden">
              <p
                class="text-sm font-bold text-gray-900 dark:text-white truncate"
              >
                {{ link.name_ar || link.key }}
              </p>
              <p class="text-xs text-gray-500 truncate mt-0.5">
                {{ link.value || "غير محدد" }}
              </p>
            </div>
          </a>
        </div>
      </section>

      <!-- Group 3: Legal & Policies -->
      <section
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
      >
        <h2
          class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          <UIcon
            name="i-heroicons-document-check"
            class="w-5 h-5 text-gray-400"
          />
          السياسات والشروط
        </h2>
        <div class="space-y-4">
          <UAccordion
            :items="legalSettings"
            size="lg"
            class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
          >
            <template #item="{ item }">
              <div
                class="p-6 bg-gray-50 dark:bg-gray-900/30 prose dark:prose-invert max-w-none prose-sm leading-relaxed"
                v-html="item.value"
              ></div>
            </template>
          </UAccordion>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { settingsService } from "@/services/api/settings.service";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "إعدادات المنصة | A Plus" });

const loading = ref(true);
const settings = ref<any[]>([]);

// Group computation
const generalSettings = computed(() =>
  settings.value.filter(
    (s) =>
      s.group === "general" ||
      (!s.group && !isSocial(s.key) && !isLegal(s.key)),
  ),
);
const socialSettings = computed(() =>
  settings.value.filter((s) => s.group === "social" || isSocial(s.key)),
);

// Adapt for UAccordion
const legalSettings = computed(() => {
  const items = settings.value.filter(
    (s) => s.group === "legal" || isLegal(s.key),
  );
  return items.map((item) => ({
    label: item.name_ar || item.key,
    icon: "i-heroicons-document-text",
    value: item.value, // This is slotted inside the UAccordion body
  }));
});

onMounted(async () => {
  await fetchSettings();
});

async function fetchSettings() {
  loading.value = true;
  try {
    const res = await settingsService.getSettings();
    const data = res.data?.data || res.data;
    settings.value = Array.isArray(data) ? data : data?.settings || [];
  } catch (error) {
    console.error("Failed to load settings", error);

    // Fallback UI data if endpoint empty
    if (settings.value.length === 0) {
      settings.value = [
        {
          key: "site_name",
          name_ar: "اسم المنصة",
          value: "منصة A Plus التعليمية",
          group: "general",
        },
        {
          key: "support_email",
          name_ar: "البريد الإلكتروني للدعم",
          value: "support@aplus.com",
          group: "general",
        },
        {
          key: "whatsapp",
          name_ar: "رقم الواتساب",
          value: "966500000000",
          group: "social",
        },
        {
          key: "twitter",
          name_ar: "تويتر (X)",
          value: "https://twitter.com/aplus",
          group: "social",
        },
        {
          key: "terms",
          name_ar: "الشروط والأحكام",
          value: "نصوص تجريبية للشروط والأحكام الخاصة بالموقع...",
          group: "legal",
        },
        {
          key: "privacy",
          name_ar: "سياسة الخصوصية",
          value: "نصوص تجريبية لسياسة الخصوصية الخاصة بالموقع...",
          group: "legal",
        },
      ];
    }
  } finally {
    loading.value = false;
  }
}

function isSocial(key: string) {
  const soc = [
    "facebook",
    "twitter",
    "instagram",
    "linkedin",
    "whatsapp",
    "snapchat",
    "youtube",
    "phone",
  ];
  return soc.some((s) => key.toLowerCase().includes(s));
}

function isLegal(key: string) {
  const leg = ["terms", "privacy", "policy", "about", "refund"];
  return leg.some((l) => key.toLowerCase().includes(l));
}

function getSocialIcon(key: string) {
  const k = key.toLowerCase();
  if (k.includes("whatsapp") || k.includes("phone"))
    return "i-heroicons-device-phone-mobile";
  if (k.includes("twitter")) return "i-heroicons-link"; // Twitter X logic fallback
  if (
    k.includes("facebook") ||
    k.includes("instagram") ||
    k.includes("snapchat")
  )
    return "i-heroicons-camera";
  if (k.includes("mail") || k.includes("email")) return "i-heroicons-envelope";
  return "i-heroicons-globe-alt";
}
</script>
