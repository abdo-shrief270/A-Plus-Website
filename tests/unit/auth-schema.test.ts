import { describe, it, expect } from 'vitest'
import {
  parentRegisterSchema,
  studentRegisterSchema,
  otpSchema,
  buildUsernameSchema
} from '@/schemas/auth'

const validParent = {
  name: 'أحمد',
  user_name: 'ahmed_99',
  country_code: '+966',
  phone: '0512345678',
  email: '',
  password: 'password123',
  password_confirmation: 'password123',
  gender: 'male' as const
}

describe('parentRegisterSchema', () => {
  it('accepts a valid parent payload (email optional/empty allowed)', () => {
    expect(parentRegisterSchema.safeParse(validParent).success).toBe(true)
  })

  it('rejects mismatched password confirmation', () => {
    const res = parentRegisterSchema.safeParse({ ...validParent, password_confirmation: 'different1' })
    expect(res.success).toBe(false)
    expect(JSON.stringify(res.error?.issues)).toContain('غير متطابقة')
  })

  it('rejects an invalid email', () => {
    expect(parentRegisterSchema.safeParse({ ...validParent, email: 'nope' }).success).toBe(false)
  })

  it('rejects a too-short password', () => {
    const short = { ...validParent, password: '123', password_confirmation: '123' }
    expect(parentRegisterSchema.safeParse(short).success).toBe(false)
  })
})

describe('studentRegisterSchema', () => {
  it('requires exam_id (number) and exam_date', () => {
    const ok = studentRegisterSchema.safeParse({ ...validParent, exam_id: 1, exam_date: '2026-07-01' })
    expect(ok.success).toBe(true)
    const noExam = studentRegisterSchema.safeParse({ ...validParent, exam_date: '2026-07-01' })
    expect(noExam.success).toBe(false)
  })
})

describe('otpSchema', () => {
  it('requires at least 6 characters', () => {
    expect(otpSchema.safeParse({ otp: '123456' }).success).toBe(true)
    expect(otpSchema.safeParse({ otp: '123' }).success).toBe(false)
  })
})

describe('buildUsernameSchema', () => {
  it('uses the translator for the required message', () => {
    const t = (key: string) => `tr:${key}`
    const res = buildUsernameSchema(t).safeParse({ user_name: '' })
    expect(res.success).toBe(false)
    expect(JSON.stringify(res.error?.issues)).toContain('tr:validation.required')
  })
})
