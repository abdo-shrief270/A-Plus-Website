### Auth
- `POST /v2/auth/username/check` : Check Username Availability
- `POST /v2/auth/register/student` : Register Student
- `POST /v2/auth/register/parent` : Register Parent
- `POST /v2/auth/login/check` : Pre-Login Check (التحقق قبل تسجيل الدخول)
- `POST /v2/auth/login` : Login Authentication (تسجيل الدخول)
- `POST /v2/auth/otp/send` : Send OTP Code (إرسال رمز التحقق)
- `POST /v2/auth/otp/verify` : Verify OTP Code (التحقق من رمز OTP)
- `POST /v2/auth/password/reset` : Reset Password Init (بدء استرجاع كلمة المرور)
- `POST /v2/auth/password/change` : Change Password After OTP (تغيير كلمة المرور الجديدة)
- `GET /v2/auth/me` : Get Current Profile (حسابي)
- `POST /v2/auth/profile` : Update Profile (تحديث الملف الشخصي)
- `POST /v2/auth/logout` : Logout Securely (تسجيل الخروج)
- `GET /v2/auth/devices` : Get Registered Devices (أجهزتي المعرفة)
- `POST /v2/auth/devices/{deviceId}` : Revoke / Remove Device (حذف جهاز نشط)

### Contact
- `POST /v2/contact` : Submit Contact Form (نموذج اتصل بنا)

### Enrollment
- `GET /v2/enrollments` : Get Enrollments List (قائمة الاشتراكات بالدورات)

### Exam
- `GET /v2/exams` : Get All Exams (قائمة الامتحانات/المراحل الدراسية)
- `GET /v2/exams/{exam}` : Get Exam Details (تفاصيل الامتحان/المرحلة)
- `GET /v2/exams/{exam}/subjects` : Get Exam Subjects (المواد التابعة للامتحان)
- `GET /v2/exams/{exam}/sections` : Get Exam Sections (أقسام الامتحان)

### PracticeExam
- `GET /v2/practice-exams` : Get Practice Exams (نماذج الامتحانات والاختبارات التجريبية)
- `GET /v2/practice-exams/{practiceExam}` : Get Practice Exam Details (تفاصيل النموذج التجريبي وأسئلته)

### Question
- `GET /v2/questions/trending` : Get Trending Questions (الأسئلة الشائعة والأكثر حلاً)
- `GET /v2/questions/recent` : Get Recent Questions (أحدث الأسئلة المُضافة)
- `GET /v2/questions/search` : Search Questions (البحث في بنك الأسئلة)
- `GET /v2/questions/{question}` : Get Question Details (تفاصيل السؤال)
- `GET /v2/subjects/{subject}/questions` : Get Questions by Subject (أسئلة مادة معينة)
- `GET /v2/categories/{category}/questions` : Get Questions by Category (أسئلة تصنيف فرعي)

### Setting
- `GET /v2/settings` : Get Settings (إعدادات المنصة)
- `GET /v2/settings/groups` : Get Setting Groups (مجموعات الإعدادات)
- `GET /v2/settings/{key}` : Get Specific Setting (جلب إعداد بعينه)

### Stats
- `GET /v2/stats` : Get Platform Statistics (إحصائيات المنصة)

### Student
- `GET /v2/students` : List Students (قائمة الطلاب)
- `GET /v2/students/{student}` : Get Student Profile (بيانات الطالب)
- `PUT /v2/students/{student}` : Update Student Profile (تعديل بيانات الطالب)
- `DELETE /v2/students/{student}` : Request Student Deletion (طلب حذف حساب طالب)

### StudentImport
- `POST /v2/students` : Create Single Student (إضافة حساب طالب واحد)
- `POST /v2/students/bulk` : Bulk Create Students (JOSN) (إضافة مجموعة طلاب كبيانات JSON)
- `POST /v2/students/import` : Import Students from Excel/CSV (استيراد الطلاب من ملفات الجداول)

### StudentStats
- `GET /v2/student-stats` : Get Student Statistics Charts (رسوم بيانية لتقدم الطلاب)

### TrendingCourse
- `GET /v2/trending-courses` : Get Trending Courses (الدورات الأكثر إقبالاً)

### الأسئلة والإجابات (Questions & Answers)
- `POST /v2/questions/answer` : Submit Question Answer (إرسال إجابة السؤال)

