import { z } from 'zod'

type Translator = (key: string, params?: Record<string, unknown>) => string

/** Login flow — built as factories so error messages can be localized via the i18n translator. */
export function buildUsernameSchema(t: Translator) {
  return z.object({
    user_name: z.string().min(1, t('validation.required', { field: t('login.username') }))
  })
}

export function buildPasswordSchema(t: Translator) {
  return z.object({
    password: z.string().min(1, t('validation.required', { field: t('login.password') }))
  })
}

export const otpSchema = z.object({
  otp: z.string().min(6, 'رمز التحقق يجب أن يكون 6 أرقام على الأقل')
})

export type UsernameInput = z.output<ReturnType<typeof buildUsernameSchema>>
export type PasswordInput = z.output<ReturnType<typeof buildPasswordSchema>>
export type OtpInput = z.output<typeof otpSchema>

/** Strong-password policy — mirrors the backend (App\Support\PasswordRules). */
export const strongPassword = z.string()
  .min(8, 'كلمة المرور ٨ أحرف على الأقل')
  .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
  .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
  .regex(/\d/, 'يجب أن تحتوي على رقم')
  .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص')

/** Shared base for any user that registers — name, contact, password, gender. */
const baseRegisterShape = {
  name: z.string().min(2, 'الاسم مطلوب'),
  user_name: z.string().min(3, 'اسم المستخدم مطلوب'),
  country_code: z.string().min(1, 'كود الدولة مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  password: strongPassword,
  password_confirmation: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
  gender: z.enum(['male', 'female'], { message: 'الجنس مطلوب' })
}

const passwordsMatch = {
  message: 'كلمات المرور غير متطابقة',
  path: ['password_confirmation' as const]
}

export const parentRegisterSchema = z
  .object(baseRegisterShape)
  .refine(d => d.password === d.password_confirmation, passwordsMatch)

export const studentRegisterSchema = z
  .object({
    ...baseRegisterShape,
    exam_id: z.number({ message: 'الاختبار مطلوب' }),
    exam_date: z.any().refine(val => !!val, 'تاريخ الاختبار مطلوب')
  })
  .refine(d => d.password === d.password_confirmation, passwordsMatch)

export type ParentRegisterInput = z.output<typeof parentRegisterSchema>
export type StudentRegisterInput = z.output<typeof studentRegisterSchema>
