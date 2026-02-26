export interface User {
  id: number
  name: string
  user_name: string
  email?: string
  phone?: string
  type: 'student' | 'parent' | 'school'
  gender?: 'male' | 'female'
  avatar?: string
  lang: 'ar' | 'en'
  created_at?: string
  updated_at?: string
  [key: string]: string | number | boolean | undefined | null
}

export interface StudentData {
  id_number?: string
  exam_id?: number
  exam_date?: string
}

export interface LoginPayload {
  user_name: string
  password?: string
  device_id: string
}

export interface LoginCheckResponse {
  data: {
    exists: boolean
    has_2fa: boolean
    phone?: string
    email?: string
  }
  message?: string
  status?: number
}

export interface SendOtpPayload {
  user_name?: string
  email?: string
  phone?: string
  country_code?: string
  method: 'email' | 'sms' | 'whatsapp'
}

export interface VerifyOtpPayload {
  token: string
  otp: string
  type: 'login' | 'reset'
}

export interface RegisterParentPayload {
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
  data: {
    token?: string
    user?: User
    requires_2fa?: boolean
  }
  message?: string
  status?: number
}
