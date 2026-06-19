# دليل المشروع والنشر — مؤسسة النخبة للعلوم الصينية

وثيقة مرجعية كاملة: شجرة المشروع، مخططات قاعدة البيانات، متغيّرات البيئة،
دليل النشر على VPS (Ubuntu + PM2 + Nginx)، ودليل النسخ الاحتياطي والاستعادة لـ MongoDB.

---

## 1) شجرة المشروع

```
.
├─ public/
│  └─ icon.svg                      # Favicon (SVG ضمن الهوية)
├─ scripts/
│  └─ seed-admin.ts                 # إنشاء/ترقية حساب المشرف
├─ src/
│  ├─ app/
│  │  ├─ (admin)/admin/             # لوحة الإدارة (Admin فقط)
│  │  │  ├─ approved-students/page.tsx
│  │  │  ├─ articles/page.tsx
│  │  │  ├─ courses/page.tsx
│  │  │  ├─ instructors/page.tsx
│  │  │  ├─ settings/page.tsx
│  │  │  ├─ users/page.tsx
│  │  │  ├─ layout.tsx              # حارس requireAdmin + Sidebar
│  │  │  └─ page.tsx                # نظرة عامة + إحصائيات
│  │  ├─ (auth)/                    # login / register / forgot / reset
│  │  ├─ (dashboard)/dashboard/     # لوحة الطالب (courses / settings)
│  │  ├─ (learn)/learn/[slug]/      # مشغّل الدروس (محمي)
│  │  ├─ (public)/                  # الموقع العام
│  │  │  ├─ about, courses, courses/[slug]
│  │  │  ├─ instructors, instructors/[slug]
│  │  │  ├─ articles, articles/[slug]
│  │  │  ├─ verify, contact
│  │  │  ├─ layout.tsx              # Header + Footer
│  │  │  └─ page.tsx                # الرئيسية (Desktop/Mobile منفصلان)
│  │  ├─ api/
│  │  │  ├─ account/{password,profile}/route.ts
│  │  │  ├─ admin/{approved-students,articles,courses,instructors,
│  │  │  │        lessons,settings,users}/...route.ts
│  │  │  ├─ auth/[...nextauth]/route.ts
│  │  │  ├─ contact, enroll, progress, register
│  │  │  ├─ forgot-password, reset-password
│  │  │  ├─ upload/sign/route.ts    # توقيع رفع Cloudinary
│  │  │  └─ verify/route.ts         # التحقق بالكود (عام)
│  │  ├─ error.tsx, loading.tsx, not-found.tsx
│  │  ├─ globals.css, layout.tsx
│  │  └─ robots.ts, sitemap.ts
│  ├─ components/
│  │  ├─ admin/                     # Managers + DataTable + Dialogs
│  │  ├─ auth/                      # نماذج المصادقة + زر Google
│  │  ├─ brand/logo.tsx
│  │  ├─ courses/course-cta.tsx
│  │  ├─ dashboard/                 # nav + بطاقات + الإعدادات
│  │  ├─ home/                      # Hero + الأقسام
│  │  ├─ layout/                    # Header + Footer
│  │  ├─ learn/lesson-player.tsx
│  │  ├─ shared/                    # بطاقات + رفع وسائط + حالات فارغة
│  │  └─ ui/                        # primitives (shadcn-style)
│  ├─ models/                       # Mongoose Schemas
│  ├─ lib/
│  │  ├─ data/                      # جلب البيانات للخادم (RSC)
│  │  ├─ validations/               # Zod schemas
│  │  ├─ auth.ts, auth.config.ts    # ⟵ src/ (انظر أدناه)
│  │  ├─ db.ts, cloudinary.ts, mail.ts
│  │  ├─ env.ts, api.ts, session.ts, password.ts
│  │  ├─ serialize.ts, export.ts, utils.ts, constants.ts
│  ├─ store/toast.ts                # Zustand
│  ├─ types/next-auth.d.ts
│  ├─ auth.ts, auth.config.ts       # Auth.js v5
│  └─ middleware.ts                 # حماية المسارات (Edge)
├─ .env / .env.example
├─ next.config.mjs, tailwind.config.ts, tsconfig.json
├─ README.md, DEPLOYMENT.md
└─ package.json
```

---

## 2) قاعدة البيانات — Collections & Schemas

> القاعدة: `elite-chinese-sciences`. لا توجد أي بيانات وهمية — كل شيء يُضاف من لوحة الإدارة.

### `users`
| الحقل | النوع | ملاحظات |
| --- | --- | --- |
| `name` | String | مطلوب |
| `email` | String | فريد، lowercase، مفهرس |
| `password` | String | مُشفَّر (bcrypt)، `select:false`، null لحسابات Google |
| `googleId` | String | معرّف Google |
| `provider` | enum | `credentials` \| `google` |
| `avatar` | String | رابط Cloudinary |
| `role` | enum | `admin` \| `student` |
| `status` | enum | `active` \| `suspended` \| `blocked` |
| `resetToken` / `resetTokenExpiry` | String/Date | استعادة كلمة المرور (`select:false`) |
| `lastLogin` | Date | آخر دخول |
| `createdAt` / `updatedAt` | Date | تلقائي |

### `courses`
`title`, `slug` (فريد), `coverImage`, `shortDescription`, `fullDescription`,
`price` (Number), `durationMinutes`, `instructor` (ref → Instructor),
`isFeatured` (Boolean — يظهر بالرئيسية), `isPublished`, `lessonsCount`,
`enrollmentsCount`, `createdAt/updatedAt`.

### `courselessons`
`course` (ref → Course), `title`, `videoUrl` (Cloudinary), `videoPublicId`,
`durationMinutes`, `order`, `isFree` (Boolean), `createdAt/updatedAt`.
فهرس مركّب: `{ course, order }`.

### `articles`
`title`, `slug` (فريد), `image`, `excerpt`, `content`, `author`,
`isPublished`, `publishedAt`, `createdAt/updatedAt`.

### `instructors`
`name`, `slug` (فريد), `title`, `shortBio`, `bio`, `avatar`,
`yearsOfExperience`, `specialty`, `social{facebook,linkedin,website,whatsapp}`,
`isActive`, `createdAt/updatedAt`.

### `approvedstudents`
| الحقل | النوع | ملاحظات |
| --- | --- | --- |
| `code` | String | فريد — يُولَّد تلقائياً `NOK00001`… |
| `name` | String | اسم الطالب |
| `nationalId` | String | الرقم القومي |
| `photo` | String | صورة الطالب (Cloudinary) |
| `courseName` | String | يُدخل يدوياً (غير مرتبط بـ Courses) |
| `approvalDate` | Date | تاريخ الاعتماد |
| `status` | String | `approved` |

> كل سجل = كورس واحد + كود واحد. إضافة نفس الطالب لكورس آخر تُنشئ **سجلاً وكوداً جديدين تماماً**.
> التحقق العام يبحث بالكود فقط ويعرض سجلاً واحداً (لا تجميع لكورسات الطالب الأخرى).
> لا توجد ملفات شهادات أو PDF أو مرفقات في النظام إطلاقاً.

### `enrollments`
`user` (ref), `course` (ref), `purchaseDate`, `paymentStatus`
(`pending`/`paid`/`failed`), `amountPaid`, `lastLessonViewed` (ref),
`completedLessons` ([ref]), `progress` (0–100). فهرس فريد: `{ user, course }`.

### `settings` (مستند واحد `_id:"site"`)
`about{intro,vision,mission,goals[],specialties}`,
`contact{phone,email,address,mapEmbedUrl}`, `stats{...}`.

### `counters`
`_id` (مفتاح العدّاد), `seq` (Number) — يُستخدم لتوليد أكواد `NOK` بدون فجوات.

---

## 3) متغيّرات البيئة (`.env.example`)

```
MONGODB_URI=                       # رابط MongoDB (Atlas أو محلي)
AUTH_SECRET=                       # openssl rand -base64 32
AUTH_URL=                          # https://your-domain.com
NEXTAUTH_URL=                      # https://your-domain.com
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=                    # Google OAuth Client ID
AUTH_GOOGLE_SECRET=                # Google OAuth Client Secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
SEED_ADMIN_NAME=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```

> **Google OAuth — Redirect URI:** `https://your-domain.com/api/auth/callback/google`
> (وللتطوير: `http://localhost:3000/api/auth/callback/google`).

---

## 4) النشر على VPS (Ubuntu 22.04 + PM2 + Nginx)

### 4.1 إعداد الخادم
```bash
sudo apt update && sudo apt upgrade -y
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 4.2 جلب المشروع وبناؤه
```bash
cd /var/www
sudo git clone <REPO_URL> elite && cd elite
sudo chown -R $USER:$USER /var/www/elite

cp .env.example .env
nano .env                      # املأ كل القيم (Production)

npm install --legacy-peer-deps
npm run build
npm run seed:admin             # إنشاء حساب المشرف
```

### 4.3 التشغيل عبر PM2
```bash
pm2 start "npm run start" --name elite -- --port 3000
pm2 save
pm2 startup                    # نفّذ الأمر الذي يطبعه لتشغيل PM2 عند الإقلاع
pm2 status
pm2 logs elite                 # لمتابعة السجلات
```
> لإعادة النشر بعد تحديث الكود:
> ```bash
> cd /var/www/elite && git pull && npm install --legacy-peer-deps && npm run build && pm2 restart elite
> ```

### 4.4 Nginx كوكيل عكسي
أنشئ `/etc/nginx/sites-available/elite`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 200M;   # للسماح برفع الفيديوهات الكبيرة

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/elite /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4.5 شهادة SSL مجانية (Let’s Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
# التجديد التلقائي مفعّل عبر systemd timer
```
> بعد تفعيل HTTPS اضبط `AUTH_URL` و`NEXTAUTH_URL` على `https://your-domain.com` ثم `pm2 restart elite`.

### 4.6 الجدار الناري
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 5) النسخ الاحتياطي والاستعادة لـ MongoDB

> ثبّت أدوات قاعدة البيانات: `sudo apt install -y mongodb-database-tools`

### 5.1 نسخة احتياطية (Backup)
```bash
# نسخة كاملة مضغوطة (Atlas أو محلي)
mongodump --uri="$MONGODB_URI" --archive=/var/backups/elite-$(date +%F).gz --gzip
```

### 5.2 استعادة (Restore)
```bash
mongorestore --uri="$MONGODB_URI" --archive=/var/backups/elite-2026-06-15.gz --gzip
# لاستعادة فوق بيانات موجودة مع الاستبدال:
mongorestore --uri="$MONGODB_URI" --archive=backup.gz --gzip --drop
```

### 5.3 نسخ احتياطي يومي تلقائي (cron)
```bash
sudo mkdir -p /var/backups/elite
crontab -e
# أضف السطر التالي (نسخة يومياً 3 فجراً، حذف ما يزيد عن 14 يوماً):
0 3 * * * mongodump --uri="MONGODB_URI_HERE" --archive=/var/backups/elite/db-$(date +\%F).gz --gzip && find /var/backups/elite -name "db-*.gz" -mtime +14 -delete
```

### 5.4 ملاحظة عن الوسائط
الصور والفيديوهات مخزّنة على **Cloudinary** (وليست على الخادم)،
لذا نسخ MongoDB يحفظ الروابط فقط. اعتمد على نسخ Cloudinary الاحتياطية المدمجة،
أو فعّل Auto-backup add-on من لوحة Cloudinary للوسائط الحرجة.

---

## 6) أوامر سريعة

| الغرض | الأمر |
| --- | --- |
| تطوير | `npm run dev` |
| بناء | `npm run build` |
| تشغيل إنتاج | `npm run start` |
| إنشاء مشرف | `npm run seed:admin` |
| فحص الأنواع | `node node_modules/typescript/lib/tsc.js --noEmit` |
| سجلات الخادم | `pm2 logs elite` |
| إعادة تشغيل | `pm2 restart elite` |
