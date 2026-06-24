import type { ComputedRef } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

export interface NavItem {
  label: string
  icon: string
  to: string
  badge?: string | number
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export const useDashboardNav = (): ComputedRef<NavSection[]> => {
  const authStore = useAuthStore()

  return computed<NavSection[]>(() => {
    const home: NavSection = {
      items: [
        { label: 'الرئيسية', icon: 'i-heroicons-squares-2x2', to: '/dashboard' }
      ]
    }

    if (authStore.isParent) {
      return [
        home,
        {
          items: [
            { label: 'الأبناء', icon: 'i-heroicons-users', to: '/dashboard/kids' },
            { label: 'الكورسات', icon: 'i-heroicons-academic-cap', to: '/dashboard/courses' },
            { label: 'التسجيلات', icon: 'i-heroicons-clipboard-document-check', to: '/dashboard/enrollments' },
            { label: 'الاشتراكات', icon: 'i-heroicons-credit-card', to: '/dashboard/subscriptions' }
          ]
        },
        {
          title: 'الحساب',
          items: [
            { label: 'الملف الشخصي', icon: 'i-heroicons-user-circle', to: '/dashboard/profile' },
            { label: 'الأجهزة', icon: 'i-heroicons-device-phone-mobile', to: '/dashboard/devices' },
            { label: 'سجل المدفوعات', icon: 'i-heroicons-receipt-percent', to: '/dashboard/payments' },
            { label: 'رسائل التواصل', icon: 'i-heroicons-chat-bubble-left-right', to: '/dashboard/tickets' },
            { label: 'الإعدادات', icon: 'i-heroicons-cog-6-tooth', to: '/dashboard/settings' }
          ]
        }
      ]
    }

    const sections: NavSection[] = [home]

    if (authStore.isStudent) {
      sections.push({
        title: 'التعلم',
        items: [
          { label: 'الخطة الدراسية', icon: 'i-heroicons-calendar-days', to: '/dashboard/plan' },
          { label: 'بنك الأسئلة', icon: 'i-heroicons-clipboard-document-list', to: '/dashboard/question-bank' },
          { label: 'صفحة المراجعة', icon: 'i-heroicons-book-open', to: '/dashboard/revision' },
          { label: 'الاختبارات', icon: 'i-heroicons-document-text', to: '/dashboard/practice-exams' },
          { label: 'اختباراتي الذاتية', icon: 'i-heroicons-puzzle-piece', to: '/dashboard/quizzes' },
          { label: 'مراجعة الأخطاء', icon: 'i-heroicons-arrow-path-rounded-square', to: '/dashboard/review' },
          { label: 'تحليل الأداء', icon: 'i-heroicons-chart-bar', to: '/dashboard/performance' },
          { label: 'المتصدرين', icon: 'i-heroicons-trophy', to: '/dashboard/leaderboard' },
          { label: 'سجل النقاط', icon: 'i-heroicons-sparkles', to: '/dashboard/points' }
        ]
      })
      sections.push({
        title: 'الكورسات',
        items: [
          { label: 'الكورسات', icon: 'i-heroicons-academic-cap', to: '/dashboard/courses' },
          { label: 'تسجيلاتي', icon: 'i-heroicons-clipboard-document-check', to: '/dashboard/enrollments' },
          { label: 'الاشتراكات', icon: 'i-heroicons-credit-card', to: '/dashboard/subscriptions' }
        ]
      })
    }

    if (authStore.isSchool) {
      return [
        home,
        {
          items: [
            { label: 'الطلاب', icon: 'i-heroicons-users', to: '/dashboard/students' },
            { label: 'الكورسات', icon: 'i-heroicons-academic-cap', to: '/dashboard/courses' },
            { label: 'التسجيلات', icon: 'i-heroicons-clipboard-document-check', to: '/dashboard/enrollments' },
            { label: 'الاشتراكات', icon: 'i-heroicons-credit-card', to: '/dashboard/subscriptions' }
          ]
        },
        {
          title: 'الحساب',
          items: [
            { label: 'الملف الشخصي', icon: 'i-heroicons-user-circle', to: '/dashboard/profile' },
            { label: 'الأجهزة', icon: 'i-heroicons-device-phone-mobile', to: '/dashboard/devices' },
            { label: 'سجل المدفوعات', icon: 'i-heroicons-receipt-percent', to: '/dashboard/payments' },
            { label: 'رسائل التواصل', icon: 'i-heroicons-chat-bubble-left-right', to: '/dashboard/tickets' },
            { label: 'الإعدادات', icon: 'i-heroicons-cog-6-tooth', to: '/dashboard/settings' }
          ]
        }
      ]
    }

    sections.push({
      title: 'الحساب',
      items: [
        { label: 'الملف الشخصي', icon: 'i-heroicons-user-circle', to: '/dashboard/profile' },
        { label: 'الأجهزة', icon: 'i-heroicons-device-phone-mobile', to: '/dashboard/devices' },
        { label: 'سجل المدفوعات', icon: 'i-heroicons-receipt-percent', to: '/dashboard/payments' },
        { label: 'رسائل التواصل', icon: 'i-heroicons-chat-bubble-left-right', to: '/dashboard/tickets' },
        { label: 'الإعدادات', icon: 'i-heroicons-cog-6-tooth', to: '/dashboard/settings' }
      ]
    })

    return sections
  })
}

export const useDashboardSidebar = () => {
  const collapsed = useLocalStorage('aplus-sidebar-collapsed', false)
  const mobileOpen = useState('aplus-sidebar-mobile-open', () => false)
  return { collapsed, mobileOpen }
}

export const useDashboardActiveItem = () => {
  const route = useRoute()
  const sections = useDashboardNav()

  const allItems = computed(() => sections.value.flatMap(s => s.items))

  const activePath = computed(() => {
    const matches = allItems.value
      .filter(item => item.to === route.path || route.path.startsWith(item.to + '/'))
      .sort((a, b) => b.to.length - a.to.length)
    return matches[0]?.to ?? null
  })

  const activeItem = computed(() => allItems.value.find(i => i.to === activePath.value) ?? null)

  return { activePath, activeItem }
}
