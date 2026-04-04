export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedData<T> {
  data: T[]
  pagination: Pagination
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>

export interface Exam {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  is_active?: boolean
  sections?: Section[]
}

export interface Section {
  id: number
  name: string
  categories?: Category[]
}

export interface Category {
  id: number
  name: string
  description?: string
  questions_count?: number
}

export interface Answer {
  id: number
  text: string
  image_path?: string | null
  order?: number
}

export interface Question {
  id: number
  text: string
  image_path?: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  is_new: boolean
  comparison?: {
    value_1: { text: string; image_path: string | null }
    value_2: { text: string; image_path: string | null }
  } | null
  explanation: {
    text: string
    image_path: string | null
    video_url: string | null
  }
  answers: Answer[]
  belongs_to?: {
    exam?: { id: number; name: string }
    section?: { id: number; name: string }
    category?: { id: number; name: string }
    article?: { id: number; title: string } | null
  } | null
  type: {
    id: number
    name: string
  }
}

export interface QuestionSubmissionResult {
  is_correct: boolean
  score_earned: number
  correct_answer?: number // ID of the correct answer
}

export interface Article {
  id: number
  title: string
  content: string
  image_path?: string | null
  is_active?: boolean
  questions_count?: number
  category?: {
    id: number
    name: string
    section: {
      id: number
      name: string
      exam: { id: number; name: string }
    }
  }
}

export interface PracticeExam {
  id: number
  title: string
  description?: string
  duration_minutes: number
  total_questions: number
  exam: { id: number; name: string }
  questions?: Question[]
}

export interface Course {
  id: number
  title: string
  slug: string
  description: string
  image: string
  price: string | number
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: string | number
  total_hours: number
  lectures_count: number
  enrollments_count: number
  start_date: string | null
  end_date: string | null
}
