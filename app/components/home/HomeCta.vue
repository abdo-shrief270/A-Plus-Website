<template>
  <section dir="rtl" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary-700 to-primary-500 px-8 py-14 text-center shadow-xl sm:py-20">
        <div class="pointer-events-none absolute -top-16 right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div class="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-secondary-400/20 blur-2xl" />

        <div class="relative mx-auto max-w-2xl">
          <h2 class="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            جاهز لتبدأ رحلتك نحو التفوق؟
          </h2>
          <p class="mb-8 text-lg text-primary-100">
            انضم لآلاف الطلاب وابدأ تجربتك المجانية اليوم — ٣ أيام وصول كامل بدون أي التزام.
          </p>
          <div class="flex flex-col justify-center gap-3 sm:flex-row">
            <UButton
              to="/auth/register"
              size="xl"
              color="neutral"
              class="justify-center bg-white px-8 font-bold text-primary-700 hover:bg-primary-50"
            >
              ابدأ تجربتك المجانية
            </UButton>
            <UButton
              to="/exams"
              size="xl"
              variant="outline"
              class="justify-center border-white px-8 font-bold text-white hover:bg-white/10"
            >
              تصفّح المنصة أولاً
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
