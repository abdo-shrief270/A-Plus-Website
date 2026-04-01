<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          المراحل الدراسية والامتحانات
        </h1>
        <p class="text-gray-500 mt-1 text-sm">
          استعرض جميع المراحل الدراسية والامتحانات المتاحة في المنصة
        </p>
      </div>
    </div>

    <div v-if="academicStore.loadingExams" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="academicStore.exams.length === 0"
      class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
    >
      <UIcon
        name="i-heroicons-academic-cap"
        class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        لا توجد مراحل دراسية
      </h3>
      <p class="text-gray-500">
        لم يتم إضافة أي مراحل دراسية أو امتحانات حتى الآن.
      </p>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <NuxtLink
        v-for="exam in academicStore.exams"
        :key="exam.id"
        :to="`/dashboard/exams/${exam.id}`"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center group hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg hover:-translate-y-1"
      >
        <div
          class="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        >
          <UIcon name="i-heroicons-book-open" class="w-8 h-8" />
        </div>
        <h3
          class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
        >
          {{ exam.name_ar || exam.name || "مرحلة غير مسماة" }}
        </h3>
        <p
          v-if="exam.description"
          class="text-sm text-gray-500 mt-2 line-clamp-2"
        >
          {{ exam.description }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAcademicStore } from "@/stores/academic";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "المراحل الدراسية | A Plus" });

const academicStore = useAcademicStore();

onMounted(() => {
  academicStore.fetchExams();
});
</script>
