<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2"
        >
          <img
            src="/logo.svg"
            alt="A+"
            class="h-12 w-12"
          >
          <span class="text-3xl font-bold text-gray-900">A+</span>
        </NuxtLink>
      </div>

      <!-- Content Card -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <slot />
      </div>

      <!-- Footer Link -->
      <div class="text-center mt-6">
        <NuxtLink
          to="/"
          class="text-sm text-gray-600 hover:text-primary-600"
        >
          العودة للصفحة الرئيسية
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
