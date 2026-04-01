export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  data: T[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>

export interface Exam {
  id: number
  title?: string
  name?: string
  description?: string
  image_path?: string
  subjects_count?: number
  sections_count?: number
  type?: string
  year?: string | number
  created_at?: string
  updated_at?: string
}

export interface Section {
  id: number
  name: string
  exam_id: number
  parent_id?: number | null
  categories?: Category[]
  children?: Section[]
}

export interface Category {
  id: number
  name: string
  description?: string
  image_path?: string
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
  difficulty: 'easy' | 'medium' | 'hard'
  is_new?: boolean
  image_path?: string | null
  comparison?: {
    value_1: { text: string, image_path: string | null }
    value_2: { text: string, image_path: string | null }
  } | null
  explanation?: {
    text: string
    image_path?: string | null
    video_url?: string | null
  }
  answers: Answer[]
  belongs_to?: {
    exam?: { id: number, name: string }
    section?: { id: number, name: string }
    category?: { id: number, name: string }
    article?: { id: number, title: string } | null
  } | null
  type: {
    id: number
    name: string
  }
  category_id?: number
  subject_id?: number
}

export interface QuestionSubmissionResult {
  is_correct: boolean
  score_earned: number
  correct_answer?: Answer
}

export interface Article {
  id: number
  title: string
  content: string
  image_path?: string | null
  created_at?: string
}

export interface PracticeExam {
  id: number
  title: string
  description?: string
  time_limit?: number // in minutes
  questions_count?: number
  questions?: Question[]
}

export interface Course {
  id: number
  title: string
  slug: string
  description?: string
  price: number
  sale_price?: number
  image_path?: string
  is_enrolled?: boolean
}
