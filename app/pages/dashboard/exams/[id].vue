<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        icon="i-heroicons-arrow-right"
        color="neutral"
        variant="ghost"
        to="/dashboard/exams"
        class="rtl:-scale-x-100"
      />
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ exam?.name_ar || exam?.name || "تفاصيل المرحلة" }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          استعرض المواد والأقسام التابعة لهذه المرحلة الدراسية
        </p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div v-else class="space-y-8">
      <!-- Subjects Grid -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-book-open"
              class="w-6 h-6 text-primary-500"
            />
            المواد الدراسية
            <UBadge color="neutral" variant="subtle" size="sm" class="ml-2">
              {{ subjects.length }}
            </UBadge>
          </h2>
        </div>

        <div
          v-if="subjects.length === 0"
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center"
        >
          <p class="text-gray-500">لا توجد مواد مضافة لهذه المرحلة بعد.</p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <NuxtLink
            v-for="subject in subjects"
            :key="subject.id"
            :to="`/dashboard/subjects/${subject.id}`"
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-md group"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <span class="font-bold text-lg">{{
                subject?.name_ar?.charAt(0) || subject?.name?.charAt(0) || "م"
              }}</span>
            </div>
            <div>
              <h3
                class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ subject.name_ar || subject.name }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ subject.description || "بدون وصف" }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Sections Grid -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-queue-list"
              class="w-6 h-6 text-primary-500"
            />
            أقسام المرحلة (Sections)
            <UBadge color="neutral" variant="subtle" size="sm" class="ml-2">
              {{ sections.length }}
            </UBadge>
          </h2>
        </div>

        <div
          v-if="sections.length === 0"
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center"
        >
          <p class="text-gray-500">لا توجد أقسام متفرعة لهذه المرحلة بعد.</p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="section in sections"
            :key="section.id"
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
          >
            <h3 class="font-bold text-gray-900 dark:text-white">
              {{ section.name_ar || section.name }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              {{ section.description || "بدون وصف" }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAcademicStore } from "@/stores/academic";
import { examsService } from "@/services/api/exams.service";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });

const route = useRoute();
const academicStore = useAcademicStore();

const examId = route.params.id as string;
const loading = ref(true);

const exam = ref<any>(null);
const subjects = ref<any[]>([]);
const sections = ref<any[]>([]);

onMounted(async () => {
  try {
    // Attempt to fetch exam details, subjects, and sections in parallel
    const [examRes, subjectsData, sectionsData] = await Promise.all([
      examsService.getExamDetails(examId),
      academicStore.fetchSubjectsForExam(examId),
      academicStore.fetchSectionsForExam(examId),
    ]);

    const payload = examRes.data?.data || examRes.data;
    exam.value = payload?.exam || payload;

    useSeoMeta({
      title: `${exam.value?.name_ar || exam.value?.name || "تفاصيل المرحلة"} | A Plus`,
    });

    subjects.value = subjectsData || [];
    sections.value = sectionsData || [];
  } catch (error) {
    console.error("Failed to load exam layout", error);
  } finally {
    loading.value = false;
  }
});
</script>
