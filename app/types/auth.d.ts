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
  [key: string]: string | number | boolean | undefined | null
}

export interface LoginPayload {
  username: string
  password: string
  device_id: string
}

export interface RegisterPayload {
  name: string
  email: string
  country_code: string
  phone: string
  password: string
  password_confirmation: string
  gender: 'male' | 'female'
  device_id: string
  role?: 'student' | 'parent' | 'teacher'
}

export interface StudentRegisterPayload extends RegisterPayload {
  user_name: string
  exam_id: number
  exam_date: string
  role: 'student'
}

export interface ParentRegisterPayload extends RegisterPayload {
  role: 'parent'
}

export interface CheckUsernamePayload {
  user_name: string
}

export interface AuthResponse {
  user: User
  token: string
  message?: string
}
