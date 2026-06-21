import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
})

export const passwordChangeSchema = z.object({
  old_password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف')
})

export type ProfileInput = z.output<typeof profileSchema>
export type PasswordChangeInput = z.output<typeof passwordChangeSchema>
