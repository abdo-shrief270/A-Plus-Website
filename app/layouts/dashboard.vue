<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
    dir="rtl"
  >
    <DashboardSidebar />

    <div
      :class="[
        'min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out',
        collapsed ? 'lg:pr-20' : 'lg:pr-72'
      ]"
    >
      <DashboardNavbar />

      <main class="flex-1 px-4 sm:px-6 py-6">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- Global "fast action" modals — opened from the navbar's bolt menu or
         any other place via useCreationModals(). Page-level modals (e.g. the
         course-card اشتراك button) still use their own local instances so they
         can preselect context like the specific course or plan. -->
    <DashboardKidsAddKidModal
      v-if="!authStore.isStudent"
      v-model:open="modals.addKid.value"
      @created="onKidCreated"
    />

    <DashboardCoursesEnrollStudentModal
      v-if="authStore.isStudent"
      v-model:open="modals.enrollCourse.value"
      :course="null"
      @enrolled="onEnrolled"
    />
    <DashboardCoursesEnrollKidsModal
      v-else
      v-model:open="modals.enrollCourse.value"
      :course="null"
      @enrolled="onEnrolled"
    />

    <DashboardSubscriptionsSubscribeStudentModal
      v-if="authStore.isStudent"
      v-model:open="modals.subscribePlan.value"
      :plan="null"
      @subscribed="onSubscribed"
    />
    <DashboardSubscriptionsSubscribeKidsModal
      v-else
      v-model:open="modals.subscribePlan.value"
      :plan="null"
      @subscribed="onSubscribed"
    />

    <DashboardTicketsNewTicketModal
      v-model:open="modals.newTicket.value"
      @created="onTicketCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { showToast } from '@/utils/helpers/toast.helper'
import { useAuthStore } from '@/stores/auth'

const { collapsed, mobileOpen } = useDashboardSidebar()
const modals = useCreationModals()
const labels = useEntityLabels()
const authStore = useAuthStore()
const studentEnrollments = useStudentEnrollments()
const route = useRoute()

watch(() => route.fullPath, () => {
  if (mobileOpen.value) mobileOpen.value = false
})

function onKidCreated() {
  showToast('تم بنجاح', `تم إضافة ${labels.value.singular} جديد`, 'success')
  if (!route.path.startsWith(labels.value.detailRoot)) {
    navigateTo(labels.value.detailRoot)
  }
}

function onEnrolled(result: { total_created: number, total_skipped: number }) {
  if (result.total_created > 0) {
    showToast(
      'تم بنجاح',
      authStore.isStudent ? 'تم تسجيلك في الكورس' : `تم إنشاء ${result.total_created} اشتراك`,
      'success'
    )
    if (authStore.isStudent) studentEnrollments.refresh()
    if (!route.path.startsWith('/dashboard/enrollments')) {
      navigateTo('/dashboard/enrollments')
    }
  }
}

function onSubscribed(result: { total_created: number, total_skipped: number }) {
  if (result.total_created > 0) {
    showToast(
      'تم الاشتراك',
      authStore.isStudent ? 'تم تفعيل اشتراكك في الباقة' : `تم إنشاء ${result.total_created} اشتراك في الباقة`,
      'success'
    )
    if (!route.path.startsWith('/dashboard/subscriptions')) {
      navigateTo('/dashboard/subscriptions')
    }
  }
}

function onTicketCreated(ticket: { id?: number | string } | null) {
  showToast('تم الإرسال', 'تم إرسال رسالتك إلى فريق الدعم', 'success')
  if (ticket?.id) {
    navigateTo(`/dashboard/tickets/${ticket.id}`)
  } else if (!route.path.startsWith('/dashboard/tickets')) {
    navigateTo('/dashboard/tickets')
  }
}
</script>
