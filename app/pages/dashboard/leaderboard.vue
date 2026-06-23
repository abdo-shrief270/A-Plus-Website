<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          لوحة المتصدرين
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          نافس زملاءك في دوريك واصعد سلّم الدوريات
        </p>
      </div>
      <!-- Period toggle -->
      <div class="flex items-center bg-gray-100 rounded-xl p-1">
        <button
          v-for="p in periods"
          :key="p.value"
          type="button"
          :class="[
            'px-4 py-1.5 rounded-lg text-sm font-bold transition-all',
            period === p.value ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          ]"
          @click="setPeriod(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !data"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <template v-else-if="data">
      <!-- League ladder -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 overflow-x-auto">
        <div class="flex items-center justify-between gap-2 min-w-[480px]">
          <template
            v-for="(l, idx) in data.ladder"
            :key="l.id"
          >
            <div class="flex flex-col items-center gap-1.5 flex-1">
              <div
                :class="[
                  'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
                  l.is_current ? 'scale-110 shadow-lg ring-2 ring-offset-2' : 'opacity-50'
                ]"
                :style="{ 'backgroundColor': (l.color || '#9ca3af') + '22', '--tw-ring-color': l.color || '#9ca3af' }"
              >
                <UIcon
                  name="i-heroicons-trophy"
                  class="w-6 h-6"
                  :style="{ color: l.color || '#9ca3af' }"
                />
              </div>
              <span :class="['text-[11px] font-bold', l.is_current ? 'text-gray-900' : 'text-gray-400']">
                {{ l.name }}
              </span>
              <span class="text-[10px] text-gray-400">{{ formatNumber(l.min_score) }}+</span>
            </div>
            <div
              v-if="idx < data.ladder.length - 1"
              class="h-0.5 flex-1 bg-gray-100 rounded-full min-w-4"
            />
          </template>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- My standing card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div class="px-6 py-5 bg-gradient-to-l from-primary-50/40 to-white border-b border-gray-100">
            <h2 class="text-base font-bold text-gray-900">
              ترتيبي
            </h2>
          </div>
          <div class="p-6 text-center">
            <div
              class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ring-4 ring-offset-2"
              :style="{ 'backgroundColor': (data.league.color || '#9ca3af') + '22', '--tw-ring-color': (data.league.color || '#9ca3af') + '55' }"
            >
              <span
                class="text-3xl font-black"
                :style="{ color: data.league.color || '#6b7280' }"
              >
                #{{ data.me.rank ?? '—' }}
              </span>
            </div>
            <p class="text-sm font-bold text-gray-900">
              الدوري {{ data.league.name }}
            </p>
            <p class="text-[11px] text-gray-500 mt-0.5">
              من أصل {{ formatNumber(data.league.members_count) }} طالب
            </p>

            <div class="grid grid-cols-2 gap-3 mt-5">
              <div class="bg-gray-50 rounded-xl py-3">
                <p class="text-lg font-black text-primary-700">
                  {{ formatNumber(data.me.points) }}
                </p>
                <p class="text-[10px] text-gray-500">
                  {{ period === 'week' ? 'نقاط الأسبوع' : 'النقاط' }}
                </p>
              </div>
              <div class="bg-gray-50 rounded-xl py-3">
                <p class="text-lg font-black text-gray-700">
                  {{ formatNumber(data.me.total_score) }}
                </p>
                <p class="text-[10px] text-gray-500">
                  مجموع النقاط
                </p>
              </div>
            </div>

            <!-- Next league progress -->
            <div
              v-if="data.me.next_league"
              class="mt-5 text-right"
            >
              <div class="flex items-center justify-between text-[11px] mb-1.5">
                <span class="font-bold text-gray-600">الترقية إلى {{ data.me.next_league.name }}</span>
                <span class="text-gray-400">متبقي {{ formatNumber(data.me.next_league.points_needed) }} نقطة</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-l from-primary-500 to-primary-400 transition-all"
                  :style="{ width: `${nextLeagueProgress}%` }"
                />
              </div>
            </div>
            <p
              v-else
              class="mt-5 text-[11px] font-bold text-success-600 flex items-center justify-center gap-1"
            >
              <UIcon
                name="i-heroicons-star"
                class="w-4 h-4"
              />
              أنت في أعلى دوري — حافظ على مركزك!
            </p>
          </div>
        </div>

        <!-- Standings -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 bg-gradient-to-l from-warning-50/40 to-white border-b border-gray-100 flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-warning-50 border border-warning-100 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-trophy"
                class="w-5 h-5 text-warning-600"
              />
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">
                ترتيب الدوري {{ data.league.name }}
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ period === 'week' ? 'حسب نقاط هذا الأسبوع' : 'حسب مجموع النقاط' }}
              </p>
            </div>
          </div>

          <div
            v-if="!data.top.length"
            class="py-12 text-center text-sm text-gray-500"
          >
            لا يوجد طلاب في هذا الدوري بعد.
          </div>

          <div
            v-else
            class="divide-y divide-gray-50"
          >
            <div
              v-for="row in data.top"
              :key="row.student_id"
              :class="[
                'flex items-center gap-4 px-5 py-3.5 transition-colors',
                row.is_me ? 'bg-primary-50/60 border-r-4 border-primary-500' : 'hover:bg-gray-50'
              ]"
            >
              <!-- Rank -->
              <div class="w-9 shrink-0 text-center">
                <span
                  v-if="row.rank <= 3"
                  class="text-xl"
                >{{ ['🥇', '🥈', '🥉'][row.rank - 1] }}</span>
                <span
                  v-else
                  class="text-sm font-black text-gray-400"
                >{{ row.rank }}</span>
              </div>
              <!-- Avatar initial -->
              <div
                :class="[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0',
                  row.is_me ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                ]"
              >
                {{ row.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-bold truncate', row.is_me ? 'text-primary-700' : 'text-gray-900']">
                  {{ row.name }}
                  <span
                    v-if="row.is_me"
                    class="text-[10px] font-black text-primary-500 mr-1"
                  >(أنت)</span>
                </p>
              </div>
              <div class="text-left shrink-0">
                <span class="text-sm font-black text-gray-900">{{ formatNumber(row.points) }}</span>
                <span class="text-[10px] text-gray-400 mr-1">نقطة</span>
              </div>
            </div>
          </div>

          <!-- My rank if outside top list -->
          <div
            v-if="data.me.rank && data.me.rank > data.top.length"
            class="px-5 py-3.5 bg-primary-50/60 border-t-2 border-dashed border-primary-200 flex items-center gap-4"
          >
            <div class="w-9 shrink-0 text-center text-sm font-black text-primary-600">
              {{ data.me.rank }}
            </div>
            <div class="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-black shrink-0">
              {{ myInitial }}
            </div>
            <p class="flex-1 text-sm font-bold text-primary-700">
              أنت <span class="text-[10px]">({{ formatNumber(data.me.points) }} نقطة)</span>
            </p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-6 bg-gradient-to-l from-primary-50 to-white rounded-2xl border border-primary-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex-1">
          <h3 class="font-bold text-gray-900">
            اكسب نقاطاً أكثر
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            كل إجابة صحيحة في بنك الأسئلة تمنحك نقاطاً ترفع ترتيبك في الدوري.
          </p>
        </div>
        <UButton
          to="/dashboard/question-bank"
          color="primary"
          icon="i-heroicons-bolt"
        >
          ابدأ الحل الآن
        </UButton>
      </div>
    </template>

    <!-- Error -->
    <ErrorState
      v-else
      title="تعذّر تحميل لوحة المتصدرين"
      message="حدث خطأ أثناء جلب الترتيب. حاول مرة أخرى."
      :retrying="loading"
      @retry="load"
    />
  </div>
</template>

<script setup lang="ts">
import { leaderboardService } from '@/services/api/leaderboard.service'
import { formatNumber } from '@/utils/number'
import { useAuthStore } from '@/stores/auth'
import type { LeaderboardData } from '@/types/leaderboard'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'المتصدرين' })
useSeoMeta({ title: 'لوحة المتصدرين | A Plus' })

const authStore = useAuthStore()

const periods = [
  { value: 'week' as const, label: 'هذا الأسبوع' },
  { value: 'all' as const, label: 'كل الوقت' }
]

const period = ref<'week' | 'all'>('week')
const loading = ref(true)
const data = ref<LeaderboardData | null>(null)

const myInitial = computed(() =>
  authStore.getUser?.name?.charAt(0)?.toUpperCase() ?? 'أ'
)

const nextLeagueProgress = computed(() => {
  const next = data.value?.me.next_league
  if (!next || next.min_score === 0) return 0
  return Math.min(100, Math.round((data.value!.me.total_score / next.min_score) * 100))
})

async function load() {
  loading.value = true
  try {
    const res = await leaderboardService.get(period.value)
    data.value = res.data?.data ?? null
  } catch (err) {
    console.error('Failed to load leaderboard', err)
    data.value = null
  } finally {
    loading.value = false
  }
}

function setPeriod(p: 'week' | 'all') {
  if (period.value === p) return
  period.value = p
  load()
}

onMounted(load)
</script>
