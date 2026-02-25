<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      الأجهزة المرتبطة
    </h1>

    <div v-if="loading" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary-500 animate-spin" />
    </div>

    <div v-else class="space-y-4 max-w-2xl">
      <div
        v-for="device in devices"
        :key="device.id"
        class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <UIcon
              :name="device.platform?.toLowerCase()?.includes('mobile') ? 'i-heroicons-device-phone-mobile' : 'i-heroicons-computer-desktop'"
              class="w-5 h-5 text-gray-600"
            />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ device.device_name || device.name || 'جهاز غير معروف' }}
            </p>
            <p class="text-xs text-gray-500">
              {{ device.platform }} · {{ device.browser }}
            </p>
            <p class="text-xs text-gray-400">
              آخر نشاط: {{ device.last_active_at || device.updated_at }}
            </p>
          </div>
        </div>
        <UBadge v-if="device.is_current" color="success" variant="soft" size="xs" class="ml-3">
          الجهاز الحالي
        </UBadge>
        <UButton
          v-else
          size="xs"
          color="error"
          variant="soft"
          icon="i-heroicons-trash"
          :loading="revokingId === device.id"
          @click="onRevoke(device.id)"
        >
          إلغاء الربط
        </UButton>
      </div>

      <div v-if="devices.length === 0" class="text-center py-16 text-gray-400">
        <UIcon name="i-heroicons-device-phone-mobile" class="w-12 h-12 mx-auto mb-3" />
        <p>لا توجد أجهزة مسجلة</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from '@/services/api/auth.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useSeoMeta({ title: 'الأجهزة | A Plus' })

const loading = ref(true)
const revokingId = ref<number | null>(null)
const devices = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await authService.devices()
    devices.value = res.data?.data?.devices || []
  } catch {
    //
  } finally {
    loading.value = false
  }
})

async function onRevoke(id: number) {
  revokingId.value = id
  try {
    await authService.revokeDevice(id)
    devices.value = devices.value.filter(d => d.id !== id)
    showToast('نجح', 'تم إلغاء ربط الجهاز', 'success')
  } catch {
    //
  } finally {
    revokingId.value = null
  }
}
</script>
