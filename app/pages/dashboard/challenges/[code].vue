<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/quizzes"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        square
      />
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
          نتائج التحدّي
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          الرمز: <span class="font-mono font-bold">{{ code }}</span>
        </p>
      </div>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        size="sm"
        class="mr-auto"
        :loading="loading"
        @click="load"
      />
    </div>

    <div
      v-if="loading && !data"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="!data"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <p class="text-sm text-gray-500">
        لم يتم العثور على هذا التحدّي.
      </p>
    </div>

    <template v-else>
      <!-- Share -->
      <div class="bg-gradient-to-l from-secondary-50 to-white rounded-2xl border border-secondary-200 p-5 mb-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0">
          <UIcon
            name="i-heroicons-user-group"
            class="w-6 h-6 text-secondary-600"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-gray-900">
            ادعُ أصدقاءك بالرمز
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ data.question_count }} سؤال · شارك الرمز لينضمّوا للتحدّي
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono font-black text-lg text-secondary-700 tracking-widest">{{ data.invite_code }}</span>
          <UButton
            color="secondary"
            variant="soft"
            size="sm"
            :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
            @click="copyCode"
          />
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-warning-50/40 to-white flex items-center gap-2">
          <UIcon
            name="i-heroicons-trophy"
            class="w-5 h-5 text-warning-600"
          />
          <h2 class="text-base font-bold text-gray-900">
            الترتيب
          </h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div
            v-for="(p, i) in data.participants"
            :key="p.student_id"
            :class="[
              'flex items-center gap-4 px-5 py-3.5',
              p.is_me ? 'bg-primary-50/60' : ''
            ]"
          >
            <div class="w-8 shrink-0 text-center">
              <span
                v-if="p.score_percent !== null && i < 3"
                class="text-xl"
              >{{ ['🥇', '🥈', '🥉'][i] }}</span>
              <span
                v-else
                class="text-sm font-black text-gray-400"
              >{{ i + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">
                {{ p.name }}
                <span
                  v-if="p.is_creator"
                  class="text-[10px] text-secondary-600"
                >⭐ المُنشئ</span>
              </p>
            </div>
            <span
              v-if="p.score_percent !== null"
              :class="['text-lg font-black', p.score_percent >= 50 ? 'text-success-600' : 'text-error-500']"
            >{{ p.score_percent }}%</span>
            <span
              v-else
              class="text-[11px] px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 font-bold"
            >لم ينتهِ</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { challengesService } from '@/services/api/challenges.service'
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'نتائج التحدّي' })
useSeoMeta({ title: 'نتائج التحدّي | A Plus' })

const route = useRoute()
const code = route.params.code as string
const authStore = useAuthStore()
const myStudentId = computed(() => (authStore.getUser as { student?: { id?: number } })?.student?.id)

interface Participant {
  student_id: number
  name: string
  status: string
  score_percent: number | null
  correct_count: number
  is_creator: boolean
  is_me?: boolean
  completed_at: string | null
}
interface ChallengeResults {
  invite_code: string
  question_count: number
  status: string
  participants: Participant[]
}

const loading = ref(true)
const data = ref<ChallengeResults | null>(null)
const copied = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await challengesService.results(code)
    const d = res.data?.data ?? null
    if (d) {
      d.participants = d.participants.map((p: Participant) => ({ ...p, is_me: p.student_id === myStudentId.value }))
    }
    data.value = d
  } catch (err) {
    console.error('Failed to load challenge', err)
    data.value = null
  } finally {
    loading.value = false
  }
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(data.value?.invite_code ?? code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard unavailable — ignore
  }
}

onMounted(load)
</script>
