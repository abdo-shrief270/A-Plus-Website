<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-chart-pie"
            class="w-8 h-8 text-primary-500"
          />
          إحصائيات وتقدم الطالب
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          متابعة الأداء الأكاديمي، نتائج الاختبارات، ومدى التقدم في الدورات
        </p>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="fetchStats"
      >
        تحديث البيانات
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="!stats"
      class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
    >
      <UIcon
        name="i-heroicons-chart-bar-square"
        class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        لا توجد إحصائيات كافية
      </h3>
      <p class="text-gray-500">
        لم يتم تجميع بيانات كافية لعرض إحصائيات التقدم حتى الآن.
      </p>
    </div>

    <div v-else class="space-y-6">
      <!-- Top Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm flex items-center gap-4"
        >
          <div
            class="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center"
          >
            <UIcon name="i-heroicons-check-circle" class="w-8 h-8" />
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">
              الأسئلة المجابة المعززة
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.total_answered_questions || 0 }}
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm flex items-center gap-4"
        >
          <div
            class="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center"
          >
            <UIcon name="i-heroicons-document-text" class="w-8 h-8" />
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">الاختبارات المجتازة</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.completed_exams || 0 }}
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm flex items-center gap-4"
        >
          <div
            class="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center"
          >
            <UIcon name="i-heroicons-fire" class="w-8 h-8" />
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">أيام التدريب المتتالية</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.streak_days || 0 }} سلسلة
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm flex items-center gap-4"
        >
          <div
            class="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center"
          >
            <UIcon name="i-heroicons-academic-cap" class="w-8 h-8" />
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">متوسط الدرجات</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stats.average_score || 0 }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section (Mocked visualization containers for now) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
        >
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-presentation-chart-line"
              class="w-5 h-5 text-gray-400"
            />
            منحنى التطور الأكاديمي
          </h3>

          <div
            class="h-64 flex items-end justify-between gap-2 px-2 pb-6 border-b border-gray-100 dark:border-gray-700"
          >
            <!-- Mock chart bars -->
            <div
              v-for="i in 12"
              :key="i"
              class="w-full flex flex-col justify-end group"
            >
              <!-- Tooltip simulation -->
              <div
                class="opacity-0 group-hover:opacity-100 text-center text-xs font-bold text-gray-900 dark:text-white mb-2 transition-opacity"
              >
                {{ Math.floor(Math.random() * 40) + 60 }}%
              </div>
              <div
                class="w-full bg-primary-100 dark:bg-primary-900/30 rounded-t-sm group-hover:bg-primary-400 transition-colors"
                :style="`height: ${Math.floor(Math.random() * 80) + 20}%`"
              ></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2 px-2">
            <span>الأسبوع 1</span>
            <span>الأسبوع 12</span>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
        >
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
          >
            <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 text-gray-400" />
            توزيع المهارات والمواد
          </h3>

          <div class="flex items-center justify-center h-64">
            <!-- Mock Pie/Donut Chart Placeholder -->
            <div
              class="relative w-48 h-48 rounded-full border-[16px] border-primary-100 dark:border-gray-700 flex items-center justify-center"
            >
              <div
                class="absolute inset-0 border-[16px] border-primary-500 rounded-full"
                style="
                  clip-path: polygon(
                    50% 50%,
                    100% 0,
                    100% 100%,
                    0 100%,
                    0 0,
                    50% 0
                  );
                "
              ></div>
              <div
                class="text-center bg-white dark:bg-gray-800 w-32 h-32 rounded-full flex flex-col items-center justify-center z-10 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <span class="text-3xl font-bold text-gray-900 dark:text-white"
                  >4</span
                >
                <span class="text-xs text-gray-500">مواد قوية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentsService } from "@/services/api/students.service";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "إحصائيات التقدم | A Plus" });

const route = useRoute();
// Optional: If an admin is viewing a specific student, they might pass ?student=ID
const targetStudentId = route.query.student as string | undefined;

const loading = ref(true);
const stats = ref<any>(null);

onMounted(async () => {
  await fetchStats();
});

async function fetchStats() {
  loading.value = true;
  try {
    const res = await studentsService.getStudentStats({
      student_id: targetStudentId || undefined,
    });

    const payload = res.data?.data || res.data;
    stats.value = payload?.stats || payload;

    // Just a basic fallback to show the mockup UI if backend is empty
    if (Object.keys(stats.value || {}).length === 0) {
      stats.value = {
        total_answered_questions: 154,
        completed_exams: 12,
        streak_days: 5,
        average_score: 87,
      };
    }
  } catch (error) {
    console.error("Failed to load student stats", error);
    // Add mock data for demonstration
    stats.value = {
      total_answered_questions: 154,
      completed_exams: 12,
      streak_days: 5,
      average_score: 87,
    };
  } finally {
    loading.value = false;
  }
}
</script>
