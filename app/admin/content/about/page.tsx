'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ChevronDown, GripVertical, Star, Save, RefreshCw } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Types ──────────────────────────────────────────── */
interface Bilingual { en: string; ar: string }

interface DnaNode  { gold: boolean; title: Bilingual; body: Bilingual }
interface StatCard { value: Bilingual; label: Bilingual }
interface WhyCard  { icon: string; gold: boolean; title: Bilingual; body: Bilingual }

interface MapConfig {
  embedUrl: string;
  mapsUrl:  string;
  label:    Bilingual;
}

interface AboutContent {
  dna:   DnaNode[];
  stats: StatCard[];
  why:   WhyCard[];
  map:   MapConfig;
}

interface PageHeader { en: Record<string, string>; ar: Record<string, string> }

/* ─── Bilingual labels ───────────────────────────────── */
const L = {
  en: {
    pageTitle:      'About Page Content',
    pageDesc:       'Edit all bilingual content that appears on the About Us public page.',
    sectionA:       'A — Hero Section',
    sectionB:       'B — Company DNA (Vision / Mission / Values)',
    sectionC:       'C — Stats Cards',
    sectionD:       'D — Geographic Footprint (Map)',
    sectionE:       'E — Why BetaVolt Cards',
    eyebrow:        'Eyebrow Tag',
    headline:       'Main Headline',
    subtitle:       'Subtitle',
    sectionEyebrow: 'Section Eyebrow',
    sectionTitle:   'Section Title',
    node:           (i: number) => `Node ${i + 1}`,
    stat:           (i: number) => `Stat ${i + 1}`,
    card:           (i: number) => `Card ${i + 1}`,
    gold:           'Gold',
    title:          'Title',
    body:           'Body',
    value:          'Value',
    label:          'Label',
    icon:           'Icon',
    mapsEmbed:      'Google Maps Embed URL',
    mapsLink:       'Google Maps Link URL (Open in Maps button)',
    mapPin:         'Map Pin Label',
    addDna:         'Add DNA Node',
    addStat:        'Add Stat Card',
    addWhy:         'Add Why Card',
    save:           'Publish Changes',
    saving:         'Saving…',
    saved:          'Saved!',
    saveHint:       'Changes are saved to both message files and content JSON.',
    flagEn:         '🇬🇧',
    flagAr:         '🇸🇦',
    labelEn:        'English',
    labelAr:        'Arabic',
  },
  ar: {
    pageTitle:      'محتوى صفحة من نحن',
    pageDesc:       'تعديل جميع المحتويات ثنائية اللغة التي تظهر في صفحة "من نحن" العامة.',
    sectionA:       'أ — قسم الهيرو',
    sectionB:       'ب — هوية الشركة (الرؤية / الرسالة / القيم)',
    sectionC:       'ج — بطاقات الإحصائيات',
    sectionD:       'د — البصمة الجغرافية (الخريطة)',
    sectionE:       'هـ — بطاقات لماذا BetaVolt',
    eyebrow:        'النص الصغير فوق العنوان',
    headline:       'العنوان الرئيسي',
    subtitle:       'العنوان الفرعي',
    sectionEyebrow: 'نص القسم الصغير',
    sectionTitle:   'عنوان القسم',
    node:           (i: number) => `عقدة ${i + 1}`,
    stat:           (i: number) => `إحصاء ${i + 1}`,
    card:           (i: number) => `بطاقة ${i + 1}`,
    gold:           'ذهبي',
    title:          'العنوان',
    body:           'المحتوى',
    value:          'القيمة',
    label:          'التسمية',
    icon:           'الأيقونة',
    mapsEmbed:      'رابط تضمين خرائط جوجل',
    mapsLink:       'رابط خرائط جوجل (زر الفتح في الخرائط)',
    mapPin:         'نص دبوس الخريطة',
    addDna:         'إضافة عقدة هوية',
    addStat:        'إضافة بطاقة إحصاء',
    addWhy:         'إضافة بطاقة لماذا',
    save:           'نشر التغييرات',
    saving:         'جارٍ الحفظ…',
    saved:          'تم الحفظ!',
    saveHint:       'يتم الحفظ في ملفات الرسائل وملف JSON للمحتوى.',
    flagEn:         '🇬🇧',
    flagAr:         '🇸🇦',
    labelEn:        'الإنجليزية',
    labelAr:        'العربية',
  },
};

type T = typeof L['en'];

/* ─── Shared UI ──────────────────────────────────────── */
const LABEL    = 'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5';
const INPUT    = 'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-colors';
const TEXTAREA = INPUT + ' resize-none leading-relaxed';

function BiField({
  label, valueEn, valueAr, onEn, onAr, rows = 1, t,
}: {
  label: string; valueEn: string; valueAr: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  rows?: number; t: T;
}) {
  const Tag = rows > 1 ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5">
      <p className={LABEL}>{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" dir="ltr">
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagEn}</span> {t.labelEn}
          </p>
          <Tag
            className={rows > 1 ? TEXTAREA : INPUT}
            value={valueEn}
            onChange={e => onEn(e.target.value)}
            {...(rows > 1 ? { rows } : {})}
            dir="ltr"
          />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <span>{t.flagAr}</span> {t.labelAr}
          </p>
          <Tag
            className={rows > 1 ? TEXTAREA : INPUT}
            value={valueAr}
            onChange={e => onAr(e.target.value)}
            {...(rows > 1 ? { rows } : {})}
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  badge, title, children, defaultOpen = false,
}: {
  badge: string; title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white text-[10px] font-black shrink-0">
          {badge}
        </span>
        <span className="font-bold text-slate-900 dark:text-white text-sm flex-1">{title}</span>
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={['shrink-0 text-slate-400 transition-transform duration-300', open ? 'rotate-180' : ''].join(' ')}
        />
      </button>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? '9999px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 sm:gap-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Icon selector options ──────────────────────────── */
const ICON_OPTIONS = [
  { value: 'badge',   label: 'Badge / Award'    },
  { value: 'clock',   label: 'Clock'            },
  { value: 'headset', label: 'Headset / Support' },
  { value: 'star',    label: 'Star'             },
  { value: 'shield',  label: 'Shield'           },
  { value: 'zap',     label: 'Zap / Lightning'  },
];

/* ─── Page ───────────────────────────────────────────── */
export default function AboutContentPage() {
  const { lang } = useAdminLang();
  const t = L[lang];

  const [header,  setHeader]  = useState<PageHeader>({ en: {}, ar: {} });
  const [content, setContent] = useState<AboutContent>({
    dna: [], stats: [], why: [],
    map: { embedUrl: '', mapsUrl: '', label: { en: '', ar: '' } },
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    fetch('/api/admin/content/about')
      .then(r => r.json())
      .then(d => {
        setHeader(d.pageHeader);
        setContent(d.content);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Helpers ── */
  function setHeaderField(locale: 'en' | 'ar', key: string, val: string) {
    setHeader(h => ({ ...h, [locale]: { ...h[locale], [key]: val } }));
  }

  function setContentField<K extends keyof AboutContent>(key: K, val: AboutContent[K]) {
    setContent(c => ({ ...c, [key]: val }));
  }

  function setDna(i: number, patch: Partial<DnaNode>) {
    setContent(c => {
      const dna = [...c.dna];
      dna[i] = { ...dna[i], ...patch };
      return { ...c, dna };
    });
  }
  function addDna() {
    setContent(c => ({
      ...c,
      dna: [...c.dna, { gold: false, title: { en: '', ar: '' }, body: { en: '', ar: '' } }],
    }));
  }
  function removeDna(i: number) {
    setContent(c => ({ ...c, dna: c.dna.filter((_, idx) => idx !== i) }));
  }

  function setStat(i: number, patch: Partial<StatCard>) {
    setContent(c => {
      const stats = [...c.stats];
      stats[i] = { ...stats[i], ...patch };
      return { ...c, stats };
    });
  }
  function addStat() {
    setContent(c => ({
      ...c,
      stats: [...c.stats, { value: { en: '', ar: '' }, label: { en: '', ar: '' } }],
    }));
  }
  function removeStat(i: number) {
    setContent(c => ({ ...c, stats: c.stats.filter((_, idx) => idx !== i) }));
  }

  function setWhy(i: number, patch: Partial<WhyCard>) {
    setContent(c => {
      const why = [...c.why];
      why[i] = { ...why[i], ...patch };
      return { ...c, why };
    });
  }
  function addWhy() {
    setContent(c => ({
      ...c,
      why: [...c.why, { icon: 'badge', gold: false, title: { en: '', ar: '' }, body: { en: '', ar: '' } }],
    }));
  }
  function removeWhy(i: number) {
    setContent(c => ({ ...c, why: c.why.filter((_, idx) => idx !== i) }));
  }

  /* ── Save ── */
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/about', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ pageHeader: header, content }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert(lang === 'ar' ? 'فشل الحفظ. حاول مرة أخرى.' : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [header, content, lang]);

  /* ─── Render ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw size={20} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  const h = (locale: 'en' | 'ar', key: string) => header[locale]?.[key] ?? '';

  const BADGES = ['A', 'B', 'C', 'D', 'E'];

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-2 py-4 sm:py-6 pb-24 sm:pb-28 flex flex-col gap-4 sm:gap-5" dir={dir}>

      <div className="px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{t.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.pageDesc}</p>
      </div>

      {/* ── Section A: Hero ── */}
      <SectionCard badge={BADGES[0]} title={t.sectionA} defaultOpen>
        <BiField t={t} label={t.eyebrow}
          valueEn={h('en', 'eyebrow')} valueAr={h('ar', 'eyebrow')}
          onEn={v => setHeaderField('en', 'eyebrow', v)}
          onAr={v => setHeaderField('ar', 'eyebrow', v)}
        />
        <BiField t={t} label={t.headline}
          valueEn={h('en', 'hero_headline')} valueAr={h('ar', 'hero_headline')}
          onEn={v => setHeaderField('en', 'hero_headline', v)}
          onAr={v => setHeaderField('ar', 'hero_headline', v)}
        />
        <BiField t={t} label={t.subtitle} rows={3}
          valueEn={h('en', 'hero_subtitle')} valueAr={h('ar', 'hero_subtitle')}
          onEn={v => setHeaderField('en', 'hero_subtitle', v)}
          onAr={v => setHeaderField('ar', 'hero_subtitle', v)}
        />
      </SectionCard>

      {/* ── Section B: Company DNA ── */}
      <SectionCard badge={BADGES[1]} title={t.sectionB}>
        <BiField t={t} label={t.sectionEyebrow}
          valueEn={h('en', 'dna_eyebrow')} valueAr={h('ar', 'dna_eyebrow')}
          onEn={v => setHeaderField('en', 'dna_eyebrow', v)}
          onAr={v => setHeaderField('ar', 'dna_eyebrow', v)}
        />
        <BiField t={t} label={t.sectionTitle}
          valueEn={h('en', 'dna_title')} valueAr={h('ar', 'dna_title')}
          onEn={v => setHeaderField('en', 'dna_title', v)}
          onAr={v => setHeaderField('ar', 'dna_title', v)}
        />

        <div className="flex flex-col gap-4">
          {content.dna.map((node, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.node(i)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDna(i, { gold: !node.gold })}
                    className={[
                      'flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors',
                      node.gold
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-amber-300',
                    ].join(' ')}
                  >
                    <Star size={11} className={node.gold ? 'fill-current' : ''} />
                    {t.gold}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDna(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <BiField t={t} label={t.title}
                valueEn={node.title.en} valueAr={node.title.ar}
                onEn={v => setDna(i, { title: { ...node.title, en: v } })}
                onAr={v => setDna(i, { title: { ...node.title, ar: v } })}
              />
              <BiField t={t} label={t.body} rows={3}
                valueEn={node.body.en} valueAr={node.body.ar}
                onEn={v => setDna(i, { body: { ...node.body, en: v } })}
                onAr={v => setDna(i, { body: { ...node.body, ar: v } })}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addDna}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Plus size={15} />
          {t.addDna}
        </button>
      </SectionCard>

      {/* ── Section C: Stats ── */}
      <SectionCard badge={BADGES[2]} title={t.sectionC}>
        <BiField t={t} label={t.sectionEyebrow}
          valueEn={h('en', 'stats_eyebrow')} valueAr={h('ar', 'stats_eyebrow')}
          onEn={v => setHeaderField('en', 'stats_eyebrow', v)}
          onAr={v => setHeaderField('ar', 'stats_eyebrow', v)}
        />
        <BiField t={t} label={t.sectionTitle}
          valueEn={h('en', 'stats_title')} valueAr={h('ar', 'stats_title')}
          onEn={v => setHeaderField('en', 'stats_title', v)}
          onAr={v => setHeaderField('ar', 'stats_title', v)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.stat(i)}
                </span>
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <BiField t={t} label={t.value}
                valueEn={s.value.en} valueAr={s.value.ar}
                onEn={v => setStat(i, { value: { ...s.value, en: v } })}
                onAr={v => setStat(i, { value: { ...s.value, ar: v } })}
              />
              <BiField t={t} label={t.label}
                valueEn={s.label.en} valueAr={s.label.ar}
                onEn={v => setStat(i, { label: { ...s.label, en: v } })}
                onAr={v => setStat(i, { label: { ...s.label, ar: v } })}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStat}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Plus size={15} />
          {t.addStat}
        </button>
      </SectionCard>

      {/* ── Section D: Map ── */}
      <SectionCard badge={BADGES[3]} title={t.sectionD}>
        <BiField t={t} label={t.sectionEyebrow}
          valueEn={h('en', 'map_eyebrow')} valueAr={h('ar', 'map_eyebrow')}
          onEn={v => setHeaderField('en', 'map_eyebrow', v)}
          onAr={v => setHeaderField('ar', 'map_eyebrow', v)}
        />
        <BiField t={t} label={t.sectionTitle}
          valueEn={h('en', 'map_title')} valueAr={h('ar', 'map_title')}
          onEn={v => setHeaderField('en', 'map_title', v)}
          onAr={v => setHeaderField('ar', 'map_title', v)}
        />

        <div className="space-y-1.5">
          <label className={LABEL}>{t.mapsEmbed}</label>
          <input
            className={INPUT}
            value={content.map.embedUrl}
            onChange={e => {
              let val = e.target.value.trim();
              if (val && !val.includes('output=embed')) {
                const pinMatch = val.match(/!3d([0-9.-]+)!4d([0-9.-]+)/);
                if (pinMatch) {
                  val = `https://maps.google.com/maps?q=${pinMatch[1]},${pinMatch[2]}&z=16&output=embed`;
                } else {
                  const atMatch = val.match(/@([0-9.-]+),([0-9.-]+)/);
                  if (atMatch) {
                    val = `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=16&output=embed`;
                  } else {
                    const qMatch = val.match(/[?&]q=([0-9.-]+,[0-9.-]+)/);
                    if (qMatch) {
                      val = `https://maps.google.com/maps?q=${qMatch[1]}&z=16&output=embed`;
                    }
                  }
                }
              }
              setContentField('map', { ...content.map, embedUrl: val });
            }}
            dir="ltr"
            placeholder="https://maps.google.com/maps?q=26.2336915,49.9876096&z=16&output=embed"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {lang === 'ar'
              ? 'يدعم روابط التضمين المباشرة (output=embed) أو روابط الموقع العادية على خرائط جوجل وسيتم تحويلها تلقائياً لتجنب الحظر.'
              : 'Supports direct embed links (output=embed) or standard Google Maps place links, automatically converted to avoid embedding blocks.'}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className={LABEL}>{t.mapsLink}</label>
          <input
            className={INPUT}
            value={content.map.mapsUrl}
            onChange={e => setContentField('map', { ...content.map, mapsUrl: e.target.value })}
            dir="ltr"
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>

        <BiField t={t} label={t.mapPin}
          valueEn={content.map.label.en} valueAr={content.map.label.ar}
          onEn={v => setContentField('map', { ...content.map, label: { ...content.map.label, en: v } })}
          onAr={v => setContentField('map', { ...content.map, label: { ...content.map.label, ar: v } })}
        />
      </SectionCard>

      {/* ── Section E: Why BetaVolt ── */}
      <SectionCard badge={BADGES[4]} title={t.sectionE}>
        <BiField t={t} label={t.sectionEyebrow}
          valueEn={h('en', 'why_eyebrow')} valueAr={h('ar', 'why_eyebrow')}
          onEn={v => setHeaderField('en', 'why_eyebrow', v)}
          onAr={v => setHeaderField('ar', 'why_eyebrow', v)}
        />
        <BiField t={t} label={t.sectionTitle}
          valueEn={h('en', 'why_title')} valueAr={h('ar', 'why_title')}
          onEn={v => setHeaderField('en', 'why_title', v)}
          onAr={v => setHeaderField('ar', 'why_title', v)}
        />

        <div className="flex flex-col gap-4">
          {content.why.map((card, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t.card(i)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWhy(i, { gold: !card.gold })}
                    className={[
                      'flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors',
                      card.gold
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-amber-300',
                    ].join(' ')}
                  >
                    <Star size={11} className={card.gold ? 'fill-current' : ''} />
                    {t.gold}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeWhy(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={LABEL}>{t.icon}</label>
                <select
                  className={INPUT}
                  value={card.icon}
                  onChange={e => setWhy(i, { icon: e.target.value })}
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <BiField t={t} label={t.title}
                valueEn={card.title.en} valueAr={card.title.ar}
                onEn={v => setWhy(i, { title: { ...card.title, en: v } })}
                onAr={v => setWhy(i, { title: { ...card.title, ar: v } })}
              />
              <BiField t={t} label={t.body} rows={3}
                valueEn={card.body.en} valueAr={card.body.ar}
                onEn={v => setWhy(i, { body: { ...card.body, en: v } })}
                onAr={v => setWhy(i, { body: { ...card.body, ar: v } })}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addWhy}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Plus size={15} />
          {t.addWhy}
        </button>
      </SectionCard>

      {/* ── Floating Save Bar ── */}
      <div className="fixed bottom-0 inset-x-0 lg:ps-64 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 flex justify-end pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">
              {saving ? t.saving : saved ? t.saved : t.saveHint}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={[
                'inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm disabled:opacity-60 whitespace-nowrap',
                saved
                  ? 'bg-emerald-500 dark:bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
              ].join(' ')}
            >
              {saving ? (
                <RefreshCw size={15} strokeWidth={2} className="animate-spin" />
              ) : (
                <Save size={15} strokeWidth={2} />
              )}
              {saving ? t.saving : saved ? t.saved : t.save}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
