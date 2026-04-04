<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20">
    <!-- Hero Section -->
    <div class="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
      <!-- Background Abstract Shape -->
      <div class="absolute top-0 right-0 w-1/3 h-full bg-primary-500/5 skew-x-[-20deg] translate-x-20 pointer-events-none" />
      
      <div class="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div class="flex flex-col md:flex-row items-center gap-10">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 transform hover:rotate-6 transition-transform duration-500">
            <UIcon name="i-heroicons-academic-cap" class="w-12 h-12 md:w-16 md:h-16" />
          </div>
          
          <div class="flex-grow text-center md:text-right">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <UBadge color="primary" variant="subtle" size="xs" class="rounded-lg px-3 font-black uppercase tracking-tighter">بنك الأسئلة الرئيسي</UBadge>
              <div v-if="examsStore.subjects?.length" class="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <UIcon name="i-heroicons-book-open" class="w-4 h-4 text-primary-500" />
                {{ examsStore.subjects.length }} مواد دراسية
              </div>
            </div>
            
            <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              {{ examsStore.currentExam?.name || 'تفاصيل الاختبار' }}
            </h1>
            
            <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed font-medium">
              {{ examsStore.currentExam?.description || 'تصفح الأقسام والمواد المتاحة للبدء في التدريب والتحضير للاختبار بأفضل الوسائل العلمية.' }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <BButton variant="soft" color="primary" size="lg" class="rounded-2xl px-6">
              <template #leading>
                <UIcon name="i-heroicons-share" class="w-5 h-5" />
              </template>
              مشاركة
            </BButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs (Breadcrumb style) -->
    <div class="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <NuxtLink to="/exams" class="text-gray-400 hover:text-primary-500 transition-colors uppercase text-[10px] font-black tracking-widest">الاختبارات</NuxtLink>
          <UIcon name="i-heroicons-chevron-left" class="w-3 h-3 text-gray-300" />
          <span class="text-primary-500 uppercase text-[10px] font-black tracking-widest whitespace-nowrap">{{ examsStore.currentExam?.name }}</span>
        </div>
        
        <div class="flex items-center gap-4">
          <UButton
            v-if="examsStore.isLoading"
            variant="ghost"
            color="primary"
            loading
            class="font-bold text-xs"
          >
            جاري المزامنة...
          </UButton>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Sidebar Navigation (Section & Categories) -->
        <aside class="lg:col-span-4">
          <div class="sticky top-24 space-y-8">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-primary-500 rounded-full" />
                أقسام الاختبار
              </h3>
            </div>
            
            <CategorySidebar :sections="examsStore.sections" />
          </div>
        </aside>

        <!-- Main Content (Subjects Grid) -->
        <main class="lg:col-span-8">
          <div class="mb-10 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
                المواد الدراسية المتوفرة
              </h2>
              <p class="text-gray-500 dark:text-gray-400 font-medium italic">
                اختر مادة للبدء في تصفح الأسئلة والاختبارات التدريبية المخصصة لها.
              </p>
            </div>
            
            <div class="hidden sm:block">
               <BButton variant="outline" color="neutral" size="sm" class="rounded-xl">ترتيب حسب: الأحدث</BButton>
            </div>
          </div>

          <div v-if="examsStore.isLoading && !examsStore.subjects.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="i in 4" :key="i" class="h-32 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse" />
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NuxtLink
              v-for="subject in examsStore.subjects"
              :key="subject.id"
              :to="`/subjects/${subject.id}/questions`"
              class="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2"
            >
              <!-- Decorative Circle -->
              <div class="absolute -top-10 -left-10 w-32 h-32 bg-secondary-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div class="flex items-center justify-between relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white shadow-xl shadow-secondary-500/20 transform group-hover:rotate-12 transition-transform duration-500">
                  <UIcon name="i-heroicons-book-open" class="w-8 h-8" />
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-[10px] font-black text-secondary-500 uppercase tracking-widest mb-1">عدد المختبرين</span>
                  <span class="text-lg font-black text-gray-900 dark:text-white">1.2k+</span>
                </div>
              </div>
              
              <div class="relative z-10">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {{ subject.name }}
                </h3>
                <div class="flex items-center gap-2">
                  <UBadge color="secondary" variant="soft" size="xs" class="rounded-lg font-black">{{ subject.questions_count || 0 }} سؤال</UBadge>
                  <UBadge color="gray" variant="soft" size="xs" class="rounded-lg font-bold">محدث دورياً</UBadge>
                </div>
              </div>
              
              <div class="pt-4 mt-auto border-t border-gray-50 dark:border-gray-800 relative z-10 flex items-center justify-between text-primary-500 group-hover:text-primary-600 font-black text-sm">
                 <span>ابدأ التدريب الآن</span>
                 <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 transform group-hover:translate-x-[-6px] transition-transform" />
              </div>
            </NuxtLink>

            <div
              v-if="!examsStore.isLoading && examsStore.subjects.length === 0"
              class="col-span-full py-32 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800"
            >
              <div class="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-heroicons-document-magnifying-glass" class="w-10 h-10 text-gray-300" />
              </div>
              <h4 class="text-xl font-black text-gray-900 dark:text-white mb-2">لا توجد مواد مباشرة</h4>
              <p class="text-gray-400 font-medium">سيتم إضافة المحتوى الدراسي لهذا الاختبار قريباً.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamsStore } from '@/stores/useExamsStore'
import CategorySidebar from '~/components/question/CategorySidebar.vue'

// Public page
definePageMeta({ layout: 'default' })

const route = useRoute()
const examId = computed(() => route.params.id as string)
const examsStore = useExamsStore()

useSeoMeta({
  title: computed(() => `${examsStore.currentExam?.name || 'تفاصيل الاختبار'} | A Plus`),
  description: computed(() => `استعرض أقسام ومواد ${examsStore.currentExam?.name} في بنك الأسئلة A Plus.`)
})

onMounted(async () => {
  await Promise.all([
    examsStore.fetchExamById(examId.value),
    examsStore.fetchExamSubjects(examId.value),
    examsStore.fetchExamSections(examId.value)
  ])
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
