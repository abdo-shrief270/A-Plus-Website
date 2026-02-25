<template>
  <UFormField
    :label="label ? $t(label) : undefined"
    :description="description ? $t(description) : undefined"
    :help="help ? $t(help) : undefined"
    :error="error ? $t(error) : undefined"
    :required="required"
    class="b-form-field"
  >
    <USelectMenu
      v-bind="$attrs"
      class="b-select w-full"
      size="md"
      :search-input="{
        placeholder: searchPlaceholder ? $t(searchPlaceholder) : undefined
      }"
    >
      <template
        v-if="$slots.item"
        #item="{ item }"
      >
        <slot
          name="item"
          :item="item"
        />
      </template>
    </USelectMenu>
  </UFormField>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  description?: string
  help?: string
  error?: any
  required?: boolean
  searchPlaceholder?: string
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

.b-select :deep(button) {
  height: 44px;
  border-radius: 0.5rem;
}
</style>
