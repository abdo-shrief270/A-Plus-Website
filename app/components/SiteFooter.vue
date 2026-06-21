<template>
  <footer
    dir="rtl"
    class="bg-primary-900 text-primary-100"
  >
    <div class="mx-auto max-w-7xl px-6 py-14">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <img
            src="/logo.svg"
            alt="A+"
            class="mb-4 h-12"
          >
          <p class="max-w-sm leading-relaxed text-primary-200">
            منصة تعليمية متكاملة لمساعدتك على التفوق في اختبارات القدرات والتحصيلي،
            ببنك أسئلة ضخم، اختبارات محاكية، وخطة دراسية ذكية.
          </p>
          <UButton
            to="/auth/register"
            class="mt-6 font-bold"
            color="neutral"
          >
            ابدأ تجربتك المجانية
          </UButton>
        </div>

        <!-- Nav columns -->
        <div
          v-for="col in columns"
          :key="col.title"
        >
          <h4 class="mb-4 font-bold text-white">
            {{ col.title }}
          </h4>
          <ul class="space-y-3 text-sm">
            <li
              v-for="link in col.links"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-primary-200 transition-colors hover:text-white"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-primary-800 pt-6 text-center text-sm text-primary-300">
        جميع الحقوق محفوظة © 2026 A+
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const columns = [
  {
    title: 'المنصة',
    links: [
      { label: 'الدورات', to: '/courses' },
      { label: 'الاختبارات', to: '/exams' },
      { label: 'خطتي', to: '/plan' },
      { label: 'المتصدّرون', to: '/contestants' }
    ]
  },
  {
    title: 'حسابك',
    links: [
      { label: 'تسجيل الدخول', to: '/auth/login' },
      { label: 'إنشاء حساب', to: '/auth/register' },
      { label: 'التجربة المجانية', to: '/auth/register' }
    ]
  },
  {
    title: 'روابط مهمة',
    links: [
      { label: 'من نحن', to: '/about' },
      { label: 'الشروط والأحكام', to: '/terms' },
      { label: 'سياسة الخصوصية', to: '/privacy' }
    ]
  }
]
</script>
