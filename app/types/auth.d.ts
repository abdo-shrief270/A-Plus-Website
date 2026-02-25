export interface User {
  id: number
  name: string
  user_name: string
  email?: string
  phone?: string
  type: 'student' | 'parent' | 'school'
  gender?: 'male' | 'female'
  avatar?: string
  two_factor_enabled?: boolean
  lang?: string
  student?: StudentData
  [key: string]: any
}

export interface StudentData {
  id_number?: string
  exam_id?: number
  exam_date?: string
}

export interface LoginPayload {
  user_name: string
  password: string
}

export interface RegisterStudentPayload {
  name: string
  user_name: string
  country_code: string
  phone: string
  email?: string
  password: string
  gender: 'male' | 'female'
  exam_id: number
  exam_date: string
  id_number: string
}

export interface RegisterParentPayload {
  name: string
  user_name: string
  country_code: string
  phone: string
  email?: string
  password: string
  gender: 'male' | 'female'
}

export interface AuthResponse {
  data: {
    token: string
    user: User
  }
  message?: string
  status?: number
}
