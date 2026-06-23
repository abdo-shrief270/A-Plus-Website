<template>
  <section v-if="courses.length" dir="rtl" class="bg-[#F5F7FA] py-20">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 class="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            دورات مميّزة
          </h2>
          <p class="text-lg text-gray-600">
            تعلّم من نخبة المعلّمين عبر دورات مصمّمة للتفوق
          </p>
        </div>
        <UButton
          to="/courses"
          color="neutral"
          variant="ghost"
          trailing-icon="i-heroicons-arrow-left"
          class="hidden shrink-0 font-bold sm:flex"
        >
          عرض الكل
        </UButton>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :course="course"
          @enroll="() => navigateTo('/courses')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { coursesService } from '@/services/api/courses.service'
import type { Course } from '@/types/course'

const { data } = await useAsyncData(
  'home-courses-preview',
  () => coursesService.list({ per_page: 3 }).then(r => r.data?.data ?? r.data).catch(() => []),
  { lazy: true, server: false, default: () => [] }
)

const courses = computed<Course[]>(() => {
  const payload = data.value as unknown
  const list = Array.isArray(payload) ? payload : ((payload as { data?: unknown })?.data ?? [])
  return (list as Course[]).slice(0, 3)
})
</script>
