<template>
  <div dir="rtl">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-secondary-50 to-[#F5F7FA] py-16 sm:py-24">
      <div class="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-secondary-200/40 blur-3xl" />
      <div class="relative mx-auto max-w-3xl px-6 text-center">
        <span class="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-secondary-700 shadow-sm ring-1 ring-secondary-100">
          <UIcon name="i-heroicons-trophy" class="h-4 w-4" />
          المنافسة والمتصدّرون
        </span>
        <h1 class="mb-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
          تعلَّم.. نافِس.. وتصدّر القائمة
        </h1>
        <p class="mb-8 text-lg leading-relaxed text-gray-600">
          اكسب النقاط مع كل إجابة صحيحة، اصعد في الدوريات، وتحدَّ أصدقاءك في اختبارات
          مباشرة لتعرف من الأفضل.
        </p>
        <UButton to="/auth/register" size="xl" class="px-8 font-bold" trailing-icon="i-heroicons-arrow-left">
          انضم للمنافسة مجاناً
        </UButton>
      </div>
    </section>

    <!-- Leaderboard mock + features -->
    <section class="bg-white py-20">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <!-- mock leaderboard -->
        <div class="order-2 rounded-3xl bg-[#F9FAFB] p-6 shadow-xl ring-1 ring-gray-100 lg:order-1">
          <div class="mb-4 flex items-center justify-between">
            <span class="font-bold text-gray-900">المتصدّرون هذا الأسبوع</span>
            <UIcon name="i-heroicons-fire" class="h-5 w-5 text-secondary-500" />
          </div>
          <div class="space-y-2">
            <div
              v-for="row in leaders"
              :key="row.rank"
              class="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-gray-100"
              :class="row.rank <= 3 ? 'ring-secondary-200' : ''"
            >
              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg font-bold"
                :class="rankClass(row.rank)"
              >
                {{ row.rank }}
              </div>
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
                <UIcon name="i-heroicons-user" class="h-5 w-5 text-primary-600" />
              </div>
              <span class="flex-1 text-sm font-bold text-gray-800">{{ row.name }}</span>
              <span class="text-sm font-extrabold text-primary-600">{{ row.points }}</span>
            </div>
          </div>
        </div>

        <!-- features -->
        <div class="order-1 lg:order-2">
          <h2 class="mb-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ما الذي يجعل التعلّم ممتعاً؟
          </h2>
          <div class="space-y-5">
            <div v-for="f in features" :key="f.title" class="flex gap-4">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
                <UIcon :name="f.icon" class="h-6 w-6" />
              </div>
              <div>
                <h3 class="mb-1 font-bold text-gray-900">
                  {{ f.title }}
                </h3>
                <p class="text-sm leading-relaxed text-gray-600">
                  {{ f.body }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <HomeCta />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'website' })
useSeoMeta({
  title: 'المتصدّرون والمنافسة | A+',
  description: 'اكسب النقاط، اصعد في الدوريات، وتحدَّ أصدقاءك في اختبارات مباشرة على منصة A+.'
})

function rankClass(rank: number) {
  if (rank === 1) return 'bg-secondary-500 text-white'
  if (rank === 2) return 'bg-secondary-300 text-white'
  if (rank === 3) return 'bg-secondary-200 text-secondary-800'
  return 'bg-gray-100 text-gray-500'
}

const leaders = [
  { rank: 1, name: 'سارة الأحمدي', points: '٤٬٨٢٠' },
  { rank: 2, name: 'خالد العتيبي', points: '٤٬٥١٠' },
  { rank: 3, name: 'ليان الزهراني', points: '٤٬٢٠٠' },
  { rank: 4, name: 'فيصل القحطاني', points: '٣٬٩٧٥' },
  { rank: 5, name: 'جنى المالكي', points: '٣٬٨٤٠' }
]

const features = [
  { icon: 'i-heroicons-sparkles', title: 'نقاط مع كل إنجاز', body: 'اكسب النقاط عن كل إجابة صحيحة ودرس تكمله، وافتح بها محتوى إضافياً.' },
  { icon: 'i-heroicons-chart-bar-square', title: 'دوريات وترتيب', body: 'اصعد بين الدوريات كلما زاد نشاطك وتنافس مع طلاب على مستواك.' },
  { icon: 'i-heroicons-users', title: 'تحدَّ أصدقاءك', body: 'أرسل تحدياً بنفس الأسئلة لصديقك وشاهدوا من يحصل على النتيجة الأعلى.' }
]
</script>
