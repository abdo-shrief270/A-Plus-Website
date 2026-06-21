export type QuizMode = 'tutor' | 'exam'
export type QuizSource = 'random' | 'unanswered' | 'wrong' | 'bookmarked'
export type QuizDifficulty = 'easy' | 'medium' | 'hard'
export type QuizStatus = 'in_progress' | 'completed' | 'expired' | 'abandoned'

export interface QuizAnswerOption {
  id: number
  text: string
  image_path?: string | null
  order?: number
}

export interface QuizQuestion {
  id: number
  text: string
  difficulty: QuizDifficulty
  comparison?: {
    value_1: { text: string | null, image: string | null }
    value_2: { text: string | null, image: string | null }
  } | null
  type?: { id: number, name: string } | null
  answers: QuizAnswerOption[]
}

export interface QuizSessionQuestion {
  order: number
  chosen_answer_id: number | null
  answered_at: string | null
  question: QuizQuestion
  // Present only when revealed (session finalized, or tutor mode + answered)
  is_correct?: boolean | null
  correct_answer_id?: number | null
  explanation?: { text: string | null, video_url: string | null }
}

export interface QuizScopeItem {
  id: number
  name: string
}

export interface QuizSession {
  id: number
  mode: QuizMode
  source: QuizSource
  difficulty: QuizDifficulty | null
  question_count: number
  time_limit_seconds: number | null
  status: QuizStatus
  is_daily_challenge?: boolean
  is_simulation?: boolean
  practice_exam?: { id: number, title: string | null } | null
  challenge_id?: number | null
  challenge_code?: string | null
  correct_count: number
  incorrect_count: number
  skipped_count: number
  score_percent: number | null
  answered_count: number
  remaining_seconds: number | null
  started_at: string
  deadline_at: string | null
  completed_at: string | null
  scope: {
    sections: QuizScopeItem[]
    categories: QuizScopeItem[]
  }
  questions?: QuizSessionQuestion[]
  section_breakdown?: QuizSectionBreakdown[]
}

export interface QuizSectionBreakdown {
  section_id: number
  name: string
  total: number
  correct: number
  accuracy: number
}

export interface QuizConfig {
  mode: QuizMode
  source: QuizSource
  section_ids?: number[]
  category_ids?: number[]
  question_count: number
  time_limit_minutes?: number | null
  difficulty?: QuizDifficulty | null
}

export interface QuizTutorFeedback {
  is_correct: boolean
  correct_answer_id: number | null
  explanation: { text: string | null, video_url: string | null }
  answered_count: number
}

export interface DailyChallengeStatus {
  today: QuizSession | null
  streak: number
  bonus: { base: number, excellent: number, excellent_threshold: number }
  config: { question_count: number, time_limit_minutes: number }
}
