export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  avatar?: string
  lang: 'ar' | 'en'
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export interface LoginPayload {
  email?: string
  username?: string
  password: string
  remember_me?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
  message?: string
}
