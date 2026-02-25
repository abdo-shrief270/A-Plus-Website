<template>
  <footer class="bg-[#009688] text-white py-16" dir="rtl">
    <UContainer>
      <!-- Top Section: App Promo -->
      <div class="flex flex-col md:flex-row items-center justify-between border-b border-[#33A99D] pb-10 mb-10 gap-6">
        <div>
          <h2 class="text-3xl font-bold mb-3 text-right">حمل التطبيق الان</h2>
          <p class="text-[#E0F2F1] text-lg text-right">استمتع بتجربة تعليمية فريدة بأسلوب مبتكر يخليك تكتسب المهارات بسهولة وتوصل للنتائج اللي تتمناها</p>
        </div>
        <div class="flex gap-4">
          <a href="#" class="bg-[#F5F7FA] text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white transition-colors">
            <span class="font-bold">أبل ستور</span>
            <UIcon name="i-simple-icons-apple" class="text-2xl" />
          </a>
          <a href="#" class="bg-[#F5F7FA] text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white transition-colors">
            <span class="font-bold">متجر بلاي</span>
            <UIcon name="i-simple-icons-googleplay" class="text-2xl text-green-600" />
          </a>
        </div>
      </div>

      <!-- Middle Section: Links -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <!-- Col 4 -->
        <div class="text-right">
          <h3 class="font-bold text-xl mb-6">انضم إلى قنواتنا على تيليجرام</h3>
          <ul class="space-y-4 text-[#E0F2F1]">
            <li><a href="#" class="hover:text-white transition-colors">قناة القدرات</a></li>
            <li><a href="#" class="hover:text-white transition-colors">قناة التحصيلي</a></li>
          </ul>
        </div>

        <!-- Col 3 -->
        <div class="text-right">
          <h3 class="font-bold text-xl mb-6">تواصل معنا</h3>
          <ul class="space-y-4 text-[#E0F2F1]">
            <li><a href="#" class="hover:text-white transition-colors">اتصل بنا</a></li>
            <li><a href="#" class="hover:text-white transition-colors">الدعم الفني</a></li>
            <li><a href="#" class="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
            <li><a href="#" class="hover:text-white transition-colors">من نحن</a></li>
            <li><a href="#" class="hover:text-white transition-colors">انضم الى برنامج الشراكة</a></li>
          </ul>
        </div>

        <!-- Col 2 -->
        <div class="text-right">
          <h3 class="font-bold text-xl mb-6">سياسة الخصوصية</h3>
          <ul class="space-y-4 text-[#E0F2F1]">
            <li><a href="#" class="hover:text-white transition-colors">البيانات التي نجمعها</a></li>
            <li><a href="#" class="hover:text-white transition-colors">كيف نجمع بياناتك</a></li>
            <li><a href="#" class="hover:text-white transition-colors">لماذا نستخدم بياناتك</a></li>
            <li><a href="#" class="hover:text-white transition-colors">حقوقك واختياراتك</a></li>
            <li><a href="#" class="hover:text-white transition-colors">من نشارك بياناتك</a></li>
            <li><a href="#" class="hover:text-white transition-colors">التغييرات على سياسة الخصوصية</a></li>
            <li><a href="#" class="hover:text-white transition-colors">الأمان</a></li>
          </ul>
        </div>

        <!-- Col 1 -->
        <div class="text-right">
          <h3 class="font-bold text-xl mb-6">الشروط والاحكام</h3>
          <ul class="space-y-4 text-[#E0F2F1]">
            <li><a href="#" class="hover:text-white transition-colors">المسؤولية عن الحسابات الشخصية</a></li>
            <li><a href="#" class="hover:text-white transition-colors">استخدام المحتوى</a></li>
            <li><a href="#" class="hover:text-white transition-colors">سياسة الإلغاء والاسترداد المالي</a></li>
            <li><a href="#" class="hover:text-white transition-colors">تسريب المحتوى</a></li>
            <li><a href="#" class="hover:text-white transition-colors">حظر المستخدمين</a></li>
            <li><a href="#" class="hover:text-white transition-colors">التعديلات على الشروط</a></li>
            <li><a href="#" class="hover:text-white transition-colors">شروط قانونية عامة</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section: Copyright & Socials -->
      <div class="flex flex-col md:flex-row items-center justify-between border-t border-[#33A99D] pt-6">
        <p class="text-[#E0F2F1] text-sm mb-4 md:mb-0">جميع الحقوق محفوظة &copy; 2026 A+</p>
        
        <div class="flex items-center gap-4">
          <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#009688] hover:bg-[#E0F2F1] transition-colors">
            <UIcon name="i-simple-icons-x" class="text-lg" />
          </a>
          <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#009688] hover:bg-[#E0F2F1] transition-colors">
            <UIcon name="i-simple-icons-tiktok" class="text-lg" />
          </a>
          <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#009688] hover:bg-[#E0F2F1] transition-colors">
            <UIcon name="i-simple-icons-telegram" class="text-lg" />
          </a>
          <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#009688] hover:bg-[#E0F2F1] transition-colors">
            <UIcon name="i-simple-icons-instagram" class="text-lg" />
          </a>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
