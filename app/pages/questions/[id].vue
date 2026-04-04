<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20">
    <header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
      <div class="container mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BButton
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-xl"
            @click="router.back()"
          >
            <template #leading>
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-5 h-5"
              />
            </template>
          </BButton>
          <div class="flex flex-col">
            <h1 class="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
              حل السؤال
            </h1>
            <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              رمز السؤال: #{{ $route.params.id }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-share"
            size="sm"
            class="rounded-xl"
          />
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div
          v-if="questionsStore.isLoading && !questionsStore.currentQuestion"
          class="flex flex-col items-center justify-center py-32"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-12 h-12 text-primary-500 animate-spin mb-4"
          />
          <span class="text-gray-500 font-bold">
            جاري تحميل السؤال...
          </span>
        </div>

        <div
          v-else-if="questionsStore.currentQuestion"
          class="space-y-8"
        >
          <!-- Question Item -->
          <QuestionItem
            ref="questionItemRef"
            :question="questionsStore.currentQuestion"
            @answered="onAnswered"
          />

          <!-- Action Buttons / Navigation -->
          <div class="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-4">
              <BButton
                v-if="showRetryButton"
                color="warning"
                variant="soft"
                size="lg"
                class="rounded-2xl px-8 font-black"
                @click="retry"
              >
                <template #leading>
                  <UIcon
                    name="i-heroicons-arrow-path"
                    class="w-5 h-5"
                  />
                </template>
                إعادة المحاولة
              </BButton>
            </div>

            <div class="flex items-center gap-4">
              <BButton
                variant="outline"
                color="neutral"
                size="lg"
                class="rounded-2xl px-6"
                @click="router.back()"
              >
                العودة للقائمة
              </BButton>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-32"
        >
          <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-10 h-10 text-red-500"
            />
          </div>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
            عذراً، لم يتم العثور على السؤال
          </h2>
          <p class="text-gray-400 mb-8 font-medium">
            قد يكون الرابط غير صحيح أو تم نقل السؤال.
          </p>
          <BButton
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-2xl px-10"
            @click="router.push('/exams')"
          >
            تصفح الاختبارات
          </BButton>
        </div>
      </div>
    </div>

    <!-- Confetti for success -->
    <ConfettiOverlay
      ref="confettiRef"
      type="burst"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuestionsStore } from '@/stores/useQuestionsStore'
import QuestionItem from '@/components/question/QuestionItem.vue'
import ConfettiOverlay from '@/components/common/ConfettiOverlay.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const questionsStore = useQuestionsStore()
const questionId = computed(() => route.params.id as string)

const questionItemRef = ref<{ reset: () => void } | null>(null)
const confettiRef = ref<{ fire: () => void } | null>(null)
const showRetryButton = ref(false)

const onAnswered = (result: { is_correct: boolean, score_earned: number }) => {
  if (result.is_correct) {
    showRetryButton.value = false
    if (result.score_earned > 0) {
      confettiRef.value?.fire()
    }
  } else {
    showRetryButton.value = true
  }
}

const retry = () => {
  questionItemRef.value?.reset()
  showRetryButton.value = false
}

onMounted(async () => {
  await questionsStore.fetchQuestionById(questionId.value)
})

onUnmounted(() => {
  questionsStore.currentQuestion = null
})

useSeoMeta({
  title: computed(() => `سؤال #${questionId.value} | A Plus`),
  description: 'قم بحل التمارين والأسئلة لتعزيز مستواك التعليمي في منصة A Plus.'
})
</script>
