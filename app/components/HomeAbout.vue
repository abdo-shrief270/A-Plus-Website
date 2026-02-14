<template>
  <div class="relative py-16 lg:py-20">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-10 left-10 w-32 h-32 bg-primary-100 rounded-full opacity-20 blur-xl"
      />
      <div
        class="absolute bottom-10 right-10 w-24 h-24 bg-green-100 rounded-full opacity-20 blur-xl"
      />
    </div>

    <!-- Main Content Container -->
    <UContainer class="relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <!-- Statistic Item 1: Questions -->
        <div class="text-center animate-fade-in">
          <!-- Icon Container -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-subtle"
              >
                <UIcon
                  name="i-heroicons-briefcase"
                  class="text-white text-2xl"
                />
              </div>
              <div
                class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full animate-bounce-subtle"
              />
            </div>
          </div>

          <!-- Number -->
          <div class="mb-4">
            <span
              class="text-4xl lg:text-5xl font-bold text-primary-800 countup"
            >
              {{ animatedNumbers.questions }}
            </span>
            <span class="text-2xl lg:text-3xl font-bold text-green-600 mr-2">+</span>
          </div>

          <!-- Description -->
          <p
            class="text-gray-700 text-sm lg:text-base leading-relaxed max-w-xs mx-auto"
          >
            بنك أسئلة ضخم فيه أكثر من
            <span class="font-semibold text-primary-700">4000</span>
            سؤال يضمنلك استعداد كامل
          </p>
        </div>

        <!-- Statistic Item 2: Videos -->
        <div
          class="text-center animate-fade-in"
          style="animation-delay: 200ms"
        >
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-subtle"
              >
                <UIcon
                  name="i-heroicons-play"
                  class="text-white text-2xl"
                />
              </div>
              <div
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce-subtle"
              />
            </div>
          </div>

          <div class="mb-4">
            <span
              class="text-4xl lg:text-5xl font-bold text-primary-800 countup"
            >
              {{ animatedNumbers.videos }}
            </span>
            <span class="text-2xl lg:text-3xl font-bold text-green-600 mr-2">+</span>
          </div>

          <p
            class="text-gray-700 text-sm lg:text-base leading-relaxed max-w-xs mx-auto"
          >
            من العلوم للمهارات العملية..
            <span class="font-semibold text-primary-700">محتوى متنوع</span>
            يغطي كل الأجزاء
          </p>
        </div>

        <!-- Statistic Item 3: Students -->
        <div
          class="text-center animate-fade-in"
          style="animation-delay: 400ms"
        >
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-subtle"
              >
                <UIcon
                  name="i-heroicons-user-group"
                  class="text-white text-2xl"
                />
              </div>
              <div
                class="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full animate-bounce-subtle"
              />
            </div>
          </div>

          <div class="mb-4">
            <span
              class="text-4xl lg:text-5xl font-bold text-primary-800 countup"
            >
              {{ animatedNumbers.students }}
            </span>
            <span class="text-2xl lg:text-3xl font-bold text-green-600 mr-2">+</span>
          </div>

          <p
            class="text-gray-700 text-sm lg:text-base leading-relaxed max-w-xs mx-auto"
          >
            انضم لأكثر من
            <span class="font-semibold text-primary-700">2000 طالب</span>
            يذاكروا ويستعدوا معنا للنجاح
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const animatedNumbers = ref({
  questions: 0,
  videos: 0,
  students: 0
})

const isVisible = ref(false)

const animateCounter = (start, end, duration, callback) => {
  const startTime = performance.now()
  const difference = end - start

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(start + difference * easeOutCubic)

    callback(current)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

const startAnimations = () => {
  if (isVisible.value) return
  isVisible.value = true

  animateCounter(0, 4000, 2000, (value) => {
    animatedNumbers.value.questions = value
  })

  setTimeout(() => {
    animateCounter(0, 300, 1500, (value) => {
      animatedNumbers.value.videos = value
    })
  }, 200)

  setTimeout(() => {
    animateCounter(0, 2000, 1800, (value) => {
      animatedNumbers.value.students = value
    })
  }, 400)
}

onMounted(() => {
  // Only run on client side
  if (typeof window === 'undefined') return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          startAnimations()
        }
      })
    },
    {
      threshold: 0.3
    }
  )

  // Use a more reliable selector
  const mainElement = document.querySelector('.relative.py-16')
  if (mainElement) {
    observer.observe(mainElement)
  } else {
    // Fallback: start animations immediately if element not found
    startAnimations()
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse-subtle {
  animation: pulseSubtle 2s ease-in-out infinite;
}

@keyframes pulseSubtle {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite;
}

@keyframes bounceSubtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.countup {
  background: linear-gradient(135deg, #1e40af, #059669);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
