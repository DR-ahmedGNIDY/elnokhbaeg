# تقرير التدقيق الأمني وجاهزية الإنتاج — مؤسسة النخبة للعلوم الصينية

تاريخ التدقيق: 2026‑06‑19 · الفرع: `main` · المستودع: `DR-ahmedGNIDY/elnokhbaeg`

---

## 0) نتيجة فحص الأسرار (Secret Scan)

تم فحص **جميع الملفات المتعقَّبة في git** (ما سيُنشر علناً) بحثاً عن أي أسرار:

| الفحص | الأمر | النتيجة |
| --- | --- | --- |
| ملفات البيئة المرفوعة | `git ls-files | grep .env` | `.env.example` فقط (قيم وهمية) ✅ |
| هل `.env` متعقَّب؟ | `git ls-files --error-unmatch .env` | غير متعقَّب — لن يُرفع ✅ |
| قيم Cloudinary/Mongo/Google الحقيقية | `git grep <secret-values>` | **لا مطابقات** ✅ |
| سلاسل اتصال بكلمات مرور | `git grep "mongodb.*://.*:.*@"` | **لا مطابقات** ✅ |
| مفاتيح Google (`AIza…`, `GOCSPX-…`) | `git grep` | **لا مطابقات** ✅ |
| إسنادات سرّية مكتوبة يدوياً | `git grep "(secret|password)=…"` | **لا مطابقات** ✅ |
| مفاتيح خاصة / PEM | `git grep "BEGIN"` | **لا مطابقات** ✅ |

**الخلاصة:** لا توجد أي أسرار، مفاتيح API، بيانات Cloudinary، أسرار Google OAuth، أو بيانات MongoDB
مكتوبة في الكود أو مرفوعة إلى المستودع. جميع الأسرار تُقرأ حصراً من `process.env`
(انظر `src/lib/env.ts`، `src/lib/cloudinary.ts`، `src/auth.config.ts`).

> القيمة العامة الوحيدة المخصّصة للعميل هي `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
> (اسم الـ cloud) — وهي **ليست سرّاً** بطبيعتها. أما `CLOUDINARY_API_SECRET` فلا
> يصل إلى المتصفح إطلاقاً (يُستخدم فقط على الخادم للتوقيع).

---

## 1) ملف `.env.example` النهائي

```
# ─── Database ───────────────────────────────────────────────
MONGODB_URI="mongodb://127.0.0.1:27017/elite-chinese-sciences"

# ─── Auth.js (NextAuth) ─────────────────────────────────────
AUTH_SECRET="change-me-to-a-long-random-string"   # openssl rand -base64 32
AUTH_URL="http://localhost:3000"                   # prod: https://nokhbaeg.com
NEXTAUTH_URL="http://localhost:3000"               # prod: https://nokhbaeg.com
AUTH_TRUST_HOST="true"

# ─── Google OAuth ───────────────────────────────────────────
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# ─── Cloudinary ─────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"            # server-only, never public
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# ─── SMTP (password reset / contact) ────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="مؤسسة النخبة <no-reply@nokhbaeg.com>"

# ─── Bootstrap admin (npm run seed:admin) ───────────────────
SEED_ADMIN_NAME="مدير المؤسسة"
SEED_ADMIN_EMAIL="admin@nokhbaeg.com"
SEED_ADMIN_PASSWORD="ChangeMe123!"                 # غيّرها بعد أول دخول
```

---

## 2) قائمة التحقق الأمني (Security Checklist)

| # | البند | الحالة | المرجع |
| --- | --- | --- | --- |
| 1 | لا أسرار في الكود أو git | ✅ | فحص القسم 0 |
| 2 | `.env` ضمن `.gitignore` | ✅ | `.gitignore` |
| 3 | كلمات المرور مشفّرة bcrypt (12 rounds) | ✅ | `src/lib/password.ts` |
| 4 | `password` بـ `select:false` (لا يُسترجع افتراضياً) | ✅ | `src/models/User.ts` |
| 5 | رموز إعادة التعيين مخزّنة كـ SHA‑256 hash + صلاحية ساعة | ✅ | `password.ts`, `forgot/reset routes` |
| 6 | جلسات JWT موقَّعة بـ `AUTH_SECRET` | ✅ | `src/auth.config.ts` |
| 7 | RBAC (Admin/Student) على الـ middleware + الصفحات + الـ API | ✅ | `middleware.ts`, `lib/session.ts`, `lib/api.ts` |
| 8 | حماية الفيديو من الخادم (حذف الرابط للدروس المغلقة) | ✅ | `src/lib/data/learn.ts` |
| 9 | التحقق من المدخلات بـ Zod في كل المسارات | ✅ | `src/lib/validations/*` |
| 10 | رفع Cloudinary موقَّع (السر لا يصل للعميل) | ✅ | `lib/cloudinary.ts`, `api/upload/sign` |
| 11 | رؤوس أمان (XFO, nosniff, Referrer-Policy, Permissions-Policy) | ✅ | `next.config.mjs` |
| 12 | `X-Powered-By` معطّل | ✅ | `next.config.mjs` |
| 13 | قيود فريدة تمنع التكرار (email, slug, enrollment) | ✅ | النماذج |
| 14 | الأدمن لا يحذف/يخفّض نفسه | ✅ | `api/admin/users/[id]` |
| 15 | استجابة موحّدة لاستعادة كلمة المرور (عدم كشف وجود البريد) | ✅ | `api/forgot-password` |
| 16 | لا بيانات وهمية / تسريب بيانات حسّاسة في التحقق العام | ✅ | `lib/data/verify.ts` |
| **توصيات قبل الإطلاق** | | | |
| 17 | تغيير كلمة مرور المشرف الافتراضية | ⬜ يدوي | بعد `seed:admin` |
| 18 | `AUTH_SECRET` قيمة عشوائية قوية في الإنتاج | ⬜ يدوي | `.env` الخادم |
| 19 | تقييد MongoDB Atlas Network Access على IP الخادم | ⬜ يدوي | Atlas |
| 20 | تفعيل HTTPS (Let’s Encrypt) | ⬜ يدوي | `DEPLOYMENT.md §4.5` |
| 21 | (اختياري) Rate limiting على مسارات الدخول/التسجيل | ⬜ مقترح | بوابة/Nginx |

---

## 3) قائمة التحقق لنشر الإنتاج (Deployment Checklist)

- [ ] ضبط سجلات DNS: `A @ → SERVER_IP` و`A www → SERVER_IP`.
- [ ] إنشاء `.env` على الخادم من `.env.example` بقيم الإنتاج الحقيقية.
- [ ] `AUTH_URL` و`NEXTAUTH_URL` = `https://nokhbaeg.com` + `AUTH_TRUST_HOST=true`.
- [ ] `AUTH_SECRET` عشوائي (`openssl rand -base64 32`).
- [ ] `MONGODB_URI` يعمل + IP الخادم مضاف في Atlas Network Access.
- [ ] متغيّرات Cloudinary مضبوطة (4 متغيّرات).
- [ ] Google OAuth: redirect URI + JS origin للدومين (انظر §6).
- [ ] `npm install --legacy-peer-deps` ثم `npm run build`.
- [ ] `npm run seed:admin` لإنشاء المشرف، ثم تغيير كلمته.
- [ ] تشغيل عبر PM2 (`pm2 start … && pm2 save && pm2 startup`).
- [ ] Nginx reverse proxy + `client_max_body_size 200M` للفيديوهات.
- [ ] شهادة SSL عبر Certbot (HTTPS فعّال).
- [ ] جدار ناري UFW (OpenSSH + Nginx Full).
- [ ] نسخ احتياطي MongoDB مجدول (cron) — `DEPLOYMENT.md §5`.
- [ ] اختبار: تسجيل/دخول/Google، رفع وسائط، شراء دورة، تشغيل درس، توليد كود NOK، تحقق عام.

---

## 4) تقرير فهارس MongoDB (Indexes Report)

| Collection | الفهرس | النوع | الغرض |
| --- | --- | --- | --- |
| **users** | `email` | فريد + مفهرس | منع تكرار الحسابات + سرعة الدخول |
| | `role`, `status` | مفهرس | فلترة لوحة المستخدمين |
| | `{name, email}` | نصّي (text) | البحث في المستخدمين |
| **courses** | `slug` | فريد + مفهرس | روابط الدورات |
| | `instructor`, `isFeatured`, `isPublished` | مفهرس | الصفحة الرئيسية/الفلاتر |
| | `{title, shortDescription}` | نصّي | البحث |
| **courselessons** | `course` | مفهرس | جلب دروس الدورة |
| | `{course, order}` | مركّب | ترتيب الدروس |
| **articles** | `slug` | فريد + مفهرس | روابط المقالات |
| | `isPublished`, `publishedAt` | مفهرس | القوائم المنشورة |
| | `{title, excerpt}` | نصّي | البحث |
| **instructors** | `slug` | فريد + مفهرس | روابط المحاضرين |
| | `isActive` | مفهرس | العرض العام |
| **approvedstudents** | `code` | فريد + مفهرس | التحقق بالكود (NOK) |
| | `name`, `nationalId` | مفهرس | بحث الإدارة |
| | `{name, nationalId}` | نصّي | البحث |
| **enrollments** | `user`, `course` | مفهرس | استعلامات الاشتراك |
| | `{user, course}` | **مركّب فريد** | منع الاشتراك المكرّر |
| **counters** | `_id` | افتراضي | عدّاد أكواد NOK المتسلسلة |
| **settings** | `_id` (`"site"`) | مستند مفرد | إعدادات الموقع |

> الفهارس تُنشأ تلقائياً عبر Mongoose عند أول اتصال (`autoIndex` مفعّل في التطوير).
> في الإنتاج يُنصح بإنشائها مرة واحدة (Mongoose ينشئها افتراضياً) ومراقبتها عبر Atlas.

---

## 5) تقرير إعداد Cloudinary

| البند | التفصيل |
| --- | --- |
| التهيئة | `src/lib/cloudinary.ts` — تُقرأ من `process.env` فقط (cloud_name/api_key/api_secret) |
| نموذج الرفع | **رفع موقَّع مباشر من المتصفح** — الملفات الكبيرة لا تمرّ عبر الخادم |
| التوقيع | `api_sign_request({ timestamp, folder })` على الخادم؛ يُرجَع للعميل: signature + timestamp + apiKey + cloudName فقط |
| سرّية الـ API Secret | **لا يصل للمتصفح إطلاقاً** — يُستخدم فقط لتوليد التوقيع على الخادم |
| الصلاحيات | `api/upload/sign` يتطلب تسجيل دخول؛ كل المجلدات للمشرف فقط عدا `avatars` (للطالب) |
| المجلدات | `elite/courses`, `elite/lessons`, `elite/articles`, `elite/instructors`, `elite/students`, `elite/avatars` |
| الأنواع | صور (image) + فيديوهات الدروس (video) |
| الحذف | `destroyAsset()` يحذف الأصل من Cloudinary عند حذف الدورة/الدرس |
| التحقق التشغيلي | تم اختبار ping + رفع + حذف بنجاح (status: ok) |
| متغيّرات مطلوبة | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |

---

## 6) تقرير إعداد Google OAuth

| البند | التفصيل |
| --- | --- |
| المزوّد | `next-auth/providers/google` في `src/auth.config.ts` |
| التفعيل المشروط | يُفعّل فقط عند وجود `AUTH_GOOGLE_ID` و`AUTH_GOOGLE_SECRET` (وإلا يبقى زر Google غير فعّال بأمان) |
| السرّية | المعرّف والسر يُقرآن من `process.env` — لا يظهران في الكود أو حزمة العميل |
| النطاقات (scopes) | الافتراضية: `openid email profile` |
| ربط الحسابات | `allowDangerousEmailAccountLinking: true` — يربط حساب Google بحساب بريد موجود بنفس الإيميل (سلوك مقصود لتجربة سلسة؛ آمن لأن Google يتحقق من ملكية البريد) |
| المعالجة | `signIn` callback يُنشئ/يحدّث المستخدم في `users` (provider=google)، ويرفض الحسابات الموقوفة |
| **الإعداد المطلوب في Google Cloud Console** | |
| Authorized JavaScript origins | `https://nokhbaeg.com` (وللتطوير `http://localhost:3000`) |
| Authorized redirect URI | `https://nokhbaeg.com/api/auth/callback/google` (وللتطوير `http://localhost:3000/api/auth/callback/google`) |

---

## ✅ الخلاصة النهائية

- **لا أسرار مكشوفة** في الكود أو المستودع (مؤكَّد بفحص آلي شامل).
- **جميع المفاتيح** (Cloudinary, Google, MongoDB, AUTH_SECRET) تُقرأ من البيئة فقط.
- البناء `next build` ناجح، الأنواع `tsc` نظيفة، والاتصال بقاعدة البيانات وCloudinary مُختبَر.
- **المشروع جاهز للإنتاج وآمن للنشر العام** بعد إكمال البنود اليدوية في القسمين 2 و3
  (AUTH_SECRET، كلمة مرور المشرف، Atlas IP، HTTPS، إعداد Google OAuth للدومين).
