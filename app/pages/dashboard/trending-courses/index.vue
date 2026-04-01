<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon name="i-heroicons-fire" class="w-8 h-8 text-orange-500" />
          الدورات الأكثر إقبالاً
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          اكتشف الدورات والمواد التعليمية الشائعة التي يدرسها زملائك الآن
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="ابحث عن دورة..."
        class="w-full sm:max-w-md"
        size="lg"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="courses.length === 0"
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center"
    >
      <div
        class="w-20 h-20 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mx-auto mb-6"
      >
        <UIcon name="i-heroicons-fire" class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        لا توجد دورات شائعة حالياً
      </h3>
      <p class="text-gray-500 max-w-md mx-auto mb-6">
        يرجى المحاولة في وقت لاحق للاطلاع على أحدث الدورات المضافة.
      </p>
    </div>

    <!-- Courses Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <NuxtLink
        v-for="course in courses"
        :key="course.id"
        :to="`/dashboard/courses/${course.id}`"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:shadow-lg group shadow-sm"
      >
        <!-- Course Image -->
        <div class="h-48 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
          <img
            v-if="course.image || course.cover_image"
            :src="course.image || course.cover_image"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-rose-600/20 group-hover:scale-105 transition-transform duration-500"
          >
            <UIcon
              name="i-heroicons-book-open"
              class="w-16 h-16 text-orange-500/30"
            />
          </div>

          <!-- Floating metrics -->
          <div
            class="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 shadow-sm"
          >
            <UIcon name="i-heroicons-users" class="w-4 h-4 text-orange-500" />
            {{ course.students_count || Math.floor(Math.random() * 500) + 50 }}
            طالب
          </div>

          <UBadge
            v-if="course.is_new"
            color="rose"
            variant="solid"
            class="absolute top-4 right-4 shadow-sm"
          >
            جديد
          </UBadge>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-xs text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded"
            >
              {{
                course.subject?.name_ar || course.category?.name || "مادة عامة"
              }}
            </span>
            <div class="flex items-center text-xs text-amber-500 font-bold">
              <UIcon name="i-heroicons-star-solid" class="w-3.5 h-3.5 mr-0.5" />
              {{ course.rating || "4.8" }}
            </div>
          </div>

          <h3
            class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2 line-clamp-2"
          >
            {{ course.title || course.name }}
          </h3>

          <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {{
              course.description ||
              "تعلم المهارات الأساسية والمتقدمة في هذه الدورة المتميزة."
            }}
          </p>

          <div
            class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700"
          >
            <span
              v-if="course.price === 0 || !course.price"
              class="font-bold text-emerald-600 dark:text-emerald-400"
              >مجاني</span
            >
            <span v-else class="font-bold text-gray-900 dark:text-white"
              >{{ course.price }} ر.س</span
            >

            <UIcon
              name="i-heroicons-arrow-left"
              class="w-5 h-5 text-gray-400 group-hover:text-orange-500 rtl:-scale-x-100 transition-colors"
            />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentsService } from "@/services/api/students.service";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "الدورات الأكثر إقبالاً | A Plus" });

const loading = ref(true);
const courses = ref<any[]>([]);

const searchQuery = ref("");

onMounted(async () => {
  await fetchTrendingCourses();
});

async function fetchTrendingCourses() {
  loading.value = true;
  try {
    const res = await studentsService.getTrendingCourses({
      search: searchQuery.value || undefined,
    });

    // Check various common wrappers `data.data`, `data.courses`, `data.trending_courses`
    const payload = res.data?.data || res.data;
    courses.value = Array.isArray(payload)
      ? payload
      : payload?.trending_courses || payload?.courses || [];
  } catch (error) {
    console.error("Failed to load trending courses", error);
  } finally {
    loading.value = false;
  }
}
</script>
