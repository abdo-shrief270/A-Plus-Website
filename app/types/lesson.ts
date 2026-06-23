export type LessonStatus = 'pending' | 'in_progress' | 'completed'
export type LessonPageType = 'text' | 'image' | 'question' | 'mixed'

export interface LessonQuestionAnswer {
  id: number
  text: string
  image_path?: string | null
  order: number
}

export interface LessonPageQuestion {
  id: number
  text: string
  difficulty: string
  explanation: { text: string | null, video_url: string | null }
  answers: LessonQuestionAnswer[]
}

export interface LessonPage {
  id: number
  page_number: number
  type: LessonPageType
  title: string
  is_required: boolean
  // Shape depends on type:
  //  text:     { body }
  //  image:    { image_url, caption }
  //  question: { instructions, question }
  //  mixed:    { sections: [{ type, content }] }
  content: Record<string, unknown> & {
    body?: string
    image_url?: string
    caption?: string
    instructions?: string | null
    question?: LessonPageQuestion | null
    sections?: { type: string, content: string }[]
  }
}

export interface LessonProgress {
  status: LessonStatus
  scheduled_date: string | null
  started_at: string | null
  completed_at: string | null
  time_spent_minutes: number | null
}

export interface Lesson {
  id: number
  exam_id: number
  title: string
  description: string | null
  logo: string | null
  color: string | null
  order: number
  duration_minutes: number | null
  pages_count?: number
  pages?: LessonPage[]
  progress?: LessonProgress | null
}

export interface StudyPlanLesson {
  progress_id: number
  lesson_id: number
  title: string
  description: string | null
  logo: string | null
  color: string | null
  duration_minutes: number | null
  status: LessonStatus
  is_locked: boolean
  started_at: string | null
  completed_at: string | null
}

export interface StudyPlanDay {
  date: string
  is_today: boolean
  is_past: boolean
  is_locked: boolean
  lessons: StudyPlanLesson[]
}

export interface StudyPlanWeek {
  week_number: number | null
  label: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  total_lessons: number
  completed_lessons: number
  days: StudyPlanDay[]
}

export interface StudyPlanSummary {
  total_lessons: number
  completed: number
  in_progress: number
  pending: number
  due_today: number
  overdue: number
  completion_percentage: number
  days_until_exam: number | null
}

export interface StudyPlan {
  available: boolean
  reason?: string
  message?: string
  summary?: StudyPlanSummary
  // `days` now carries the week-grouped structure (weeks → days → lessons).
  days?: StudyPlanWeek[]
}
