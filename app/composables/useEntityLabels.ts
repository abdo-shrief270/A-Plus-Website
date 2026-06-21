/**
 * Role-aware Arabic labels for the "kid"/"student" entity.
 * - Parent role refers to their children as أبناء / ابن.
 * - School role refers to them as طلاب / طالب.
 *
 * Used by shared modals (Add / Edit / Import / Enroll / Subscribe) and the
 * mirrored students/kids pages so the same components render correct wording
 * for each role without duplication.
 */
import { useAuthStore } from '@/stores/auth'

export interface EntityLabels {
  singular: string
  plural: string
  myPlural: string
  yourPlural: string
  one: string
  hisFor: string
  addAction: string
  importAction: string
  detailRoot: string
}

export const useEntityLabels = () => {
  const authStore = useAuthStore()

  return computed<EntityLabels>(() => {
    if (authStore.isSchool) {
      return {
        singular: 'طالب',
        plural: 'طلاب',
        myPlural: 'طلابي',
        yourPlural: 'طلابك',
        one: 'الطالب',
        hisFor: 'الطالب',
        addAction: 'إضافة طالب',
        importAction: 'استيراد طلاب',
        detailRoot: '/dashboard/students'
      }
    }
    return {
      singular: 'ابن',
      plural: 'أبناء',
      myPlural: 'أبنائي',
      yourPlural: 'أبنائك',
      one: 'الابن',
      hisFor: 'ابنك',
      addAction: 'إضافة ابن',
      importAction: 'استيراد قائمة أبناء',
      detailRoot: '/dashboard/kids'
    }
  })
}
