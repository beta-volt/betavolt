'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Mail, Phone, MessageCircle, Save, RefreshCw } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Types ──────────────────────────────────────────── */
interface ContactDetails {
  email_general:  string;
  email_projects: string;
  email_careers?: string;
  phone:          string;
  whatsapp:       string;
}

/* ─── Bilingual labels ───────────────────────────────── */
const L = {
  en: {
    pageTitle:    'Contact Page Content',
    pageDesc:     'Edit bilingual text and contact details for the Contact Us public page.',
    sectionA:     'A — Page Header',
    sectionB:     'B — Company Contact Details',
    eyebrow:      'Eyebrow Tag',
    mainTitle:    'Main Title',
    subtitle:     'Subtitle',
    divInfo:      'Info Column',
    infoTitle:    'Info Section Title',
    divPromise:   'Response Promise Box',
    promiseTitle: 'Promise Title',
    promiseBody:  'Promise Body',
    divCareers:   'Careers & Opportunities Section',
    careersEyebrow: 'Careers Eyebrow Tag',
    careersTitle: 'Careers Main Title',
    careersSub:   'Careers Subtitle / Description',
    careersCta:   'Careers CTA Label',
    careersBadge: 'Careers Security / HR Badge',
    addressLabel: 'Address Label',
    addressValue: 'Address Value',
    divEmail:     'Email Addresses',
    emailGenLabel:'General Email Label',
    emailGenAddr: 'General Email Address',
    emailProjLabel:'Projects Email Label',
    emailProjAddr: 'Projects Email Address',
    emailCarLabel:'Careers Email Label',
    emailCarAddr: 'Careers Email Address',
    divPhone:     'Phone Numbers',
    phoneLabel:   'Phone Label',
    phoneNum:     'Primary Phone Number',
    whatsapp:     'WhatsApp / Support',
    whatsappNum:  'WhatsApp Number',
    divHours:     'Working Hours',
    hoursLabel:   'Hours Label',
    hoursValue:   'Hours Value',
    flagEn:       '🇬🇧',
    flagAr:       '🇸🇦',
    colEn:        'English',
    colAr:        'Arabic',
    save:         'Save Changes',
    saving:       'Saving…',
    saved:        '✓ Saved!',
    saveHint:     'Saves bilingual text to message files and contact details to JSON.',
  },
  ar: {
    pageTitle:    'محتوى صفحة التواصل',
    pageDesc:     'تعديل النصوص ثنائية اللغة وبيانات التواصل لصفحة "اتصل بنا" العامة.',
    sectionA:     'أ — رأس الصفحة',
    sectionB:     'ب — بيانات التواصل مع الشركة',
    eyebrow:      'النص الصغير فوق العنوان',
    mainTitle:    'العنوان الرئيسي',
    subtitle:     'العنوان الفرعي',
    divInfo:      'عمود المعلومات',
    infoTitle:    'عنوان قسم المعلومات',
    divPromise:   'صندوق وعد الرد',
    promiseTitle: 'عنوان الوعد',
    promiseBody:  'نص الوعد',
    divCareers:   'قسم التوظيف وبناء المستقبل المستقل',
    careersEyebrow: 'النص الصغير فوق عنوان التوظيف',
    careersTitle: 'عنوان قسم التوظيف الرئيسي',
    careersSub:   'وصف/نص قسم التوظيف',
    careersCta:   'تسمية زر إرسال السيرة الذاتية',
    careersBadge: 'شارة الموارد البشرية / المراجعة',
    addressLabel: 'تسمية العنوان',
    addressValue: 'قيمة العنوان',
    divEmail:     'عناوين البريد الإلكتروني',
    emailGenLabel:'تسمية البريد العام',
    emailGenAddr: 'عنوان البريد العام',
    emailProjLabel:'تسمية بريد المشاريع',
    emailProjAddr: 'بريد استفسارات المشاريع',
    emailCarLabel:'تسمية بريد التوظيف',
    emailCarAddr: 'بريد التوظيف والسير الذاتية',
    divPhone:     'أرقام الهواتف',
    phoneLabel:   'تسمية الهاتف',
    phoneNum:     'رقم الهاتف الرئيسي',
    whatsapp:     'واتساب / الدعم',
    whatsappNum:  'رقم واتساب',
    divHours:     'ساعات العمل',
    hoursLabel:   'تسمية ساعات العمل',
    hoursValue:   'قيمة ساعات العمل',
    flagEn:       '🇬🇧',
    flagAr:       '🇸🇦',
    colEn:        'الإنجليزية',
    colAr:        'العربية',
    save:         'حفظ التغييرات',
    saving:       'جارٍ الحفظ…',
    saved:        '✓ تم الحفظ!',
    saveHint:     'يتم الحفظ في ملفات الرسائل وملف بيانات التواصل JSON.',
  },
};

type T = typeof L['en'];

/* ─── Shared style tokens ────────────────────────────── */
const LABEL =
  'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5';
const INPUT =
  'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 dark:focus:border-blue-500 transition-colors';
const TEXTAREA   = INPUT + ' resize-none leading-relaxed';
const ICON_WRAP  = 'relative';
const ICON_INSET = 'absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400 dark:text-slate-500';

/* ─── BiField ────────────────────────────────────────── */
function BiField({
  label, valueEn, valueAr, onEn, onAr, rows = 1,
  placeholderEn = '', placeholderAr = '', t,
}: {
  label: string; valueEn: string; valueAr: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  rows?: number; placeholderEn?: string; placeholderAr?: string; t: T;
}) {
  const isArea = rows > 1;
  return (
    <div className="space-y-2">
      <p className={LABEL}>{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagEn}</span>{t.colEn}
          </span>
          {isArea
            ? <textarea className={TEXTAREA} value={valueEn} onChange={e => onEn(e.target.value)} rows={rows} dir="ltr" placeholder={placeholderEn} />
            : <input    className={INPUT}    value={valueEn} onChange={e => onEn(e.target.value)} dir="ltr"  placeholder={placeholderEn} />}
        </div>
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagAr}</span>{t.colAr}
          </span>
          {isArea
            ? <textarea className={TEXTAREA} value={valueAr} onChange={e => onAr(e.target.value)} rows={rows} dir="rtl" placeholder={placeholderAr} />
            : <input    className={INPUT}    value={valueAr} onChange={e => onAr(e.target.value)} dir="rtl"  placeholder={placeholderAr} />}
        </div>
      </div>
    </div>
  );
}

/* ─── SingleField ────────────────────────────────────── */
function SingleField({
  label, value, onChange, placeholder = '', icon: Icon, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: React.ElementType; type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className={LABEL}>{label}</label>
      <div className={Icon ? ICON_WRAP : ''}>
        {Icon && <span className={ICON_INSET}><Icon size={15} strokeWidth={1.75} /></span>}
        <input
          type={type}
          className={Icon ? INPUT + ' ps-9' : INPUT}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
        />
      </div>
    </div>
  );
}

/* ─── SectionCard ────────────────────────────────────── */
function SectionCard({ title, badge, children, defaultOpen = false }: {
  title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-start hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150">
        {badge && (
          <span className="shrink-0 w-6 h-6 rounded-md bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
            {badge}
          </span>
        )}
        <span className="flex-1 font-bold text-slate-900 dark:text-white text-sm">{title}</span>
        <ChevronDown size={15} strokeWidth={2.5}
          className={['shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')} />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '9999px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5 flex flex-col gap-4 sm:gap-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function FieldDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-600 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ContactContentPage() {
  const { lang } = useAdminLang();
  const t = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [pageEn,  setPageEn]  = useState<Record<string, string>>({});
  const [pageAr,  setPageAr]  = useState<Record<string, string>>({});
  const [details, setDetails] = useState<ContactDetails>({
    email_general: '', email_projects: '', email_careers: '', phone: '', whatsapp: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/admin/content/contact')
      .then(r => r.json())
      .then(d => {
        setPageEn(d.pageContent.en ?? {});
        setPageAr(d.pageContent.ar ?? {});
        setDetails(d.details);
      })
      .finally(() => setLoading(false));
  }, []);

  const en      = (k: string) => pageEn[k] ?? '';
  const ar      = (k: string) => pageAr[k] ?? '';
  const setEn   = (k: string, v: string) => setPageEn(p => ({ ...p, [k]: v }));
  const setAr   = (k: string, v: string) => setPageAr(p => ({ ...p, [k]: v }));
  const setDetail = (k: keyof ContactDetails, v: string) =>
    setDetails(d => ({ ...d, [k]: v }));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ pageContent: { en: pageEn, ar: pageAr }, details }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert(lang === 'ar' ? 'فشل الحفظ. حاول مرة أخرى.' : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [pageEn, pageAr, details, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw size={20} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-28 flex flex-col gap-4 sm:gap-5" dir={dir}>

      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.pageDesc}</p>
      </div>

      {/* A — Page Header */}
      <SectionCard title={t.sectionA} badge="A" defaultOpen>
        <BiField t={t} label={t.eyebrow}
          valueEn={en('eyebrow')} valueAr={ar('eyebrow')}
          onEn={v => setEn('eyebrow', v)} onAr={v => setAr('eyebrow', v)}
          placeholderEn="Get In Touch" placeholderAr="تواصل معنا" />
        <BiField t={t} label={t.mainTitle}
          valueEn={en('title')} valueAr={ar('title')}
          onEn={v => setEn('title', v)} onAr={v => setAr('title', v)}
          placeholderEn="Connect with Our Engineering Team"
          placeholderAr="تواصل مع فريقنا الهندسي" />
        <BiField t={t} label={t.subtitle} rows={3}
          valueEn={en('subtitle')} valueAr={ar('subtitle')}
          onEn={v => setEn('subtitle', v)} onAr={v => setAr('subtitle', v)}
          placeholderEn="Whether you are starting a new project…"
          placeholderAr="سواء كنت تبدأ مشروعاً جديداً…" />
        <FieldDivider label={t.divInfo} />
        <BiField t={t} label={t.infoTitle}
          valueEn={en('info_title')} valueAr={ar('info_title')}
          onEn={v => setEn('info_title', v)} onAr={v => setAr('info_title', v)}
          placeholderEn="Contact Information" placeholderAr="معلومات التواصل" />
        <FieldDivider label={t.divPromise} />
        <BiField t={t} label={t.promiseTitle}
          valueEn={en('promise_title')} valueAr={ar('promise_title')}
          onEn={v => setEn('promise_title', v)} onAr={v => setAr('promise_title', v)}
          placeholderEn="What to Expect" placeholderAr="ماذا تتوقع" />
        <BiField t={t} label={t.promiseBody} rows={2}
          valueEn={en('promise_body')} valueAr={ar('promise_body')}
          onEn={v => setEn('promise_body', v)} onAr={v => setAr('promise_body', v)}
          placeholderEn="Our support team will review your inquiry…"
          placeholderAr="سيراجع الدعم لدينا استفساركم…" />
        <FieldDivider label={t.divCareers} />
        <BiField t={t} label={t.careersEyebrow}
          valueEn={en('careers_eyebrow')} valueAr={ar('careers_eyebrow')}
          onEn={v => setEn('careers_eyebrow', v)} onAr={v => setAr('careers_eyebrow', v)}
          placeholderEn="Careers & Opportunities" placeholderAr="التوظيف وبناء المستقبل" />
        <BiField t={t} label={t.careersTitle}
          valueEn={en('careers_title')} valueAr={ar('careers_title')}
          onEn={v => setEn('careers_title', v)} onAr={v => setAr('careers_title', v)}
          placeholderEn="Want to join our journey?" placeholderAr="هل ترغب في الانضمام إلى رحلتنا؟" />
        <BiField t={t} label={t.careersSub} rows={2}
          valueEn={en('careers_subtitle')} valueAr={ar('careers_subtitle')}
          onEn={v => setEn('careers_subtitle', v)} onAr={v => setAr('careers_subtitle', v)}
          placeholderEn="We are always seeking ambitious engineers…"
          placeholderAr="نبحث دائماً عن الكفاءات الهندسية والتقنية الطموحة…" />
        <BiField t={t} label={t.careersCta}
          valueEn={en('careers_cta_label')} valueAr={ar('careers_cta_label')}
          onEn={v => setEn('careers_cta_label', v)} onAr={v => setAr('careers_cta_label', v)}
          placeholderEn="Send your resume directly to" placeholderAr="أرسل سيرتك الذاتية مباشرة إلى" />
        <BiField t={t} label={t.careersBadge}
          valueEn={en('careers_badge')} valueAr={ar('careers_badge')}
          onEn={v => setEn('careers_badge', v)} onAr={v => setAr('careers_badge', v)}
          placeholderEn="Direct HR Review" placeholderAr="مراجعة مباشرة من الموارد البشرية" />
      </SectionCard>

      {/* B — Contact Details */}
      <SectionCard title={t.sectionB} badge="B" defaultOpen>
        <BiField t={t} label={t.addressLabel}
          valueEn={en('address_label')} valueAr={ar('address_label')}
          onEn={v => setEn('address_label', v)} onAr={v => setAr('address_label', v)}
          placeholderEn="Headquarters" placeholderAr="المقر الرئيسي" />
        <BiField t={t} label={t.addressValue} rows={2}
          valueEn={en('address_value')} valueAr={ar('address_value')}
          onEn={v => setEn('address_value', v)} onAr={v => setAr('address_value', v)}
          placeholderEn="Jubail Industrial Area 01, Eastern Province, KSA"
          placeholderAr="المدينة الصناعية الأولى — جبيل، المنطقة الشرقية" />

        <FieldDivider label={t.divEmail} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <BiField t={t} label={t.emailGenLabel}
              valueEn={en('email_general_label')} valueAr={ar('email_general_label')}
              onEn={v => setEn('email_general_label', v)} onAr={v => setAr('email_general_label', v)}
              placeholderEn="General Inquiries" placeholderAr="الاستفسارات العامة" />
            <SingleField label={t.emailGenAddr} value={details.email_general}
              onChange={v => setDetail('email_general', v)} placeholder="info@betavolt.com"
              icon={Mail} type="email" />
          </div>
          <div className="space-y-3">
            <BiField t={t} label={t.emailProjLabel}
              valueEn={en('email_projects_label')} valueAr={ar('email_projects_label')}
              onEn={v => setEn('email_projects_label', v)} onAr={v => setAr('email_projects_label', v)}
              placeholderEn="Project Inquiries" placeholderAr="استفسارات المشاريع" />
            <SingleField label={t.emailProjAddr} value={details.email_projects}
              onChange={v => setDetail('email_projects', v)} placeholder="engineering@betavolt.com"
              icon={Mail} type="email" />
          </div>
          <div className="space-y-3 sm:col-span-2">
            <BiField t={t} label={t.emailCarLabel}
              valueEn={en('email_careers_label')} valueAr={ar('email_careers_label')}
              onEn={v => setEn('email_careers_label', v)} onAr={v => setAr('email_careers_label', v)}
              placeholderEn="Careers & Talent" placeholderAr="التوظيف والوظائف" />
            <SingleField label={t.emailCarAddr} value={details.email_careers ?? ''}
              onChange={v => setDetail('email_careers', v)} placeholder="careers@betavolt.com.sa"
              icon={Mail} type="email" />
          </div>
        </div>

        <FieldDivider label={t.divPhone} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <BiField t={t} label={t.phoneLabel}
              valueEn={en('phone_label')} valueAr={ar('phone_label')}
              onEn={v => setEn('phone_label', v)} onAr={v => setAr('phone_label', v)}
              placeholderEn="Phone" placeholderAr="الهاتف" />
            <SingleField label={t.phoneNum} value={details.phone}
              onChange={v => setDetail('phone', v)} placeholder="+966 XX XXX XXXX"
              icon={Phone} type="tel" />
          </div>
          <div className="space-y-3">
            <p className={LABEL}>{t.whatsapp}</p>
            <div className="h-[calc(1.75rem+2px)]" aria-hidden="true" />
            <SingleField label={t.whatsappNum} value={details.whatsapp}
              onChange={v => setDetail('whatsapp', v)} placeholder="+966 XX XXX XXXX"
              icon={MessageCircle} type="tel" />
          </div>
        </div>

        <FieldDivider label={t.divHours} />
        <BiField t={t} label={t.hoursLabel}
          valueEn={en('hours_label')} valueAr={ar('hours_label')}
          onEn={v => setEn('hours_label', v)} onAr={v => setAr('hours_label', v)}
          placeholderEn="Working Hours" placeholderAr="ساعات العمل" />
        <BiField t={t} label={t.hoursValue}
          valueEn={en('hours_value')} valueAr={ar('hours_value')}
          onEn={v => setEn('hours_value', v)} onAr={v => setAr('hours_value', v)}
          placeholderEn="Sunday – Thursday  |  08:00 AM – 05:00 PM"
          placeholderAr="الأحد – الخميس  |  08:00 ص – 05:00 م" />
      </SectionCard>

      {/* Floating save bar */}
      <div className="fixed bottom-0 inset-x-0 lg:ps-64 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 flex justify-end pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">
              {saving ? t.saving : saved ? t.saved : t.saveHint}
            </span>
            <button
              type="button" onClick={handleSave} disabled={saving}
              className={[
                'inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm disabled:opacity-60 select-none whitespace-nowrap',
                saved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
              ].join(' ')}
            >
              {saving
                ? <RefreshCw size={15} strokeWidth={2} className="animate-spin" />
                : <Save size={15} strokeWidth={2} />}
              {saving ? t.saving : saved ? t.saved : t.save}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
