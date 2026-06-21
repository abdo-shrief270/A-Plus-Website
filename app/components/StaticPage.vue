<template>
  <section class="min-h-[60vh] py-10 sm:py-16">
    <UContainer>
      <header class="mb-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {{ page?.title || fallbackTitle }}
        </h1>
        <p
          v-if="subtitle"
          class="text-sm text-gray-500"
        >
          {{ subtitle }}
        </p>
      </header>

      <div
        v-if="loading"
        class="flex items-center justify-center py-16"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 text-primary-500 animate-spin"
        />
      </div>

      <div
        v-else-if="!page?.content"
        class="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm"
      >
        <UIcon
          name="i-heroicons-document-text"
          class="w-10 h-10 text-gray-300 mx-auto mb-3"
        />
        <p class="text-sm text-gray-500">
          هذه الصفحة قيد الإعداد. تواصل مع الإدارة لتحديث المحتوى.
        </p>
      </div>

      <article
        v-else
        class="prose prose-lg max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 leading-relaxed prose-headings:text-gray-900 prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-primary-700 prose-li:text-gray-700"
        dir="rtl"
        v-html="page.content"
      />
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { pagesService, type CmsPage } from '@/services/api/pages.service'

const props = defineProps<{
  slug: string
  fallbackTitle: string
  subtitle?: string
}>()

const page = ref<CmsPage | null>(null)
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    const res = await pagesService.bySlug(props.slug)
    page.value = res.data?.data ?? res.data ?? null
  } catch {
    page.value = null
  } finally {
    loading.value = false
  }
})
</script>
