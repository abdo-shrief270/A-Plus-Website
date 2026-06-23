<template>
  <div dir="rtl">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary-50 to-[#F5F7FA]">
      <div class="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-secondary-200/30 blur-3xl" />

      <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div class="flex flex-col items-center text-center lg:items-start lg:text-right">
          <span class="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm ring-1 ring-primary-100">
            <UIcon
              name="i-heroicons-device-phone-mobile"
              class="h-4 w-4"
            />
            تطبيق أندرويد — الإصدار {{ APP_VERSION }}
          </span>

          <h1 class="mb-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            حمّل تطبيق A+
            <span class="block text-primary-600">وذاكر في أي وقت ومكان</span>
          </h1>

          <p class="mb-8 max-w-lg text-lg leading-relaxed text-gray-600">
            كل أدوات الاستعداد للقدرات والتحصيلي بين يديك: بنك الأسئلة، الاختبارات
            المحاكية، الخطة الدراسية، التحدّيات، ومتابعة تقدّمك — في تطبيق واحد.
          </p>

          <div class="flex flex-col gap-3 sm:flex-row">
            <UButton
              :to="PLAY_LIVE ? PLAY_URL : undefined"
              :target="PLAY_LIVE ? '_blank' : undefined"
              :disabled="!PLAY_LIVE"
              size="xl"
              icon="i-simple-icons-googleplay"
              class="justify-center px-8 font-bold"
            >
              {{ PLAY_LIVE ? 'تحميل من Google Play' : 'قريباً على Google Play' }}
            </UButton>
            <UButton
              :href="apks.arm64.url"
              :download="apks.arm64.file"
              size="xl"
              color="neutral"
              variant="outline"
              icon="i-heroicons-arrow-down-tray"
              class="justify-center px-8 font-bold"
            >
              تحميل مباشر (APK)
            </UButton>
          </div>

          <p class="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <UIcon
              name="i-heroicons-shield-check"
              class="h-4 w-4 text-secondary-500"
            />
            أندرويد 7.0 فأحدث · حجم {{ apks.arm64.size }} · مجاني
          </p>
        </div>

        <!-- Phone mockup -->
        <div class="relative flex items-center justify-center">
          <div class="absolute h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-primary-500 to-primary-200 opacity-30 blur-2xl sm:h-[380px] sm:w-[380px]" />
          <div class="relative flex h-[420px] w-[210px] flex-col items-center justify-center rounded-[2.5rem] border-[10px] border-gray-900 bg-white shadow-2xl">
            <img
              src="/logo.svg"
              alt="A+"
              class="h-20 w-20"
              @error="onLogoError"
            >
            <p class="mt-4 text-2xl font-extrabold text-primary-700">
              A+
            </p>
            <p class="mt-1 text-sm text-gray-500">
              منصة التفوق
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Direct download options -->
    <section class="bg-white py-16">
      <div class="mx-auto max-w-3xl px-6">
        <h2 class="mb-2 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
          التحميل المباشر
        </h2>
        <p class="mb-8 text-center text-gray-600">
          لمعظم الأجهزة، اختر النسخة الموصى بها. إن لم تعمل، جرّب نسخة أخرى.
        </p>

        <!-- recommended -->
        <a
          :href="apks.arm64.url"
          :download="apks.arm64.file"
          class="flex items-center justify-between gap-4 rounded-2xl border-2 border-primary-200 bg-primary-50 p-5 transition-all hover:border-primary-400 hover:shadow-md"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
              <UIcon
                name="i-heroicons-arrow-down-tray"
                class="h-6 w-6"
              />
            </div>
            <div>
              <p class="flex items-center gap-2 font-bold text-gray-900">
                النسخة الموصى بها
                <span class="rounded-full bg-secondary-500 px-2 py-0.5 text-xs font-bold text-white">الأكثر توافقاً</span>
              </p>
              <p class="text-sm text-gray-500">
                {{ apks.arm64.label }} · {{ apks.arm64.size }}
              </p>
            </div>
          </div>
          <UIcon
            name="i-heroicons-arrow-down-circle"
            class="h-7 w-7 shrink-0 text-primary-600"
          />
        </a>

        <button
          class="mx-auto mt-5 flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          @click="showAll = !showAll"
        >
          {{ showAll ? 'إخفاء النسخ الأخرى' : 'عرض نسخ أخرى' }}
          <UIcon
            :name="showAll ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="h-4 w-4"
          />
        </button>

        <div
          v-if="showAll"
          class="mt-4 space-y-3"
        >
          <a
            v-for="apk in otherApks"
            :key="apk.file"
            :href="apk.url"
            :download="apk.file"
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F9FAFB] p-4 transition-colors hover:border-primary-300"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ apk.label }}</p>
              <p class="text-sm text-gray-500">{{ apk.note }} · {{ apk.size }}</p>
            </div>
            <UIcon
              name="i-heroicons-arrow-down-tray"
              class="h-5 w-5 text-gray-500"
            />
          </a>
        </div>
      </div>
    </section>

    <!-- Install steps -->
    <section class="bg-[#F9FAFB] py-16">
      <div class="mx-auto max-w-5xl px-6">
        <h2 class="mb-10 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
          كيف تثبّت التطبيق؟
        </h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100"
          >
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-extrabold text-white">
              {{ i + 1 }}
            </div>
            <h3 class="mb-2 font-bold text-gray-900">
              {{ step.title }}
            </h3>
            <p class="text-sm leading-relaxed text-gray-600">
              {{ step.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-white py-16">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="mb-10 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
          ماذا يقدّم لك التطبيق؟
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="f in features"
            :key="f.title"
            class="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6 text-center"
          >
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <UIcon
                :name="f.icon"
                class="h-6 w-6"
              />
            </div>
            <h3 class="mb-1 font-bold text-gray-900">
              {{ f.title }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ f.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-white pb-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="rounded-3xl bg-gradient-to-l from-primary-700 to-primary-500 px-8 py-12 text-center shadow-xl">
          <h2 class="mb-3 text-2xl font-extrabold text-white sm:text-3xl">
            لا تملك حساباً بعد؟
          </h2>
          <p class="mb-6 text-primary-100">
            أنشئ حسابك وابدأ تجربتك المجانية ٣ أيام — ثم أكمل من التطبيق.
          </p>
          <UButton
            to="/auth/register"
            size="xl"
            color="neutral"
            class="justify-center bg-white px-8 font-bold text-primary-700 hover:bg-primary-50"
          >
            ابدأ مجاناً
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'website'
})

// ── Release config ────────────────────────────────────────────────
const APP_VERSION = '1.0.0'
// Flip to true and set PLAY_URL once the app is live on Google Play.
const PLAY_LIVE = false
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.aplus.aplus_app_final'

// APK files are served from public/downloads/ (see README there).
const apks = {
  arm64: {
    file: 'aplus-arm64-v8a.apk',
    url: '/downloads/aplus-arm64-v8a.apk',
    label: 'أندرويد (64-بت)',
    size: '34 ميجابايت'
  },
  armv7: {
    file: 'aplus-armeabi-v7a.apk',
    url: '/downloads/aplus-armeabi-v7a.apk',
    label: 'أندرويد (32-بت)',
    note: 'للأجهزة القديمة',
    size: '34 ميجابايت'
  },
  x64: {
    file: 'aplus-x86_64.apk',
    url: '/downloads/aplus-x86_64.apk',
    label: 'أندرويد (x86_64)',
    note: 'للمحاكيات وأجهزة x86',
    size: '37 ميجابايت'
  }
}
const otherApks = [apks.armv7, apks.x64]

const showAll = ref(false)

const steps = [
  { title: 'حمّل الملف', body: 'اضغط على زر التحميل المباشر لتنزيل ملف APK على جهازك.' },
  { title: 'اسمح بالتثبيت', body: 'عند فتح الملف قد يطلب الجهاز السماح بالتثبيت من «مصادر غير معروفة» — فعّل الخيار.' },
  { title: 'ثبّت وافتح', body: 'اضغط «تثبيت»، ثم افتح التطبيق وسجّل دخولك بحسابك في A+.' }
]

const features = [
  { icon: 'i-heroicons-rectangle-stack', title: 'بنك الأسئلة', body: 'آلاف الأسئلة مع الشرح والتصحيح الفوري.' },
  { icon: 'i-heroicons-clipboard-document-check', title: 'اختبارات محاكية', body: 'اختبارات مؤقتة تحاكي القدرات والتحصيلي.' },
  { icon: 'i-heroicons-calendar-days', title: 'خطة دراسية', body: 'خطة ذكية تنظّم مذاكرتك حتى يوم الاختبار.' },
  { icon: 'i-heroicons-trophy', title: 'التحدّيات والمتصدّرون', body: 'تحدّى أصدقاءك وتابع ترتيبك في الدوري.' }
]

function onLogoError(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none'
}

useSeoMeta({
  title: 'تحميل تطبيق A+ | أندرويد',
  description: 'حمّل تطبيق A+ لأجهزة أندرويد: بنك الأسئلة، الاختبارات المحاكية، الخطة الدراسية، والتحدّيات. مجاني — أندرويد 7.0 فأحدث.'
})
</script>
