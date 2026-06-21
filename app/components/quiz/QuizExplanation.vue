<template>
  <div
    class="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-right"
    dir="rtl"
  >
    <div class="flex items-center gap-2 mb-4 text-primary-600 font-black text-sm">
      <UIcon
        name="i-heroicons-light-bulb"
        class="w-5 h-5"
      />
      شرح الحل
    </div>
    <div
      v-if="explanation.text"
      class="text-sm text-gray-600 leading-relaxed font-medium mb-4 [&_img]:max-w-full [&_img]:rounded-xl [&_p]:my-1"
      v-html="renderMarkdown(explanation.text)"
    />
    <div
      v-if="explanation.video_url"
      class="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200"
    >
      <iframe
        :src="embedUrl(explanation.video_url)"
        class="absolute inset-0 w-full h-full"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { renderMarkdown } from '@/utils/markdown'

defineProps<{
  explanation: { text: string | null, video_url: string | null }
}>()

function embedUrl(url: string) {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
  return url
}
</script>
