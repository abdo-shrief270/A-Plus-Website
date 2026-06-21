<template>
  <div dir="rtl">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary-50 to-[#F5F7FA] py-16 sm:py-24">
      <div class="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div class="relative mx-auto max-w-3xl px-6 text-center">
        <span class="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm ring-1 ring-primary-100">
          <UIcon name="i-heroicons-calendar-days" class="h-4 w-4" />
          الخطة الدراسية الذكية
        </span>
        <h1 class="mb-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
          خطّتك للتفوق.. مرتّبة يوماً بيوم
        </h1>
        <p class="mb-8 text-lg leading-relaxed text-gray-600">
          حدّد اختبارك وتاريخه، ودَع المنصة تبني لك خطة دراسية مقسّمة إلى أسابيع ودروس يومية،
          تتابع تقدّمك وتذكّرك بما تبقّى حتى يوم اختبارك.
        </p>
        <UButton to="/auth/register" size="xl" class="px-8 font-bold" trailing-icon="i-heroicons-arrow-left">
          ابدأ خطتك مجاناً
        </UButton>
      </div>
    </section>

    <!-- How it builds -->
    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mx-auto mb-14 max-w-2xl text-center">
          <h2 class="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            كيف تُبنى خطّتك؟
          </h2>
          <p class="text-lg text-gray-600">
            من هدفك الكبير إلى مهمة يومية بسيطة
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="relative rounded-2xl border border-gray-100 bg-[#F9FAFB] p-8"
          >
            <span class="absolute left-6 top-6 text-5xl font-extrabold text-primary-50">{{ i + 1 }}</span>
            <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
              <UIcon :name="step.icon" class="h-7 w-7" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900">
              {{ step.title }}
            </h3>
            <p class="leading-relaxed text-gray-600">
              {{ step.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Visual mock + benefits -->
    <section class="bg-[#F5F7FA] py-20">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <h2 class="mb-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            كل يوم تعرف بالضبط ماذا تذاكر
          </h2>
          <ul class="space-y-4">
            <li v-for="b in benefits" :key="b" class="flex items-start gap-3">
              <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-6 w-6 shrink-0 text-success-500" />
              <span class="text-gray-700">{{ b }}</span>
            </li>
          </ul>
          <UButton to="/auth/register" size="lg" class="mt-8 font-bold">
            جرّب الخطة الآن
          </UButton>
        </div>

        <!-- weekly plan mock -->
        <div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
          <div class="mb-4 flex items-center justify-between">
            <span class="font-bold text-gray-900">الأسبوع الأول</span>
            <span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">٤ / ٧ أيام</span>
          </div>
          <div class="space-y-3">
            <div
              v-for="day in mockDays"
              :key="day.label"
              class="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
              :class="day.done ? 'bg-success-50/50' : 'bg-white'"
            >
              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg"
                :class="day.done ? 'bg-success-500 text-white' : 'bg-gray-100 text-gray-400'"
              >
                <UIcon :name="day.done ? 'i-heroicons-check' : 'i-heroicons-lock-closed'" class="h-5 w-5" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-gray-800">
                  {{ day.label }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ day.task }}
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
  title: 'الخطة الدراسية الذكية | A+',
  description: 'خطة دراسية مقسّمة إلى أسابيع ودروس يومية حتى موعد اختبارك، مع متابعة تقدّمك وتذكيرك بما تبقّى.'
})

const steps = [
  { icon: 'i-heroicons-flag', title: 'حدّد هدفك', body: 'اختر اختبارك وتاريخه لتعرف المنصة المدى الزمني المتاح أمامك.' },
  { icon: 'i-heroicons-squares-2x2', title: 'تقسيم ذكي', body: 'تُقسّم المنصة المنهج إلى أسابيع ودروس يومية متوازنة.' },
  { icon: 'i-heroicons-check-badge', title: 'تابع وأنجز', body: 'أكمل دروس اليوم وتابع تقدّمك مع تذكيرٍ بالدروس المتأخرة.' }
]

const benefits = [
  'دروس يومية واضحة لا تشعرك بالضغط',
  'تُفتح دروس كل يوم في موعدها لتلتزم بالخطة',
  'تذكيرات تلقائية بالدروس الجديدة والمتأخرة',
  'صفحات أسئلة داخل الدروس لتطبيق ما تعلّمته فوراً'
]

const mockDays = [
  { label: 'اليوم الأول', task: 'المتجهات — ٣ دروس', done: true },
  { label: 'اليوم الثاني', task: 'التناظر اللفظي — درسان', done: true },
  { label: 'اليوم الثالث', task: 'النسبة والتناسب', done: true },
  { label: 'اليوم الرابع', task: 'استيعاب المقروء', done: false }
]
</script>
