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
  title: string
  exam_id: number
  parent_id?: number | null
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
}

export interface Question {
  id: number
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'multiple_choice' | 'true_false' | 'matching' | 'essay'
  answers: Answer[]
  explanation?: string | null
  image_path?: string | null
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
