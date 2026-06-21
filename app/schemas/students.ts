import { z } from 'zod'

export const studentCreateSchema = z.object({
  name: z.string().min(2),
  user_name: z.string().min(3),
  country_code: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(8),
  gender: z.enum(['male', 'female']),
  id_number: z.string().min(5),
  exam_id: z.number(),
  exam_date: z.string().min(1)
})

export const studentUpdateSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  parent_phone: z.string().min(8, 'رقم ولي الأمر متطلب ضروري'),
  exam_id: z.number().nullable(),
  admin_notes: z.string().optional()
})

export type StudentCreateInput = z.output<typeof studentCreateSchema>
export type StudentUpdateInput = z.output<typeof studentUpdateSchema>
