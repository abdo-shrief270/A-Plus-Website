<template>
  <UFormField
    :label="label ? $t(label) : undefined"
    :description="description ? $t(description) : undefined"
    :help="help ? $t(help) : undefined"
    :error="error ? $t(error) : undefined"
    :required="required"
    class="b-form-field"
  >
    <UInput
      v-bind="$attrs"
      :placeholder="placeholder ? $t(placeholder) : undefined"
      class="b-input w-full"
      size="md"
    >
      <template
        v-if="$slots.leading"
        #leading
      >
        <slot name="leading" />
      </template>
      <template
        v-if="$slots.trailing"
        #trailing
      >
        <slot name="trailing" />
      </template>
    </UInput>
  </UFormField>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  description?: string
  help?: string
  error?: any
  required?: boolean
  placeholder?: string
}>()
</script>

<style scoped>
.b-form-field :deep(label) {
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: rgb(var(--color-gray-900));
}

.dark .b-form-field :deep(label) {
  color: white;
}

.b-input :deep(input) {
  height: 44px;
  border-radius: 0.5rem;
}
</style>
