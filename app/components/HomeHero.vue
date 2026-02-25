<template>
  <div class="relative bg-[#F5F7FA] py-16 lg:py-24 overflow-hidden" dir="rtl">
    <!-- Main Content Container -->
    <UContainer class="relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
        
        <!-- Right Column: Text Content -->
        <div class="animate-fade-in order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-right">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            انطلاقتك نحو التفوق تبدأ من هنا..
            <span class="block text-[#009688] mt-2">يلا نبدأ ؟</span>
          </h1>

          <p class="text-lg sm:text-xl mb-10 max-w-lg leading-relaxed text-gray-600">
            كل حاجة مجهزة عشان تخليك واثق وتحقق أعلى نتيجة, مذاكرة أسهل, نتائج أفضل, وثقة أكبر في اختبار القدرات.
          </p>

          <UButton
            size="xl"
            class="bg-[#009688] hover:bg-[#00796B] text-white px-10 py-3 rounded-lg font-bold text-lg"
            @click="startJourney"
          >
            أبدأ رحلتك الان
          </UButton>
        </div>

        <!-- Left Column: Student Image & Decorative Circles -->
        <div class="relative flex items-center justify-center animate-fade-in order-1 lg:order-2">
          
          <!-- Outer Thin Ring -->
          <div class="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#009688] opacity-50 z-0"></div>
          
          <!-- Inner Solid Circle (Teal half/gradient) -->
          <div class="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-tr from-[#009688] to-[#E0F2F1] z-10 overflow-hidden">
             <!-- The darker section on the left side of the circle to match design -->
             <div class="absolute inset-y-0 right-1/2 left-0 bg-[#009688]"></div>
          </div>

          <!-- Student Image -->
          <img
            src="/assets/images/home/hero.png"
            alt="طالب متفوق"
            class="relative z-20 w-[250px] sm:w-[350px] object-cover drop-shadow-2xl"
          >

          <!-- Floating Icons on the Ring -->
          <div class="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] z-30 pointer-events-none">
            
            <!-- Top Icon -->
            <div class="absolute top-[5%] left-[50%] transform -translate-x-1/2 w-12 h-12 bg-[#009688] rounded-full flex items-center justify-center text-white border-4 border-[#F5F7FA] shadow-md">
              <UIcon name="i-heroicons-trophy" class="w-6 h-6" />
            </div>

            <!-- Right Top Icon -->
            <div class="absolute top-[30%] right-[0%] transform translate-x-1/2 w-12 h-12 bg-[#009688] rounded-full flex items-center justify-center text-white border-4 border-[#F5F7FA] shadow-md">
              <UIcon name="i-heroicons-briefcase" class="w-6 h-6" />
            </div>

            <!-- Right Bottom Icon -->
            <div class="absolute bottom-[30%] right-[0%] transform translate-x-1/2 w-12 h-12 bg-[#009688] rounded-full flex items-center justify-center text-white border-4 border-[#F5F7FA] shadow-md">
              <UIcon name="i-heroicons-play-circle" class="w-6 h-6" />
            </div>

            <!-- Bottom Icon -->
            <div class="absolute bottom-[5%] left-[50%] transform -translate-x-1/2 w-12 h-12 bg-[#009688] rounded-full flex items-center justify-center text-white border-4 border-[#F5F7FA] shadow-md">
              <UIcon name="i-heroicons-book-open" class="w-6 h-6" />
            </div>

          </div>

          <!-- Decorative Dots -->
          <div class="absolute -top-10 -right-10 w-24 h-24 text-[#009688] opacity-30 z-0">
             <UIcon name="i-heroicons-squares-2x2-solid" class="w-full h-full" />
          </div>
          <div class="absolute -bottom-10 -left-10 w-24 h-24 text-[#009688] opacity-30 z-0">
             <UIcon name="i-heroicons-squares-2x2-solid" class="w-full h-full" />
          </div>

        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const startJourney = () => {
  navigateTo('/auth/register')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
