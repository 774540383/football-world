# ⚽ Football World - عالم كرة القدم

منصة كرة قدم عالمية احترافية مبنية بأحدث تقنيات الويب. توفر المباريات المباشرة، الأخبار، الإحصائيات، ترتيب الدوريات، كأس العالم، وأكثر!

## ✨ المميزات

### 🌐 عامة
- مباريات مباشرة مع تحديث تلقائي
- جدول المباريات اليومية والقادمة
- عداد تنازلي للمباريات
- إحصائيات المباريات (استحواذ، تسديدات، أخطاء...)
- أحداث المباريات (أهداف، بطاقات، تغييرات...)
- ترتيب الدوريات مع نظام النقاط
- أخبار كرة القدم مع تصنيفات
- كأس العالم: مجموعات، أدوار نهائية، إحصائيات

### 📱 واجهة المستخدم
- تصميم عصري مع Glassmorphism و Skeletomorphism
- دعم كامل للغة العربية (RTL)
- وضع الظلام والفاتح
- تأثيرات حركية سلسة (Framer Motion)
- تصميم متجاوب لجميع الأجهزة
- تحميل تدريجي (Skeleton Loading)

### 🔐 نظام المستخدمين
- تسجيل دخول باستخدام Auth.js (NextAuth v5)
- نظام أدوار (مستخدم، محرر، مشرف)
- JWT Authentication
- حماية المسارات الإدارية

### ⚙️ لوحة التحكم
- إدارة المباريات (إضافة، تعديل، حذف)
- إدارة الأخبار والمقالات
- إدارة الفرق واللاعبين
- إدارة الدوريات والبطولات
- إدارة الإعلانات
- مكتبة الوسائط
- إحصائيات وتحليلات

### 🚀 أداء وتحسين محركات (SEO)
- Server Components (SSR) للصفحات الديناميكية
- ISR (Incremental Static Regeneration)
- Sitemap.xml التلقائي
- Robots.txt
- PWA Support (manifest.json)
- Open Graph / Twitter Cards
- Lazy Loading للصور
- تحسين Core Web Vitals

## 🛠 التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| Next.js 15 | الإطار الرئيسي (App Router) |
| TypeScript | الأمان النوعي |
| Tailwind CSS | التصميم والتنسيق |
| Shadcn UI / Radix UI | مكونات واجهة المستخدم |
| Framer Motion | الحركات والتأثيرات |
| Prisma ORM | قواعد البيانات |
| PostgreSQL | قاعدة البيانات |
| Auth.js (NextAuth v5) | المصادقة |
| Supabase (اختياري) | Realtime / WebSockets |
| API-Football | بيانات كرة القدم |
| Recharts | الرسوم البيانية |
| Zustand | إدارة الحالة |

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── (auth)/           # صفحات المصادقة
│   │   ├── login/        # تسجيل الدخول
│   │   ├── register/     # إنشاء حساب
│   │   └── admin/        # لوحة التحكم
│   ├── match/[id]/       # صفحة مباراة
│   ├── team/[id]/        # صفحة فريق
│   ├── player/[id]/      # صفحة لاعب
│   ├── league/[slug]/    # صفحة دوري
│   ├── world-cup/        # كأس العالم
│   ├── news/             # الأخبار
│   ├── live/             # المباريات المباشرة
│   ├── matches/          # جدول المباريات
│   ├── standings/        # الترتيب
│   ├── api/              # API Routes
│   ├── sitemap.ts        # خريطة الموقع
│   ├── robots.ts         # ملف الروبوتات
│   └── manifest.ts       # PWA Manifest
├── components/
│   ├── ui/               # مكونات Shadcn
│   ├── layout/           # تخطيط الموقع
│   ├── match/            # مكونات المباريات
│   ├── team/             # مكونات الفرق
│   ├── player/           # مكونات اللاعبين
│   ├── news/             # مكونات الأخبار
│   ├── world-cup/        # مكونات كأس العالم
│   ├── shared/           # مكونات مشتركة
│   ├── admin/            # مكونات لوحة التحكم
│   └── home/             # مكونات الصفحة الرئيسية
├── lib/
│   ├── prisma.ts         # اتصال قاعدة البيانات
│   ├── auth.ts           # إعدادات المصادقة
│   ├── data.ts           # دوال جلب البيانات (Cached)
│   ├── api-football.ts   # تكامل API-Football
│   ├── utils.ts          # دوال مساعدة
│   └── constants.ts      # الثوابت
├── hooks/                # Custom Hooks
├── types/                # أنواع TypeScript
├── styles/               # ملفات CSS
└── prisma/
    ├── schema.prisma     # نموذج قاعدة البيانات
    └── seed.ts           # بيانات تجريبية
```

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- PostgreSQL (أو Supabase/Neon)
- npm/pnpm/yarn

### 1. تنزيل المشروع
```bash
git clone https://github.com/yourusername/football-world.git
cd football-world
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# نسخ ملف البيئة
cp .env.example .env.local

# تعديل DATABASE_URL في .env.local
DATABASE_URL="postgresql://user:password@host:5432/football_world"

# إنشاء جداول قاعدة البيانات
npx prisma db push

# إضافة بيانات تجريبية
npm run db:seed
```

### 3. تشغيل المشروع
```bash
npm run dev
# المشروع يعمل على: http://localhost:3000
```

### 4. بيانات الدخول التجريبية
- **البريد الإلكتروني:** admin@footballworld.com
- **كلمة المرور:** admin123

## 🌐 APIs المستخدمة

### [API-Football](https://www.api-football.com)
- مباريات مباشرة ونتائج
- بيانات الفرق واللاعبين
- ترتيب الدوريات
- إحصائيات المباريات

### [football-data.org](https://www.football-data.org)
- جداول المباريات
- ترتيب الدوريات الأوروبية

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات:
1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing`)
5. فتح Pull Request

## 📄 الترخيص

MIT License - يمكنك استخدام وتعديل المشروع بحرية.

---

<div dir="rtl" align="center">
<b>تم البناء بـ ❤️ باستخدام Next.js 15 + TypeScript + Tailwind CSS</b>
</div>
