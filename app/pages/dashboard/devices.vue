<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      الأجهزة المرتبطة
    </h1>

    <div v-if="loading" class="flex justify-center py-10">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <div v-else class="space-y-4 max-w-2xl">
      <template v-if="devices.length > 0">
        <div
          v-for="device in devices"
          :key="device.id"
          class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800"
            >
              <UIcon
                :name="
                  device.platform?.toLowerCase()?.includes('mobile')
                    ? 'i-heroicons-device-phone-mobile'
                    : 'i-heroicons-computer-desktop'
                "
                class="w-6 h-6 text-gray-400"
              />
            </div>
            <div>
              <p
                class="font-bold text-gray-900 dark:text-white relative flex gap-2 items-center"
              >
                {{ device.device_name || device.name || "جهاز غير معروف" }}
                <UBadge
                  v-if="device.is_current"
                  color="emerald"
                  variant="subtle"
                  size="xs"
                >
                  حالي
                </UBadge>
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ device.platform || "منصة غير معروفة" }} ·
                {{ device.browser || "متصفح غير معروف" }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                آخر نشاط:
                {{ device.last_active_at || device.updated_at || "غير محدد" }}
              </p>
            </div>
          </div>

          <UButton
            v-if="!device.is_current"
            size="sm"
            color="red"
            variant="ghost"
            icon="i-heroicons-x-mark"
            :loading="revokingId === device.id"
            @click="onRevoke(device.id)"
          >
            تسجيل الخروج
          </UButton>
        </div>
      </template>

      <div
        v-else
        class="text-center py-16 text-gray-400 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl"
      >
        <UIcon
          name="i-heroicons-device-phone-mobile"
          class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
        />
        <p>لا توجد أجهزة مسجلة بخلاف هذا الجهاز</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from "@/services/api/auth.service";
import { showToast } from "@/utils/helpers/toast.helper";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "الأجهزة | A Plus" });

const loading = ref(true);
const revokingId = ref<number | null>(null);
const devices = ref<any[]>([]);

onMounted(async () => {
  try {
    const res = await authService.devices();
    const payload = res.data?.data || res.data;
    // The API might return it wrapped in an array or under a 'devices' key
    devices.value = Array.isArray(payload) ? payload : payload?.devices || [];
  } catch (error: any) {
    console.error("Failed to load devices", error);
    showToast("خطأ", "فشل في تحميل الأجهزة المتصلة", "error");
  } finally {
    loading.value = false;
  }
});

async function onRevoke(id: number) {
  revokingId.value = id;
  try {
    await authService.revokeDevice(id);
    devices.value = devices.value.filter((d) => d.id !== id);
    showToast("نجاح", "تم تسجيل الخروج من الجهاز بنجاح", "success");
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "فشل في تسجيل الخروج من الجهاز";
    showToast("خطأ", msg, "error");
  } finally {
    revokingId.value = null;
  }
}
</script>
