import common from './en/common.json'
import index from './en/index.json'
import contact from './en/contact.json'
import login from './en/login.json'
import signup from './en/signup.json'
import validation from './en/validation.json'
import privacy_policy from './en/privacy_policy.json'
import terms_conditions from './en/terms_conditions.json'
import blog from './en/blog.json'
import blog_details from './en/blog_details.json'
import solutions_whatsapp from './en/solutions_whatsapp.json'
import solutions_sms from './en/solutions_sms.json'
import solutions_otp from './en/solutions_otp.json'
import solutions_crm from './en/solutions_crm.json'
import solutions_live_chat from './en/solutions_live_chat.json'
import book_demo from './en/book_demo.json'

import layout from './en/layout.json'

export default defineI18nLocale(async () => {
  return {
    common,
    index,
    contact,
    login,
    signup,
    validation,
    privacy_policy,
    terms_conditions,
    blog,
    blog_details,
    solutions_whatsapp,
    solutions_sms,
    solutions_otp,
    solutions_crm,
    solutions_live_chat,
    book_demo,
    layout
  }
})
