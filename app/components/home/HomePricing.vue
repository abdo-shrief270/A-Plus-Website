<template>
  <section dir="rtl" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto mb-14 max-w-2xl text-center">
        <h2 class="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          ابدأ مجاناً.. ثم اختر ما يناسبك
        </h2>
        <p class="text-lg text-gray-600">
          جرّب المنصة كاملة ٣ أيام مجاناً، وعند انتهائها اختر الباقة الأنسب لك
        </p>
      </div>

      <div class="grid items-stretch gap-6 lg:grid-cols-4 md:grid-cols-2">
        <!-- Free trial card (always first, highlighted) -->
        <div class="relative flex flex-col rounded-3xl bg-primary-600 p-8 text-white shadow-xl">
          <span class="absolute left-6 top-6 rounded-full bg-secondary-500 px-3 py-1 text-xs font-bold text-white">
            الأكثر بدايةً
          </span>
          <h3 class="mb-1 text-xl font-bold">
            التجربة المجانية
          </h3>
          <p class="mb-5 text-sm text-primary-100">
            وصول كامل لكل المحتوى
          </p>
          <p class="mb-6">
            <span class="text-4xl font-extrabold">مجاناً</span>
            <span class="text-primary-100"> / ٣ أيام</span>
          </p>
          <ul class="mb-8 space-y-3 text-sm">
            <li v-for="f in trialFeatures" :key="f" class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="h-5 w-5 shrink-0 text-secondary-300" />
              {{ f }}
            </li>
          </ul>
          <UButton
            to="/auth/register"
            size="lg"
            color="neutral"
            class="mt-auto justify-center bg-white font-bold text-primary-700 hover:bg-primary-50"
            block
          >
            ابدأ الآن مجاناً
          </UButton>
        </div>

        <!-- Real plans -->
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="flex flex-col rounded-3xl border border-gray-200 bg-[#F9FAFB] p-8 transition-all hover:border-primary-300 hover:shadow-md"
        >
          <h3 class="mb-1 text-xl font-bold text-gray-900">
            {{ plan.name }}
          </h3>
          <p class="mb-5 text-sm text-gray-500">
            {{ planSubtitle(plan) }}
          </p>
          <p class="mb-6">
            <span class="text-4xl font-extrabold text-gray-900">{{ plan.price }}</span>
            <span class="text-gray-500"> ر.س</span>
          </p>
          <ul class="mb-8 space-y-3 text-sm text-gray-600">
            <li v-if="plan.duration_days" class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="h-5 w-5 shrink-0 text-success-500" />
              {{ plan.duration_days }} يوماً وصول كامل
            </li>
            <li v-if="plan.points" class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="h-5 w-5 shrink-0 text-success-500" />
              {{ plan.points }} نقطة هدية
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle" class="h-5 w-5 shrink-0 text-success-500" />
              كل أدوات الطالب بلا حدود
            </li>
          </ul>
          <UButton
            to="/auth/register"
            size="lg"
            variant="outline"
            class="mt-auto justify-center font-bold"
            block
          >
            اشترك الآن
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { plansService } from '@/services/api/plans.service'

interface Plan {
  id: number
  name: string
  type: string
  price: number | string
  points?: number
  duration_days?: number | null
}

const trialFeatures = [
  'بنك الأسئلة كاملاً',
  'الاختبارات المحاكية والذاتية',
  'الخطة الدراسية وتحليل الأداء'
]

const { data } = await useAsyncData(
  'home-plans',
  () => plansService.list().then(r => r.data?.data ?? r.data).catch(() => []),
  { lazy: true, server: false, default: () => [] }
)

const plans = computed<Plan[]>(() => {
  const payload = data.value as unknown
  const list = Array.isArray(payload) ? payload : ((payload as { data?: unknown })?.data ?? [])
  // Subscription plans only — trial is shown as its own card, packs are top-ups.
  return (list as Plan[]).filter(p => p.type === 'subscription').slice(0, 3)
})

function planSubtitle(plan: Plan) {
  if (plan.duration_days && plan.duration_days >= 365) return 'اشتراك سنوي'
  if (plan.duration_days && plan.duration_days >= 90) return 'اشتراك فصلي'
  return 'اشتراك شهري'
}
</script>
