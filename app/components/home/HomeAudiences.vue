<template>
  <section dir="rtl" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          منصة واحدة.. لكل الأدوار
        </h2>
        <p class="text-lg text-gray-600">
          سواء كنت طالباً تستعد لاختبارك، ولي أمر يتابع أبناءه، أو مدرسة تدير طلابها
        </p>
      </div>

      <!-- audience switcher -->
      <div class="mb-12 flex flex-wrap justify-center gap-3">
        <button
          v-for="aud in audiences"
          :key="aud.key"
          type="button"
          class="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all"
          :class="active === aud.key
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-primary-50 text-primary-700 hover:bg-primary-100'"
          @click="active = aud.key"
        >
          <UIcon :name="aud.icon" class="h-5 w-5" />
          {{ aud.label }}
        </button>
      </div>

      <!-- active audience -->
      <div
        v-for="aud in audiences"
        v-show="active === aud.key"
        :key="aud.key"
        class="grid items-start gap-10 lg:grid-cols-12"
      >
        <div class="lg:col-span-4">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-1.5 text-sm font-semibold text-secondary-700">
            <UIcon :name="aud.icon" class="h-4 w-4" />
            {{ aud.label }}
          </span>
          <h3 class="mb-3 text-2xl font-extrabold text-gray-900">
            {{ aud.headline }}
          </h3>
          <p class="mb-6 leading-relaxed text-gray-600">
            {{ aud.intro }}
          </p>
          <UButton :to="aud.cta.to" size="lg" class="font-bold" trailing-icon="i-heroicons-arrow-left">
            {{ aud.cta.label }}
          </UButton>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <div
            v-for="f in aud.features"
            :key="f.title"
            class="flex gap-4 rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5 transition-all hover:border-primary-200 hover:shadow-sm"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <UIcon :name="f.icon" class="h-6 w-6" />
            </div>
            <div>
              <h4 class="mb-1 font-bold text-gray-900">
                {{ f.title }}
              </h4>
              <p class="text-sm leading-relaxed text-gray-500">
                {{ f.body }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type AudienceKey = 'student' | 'parent' | 'school'

const active = ref<AudienceKey>('student')

const audiences = [
  {
    key: 'student' as const,
    label: 'للطلاب',
    icon: 'i-heroicons-academic-cap',
    headline: 'كل أدوات التفوق بين يديك',
    intro: 'تدرّب بذكاء، نافس زملاءك، وتابع تطوّرك خطوة بخطوة حتى يوم الاختبار.',
    cta: { label: 'ابدأ تجربتك المجانية', to: '/auth/register/student' },
    features: [
      { icon: 'i-heroicons-clipboard-document-list', title: 'بنك الأسئلة', body: 'آلاف الأسئلة مصنّفة حسب القسم والمهارة مع شرح لكل إجابة.' },
      { icon: 'i-heroicons-document-text', title: 'الاختبارات المحاكية', body: 'اختبارات بنظام وتوقيت مشابه للاختبار الحقيقي.' },
      { icon: 'i-heroicons-puzzle-piece', title: 'الاختبارات الذاتية', body: 'صمّم اختبارك بنفسك: اختر الأقسام، الوقت، ووضع التوجيه.' },
      { icon: 'i-heroicons-calendar-days', title: 'الخطة الدراسية', body: 'خطة يومية ذكية مقسّمة أسابيع ودروس حتى موعد اختبارك.' },
      { icon: 'i-heroicons-arrow-path-rounded-square', title: 'مراجعة الأخطاء', body: 'مراجعة ذكية تركّز على الأسئلة التي أخطأت بها لتثبيتها.' },
      { icon: 'i-heroicons-chart-bar', title: 'تحليل الأداء', body: 'تقارير دقّة واتجاه تطوّر تكشف نقاط قوّتك وضعفك.' },
      { icon: 'i-heroicons-trophy', title: 'المتصدّرون والتحدّيات', body: 'تنافس على لوحة المتصدّرين وتحدّى أصدقاءك في اختبارات.' },
      { icon: 'i-heroicons-sparkles', title: 'النقاط والمكافآت', body: 'اكسب نقاطاً مع كل إنجاز وافتح بها محتوى إضافياً.' }
    ]
  },
  {
    key: 'parent' as const,
    label: 'لأولياء الأمور',
    icon: 'i-heroicons-users',
    headline: 'تابع أبناءك بثقة',
    intro: 'اطّلع على تقدّم أبنائك واشترك لهم في المحتوى المناسب — كل ذلك من حساب واحد.',
    cta: { label: 'أنشئ حساب ولي أمر', to: '/auth/register/parent' },
    features: [
      { icon: 'i-heroicons-user-group', title: 'متابعة الأبناء', body: 'أضف أبناءك وتابع نشاطهم وأداءهم في مكان واحد.' },
      { icon: 'i-heroicons-envelope', title: 'التقرير الأسبوعي', body: 'ملخّص أسبوعي عن نشاط كل ابن: أسئلة، دروس، ونقاط.' },
      { icon: 'i-heroicons-credit-card', title: 'إدارة الاشتراكات', body: 'اشترك لأبنائك في الباقات المناسبة وفعّلها بسهولة.' },
      { icon: 'i-heroicons-receipt-percent', title: 'سجل المدفوعات', body: 'سجل واضح بكل عمليات الدفع والاشتراكات.' }
    ]
  },
  {
    key: 'school' as const,
    label: 'للمدارس',
    icon: 'i-heroicons-building-library',
    headline: 'أدِر طلابك على نطاق واسع',
    intro: 'منصّة متكاملة لإدارة طلاب مدرستك، تسجيلهم في الدورات، ومتابعة أدائهم.',
    cta: { label: 'سجّل مدرستك', to: '/auth/register' },
    features: [
      { icon: 'i-heroicons-users', title: 'إدارة الطلاب', body: 'أضف الطلاب فردياً أو استوردهم دفعة واحدة بسهولة.' },
      { icon: 'i-heroicons-clipboard-document-check', title: 'التسجيل في الدورات', body: 'سجّل مجموعات من الطلاب في الدورات بنقرات قليلة.' },
      { icon: 'i-heroicons-credit-card', title: 'الاشتراكات الجماعية', body: 'فعّل باقات لعدد من الطلاب في عملية واحدة.' },
      { icon: 'i-heroicons-chart-pie', title: 'متابعة الأداء', body: 'اطّلع على تقدّم طلابك ونتائجهم لاتخاذ قرارات أفضل.' }
    ]
  }
]
</script>
