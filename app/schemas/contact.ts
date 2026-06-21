import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يحتوي على حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().min(8, 'رقم الجوال مطلوب').max(20, 'رقم الهاتف طويل جداً'),
  subject: z.string().min(2, 'يرجى تحديد الموضوع'),
  message: z.string().min(10, 'النص قصير جداً. يرجى كتابة 10 أحرف على الأقل بوضوح')
})

export type ContactInput = z.output<typeof contactSchema>
