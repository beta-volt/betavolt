# 🏛️ MASTER_PROJECT_HANDOVER.md
# وثيقة التسليم الشاملة والمرجع الهندسي السيادي لمنصة بيتافولت (BetaVolt)
**إصدار الوثيقة:** `1.0.0`  
**تاريخ التوثيق:** `2026-09-11`  
**الجهة المطورة:** Principal Systems Architect & Lead Autonomous Systems Engineer  
**المستودع المصدري:** `https://github.com/alrrakb/betavolt.git`  
**الهدف:** أن تكون هذه الوثيقة **المصدر الحصري والمرجع الكامل (Single Source of Truth)** لأي مهندس برمجيات أو وكيل ذكاء اصطناعي (Claude, GPT, Gemini, Cursor) لاستيعاب وإدارة وتطوير كافة أركان المنظومة بنسبة 100% وبدون أي تخمين أو استكشاف عشوائي.

---

## 📑 فهرس المحتويات
1. [بطاقة تعريف المشروع والهوية المؤسسية (System Identity & Business Domain)](#1-بطاقة-تعريف-المشروع-والهوية-المؤسسية-system-identity--business-domain)
2. [معمارية الستاك التقني الكاملة (Full Tech Stack Anatomy)](#2-معمارية-الستاك-التقني-الكاملة-full-tech-stack-anatomy)
3. [خريطة الملفات والهيكل الميداني التفصيلي (Exhaustive Codebase Cartography)](#3-خريطة-الملفات-والهيكل-الميداني-التفصيلي-exhaustive-codebase-cartography)
4. [بنية البيانات وقواعد البيانات (Database Schema & Persistence Layer)](#4-بنية-البيانات-وقواعد-البيانات-database-schema--persistence-layer)
5. [مكتبة المكونات ونظام التصميم (Design System & UI Component Hierarchy)](#5-مكتبة-المكونات-ونظام-التصميم-design-system--ui-component-hierarchy)
6. [دليل التشغيل والمتغيرات البيئية والنشر (Environment & Deployment Playbook)](#6-دليل-التشغيل-والمتغيرات-البيئية-والنشر-environment--deployment-playbook)
7. [دليل الإرشادات الإلزامي للذكاء الاصطناعي (AI Agent Operating Manual)](#7-دليل-الإرشادات-الإلزامي-للذكاء-الاصطناعي-ai-agent-operating-manual)

---

## 1. بطاقة تعريف المشروع والهوية المؤسسية (System Identity & Business Domain)

### 1.1 طبيعة ونشاط المنصة
منصة **بيتافولت (BetaVolt)** هي المنصة الرقمية الرسمية والواجهة التشغيلية لشركة **بيتافولت للمقاولات الكهروميكانيكية والأنظمة الذكية ومراكز البيانات**، ومقرها الرئيسي في **المنطقة الصناعية الأولى بالجبيل، المنطقة الشرقية، المملكة العربية السعودية**.

تختص الشركة في تنفيذ مشروعات البنية التحتية الكبرى والمشروعات السيادية في المملكة (بما في ذلك مشروعات نيوم، البحر الأحمر، والقدية، وروشن)، عبر ستة قطاعات هندسية رئيسية:
1. **مراكز البيانات والمنشآت الحيوية (Data Centers & Critical Facilities):** غرف الخوادم، أنظمة التبريد الدقيق، وحدات الـ UPS، أنظمة مكافحة الحريق والغازات النظيفة.
2. **أنظمة إدارة المباني الذكية (Smart Building BMS):** التحكم الآلي في الإضاءة والتكييف والطاقة، وحلول إنترنت الأشياء (IoT) والتحكم البيئي.
3. **الأتمتة الصناعية والسكادا (Industrial Automation & SCADA):** لوحات التحكم PLC/SCADA، أتمتة خطوط الإنتاج، ومحطات المعالجة الصناعية.
4. **أنظمة التيار الخفيف والاتصالات (Low Current & Security Systems):** المراقبة بالكاميرات CCTV، التحكم في الدخول Access Control، شبكات الفايبر، والإنذار المبكر.
5. **محطات الطاقة وتوزيع الكهرباء (Power & Electrical Infrastructure):** المولدات، المحولات، لوحات التوزيع ذات الجهد المتوسط والمنخفض، وأنظمة الطاقة الشمسية.
6. **المقاولات الكهروميكانيكية العامة (General Electromechanical Contracting):** شبكات الأنابيب الصناعية، أعمال التكييف المركزي HVAC، ومحطات الضخ.

### 1.2 النطاقات الرقمية والبنية الشبكية
- **النطاق الرسمي للإنتاج (Primary Official Domain):**  
  `https://www.betavolt.com.sa` و `https://betavolt.com.sa`  
  *مزود الخدمة:* المركز السعودي لمعلومات الشبكة عبر شركة **نور نت (NourNet)** — بوابة `eservices.nour.net.sa`.
- **النطاق الموجه / البديل (Legacy Typo-Squatted Domain):**  
  `https://betavoltt.com` (دومين يحتوي على حرفي `tt` يتم اعتراضه وتحويله تلقائياً برمز 308 الدائم إلى الدومين الرسمي السعودي لمنع التشتت وتأمين الهوية).
- **البريد الإلكتروني الرسمي وخوادم الويب ميل:**  
  *البوابة:* `https://mail.hostinger.com`  
  *البريد العام:* `info@betavoltt.com`  
  *بريد التوظيف المباشر:* `careers@betavolt.com.sa`  
  *بريد إدارة المشاريع:* `projects@betavolt.com.sa`

---

## 2. معمارية الستاك التقني الكاملة (Full Tech Stack Anatomy)

### 2.1 المكونات البرمجية الأساسية
| الطبقة البرمجية | التقنية المستخدمة | الإصدار | الوظيفة الهندسية والدور |
| :--- | :--- | :--- | :--- |
| **إطار العمل الرئيسي** | Next.js (App Router) | `15.1.6` | دعم العرض على السيرفر (RSC)، التوليد الثابت (SSG)، وخدمات الحافة (Edge Runtime). |
| **مكتبة الواجهات** | React | `19.0.0` | بنية المكونات الحديثة مع المعالجة المتزامنة (Concurrent Mode) والانتقالات (Transitions). |
| **لغة البرمجة** | TypeScript | `5.7.0` | كتابة برمجية صارمة بنسبة 100% مع منع التعيين العشوائي للأنواع. |
| **محرك الأنماط** | Tailwind CSS | `3.4.17` | نظام التنسيق الذري (Utility-First) مع دعم كامل للوضع الليلي `dark` والتدرجات الكهربائية. |
| **محرك اللغات والتدويل** | next-intl | `3.26.0` | إدارة الترجمة المزدوجة اللاتينية/العربية في مسارات الـ App Router (`/ar` و `/en`). |
| **قاعدة البيانات والتحقق** | Supabase | `@supabase/ssr: 0.10.3` | قاعدة بيانات PostgreSQL 15 سحابية، محرك المصادقة GoTrue، وإدارة جلسات الكوكيز. |
| **حزمة الأيقونات** | Lucide React | `1.14.0` | أيقونات متجهة خفيفة ذات طابع هندسي حديث. |
| **إدارة السمات (Themes)** | next-themes | `0.4.6` | التبديل بين الوضعين الفاتح والداكن وتخزين التفضيل محلياً. |

---

### 2.2 محرك التدويل وتفادي أخطاء الـ Webpack الحافة (`i18n/request.ts`)
تعتمد المنصة تصميماً هجيناً فريداً لمعالجة الترجمات يجمع بين:
1. **السرعة الفائقة والحماية من الانهيار:** استيراد القواميس الثابتة لملفات `messages/ar.json` و `messages/en.json` بشكل استاتيكي ثابت (Static Imports) في رأس الملف:
   ```typescript
   import enMessages from '@/messages/en.json';
   import arMessages from '@/messages/ar.json';
   ```
   *السر الهندسي:* الاستيراد الديناميكي التقليدي `await import('../messages/' + locale + '.json')` كان يتسبب في فشل Webpack في بيئة الـ Server Components وينشئ ملفات جزئية معطوبة مثل `./_rsc_messages_en_json.js`. تم حل هذه المعضلة نهائياً عبر الخريطة الاستاتيكية الثابتة `staticMessageMap`.
2. **التعديل الإداري اللحظي والدمج العميق (`deepMerge`):**  
   يتم جلب أي تعديلات إدارية محفوظة في جدول `site_content` بقاعدة البيانات ودمجها مع القاموس الثابت عبر دالة دمج تكراري عميق:
   ```typescript
   const staticMessages = staticMessageMap[locale] ?? staticMessageMap.ar;
   const dbMessages     = await fetchMessages(locale);
   const messages       = dbMessages ? deepMerge(staticMessages, dbMessages) : staticMessages;
   ```
   هذا يضمن أن أي مفتاح جديد يضاف في ملفات الـ JSON يظهر فوراً ولا يُلقي أي خطأ `MISSING_MESSAGE` حتى وإن كانت قاعدة البيانات تحتوي على نسخة قديمة.

---

### 2.3 بوابة الـ Edge والحماية المتقدمة (`middleware.ts`)
يعمل ملف `middleware.ts` كحارس بوابة شبكي على شبكة Vercel Edge، ويؤدي 4 مهام استراتيجية حاسمة بالترتيب التالي:
```mermaid
flowchart TD
    A[طلب HTTP الوارد] --> B{هل الدومين من النطاقات البديلة؟<br>betavoltt.com}
    B -- نعم --> C[تحويل دائم 308 إلى www.betavolt.com.sa]
    B -- لا --> D{هل المسار لملف استاتيكي؟<br>_next, images, favicon}
    D -- نعم --> E[تمرير مباشر NextResponse.next]
    D -- لا --> F{هل وضع الصيانة مفعل؟<br>MAINTENANCE_MODE == true}
    F -- نعم --> G[عرض شاشة /maintenance أو رد JSON 404 للـ APIs]
    F -- لا --> H{هل المسار يتبع لوحة التحكم؟<br>/admin أو /api/admin}
    H -- نعم --> I[التحقق من جلسة Supabase Cookie وفحص مصفوفة الـ RBAC]
    H -- لا --> J[تطبيق محرك التدويل next-intl لمسارات اللغات]
```

1. **حماية النطاق (Domain Guard):** تحويل فوري لكافة مسارات نطاق `betavoltt.com` برمز 308 إلى `https://www.betavolt.com.sa`.
2. **زر وضع الصيانة الشامل (`MAINTENANCE_MODE`):**  
   مفتاح برمجي في السطر 15:
   ```typescript
   export const MAINTENANCE_MODE = false;
   ```
   عند تحويله إلى `true`، يعترض السيرفر جميع الطلبات العامة والإدارية ويعرض فوراً صفحة الصيانة المصممة بالهوية الرسمية (`app/maintenance/page.tsx`) مع إرجاع كود 404 لطلبات الـ API.
3. **مصفوفة الصلاحيات المبنية على الأدوار (RBAC Guard):**
   - مسارات المستخدمين `/admin/users`: محصورة فقط لـ `super_admin`.
   - مسارات المحتوى `/admin/content`: متاحة لـ `super_admin` و `content_manager`.
   - مسارات الطلبات والاستفسارات `/admin/inquiries`: متاحة لـ `super_admin` و `sales`.
4. **مزامنة جلسات الكوكيز (Supabase Session Sync):**  
   تحديث الكوكيز عبر `@supabase/ssr` لمنع فقدان تسجيل الدخول أثناء التنقل بين المسارات.

---

## 3. خريطة الملفات والهيكل الميداني التفصيلي (Exhaustive Codebase Cartography)

### 3.1 إحصائيات الكود البرمجي (86 ملفاً رئيسياً)
```
المجموع الكلي للأسطر البرمجية: ~10,500 سطر
TypeScript / TSX: ~8,200 سطر
JSON (بيانات وترجمة): ~1,700 سطر
CSS & Configs: ~600 سطر
```

---

### 3.2 خريطة البوابة العامة (Public Localized Pages)

#### 1. الصفحة الرئيسية (`app/[locale]/page.tsx` - 14 سطراً)
تجمع الصفحة 3 أقسام رئيسية متتالية:
- `components/sections/Hero.tsx` (168 سطراً): واجهة ترحيبية ديناميكية تدعم خلفيات الفيديو، ومعرض الشرائح السريع، وعناوين برّاقة مع روابط سريعة لطلب التسعير وسابقة الأعمال.
- `components/sections/StatsBar.tsx` (121 سطراً): شريط أرقام وإنجازات بيتافولت (عدد المشاريع المنفذة، ساعات العمل الآمنة، الطاقة الاستيعابية لمراكز البيانات، نسبة إرضاء الاستشاريين).
- `components/sections/Services.tsx` (158 سطراً): بطاقات عرض الخدمات الست المتخصصة مع أيقونات تفاعلية وتأثيرات التحويم (Hover effects).

#### 2. صفحة من نحن (`app/[locale]/about/page.tsx` - 135 سطراً)
استعراض شامل للهوية المؤسسية، الرؤية السعودية 2030، رسالة الشركة في دعم التحول الصناعي بالجبيل، القيم الهندسية (السلامة، الجودة، الدقة الزمنية)، مع صور المنشآت والمعدات.

#### 3. دليل وصفحات الخدمات الديناميكية (`app/[locale]/services/`)
- `page.tsx` (153 سطراً): فهرس الخدمات مع فلترة قطاعية (صناعي، مدني، تقني).
- `[slug]/page.tsx` (153 سطراً): صفحات تفصيلية تُنشأ برمجياً لكل خدمة (`data-centers`, `smart-building-bms`, `industrial-automation`, `power-electrical`, `low-current`, `electromechanical`). تعرض المعايير الهندسية، المراحل التنفيذية، ونماذج من المشاريع المربوطة.

#### 4. معرض المشاريع وسابقة الأعمال (`app/[locale]/projects/`)
- `page.tsx` (142 سطراً): شبكة المشاريع المنفذة مع أزرار الفلترة حسب القطاع والمدينة (الرياض، نيوم، الجبيل).
- `[slug]/page.tsx` (170 سطراً): دراسة حالة متكاملة (Case Study) لكل مشروع تشمل: العميل، الموقع، نطاق العمل المنفذ، تاريخ التسليم، ومعرض صور عالي الدقة.

#### 5. بوابة الاتصال والتوظيف والـ RFQ (`app/[locale]/contact/page.tsx` - 349 سطراً)
تحتوي هذه الصفحة على أهم عناصر التحويل التجاري:
- **معلومات التواصل:** المقر في الجبيل، الهواتف، ساعات العمل، وإيميلات الأقسام.
- **نموذج الاستفسار العام:** مربوط بـ `/api/contact`.
- **حاوية التوظيف الاحترافية المستقلة (Full-Width Careers Container):**  
  حاوية بعرض 100% من مساحة الكونتينر بتصميم زجاجي فخم وإضاءة ناعمة تبرز بريد `careers@betavolt.com.sa` وزر تقديم مباشر تحت عنوان *"هل ترغب في الانضمام إلى رحلتنا؟"* مع شارة المراجعة الفورية من الموارد البشرية.

---

### 3.3 خريطة مركز القيادة الإداري (`app/admin/`)

```
app/admin/
├── layout.tsx              # إطار لوحة التحكم (السيدبار المتجاوب، الهيدر، ومزود الصلاحيات)
├── page.tsx                # لوحة المؤشرات الرئيسية (KPIs، ملخص الطلبات، حالة النظام)
├── login/                  # تسجيل الدخول عبر Supabase Auth ومسح الجلسات
├── users/page.tsx          # إدارة حسابات المدراء (إضافة، تغيير كلمة السر، حذف، تعيين الأدوار)
├── inquiries/page.tsx      # صندوق عروض الأسعار والرسائل مع فلترة الحالات
└── content/                # المركز السيادي لإدارة محتوى الموقع
    ├── page.tsx            # فهرس أقسام المحتوى
    ├── home/               # تعديل نصوص وعناوين الهيرو
    │   └── media/          # إدارة وسائط الهيرو (الفيديوهات والصور الخلفية)
    ├── about/              # تعديل بيانات صفحة من نحن
    ├── services/           # إدارة مسميات ونصوص الخدمات
    ├── projects/           # إضافة وتعديل المشاريع ورفع الصور لدلو Supabase
    ├── contact/            # تعديل العناوين وبيانات الهواتف وقسم التوظيف
    ├── quote-modal/        # تعديل خيارات نافذة طلب عروض الأسعار
    ├── seo/                # تعديل الميتا تاجز والكلمات المفتاحية
    ├── header/             # تعديل روابط شريط التنقل العلوي
    ├── footer/             # تعديل حقوق النشر والروابط السفلية
    ├── logo/               # رفع الشعار الرسمي بدقة عالية
    └── favicon/            # رفع وتحديث أيقونة المتصفح
```

---

## 4. بنية البيانات وقواعد البيانات (Database Schema & Persistence Layer)

### 4.1 تفاصيل جداول Supabase PostgreSQL 15

#### 1. جدول الرسائل وطلبات التسعير (`public.inquiries`)
```sql
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    file_name TEXT,
    file_url TEXT,
    source TEXT NOT NULL DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'quote_form', 'direct_rfp')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- فهارس تحسين الاستعلام الإداري
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_source ON public.inquiries(source);
```

#### 2. جدول المحتوى الديناميكي المخزن (`public.site_content`)
```sql
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```
*أهم المفاتيح المخزنة في هذا الجدول:*
- `messages.ar`: القاموس الكامل للنصوص العربية المعدلة إدارياً.
- `messages.en`: القاموس الكامل للنصوص الإنجليزية المعدلة إدارياً.
- `contact-details`: بيانات الهواتف، البريد، الموقع، ونصوص التوظيف.
- `services-cards`: بطاقات الخدمات وتفاصيلها.
- `projects-data`: بيانات المشروعات وصورها.
- `home-media`: روابط الفيديوهات والصور بالهيرو.
- `quote-modal-options`: خيارات الميزانيات والجداول الزمنية لنموذج التسعير.

#### 3. دلو تخزين الوسائط والصور (`storage.buckets`)
- **اسم الدلو (Bucket Name):** `project-images`
- **حالة الوصول:** عام (`public = true`) لتمكين المتصفحات وشبكات التوصيل (CDN) من تحميل صور المشاريع ووسائط الموقع مباشرة وبأعلى سرعة.

---

### 4.2 استراتيجية التخزين المؤقت والـ Revalidation
- **القراءة:** عند طلب الصفحات العامة، تقرأ دالة `lib/content-store.ts` البيانات المخزنة من Supabase عبر `unstable_cache` الموسومة بـ `tags: ['site-messages']` وبزمن استبقاء `revalidate: 60`.
- **الكتابة والإلغاء الفوري:** بمجرد قيام مدير المحتوى بحفظ أي قسم من لوحة تحكم `/admin/content/*`، يستدعي الراوت الداخلي دالة `revalidateTag('site-messages')` و `revalidatePath('/', 'layout')`، مما يجبر Next.js على مسح الكاش القديم وتحديث المحتوى في ثانية واحدة للمستخدمين.

---

## 5. مكتبة المكونات ونظام التصميم (Design System & UI Component Hierarchy)

### 5.1 فلسفة التصميم والهوية البصرية
يعكس التصميم القوة الهندسية للبنية التحتية والمراكز الرقمية مع لمسات "السيبرانية الصناعية":
- **الخلفية الأساسية:** كحلي شديد العتمة والعمق (`#070B14`) في الوضع الداكن، وأبيض نقي متدرج للرمادي في الوضع الفاتح.
- **الألوان الوظيفية (Accent Palette):**
  - أزرق كهربائي (`#2563EB` / `Blue-600`): يمثل الطاقة والتحكم الكهروميكانيكي.
  - سماوي مشرق (`#38BDF8` / `Sky-400`): يمثل الاتصالات، التيار الخفيف، والتقنيات الرقمية.
  - أخضر زمردي (`#10B981` / `Emerald-500`): يمثل استقرار العمليات والسلامة المهنية والموافقة.
  - أحمر تحذيري (`#EF4444` / `Red-500`): يمثل إيقاف العمليات وتنبيهات الأمان وحذف الحسابات.

### 5.2 الطباعة والخطوط (Typography Tokens)
- **خط النصوص والعناوين الأساسية (Arabic & English Body):**  
  خط **`Cairo`** (الأوزان: 400، 600، 700، 800، 900) لضمان سهولة القراءة وتناسق الحروف العربية الحديثة.
- **خط الأرقام والبيانات التكنولوجية (Tech Numerals & KPIs):**  
  خط **`Orbitron`** ليعطي مظهراً مستقبلياً ودقة هندسية في أشرطة الإحصائيات وبطاقات الأداء.

### 5.3 المكونات التفاعلية المتميزة
1. **`components/layout/QuoteModal.tsx` (214 سطراً):**  
   نافذة منبثقة تفاعلية بالكامل لطلب عرض سعر (RFQ)، تتيح للعميل اختيار نوع المشروع، الميزانية المتوقعة، الجدول الزمني، رفع ملف المواصفات الهندسية، وحفظ الطلب مباشرة في Supabase.
2. **`components/layout/Navbar.tsx` (219 سطراً):**  
   شريط ملاحة ذكي يغير خلفيته وشفافيته عند التمرير، يحتوي على مبدل اللغات `LanguageSwitcher`، مبدل الوضع الليلي `ThemeToggle`، وزر مباشر لطلب التسعير.
3. **`components/home/HeroSlider.tsx` (214 سطراً):**  
   عارض وسائط متقدم يدعم الانتقال بين صور المشاريع الكبرى وفيديوهات البنية التحتية دون التأثير على أداء المتصفح.

---

## 6. دليل التشغيل والمتغيرات البيئية والنشر (Environment & Deployment Playbook)

### 6.1 حصر المتغيرات البيئية (`.env.local`)
تعتمد المنصة على 3 مفاتيح رئيسية يجب توفرها في بيئة التطوير والإنتاج:
```env
# 1. رابط الـ API المباشر لمشروع Supabase (آمن للمتصفح والسيرفر)
NEXT_PUBLIC_SUPABASE_URL=https://xdkfmduiftxisifetfmu.supabase.co

# 2. مفتاح الوصول العام (Anon Key - محدود الصلاحيات ومحمي بسياسات الـ RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTA2MjcsImV4cCI6MjA5NDI2NjYyN30.-TecalPes70OxpA18ut19i9bHd-mOx6jXEw6GDnp-ao

# 3. مفتاح السيرفر السيادي (Service Role Key - سري جداً وممنوع وصول المتصفح إليه نهائياً)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY5MDYyNywiZXhwIjoyMDk0MjY2NjI3fQ.9uiexLgZd-3jvUl1XOi-KxD80Oonw1lTqsRY2kA99y0
```

---

### 6.2 أوامر التشغيل والبناء والنشر (CLI Commands)

#### تشغيل خادم التطوير المحلي (Local Development):
```powershell
npm run dev
```
*الموقع سيعمل على:* `http://localhost:3000` (ويحول تلقائياً إلى `/ar`).

#### اختبار سلامة البناء (Production Build Verification):
```powershell
npm run build
```
*المعيار المطلوب:* يجب أن ينتهي الأمر بـ `Exit Code: 0` وتوليد كافة المسارات الـ 32 بنجاح.

#### مسح الكاش المعطوب (في حال حدوث تعليق في الـ Chunks):
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
```

#### نشر المشروع المباشر للإنتاج على Vercel (Production Deploy):
```powershell
npx vercel --prod
```
*أو عبر الرفع التلقائي:* بمجرد تنفيذ `git push origin main`، يتولى Vercel البناء والنشر التلقائي.

---

### 6.3 المحاذير الهندسية والأخطاء القاتلة (Critical Anti-Patterns)
1. ❌ **تحذير أمني شديد:** إياك واستيراد `SUPABASE_SERVICE_ROLE_KEY` أو دالة `getContent` من `lib/content-store.ts` داخل أي مكون واجهة يحتوي على `'use client'`؛ هذا يسرب مفتاح السيرفر للمتصفح.
2. ❌ **تحذير الـ Webpack:** إياك وإعادة استخدام الاستيراد الديناميكي `import(`../messages/${locale}.json`)` داخل `i18n/request.ts`؛ التزم بالخريطة الثابتة `staticMessageMap` لتفادي أخطاء الـ RSC في Next.js 15.
3. ❌ **تحذير مستودع Git:** إياك وحذف كتلة العزل في `.gitignore`؛ يجب أن تظل ملفات المهام `tasks/` والمهارات `.agents/` وبيانات الاعتماد `PROJECT_CREDENTIALS.md` معزولة محلياً.

---

## 7. دليل الإرشادات الإلزامي للذكاء الاصطناعي (AI Agent Operating Manual)

لكل وكيل ذكاء اصطناعي (Claude / GPT / Gemini / Cursor) يتولى العمل على هذا المشروع مستقبلاً، **هذه هي القوانين الملزمة غير القابلة للنقاش:**

### القاعدة 1: العمل التوثيقي الإلزامي (The Prime Directive)
ممنوع كتابة أي سطر كود أو تعديل أي ملف دون:
1. قراءة `AGENT_RULES.md` فوراً.
2. فحص `tasks/INDEX.md` لتحديد رقم المهمة التالي (`TASK-XXX`).
3. إنشاء مجلد المهمة `tasks/TASK-XXX-<slug>/` وتجهيز الملفات الأربعة (`SPEC.md`, `SKILLS_USED.md`, `EXECUTION.log`, `POST_MORTEM.md`).

### القاعدة 2: كيفية إضافة نصوص وترجمات جديدة
عند الرغبة في إضافة نصوص جديدة لصفحة معينة:
1. افتح `messages/ar.json` وأضف المفتاح الجديد في قسم الصفحة (مثلاً: `"new_feature_title": "..."`).
2. افتح `messages/en.json` وأضف نفس المفتاح بترجمته الإنجليزية.
3. استخدم في الكود: `const t = useTranslations('page_name');` ثم `{t('new_feature_title')}`.
4. بفضل معمارية `deepMerge` في `i18n/request.ts`، سيعمل المفتاح فوراً بدون أي مشكلة.

### القاعدة 3: كيفية إضافة صفحة عامة جديدة بالـ App Router
1. أنشئ المجلد داخل `app/[locale]/` (مثال: `app/[locale]/careers/page.tsx`).
2. اجعل الدالة تقبل `params: Promise<{ locale: string }>` وتقوم بفك الوعد:
   ```typescript
   export default async function NewPage({ params }: { params: Promise<{ locale: string }> }) {
     const { locale } = await params;
     // ...
   }
   ```
3. استخدم `getTranslations` للترجمة من السيرفر، وتأكد من دعم الاتجاهين RTL/LTR.

---

## 🏁 ختام المرجع
هذه الوثيقة مرخصة ومعتمدة هندسياً لتكون **المرجع الأعلى** لتطوير منصة شركة بيتافولت. على كافة المهندسين والأنظمة الذكية الرجوع إليها دائماً كبوصلة تقنية ومعمارية موحدة.
