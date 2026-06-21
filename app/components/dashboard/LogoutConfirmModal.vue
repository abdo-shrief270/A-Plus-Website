<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-md' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <div class="px-6 pt-6 pb-2 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-error-50 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-arrow-right-on-rectangle"
              class="w-6 h-6 text-error-600"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-gray-900">
              تسجيل الخروج
            </h3>
            <p class="text-sm text-gray-600 mt-1 leading-relaxed">
              هل تريد فعلاً تسجيل الخروج من حسابك؟ ستحتاج إلى إدخال بياناتك مجدداً للدخول.
            </p>
          </div>
        </div>

        <div class="px-6 pt-5 pb-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="loading"
            @click="onOpenChange(false)"
          >
            إلغاء
          </UButton>
          <UButton
            color="error"
            icon="i-heroicons-arrow-right-on-rectangle"
            :loading="loading"
            @click="confirm"
          >
            تأكيد الخروج
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const authStore = useAuthStore()
const loading = ref(false)

const onOpenChange = (val: boolean) => {
  if (loading.value) return
  emit('update:open', val)
}

async function confirm() {
  loading.value = true
  try {
    await authStore.logoutUser()
  } finally {
    loading.value = false
  }
}
</script>
