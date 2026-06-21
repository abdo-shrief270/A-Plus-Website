<template>
  <section dir="rtl" class="bg-[#F5F7FA] py-20">
    <div class="mx-auto max-w-3xl px-6">
      <div class="mb-12 text-center">
        <h2 class="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          أسئلة شائعة
        </h2>
        <p class="text-lg text-gray-600">
          كل ما تريد معرفته قبل أن تبدأ
        </p>
      </div>

      <div class="space-y-3">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 p-5 text-right"
            @click="open = open === i ? -1 : i"
          >
            <span class="font-bold text-gray-900">{{ item.q }}</span>
            <UIcon
              name="i-heroicons-chevron-down"
              class="h-5 w-5 shrink-0 text-primary-600 transition-transform"
              :class="open === i ? 'rotate-180' : ''"
            />
          </button>
          <div v-show="open === i" class="px-5 pb-5 leading-relaxed text-gray-600">
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const open = ref<number>(0)

const faqs = [
  { q: 'هل التجربة المجانية تتطلب بطاقة بنكية؟', a: 'لا. تحصل على ٣ أيام وصول كامل بمجرد إنشاء حسابك، دون أي بيانات دفع.' },
  { q: 'ماذا يحدث بعد انتهاء التجربة؟', a: 'يمكنك الاستمرار باختيار إحدى الباقات المناسبة لك، أو الاكتفاء بالمحتوى المتاح مجاناً.' },
  { q: 'هل يمكن لولي الأمر متابعة أكثر من ابن؟', a: 'نعم، يمكن لولي الأمر إضافة عدّة أبناء ومتابعة تقدّم كل منهم من حساب واحد.' },
  { q: 'هل المنصة مناسبة للمدارس؟', a: 'بالتأكيد. توفّر المنصة أدوات لإدارة الطلاب، تسجيلهم في الدورات، والاشتراكات الجماعية.' },
  { q: 'على أي اختبارات تركّز المنصة؟', a: 'تركّز المنصة على اختبارات القدرات والتحصيلي مع بنك أسئلة ضخم واختبارات محاكية.' }
]
</script>
