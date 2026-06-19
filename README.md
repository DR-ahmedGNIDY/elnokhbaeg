# مؤسسة النخبة للعلوم الصينية — منصة تعليمية متكاملة

منصة Full-Stack احترافية (Production Ready) لمؤسسة تعليمية متخصصة في الطب والعلوم الصينية،
تشمل الموقع العام، لوحة الطالب، ولوحة إدارة كاملة — مبنية بالكامل ومربوطة بقاعدة البيانات.

## التقنيات

| الطبقة | التقنية |
| --- | --- |
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn-style UI |
| Backend | Next.js API Routes + Server Components |
| Database | MongoDB + Mongoose |
| Auth | Auth.js (NextAuth v5) — Credentials + Google OAuth · RBAC |
| Storage | Cloudinary (صور + فيديوهات الدروس) |
| Validation | Zod | 
| Forms | React Hook Form |
| Tables | TanStack Table |
| State | Zustand |
| Excel | SheetJS (xlsx) |

## المعمارية

```
src/
├── app/
│   ├── (public)/        # الموقع العام (RTL، تصميم Desktop/Mobile مستقل)
│   ├── (auth)/          # تسجيل الدخول/إنشاء حساب/استعادة كلمة المرور
│   ├── (dashboard)/     # لوحة الطالب
│   ├── (admin)/         # لوحة الإدارة (محمية: Admin فقط)
│   ├── (learn)/         # مشغّل الدروس (محمي + تحقق صلاحية لكل درس)
│   └── api/             # REST APIs (auth, admin CRUD, enroll, verify…)
├── components/          # UI primitives + مكوّنات مشتركة + Managers
├── models/              # Mongoose Schemas
├── lib/                 # db, auth, cloudinary, validations, data fetchers
├── store/               # Zustand (toasts)
└── middleware.ts        # حماية المسارات حسب الصلاحية (Edge)
```

### قاعدة البيانات (Collections)
`Users` · `Courses` · `CourseLessons` · `Articles` · `Instructors` ·
`ApprovedStudents` · `Enrollments` · `Settings` · `Counter` (لتوليد أكواد NOK).

## الإعداد

### 1) المتطلبات
- Node.js ≥ 18
- حساب MongoDB (محلي أو Atlas)
- حساب Cloudinary
- (اختياري) Google OAuth Client + SMTP لإعادة تعيين كلمة المرور

### 2) متغيّرات البيئة
انسخ `.env.example` إلى `.env` واملأ القيم:

```bash
cp .env.example .env
```

| المتغيّر | الوصف |
| --- | --- |
| `MONGODB_URI` | رابط الاتصال بـ MongoDB |
| `AUTH_SECRET` | مفتاح عشوائي طويل (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | بيانات Google OAuth |
| `CLOUDINARY_*` | بيانات Cloudinary (API key/secret/cloud name) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | اسم الـ cloud (عام) |
| `SMTP_*` | بيانات إرسال البريد (إعادة تعيين كلمة المرور / التواصل) |
| `SEED_ADMIN_*` | بيانات حساب المشرف الأولي |

> ملاحظة: في إعداد Google OAuth، أضف Redirect URI:
> `http://localhost:3000/api/auth/callback/google`

### 3) التثبيت والتشغيل
```bash
npm install --legacy-peer-deps
npm run seed:admin     # إنشاء حساب المشرف الأولي
npm run dev            # http://localhost:3000
```

### 4) الإنتاج
```bash
npm run build
npm run start
```

## الميزات الرئيسية

### الموقع العام
- صفحة رئيسية بتصميمين مستقلين (Desktop / Mobile) بنفس الهوية البصرية.
- الدورات المميزة تُسحب تلقائياً من قاعدة البيانات (خيار Featured).
- صفحات: من نحن، الدورات، تفاصيل الدورة، المحاضرون، المقالات، التواصل.
- **التحقق من الاعتماد** بالكود فقط (مثل `NOK00001`) مع بطاقة نتيجة احترافية.

### الحسابات والصلاحيات
- تسجيل بالبريد + Google OAuth، استعادة كلمة المرور، RBAC (Admin/Student).
- حماية المسارات عبر `middleware.ts` (Edge) + حُرّاس على مستوى الصفحة.

### نظام الفيديو (محمي بالكامل)
- لا يشاهد الزائر أي فيديو إطلاقاً (يُحوّل لتسجيل الدخول).
- المستخدم المسجّل يشاهد الدرس المجاني فقط؛ المشترك يشاهد كل الدروس.
- روابط الفيديو لا تُسرّب للدروس المغلقة (تُحجب من الخادم).

### لوحة الإدارة
- إدارة الدورات + الدروس (رفع فيديو، ترتيب، درس مجاني).
- إدارة المقالات والمحاضرين.
- إدارة المستخدمين: إحصائيات، فلاتر، بحث، تعديل الدور/الحالة، حذف، **تصدير Excel**.
- الطلاب المعتمدون: توليد كود تلقائي `NOK`, بحث، نسخ الكود، **تصدير Excel**.
- الإعدادات: تحرير محتوى «من نحن» وبيانات التواصل.

### لوحة الطالب
- الملف الشخصي، دوراتي، متابعة التعلّم (نسبة الإكمال)، إعدادات الحساب.

## ملاحظات
- يبدأ الموقع **فارغاً تماماً** — كل البيانات تُضاف من لوحة الإدارة (لا توجد بيانات وهمية).
- الشعار الرسمي مدمج في `public/logo.png` (نسخة داكنة) و`public/logo-light.png`
  (نسخة فاتحة للخلفيات الداكنة)، وتُعرض عبر مكوّن `LogoMark`/`Logo`. أيقونات
  المتصفح وُلِّدت منه: `src/app/favicon.ico` و`icon.png` و`apple-icon.png`
  و`public/icon-192/512.png` (manifest). لتحديث الشعار مستقبلاً، استبدل الملفات
  وأعد توليد الأيقونات بنفس المقاسات.
- جميع الوسائط (صور/فيديوهات) تُرفع إلى Cloudinary وتُخزَّن روابطها في MongoDB.
