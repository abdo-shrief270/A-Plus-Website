<template>
  <div>
    <!-- Top bar -->
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/plan"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        square
      />
      <div class="min-w-0">
        <p class="text-xs text-gray-500">
          <NuxtLink
            to="/dashboard/plan"
            class="hover:text-primary-600"
          >الخطة الدراسية</NuxtLink>
          <span class="mx-1">›</span>
          <span>{{ lesson?.title || 'الدرس' }}</span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 truncate">
          {{ lesson?.title || 'الدرس' }}
        </h1>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Locked (day not reached yet) -->
    <div
      v-else-if="lockedMessage"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <div class="w-14 h-14 mx-auto rounded-2xl bg-warning-50 flex items-center justify-center mb-3">
        <UIcon
          name="i-heroicons-lock-closed"
          class="w-7 h-7 text-warning-600"
        />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">
        الدرس غير متاح بعد
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ lockedMessage }}
      </p>
      <UButton
        to="/dashboard/plan"
        color="primary"
        variant="soft"
      >
        العودة للخطة
      </UButton>
    </div>

    <!-- Not found -->
    <div
      v-else-if="!lesson"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-book-open"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500 mb-4">
        لم يتم العثور على هذا الدرس.
      </p>
      <UButton
        to="/dashboard/plan"
        color="primary"
        variant="soft"
      >
        العودة للخطة
      </UButton>
    </div>

    <template v-else>
      <!-- Progress dots -->
      <div class="flex items-center gap-2 mb-4">
        <button
          v-for="(p, idx) in pages"
          :key="p.id"
          type="button"
          :class="[
            'h-2 rounded-full transition-all',
            idx === currentIndex ? 'w-8 bg-primary-500' : (idx < currentIndex ? 'w-2 bg-primary-300' : 'w-2 bg-gray-200')
          ]"
          @click="currentIndex = idx"
        />
        <span class="text-[11px] text-gray-400 mr-auto">
          {{ currentIndex + 1 }} / {{ pages.length }}
        </span>
      </div>

      <!-- Page content -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-h-[300px]">
        <h2
          v-if="currentPage?.title"
          class="text-lg font-bold text-gray-900 mb-4"
        >
          {{ currentPage.title }}
        </h2>

        <!-- text -->
        <div
          v-if="currentPage?.type === 'text'"
          class="prose prose-sm max-w-none text-right [&_img]:max-w-full [&_img]:rounded-xl"
          dir="rtl"
          v-html="renderMarkdown(currentPage.content.body)"
        />

        <!-- image -->
        <figure
          v-else-if="currentPage?.type === 'image'"
          class="text-center"
        >
          <img
            :src="currentPage.content.image_url"
            :alt="currentPage.content.caption || ''"
            class="rounded-2xl max-h-[420px] mx-auto object-contain"
          >
          <figcaption
            v-if="currentPage.content.caption"
            class="text-xs text-gray-500 mt-3"
          >
            {{ currentPage.content.caption }}
          </figcaption>
        </figure>

        <!-- question — answered interactively, same flow as the bank
             (charges balance, awards points, counts in revision) -->
        <div v-else-if="currentPage?.type === 'question'">
          <p
            v-if="currentPage.content.instructions"
            class="text-sm text-gray-500 mb-4"
          >
            {{ currentPage.content.instructions }}
          </p>
          <QuestionItem
            v-if="questionPayload"
            :key="currentPage.id"
            :question="questionPayload"
          />
          <div
            v-else
            class="py-8 text-center text-sm text-gray-400"
          >
            تعذّر تحميل السؤال.
          </div>
        </div>

        <!-- mixed -->
        <div
          v-else-if="currentPage?.type === 'mixed'"
          class="space-y-5"
        >
          <template
            v-for="(sec, i) in currentPage.content.sections || []"
            :key="i"
          >
            <div
              v-if="sec.type === 'text'"
              class="prose prose-sm max-w-none text-right"
              dir="rtl"
              v-html="renderMarkdown(sec.content)"
            />
            <img
              v-else-if="sec.type === 'image'"
              :src="sec.content"
              class="rounded-2xl max-h-[360px] mx-auto object-contain"
              alt=""
            >
          </template>
        </div>
      </div>

      <!-- Nav + complete -->
      <div class="flex items-center justify-between mt-6">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-right"
          :disabled="currentIndex === 0"
          @click="currentIndex--"
        >
          السابق
        </UButton>

        <UButton
          v-if="currentIndex < pages.length - 1"
          color="primary"
          trailing-icon="i-heroicons-arrow-left"
          @click="currentIndex++"
        >
          التالي
        </UButton>
        <UButton
          v-else-if="!isCompleted"
          color="success"
          trailing-icon="i-heroicons-check"
          :loading="completing"
          @click="complete"
        >
          إتمام الدرس
        </UButton>
        <UButton
          v-else
          to="/dashboard/plan"
          color="success"
          variant="soft"
          trailing-icon="i-heroicons-check-circle"
        >
          تم الإتمام — العودة للخطة
        </UButton>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { studyPlanService } from '@/services/api/studyPlan.service'
import { renderMarkdown } from '@/utils/markdown'
import { showToast } from '@/utils/helpers/toast.helper'
import QuestionItem from '@/components/question/QuestionItem.vue'
import type { Lesson, LessonPage } from '@/types/lesson'
import type { Question } from '@/types/question-bank'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الدرس' })
useSeoMeta({ title: 'الدرس | A Plus' })

const route = useRoute()
const lessonId = route.params.id as string

const loading = ref(true)
const completing = ref(false)
const lesson = ref<Lesson | null>(null)
const currentIndex = ref(0)
const startedAt = Date.now()

const pages = computed<LessonPage[]>(() => lesson.value?.pages ?? [])
const currentPage = computed<LessonPage | null>(() => pages.value[currentIndex.value] ?? null)
// The lesson question-page payload is the bank-answerable shape; QuestionItem
// renders + submits it through the normal answer flow.
const questionPayload = computed<Question | undefined>(
  () => currentPage.value?.content?.question as Question | undefined
)
const isCompleted = ref(false)
const lockedMessage = ref('')

async function load() {
  loading.value = true
  lockedMessage.value = ''
  try {
    const res = await studyPlanService.getLesson(lessonId)
    // Backend returns 403 (body status) when the lesson's day hasn't arrived.
    if (res.data?.status === 403) {
      lockedMessage.value = res.data?.message || 'هذا الدرس غير متاح بعد.'
      lesson.value = null
      return
    }
    lesson.value = res.data?.data?.lesson ?? null
    isCompleted.value = lesson.value?.progress?.status === 'completed'
  } catch (err) {
    const data = (err as { response?: { data?: { status?: number, message?: string } } })?.response?.data
    if (data?.status === 403) {
      lockedMessage.value = data.message || 'هذا الدرس غير متاح بعد.'
    } else {
      console.error('Failed to load lesson', err)
    }
    lesson.value = null
  } finally {
    loading.value = false
  }
}

async function complete() {
  if (!lesson.value) return
  completing.value = true
  try {
    const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000))
    await studyPlanService.completeLesson(lesson.value.id, { time_spent_minutes: minutes })
    isCompleted.value = true
    showToast('أحسنت', 'تم إتمام الدرس', 'success')
  } catch (err) {
    console.error('Failed to complete lesson', err)
  } finally {
    completing.value = false
  }
}

onMounted(load)
</script>
