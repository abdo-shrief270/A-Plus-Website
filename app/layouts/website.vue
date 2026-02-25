<template>
  <div class="min-h-screen bg-[#F5F7FA]">
    <!-- Header -->
    <header
      class="bg-[#F5F7FA] border-b border-gray-200 sticky top-0 w-full z-30"
    >
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- User Menu / Sign In -->
          <div class="flex items-center">
            <div v-if="!authStore.isLoggedIn">
              <UButton
                to="/auth/login"
                class="bg-[#009688] hover:bg-[#00796B] text-white font-medium px-6 py-2 rounded-lg"
              >
                تسجيل الدخول
              </UButton>
            </div>

            <div v-else>
              <UButton
                to="/dashboard"
                class="bg-[#009688] hover:bg-[#00796B] text-white font-medium px-6 py-2 rounded-lg"
              >
                لوحة التحكم
              </UButton>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <UButton
            color="neutral"
            variant="ghost"
            :icon="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            class="md:hidden"
            @click="toggleMenu"
          />

          <!-- Menu Items -->
          <nav
            :class="[
              'md:flex md:flex-row md:items-center md:gap-8 list-none',
              isMenuOpen
                ? 'flex flex-col absolute top-full left-0 w-full bg-[#F5F7FA] shadow-lg md:shadow-none md:static p-4 md:p-0'
                : 'hidden'
            ]"
          >
            <NuxtLink
              v-for="item in menuItems"
              :key="item.id"
              :to="item.route"
              class="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold p-2 transition-all"
              :class="$route.path === item.route ? 'text-gray-900' : ''"
            >
              <span>{{ item.label }}</span>
              <UIcon
                :name="item.icon"
                class="text-xl"
              />
            </NuxtLink>
          </nav>

          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <img
              src="/logo.svg"
              alt="A+"
              class="h-12"
            >
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const menuItems = [
  {
    id: 'contestants',
    route: '/contestants',
    label: 'المتصدرين',
    icon: 'i-heroicons-trophy'
  },
  {
    id: 'review',
    route: '/review',
    label: 'مراجعة',
    icon: 'i-heroicons-book-open'
  },
  {
    id: 'courses',
    route: '/courses',
    label: 'الدورات',
    icon: 'i-heroicons-play-circle'
  },
  {
    id: 'exams',
    route: '/exams',
    label: 'بنك الاسئلة',
    icon: 'i-heroicons-briefcase'
  },
  {
    id: 'plan',
    route: '/plan',
    label: 'خطتي',
    icon: 'i-heroicons-map'
  }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
