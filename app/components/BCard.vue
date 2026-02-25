<template>
  <UCard
    v-bind="$attrs"
    :class="[
      'b-card transition-all duration-300',
      hover ? 'hover:shadow-xl hover:-translate-y-1' : '',
    ]"
    :ui="{
      root: 'bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm',
      body: 'p-6',
      header: 'px-6 py-4',
      footer: 'px-6 py-4',
    }"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  hover?: boolean;
}>();
</script>

<style scoped>
.b-card {
  border-radius: 1rem;
}
</style>
