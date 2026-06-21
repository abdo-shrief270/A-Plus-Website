<template>
  <!-- Mobile backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm lg:hidden"
      @click="mobileOpen = false"
    />
  </Transition>

  <aside
    :class="[
      'fixed inset-y-0 right-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl lg:shadow-none transition-[transform,width] duration-300 ease-in-out',
      collapsed ? 'lg:w-20' : 'lg:w-72',
      'w-72',
      mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Brand -->
    <div
      :class="[
        'flex items-center h-16 border-b border-gray-200 dark:border-gray-800 shrink-0',
        collapsed ? 'lg:justify-center px-3' : 'px-5 gap-3'
      ]"
    >
      <NuxtLink
        to="/dashboard"
        class="flex items-center gap-3 group"
      >
        <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-shadow shrink-0">
          <span class="text-white font-bold text-lg">A+</span>
          <div class="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-secondary-500 ring-2 ring-white dark:ring-gray-900" />
        </div>
        <div
          v-show="!collapsed"
          class="flex flex-col leading-tight"
        >
          <span class="text-lg font-bold text-gray-900 dark:text-white">A Plus</span>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">منصة التعليم الذكية</span>
        </div>
      </NuxtLink>

      <button
        v-show="!collapsed"
        type="button"
        class="hidden lg:flex mr-auto w-8 h-8 rounded-lg items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :title="'طي القائمة'"
        @click="collapsed = true"
      >
        <UIcon
          name="i-heroicons-chevron-double-right"
          class="w-4 h-4"
        />
      </button>

      <button
        type="button"
        class="lg:hidden mr-auto w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="mobileOpen = false"
      >
        <UIcon
          name="i-heroicons-x-mark"
          class="w-5 h-5"
        />
      </button>
    </div>

    <!-- Expand button when collapsed -->
    <button
      v-show="collapsed"
      type="button"
      class="hidden lg:flex mx-auto mt-3 w-9 h-9 rounded-lg items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :title="'فتح القائمة'"
      @click="collapsed = false"
    >
      <UIcon
        name="i-heroicons-chevron-double-left"
        class="w-4 h-4"
      />
    </button>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
      <div
        v-for="(section, idx) in sections"
        :key="idx"
        class="space-y-1"
      >
        <p
          v-if="section.title && !collapsed"
          class="px-3 mb-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          {{ section.title }}
        </p>
        <div
          v-else-if="section.title && collapsed"
          class="hidden lg:block mx-auto h-px w-8 bg-gray-200 dark:bg-gray-700 my-3"
        />

        <NuxtLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          :class="[
            'group relative flex items-center rounded-xl text-sm transition-all duration-200',
            collapsed ? 'lg:justify-center lg:px-0 lg:h-11 lg:w-11 lg:mx-auto px-3 h-11 gap-3' : 'px-3 h-11 gap-3',
            activePath === item.to
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 font-bold shadow-sm shadow-primary-500/10'
              : 'text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
          ]"
          :title="collapsed ? item.label : undefined"
          @click="onNavClick"
        >
          <span
            v-if="activePath === item.to"
            class="absolute right-0 top-1.5 bottom-1.5 w-1 rounded-l-full bg-primary-500"
          />
          <UIcon
            :name="item.icon"
            :class="[
              'w-5 h-5 shrink-0 transition-transform',
              activePath === item.to
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white group-hover:scale-110'
            ]"
          />
          <span
            v-show="!collapsed"
            class="flex-1 truncate"
          >
            {{ item.label }}
          </span>
          <span
            v-if="item.badge && !collapsed"
            class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- User card -->
    <div class="border-t border-gray-200 dark:border-gray-800 p-3 shrink-0">
      <div
        :class="[
          'flex items-center gap-2 rounded-2xl bg-gradient-to-l from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-900 ring-1 ring-gray-100 dark:ring-gray-800 transition-shadow',
          collapsed ? 'lg:justify-center lg:bg-transparent lg:ring-0 p-1.5' : 'p-2'
        ]"
      >
        <NuxtLink
          to="/dashboard/profile"
          class="relative shrink-0 group"
          :title="collapsed ? user?.name : undefined"
        >
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent group-hover:ring-primary-200 dark:group-hover:ring-primary-700/40 transition-shadow">
            {{ userInitial }}
          </div>
          <div class="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-success-500 ring-2 ring-white dark:ring-gray-900" />
        </NuxtLink>

        <NuxtLink
          v-show="!collapsed"
          to="/dashboard/profile"
          class="flex-1 min-w-0 text-right group"
        >
          <p class="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
            {{ user?.name }}
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {{ roleLabel }}
          </p>
        </NuxtLink>

        <button
          v-show="!collapsed"
          type="button"
          class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/20 dark:hover:text-error-400 transition-colors"
          title="تسجيل الخروج"
          @click="logoutOpen = true"
        >
          <UIcon
            name="i-heroicons-arrow-right-on-rectangle"
            class="w-5 h-5"
          />
        </button>
      </div>
    </div>

    <DashboardLogoutConfirmModal v-model:open="logoutOpen" />
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { collapsed, mobileOpen } = useDashboardSidebar()
const sections = useDashboardNav()
const { activePath } = useDashboardActiveItem()

const user = computed(() => authStore.getUser)
const userInitial = computed(() => user.value?.name?.charAt(0)?.toUpperCase() ?? 'A')

const roleLabel = computed(() => {
  if (authStore.isSchool) return 'مدرسة'
  if (authStore.isParent) return 'ولي أمر'
  if (authStore.isStudent) return 'طالب'
  return ''
})

const logoutOpen = ref(false)

const onNavClick = () => {
  // Close mobile drawer after navigation
  if (mobileOpen.value) mobileOpen.value = false
}
</script>
