<template>
  <UInput
    :model-value="modelValue"
    :type="reveal ? 'text' : 'password'"
    size="lg"
    placeholder="••••••••"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #trailing>
      <div class="flex items-center gap-0.5">
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          :icon="reveal ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
          :aria-label="reveal ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
          @click="reveal = !reveal"
        />
        <UButton
          color="primary"
          variant="link"
          size="xs"
          icon="i-heroicons-sparkles"
          aria-label="توليد كلمة مرور قوية"
          title="توليد كلمة مرور قوية"
          @click="generate"
        />
      </div>
    </template>
  </UInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateStrongPassword } from '@/utils/password'

defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'generate': [value: string]
}>()

const reveal = ref(false)

function generate() {
  const pw = generateStrongPassword()
  reveal.value = true
  emit('update:modelValue', pw)
  emit('generate', pw)
}
</script>
