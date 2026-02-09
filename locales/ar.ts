import common from './ar/common.json'
import index from './ar/index.json'
import contact from './ar/contact.json'
import login from './ar/login.json'
import signup from './ar/signup.json'
import privacy_policy from './ar/privacy_policy.json'
import terms_conditions from './ar/terms_conditions.json'
import blog from './ar/blog.json'
import blog_details from './ar/blog_details.json'
import solutions_whatsapp from './ar/solutions_whatsapp.json'
import solutions_sms from './ar/solutions_sms.json'
import solutions_otp from './ar/solutions_otp.json'
import solutions_crm from './ar/solutions_crm.json'
import solutions_live_chat from './ar/solutions_live_chat.json'
import book_demo from './ar/book_demo.json'

import layout from './ar/layout.json'

export default defineI18nLocale(async () => {
  return {
    common,
    index,
    contact,
    login,
    signup,
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
