<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header
      class="bg-white border-b border-gray-200 sticky top-0 w-full z-30 shadow-md"
    >
      <div class="container mx-auto px-6 py-3">
        <div class="flex items-center justify-between">
          <!-- User Menu / Sign In -->
          <div class="flex items-center">
            <div v-if="!authStore.isLoggedIn">
              <UButton
                to="/login"
                color="gray"
                variant="ghost"
                icon="i-heroicons-user"
                class="font-medium"
              >
                تسجيل الدخول
              </UButton>
            </div>

            <div v-else>
              <UDropdown :items="userMenuItems">
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-user"
                  trailing-icon="i-heroicons-chevron-down-20-solid"
                >
                  <span class="text-sm">حساب</span>
                </UButton>
              </UDropdown>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <UButton
            @click="toggleMenu"
            color="gray"
            variant="ghost"
            :icon="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            class="md:hidden"
          />

          <!-- Menu Items -->
          <nav
            :class="[
              'md:flex md:flex-row md:items-center md:gap-8',
              isMenuOpen
                ? 'flex flex-col absolute top-full left-0 w-full bg-white shadow-lg md:shadow-none md:static p-4 md:p-0'
                : 'hidden',
            ]"
          >
            <NuxtLink
              v-for="item in menuItems"
              :key="item.id"
              :to="item.route"
              class="flex items-center gap-3 text-gray-600 hover:text-primary-500 font-medium p-2 rounded-lg transition-all"
              :class="$route.path === item.route ? 'text-primary-500' : ''"
            >
              <UIcon :name="item.icon" class="text-lg" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.svg" alt="A+" class="h-12 w-12" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="A+" class="h-8 w-8" />
              <span class="text-xl font-bold text-gray-900">A+</span>
            </div>
            <p class="text-gray-600 text-sm">
              منصة تعليمية متكاملة للطلاب والمعلمين
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">روابط سريعة</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">
                  الرئيسية
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/about"
                  class="text-gray-600 hover:text-primary-600"
                >
                  من نحن
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/courses"
                  class="text-gray-600 hover:text-primary-600"
                >
                  الدورات
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">الدعم</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-gray-600 hover:text-primary-600"
                >
                  تواصل معنا
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/faq"
                  class="text-gray-600 hover:text-primary-600"
                >
                  الأسئلة الشائعة
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">تابعنا</h3>
            <div class="flex gap-3">
              <a href="#" class="text-gray-600 hover:text-primary-600">
                <UIcon name="i-simple-icons-facebook" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-600 hover:text-primary-600">
                <UIcon name="i-simple-icons-twitter" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-600 hover:text-primary-600">
                <UIcon name="i-simple-icons-instagram" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600"
        >
          <p>&copy; 2026 A+. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const isMenuOpen = ref(false);

const menuItems = [
  {
    id: "plan",
    route: "/plan",
    label: "خطتي",
    icon: "i-heroicons-calendar",
  },
  {
    id: "exams",
    route: "/exams",
    label: "بنك الأسئلة",
    icon: "i-heroicons-question-mark-circle",
  },
  {
    id: "courses",
    route: "/courses",
    label: "الدورات",
    icon: "i-heroicons-book-open",
  },
  {
    id: "contestants",
    route: "/contestants",
    label: "المتصدرين",
    icon: "i-heroicons-trophy",
  },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const userMenuItems = [
  [
    {
      label: "الملف الشخصي",
      icon: "i-heroicons-user",
      click: () => navigateTo("/profile"),
    },
  ],
  [
    {
      label: "تسجيل الخروج",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => authStore.logoutUser(),
    },
  ],
];

onMounted(() => {
  if (authStore.isLoggedIn) {
    authStore.fetchUser();
  }
});
</script>
