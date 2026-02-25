<template>
  <div class="bg-[#F5F7FA] py-16 lg:py-24" dir="rtl">
    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Right Column (Empty to push testimonials to the left, mimicking design) -->
        <div class="hidden lg:block lg:col-span-3"></div>

        <!-- Center/Left Column: Testimonial Cards -->
        <div class="lg:col-span-9">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Card 1 (Yumna) -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-3">
                <UIcon name="i-heroicons-user" class="w-6 h-6 text-[#009688]" />
              </div>
              <h3 class="font-bold text-gray-900 mb-1">يمنى عبدالله</h3>
              <div class="flex items-center gap-1 mb-4 text-sm font-medium">
                <span>4.7</span>
                <UIcon name="i-heroicons-star-16-solid" class="w-4 h-4 text-yellow-400" />
              </div>
              <p class="text-gray-600 text-sm leading-relaxed">
                الخطة التعليمية ساعدتني أذاكر منظم لأول مرة، وبنك الأسئلة خلاني أدخل الامتحان وأنا واثق
              </p>
            </div>

            <!-- Card 2 (Fahad) -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-3">
                <UIcon name="i-heroicons-user" class="w-6 h-6 text-[#009688]" />
              </div>
              <h3 class="font-bold text-gray-900 mb-1">فهد سلمان</h3>
              <div class="flex items-center gap-1 mb-4 text-sm font-medium">
                <span>4.2</span>
                <UIcon name="i-heroicons-star-16-solid" class="w-4 h-4 text-yellow-400" />
              </div>
              <p class="text-gray-600 text-sm leading-relaxed">
                الكورسات المتنوعة وسهولة الوصول لها خلتني أتعلم أشياء جديدة مع دراستي، وبسعر مرة مناسب
              </p>
            </div>

            <!-- Card 3 (Saud) -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-3">
                <UIcon name="i-heroicons-user" class="w-6 h-6 text-[#009688]" />
              </div>
              <h3 class="font-bold text-gray-900 mb-1">سعود عبدالعزيز</h3>
              <div class="flex items-center gap-1 mb-4 text-sm font-medium">
                <span>4.4</span>
                <UIcon name="i-heroicons-star-16-solid" class="w-4 h-4 text-yellow-400" />
              </div>
              <p class="text-gray-600 text-sm leading-relaxed">
                أكثر شي عجبني إن المنصة مو بس تعلم، بعد تخليك تختبر نفسك وتعرف نقاط ضعفك
              </p>
            </div>

            <!-- Card 4 (Noura) -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-3">
                <UIcon name="i-heroicons-user" class="w-6 h-6 text-[#009688]" />
              </div>
              <h3 class="font-bold text-gray-900 mb-1">نورة عبدالله</h3>
              <div class="flex items-center gap-1 mb-4 text-sm font-medium">
                <span>4.1</span>
                <UIcon name="i-heroicons-star-16-solid" class="w-4 h-4 text-yellow-400" />
              </div>
              <p class="text-gray-600 text-sm leading-relaxed">
                كنت دايما أتوتر قبل الاختبارات، بس مع الخطة وبنك الأسئلة حسيت كأني أذاكر خطوة بخطوة
              </p>
            </div>

          </div>
        </div>

        <!-- Left Column: The summary graph can be added here if needed, but for now it focuses on the cards -->
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Static testimonials from the design
</script>
