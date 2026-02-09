<template>
  <div
    class="relative bg-gradient-to-br from-gray-50 to-primary-50 py-16 lg:py-24 overflow-hidden"
  >
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 w-20 h-20 opacity-30">
        <svg viewBox="0 0 100 100" class="w-full h-full text-primary-300">
          <defs>
            <pattern
              id="dots1"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dots1)" />
        </svg>
      </div>

      <div class="absolute bottom-20 right-10 w-16 h-16 opacity-20">
        <svg viewBox="0 0 100 100" class="w-full h-full text-primary-400">
          <defs>
            <pattern
              id="dots2"
              x="0"
              y="0"
              width="15"
              height="15"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dots2)" />
        </svg>
      </div>
    </div>

    <!-- Main Content Container -->
    <UContainer class="relative z-10">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16"
      >
        <!-- Text Content -->
        <div class="animate-fade-in">
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-800 mb-6 leading-tight"
          >
            انطلاقتك نحو التفوق تبدأ من هنا..
            <span
              class="block text-2xl sm:text-3xl lg:text-4xl text-green-600 mt-2"
            >
              يلا نبدأ؟
            </span>
          </h2>

          <p
            class="text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed text-gray-700"
          >
            كل حاجة محتاجها عشان تحليك واثق وتحقق أعلى نتيجة، مذاكرة أسهل، نتائج
            أفضل، وثقة أكبر في اختبار القدرات.
          </p>

          <div class="flex justify-center lg:justify-start">
            <UButton size="xl" color="primary" @click="startJourney">
              ابدأ رحلتك الآن
            </UButton>
          </div>
        </div>

        <!-- Student Image -->
        <div
          class="flex items-center justify-center lg:justify-end animate-fade-in relative"
        >
          <img
            src="/images/hero.png"
            alt="طالب متفوق"
            class="float-animation max-w-md w-full"
            @error="handleImageError"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const startJourney = () => {
  navigateTo("/register");
};

const handleImageError = (e) => {
  e.target.src = "https://fakeimg.pl/400x400/cccccc/ffffff?text=طالب&font=noto";
};
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.float-animation {
  animation: float 4s ease-in-out infinite;
}

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
