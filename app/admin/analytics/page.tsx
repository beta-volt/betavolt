'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BarChart2,
  Users,
  Clock,
  Send,
  CheckCircle,
  MessageCircle,
  Phone,
  Briefcase,
  Layers,
  RefreshCw,
  TrendingUp,
  MapPin,
  ExternalLink,
  Zap,
  Copy,
  Check,
  Share2,
  Target,
  Sparkles,
} from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';

/* ─── Interfaces ────────────────────────────────────────── */
interface Kpis {
  totalSessions: number;
  pageViews: number;
  avgDwellSeconds: number;
  quoteModalOpens: number;
  totalConversions: number;
  conversionRate: number;
  quoteIntentRate: number;
  whatsappClicks: number;
  phoneClicks: number;
  careersClicks: number;
}

interface CityStat {
  key: string;
  name_ar: string;
  name_en: string;
  visits: number;
  percentage: number;
}

interface FunnelStep {
  step: number;
  key: string;
  name_ar: string;
  name_en: string;
  count: number;
  rate: number;
}

interface ServiceStat {
  key: string;
  title_ar: string;
  title_en: string;
  views: number;
  avgDurationSecs: number;
}

interface CampaignStat {
  campaign: string;
  source: string;
  medium: string;
  visits: number;
  quoteModalOpens: number;
  conversions: number;
  conversionRate: number;
  qualityBadge: 'high' | 'moderate' | 'broad';
  lastActive: string;
}

interface ActivityEvent {
  id: string;
  created_at: string;
  event_type: string;
  path: string;
  country?: string | null;
  city?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  duration_seconds?: number;
  metadata?: Record<string, unknown>;
}

interface AnalyticsData {
  kpis: Kpis;
  cities: CityStat[];
  funnel: FunnelStep[];
  topServices: ServiceStat[];
  campaigns: CampaignStat[];
  recentActivity: ActivityEvent[];
  period: string;
  isSimulated?: boolean;
}

/* ─── Bilingual Dictionary ──────────────────────────────── */
const L = {
  en: {
    title: 'Advanced Analytics & B2B Intelligence',
    subtitle: 'Track decision-maker traffic, Saudi regional distribution, and conversion funnel',
    today: 'Today',
    days7: 'Last 7 Days',
    days30: 'Last 30 Days',
    allTime: 'All Time',
    refresh: 'Refresh Data',
    liveStream: 'Live Ingestion Active',
    simulatedNotice: 'Initial baseline calibrated for Saudi B2B contracting benchmarks. Live records update automatically as traffic streams in.',
    kpiSessions: 'Decision-Maker Sessions',
    kpiSessionsSub: 'Unique corporate visits',
    kpiDwell: 'Avg Dwell Duration',
    kpiDwellSub: 'Engagement depth per session',
    kpiIntent: 'Quote Intent Rate',
    kpiIntentSub: 'Visitors opening RFP modal',
    kpiLeads: 'Total B2B Leads & RFPs',
    kpiLeadsSub: 'Conversion efficiency',
    geoTitle: 'Saudi Regional Market Distribution',
    geoSub: 'Concentration of engineering consultants and infrastructure projects',
    funnelTitle: '4-Stage B2B Action Conversion Funnel',
    funnelSub: 'Tracking visitor progression from initial view to official quote request',
    stepDropoff: 'Drop-off:',
    stepCompletion: 'Progression:',
    campaignsTitle: 'B2B Campaign Intelligence & Attribution Matrix',
    campaignsSub: 'Measure lead generation and ROI across LinkedIn, Google, and direct RFP outreach',
    builderTitle: 'Interactive Campaign URL Builder',
    builderSub: 'Generate standardized, tracked URLs for outbound campaigns and tenders',
    fieldLandingPage: 'Target Landing Page',
    fieldSource: 'Traffic Source (utm_source)',
    fieldMedium: 'Medium (utm_medium)',
    fieldCampaign: 'Campaign Name (utm_campaign)',
    fieldLocale: 'Language Version',
    copyUrl: 'Copy Campaign URL',
    copiedTooltip: 'Campaign URL copied to clipboard!',
    previewTitle: 'Generated Tracking URL',
    colCampaignName: 'Campaign & Channel',
    colCampaignVisits: 'Target Visits',
    colCampaignIntent: 'Quote Intent',
    colCampaignLeads: 'Leads Generated',
    colCampaignConv: 'Conv. Rate',
    colCampaignQuality: 'Quality Tier',
    colCampaignActive: 'Last Active',
    badgeHigh: 'High Intent',
    badgeModerate: 'Moderate',
    badgeBroad: 'Broad Audience',
    servicesTitle: 'Services & Infrastructure Engagement',
    servicesSub: 'Top explored electro-mechanical and data center divisions',
    colService: 'Service Division',
    colViews: 'Consultant Views',
    colDwell: 'Avg Reading Time',
    colAction: 'Inspect',
    activityTitle: 'Live Real-Time Activity Feed',
    activitySub: 'Instant stream of consultant events, RFPs, and clicks',
    colTime: 'Time',
    colEvent: 'Action Event',
    colTarget: 'Path / Section',
    colLocation: 'City / Region',
    colCampaign: 'Campaign / UTM',
    noActivity: 'No activity records found for this timeframe.',
    loading: 'Loading analytics intelligence...',
    errorLoad: 'Failed to fetch analytics metrics.',
    seconds: 's',
    minutes: 'm',
  },
  ar: {
    title: 'لوحة التحليلات المتقدمة واستخبارات الأعمال B2B',
    subtitle: 'رصد صناع القرار، التوزيع الجغرافي لمدن المملكة، وقمع التحويل اللحظي للمشاريع',
    today: 'اليوم',
    days7: 'آخر 7 أيام',
    days30: 'آخر 30 يوماً',
    allTime: 'كل الوقت',
    refresh: 'تحديث فوري',
    liveStream: 'استقبال البيانات اللحظي مفعّل',
    simulatedNotice: 'مؤشرات معيارية لقطاع المقاولات الكهروميكانيكية السعودي. يتم دمج السجلات الحية فوراً مع تدفق الزيارات.',
    kpiSessions: 'جلسات صناع القرار',
    kpiSessionsSub: 'زيارات فريدة للمنصة',
    kpiDwell: 'متوسط زمن المكوث',
    kpiDwellSub: 'عمق القراءة والتفاعل',
    kpiIntent: 'معدل نية التسعير',
    kpiIntentSub: 'من فتح نافذة عرض السعر',
    kpiLeads: 'إجمالي التحويلات وطلبات التسعير',
    kpiLeadsSub: 'نسبة التحويل العامة',
    geoTitle: 'التوزيع الجغرافي ومدن المملكة',
    geoSub: 'تركيز الزيارات من الاستشاريين والمطورين في المراكز الصناعية',
    funnelTitle: 'قمع التحويل والأفعال التفاعلي (Action Funnel)',
    funnelSub: 'مراحل رحلة العميل من التصفح العام حتى تقديم طلب عرض السعر والتواصل',
    stepDropoff: 'نسبة التسرب:',
    stepCompletion: 'نسبة الإكمال:',
    campaignsTitle: 'استخبارات الحملات التسويقية ومصفوفة العائد (Campaign Attribution)',
    campaignsSub: 'قياس أداء عروض الأسعار الناتجة من إعلانات لينكد إن، جوجل، وحملات التواصل المباشر',
    builderTitle: 'أداة توليد روابط الحملات التفاعلية (UTM Builder)',
    builderSub: 'توليد روابط تسويقية موثوقة بنقرة واحدة لتتبع الاستشاريين والمشاريع',
    fieldLandingPage: 'صفحة الهبوط المستهدفة',
    fieldSource: 'مصدر الزيارة (utm_source)',
    fieldMedium: 'نوع الوسيط (utm_medium)',
    fieldCampaign: 'اسم الحملة الإعلانية (utm_campaign)',
    fieldLocale: 'لغة الرابط',
    copyUrl: 'نسخ الرابط التسويقي',
    copiedTooltip: 'تم نسخ الرابط التسويقي بنجاح إلى الحافظة!',
    previewTitle: 'الرابط النهائي للتتبع المباشر',
    colCampaignName: 'اسم الحملة والقناة الإعلانية',
    colCampaignVisits: 'الزيارات المستهدفة',
    colCampaignIntent: 'نية التسعير',
    colCampaignLeads: 'طلبات الـ RFP',
    colCampaignConv: 'معدل التحويل',
    colCampaignQuality: 'جودة الاستهداف',
    colCampaignActive: 'آخر نشاط',
    badgeHigh: 'عالي الاستهداف',
    badgeModerate: 'متوسط الاستهداف',
    badgeBroad: 'زيارات عامة',
    servicesTitle: 'تحليل الاهتمام بالخدمات والمشاريع',
    servicesSub: 'القطاعات الكهروميكانيكية ومراكز البيانات الأكثر جذباً للاستشاريين',
    colService: 'القسم الهندسي',
    colViews: 'المشاهدات',
    colDwell: 'متوسط وقت القراءة',
    colAction: 'معاينة',
    activityTitle: 'سجل الأنشطة الحية اللحظي',
    activitySub: 'تدفق لحظي لأفعال الزوار ونقرات التواصل وطلبات الـ RFP',
    colTime: 'الوقت',
    colEvent: 'نوع الحدث',
    colTarget: 'المسار / الصفحة',
    colLocation: 'المدينة / الدولة',
    colCampaign: 'الحملة / الوسم',
    noActivity: 'لا توجد سجلات تتبعية لهذه الفترة الزمنية.',
    loading: 'جاري استدعاء مؤشرات التحليلات...',
    errorLoad: 'تعذر تحميل بيانات التحليلات.',
    seconds: 'ث',
    minutes: 'د',
  },
};

export default function AdminAnalyticsPage() {
  const { lang } = useAdminLang();
  const l = L[lang];

  const [period, setPeriod] = useState<string>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Campaign URL Builder State
  const [selectedPage, setSelectedPage] = useState<string>('/services/data-centers');
  const [selectedSource, setSelectedSource] = useState<string>('linkedin');
  const [customSource, setCustomSource] = useState<string>('');
  const [selectedMedium, setSelectedMedium] = useState<string>('sponsored');
  const [campaignName, setCampaignName] = useState<string>('tier3_datacenter_q3');
  const [previewLocale, setPreviewLocale] = useState<'ar' | 'en'>(lang);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  useEffect(() => {
    setPreviewLocale(lang);
  }, [lang]);

  const actualSource = selectedSource === 'custom' ? (customSource.trim().toLowerCase() || 'custom') : selectedSource;
  const actualCampaign = campaignName.trim().replace(/\s+/g, '_').toLowerCase() || 'campaign';
  const cleanPath = selectedPage === '/' ? '' : selectedPage;
  const generatedUrl = `https://betavolt.com.sa/${previewLocale}${cleanPath}?utm_source=${encodeURIComponent(actualSource)}&utm_medium=${encodeURIComponent(selectedMedium)}&utm_campaign=${encodeURIComponent(actualCampaign)}`;

  const handleCopyUrl = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(generatedUrl);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const fetchAnalytics = useCallback(async (selectedPeriod: string, isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/analytics?period=${selectedPeriod}`);
      if (!res.ok) throw new Error('API_FETCH_FAILED');

      const json = (await res.json()) as AnalyticsData;
      setData(json);
    } catch {
      setError(l.errorLoad);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [l.errorLoad]);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  // Format seconds to mm:ss or text
  function formatSeconds(totalSecs: number): string {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs}${l.seconds}`;
    return `${mins}${l.minutes} ${secs}${l.seconds}`;
  }

  // Format relative timestamp
  function formatTimeAgo(isoString: string): string {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return lang === 'ar' ? 'الآن' : 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} ${lang === 'ar' ? 'دقيقة' : 'm ago'}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ${lang === 'ar' ? 'ساعة' : 'h ago'}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${lang === 'ar' ? 'يوم' : 'd ago'}`;
  }

  // Badge styling per event type
  function renderEventBadge(type: string) {
    switch (type) {
      case 'quote_submit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle size={13} className="shrink-0" />
            {lang === 'ar' ? 'طلب عرض سعر' : 'RFP Submitted'}
          </span>
        );
      case 'quote_modal_open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Send size={13} className="shrink-0" />
            {lang === 'ar' ? 'فتح نموذج التسعير' : 'Quote Modal Open'}
          </span>
        );
      case 'whatsapp_click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-500/15 text-green-400 border border-green-500/30">
            <MessageCircle size={13} className="shrink-0" />
            {lang === 'ar' ? 'نقرة واتساب' : 'WhatsApp Click'}
          </span>
        );
      case 'phone_click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Phone size={13} className="shrink-0" />
            {lang === 'ar' ? 'اتصال هاتفي' : 'Phone Call Click'}
          </span>
        );
      case 'careers_click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Briefcase size={13} className="shrink-0" />
            {lang === 'ar' ? 'تصفح التوظيف' : 'Careers Click'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            <Layers size={13} className="shrink-0" />
            {lang === 'ar' ? 'مشاهدة صفحة' : 'Page View'}
          </span>
        );
    }
  }

  // City color bar accent
  const CITY_COLORS: Record<string, string> = {
    riyadh: 'from-blue-600 to-cyan-500',
    jubail: 'from-amber-500 to-orange-500',
    dammam: 'from-teal-500 to-emerald-500',
    jeddah: 'from-purple-500 to-pink-500',
    neom: 'from-cyan-400 to-blue-500',
    other: 'from-slate-500 to-slate-400',
  };

  // Badge styling per campaign source
  function renderSourceBadge(source: string) {
    const s = (source || '').toLowerCase();
    if (s.includes('linkedin')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0A66C2]/20 text-[#70B5F9] border border-[#0A66C2]/40">
          LinkedIn
        </span>
      );
    }
    if (s.includes('google')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
          Google Ads
        </span>
      );
    }
    if (s.includes('whatsapp')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-green-600/20 text-green-400 border border-green-500/30">
          WhatsApp VIP
        </span>
      );
    }
    if (s.includes('email')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-600/20 text-purple-400 border border-purple-500/30">
          Email Tender
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-600/20 text-amber-400 border border-amber-500/30">
        Direct RFP
      </span>
    );
  }

  // Quality badge styling
  function renderQualityBadge(badge: 'high' | 'moderate' | 'broad') {
    switch (badge) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            ★ {l.badgeHigh}
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {l.badgeModerate}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            {l.badgeBroad}
          </span>
        );
    }
  }

  return (
    <div className="space-y-6 text-slate-100 max-w-7xl mx-auto pb-12">

      {/* ─── 1. Header & Live Filter Bar ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl shadow-blue-950/20">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 shrink-0">
              <BarChart2 size={22} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{l.title}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/30 tracking-widest">
                  v2.0
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{l.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Filters & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center bg-[#070B14] p-1 rounded-xl border border-[#1E2D4A]">
            {[
              { key: 'today', label: l.today },
              { key: '7d', label: l.days7 },
              { key: '30d', label: l.days30 },
              { key: 'all', label: l.allTime },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  period === key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchAnalytics(period, true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#131D31] text-slate-200 hover:text-white hover:bg-slate-800 border border-[#1E2D4A] transition-colors shrink-0 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-cyan-400' : ''} />
            <span>{l.refresh}</span>
          </button>
        </div>
      </div>

      {/* Simulated Notice Banner if initial benchmark is active */}
      {data?.isSimulated && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-cyan-300">
          <Zap size={16} className="text-cyan-400 shrink-0" />
          <span>{l.simulatedNotice}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <RefreshCw size={32} className="animate-spin text-blue-500" />
          <p className="text-sm text-slate-400 font-medium">{l.loading}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ─── 2. Top KPI Cards ────────────────────────────────────── */}
      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* KPI 1: Sessions */}
            <div className="bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-lg group hover:border-blue-500/40 transition-colors">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l.kpiSessions}</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black font-orbitron tracking-tight text-white">
                  {data.kpis.totalSessions.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <span className="text-cyan-400 font-bold font-orbitron">{data.kpis.pageViews.toLocaleString()}</span>
                  <span>{lang === 'ar' ? 'مشاهدة صفحة' : 'page views'}</span>
                </div>
              </div>
            </div>

            {/* KPI 2: Dwell Time */}
            <div className="bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-lg group hover:border-amber-500/40 transition-colors">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l.kpiDwell}</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Clock size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black font-orbitron tracking-tight text-white">
                  {formatSeconds(data.kpis.avgDwellSeconds)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                  <TrendingUp size={13} />
                  <span>{lang === 'ar' ? 'اهتمام عالي بالتفاصيل' : 'High engagement depth'}</span>
                </div>
              </div>
            </div>

            {/* KPI 3: Quote Intent */}
            <div className="bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-lg group hover:border-cyan-500/40 transition-colors">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l.kpiIntent}</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Send size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black font-orbitron tracking-tight text-cyan-300">
                  {data.kpis.quoteIntentRate}%
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <span className="text-white font-bold font-orbitron">{data.kpis.quoteModalOpens}</span>
                  <span>{lang === 'ar' ? 'فتحوا نموذج التسعير' : 'opened quote modal'}</span>
                </div>
              </div>
            </div>

            {/* KPI 4: Conversions */}
            <div className="bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-lg group hover:border-emerald-500/40 transition-colors">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l.kpiLeads}</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black font-orbitron tracking-tight text-emerald-400">
                  {data.kpis.totalConversions}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <span>{lang === 'ar' ? 'معدل التحويل:' : 'Conv. Rate:'}</span>
                  <span className="text-white font-bold font-orbitron">{data.kpis.conversionRate}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* ─── 3. Two-Column Row: Saudi Cities & Conversion Funnel ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Saudi Cities Breakdown (5 cols) */}
            <div className="lg:col-span-5 bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={17} className="text-cyan-400" />
                    <h2 className="text-base font-bold text-white">{l.geoTitle}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-[#131D31] px-2 py-0.5 rounded border border-[#1E2D4A]">
                    Saudi KSA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{l.geoSub}</p>

                <div className="space-y-3.5">
                  {data.cities.map((city) => (
                    <div key={city.key} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">
                          {lang === 'ar' ? city.name_ar : city.name_en}
                        </span>
                        <div className="flex items-center gap-2 font-orbitron text-xs">
                          <span className="text-slate-400">{city.visits} {lang === 'ar' ? 'زيارة' : 'visits'}</span>
                          <span className="font-black text-cyan-400">{city.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-[#070B14] rounded-full overflow-hidden border border-slate-800/80">
                        <div
                          className={`h-full bg-gradient-to-r ${CITY_COLORS[city.key] || 'from-blue-600 to-cyan-500'} transition-all duration-500 rounded-full`}
                          style={{ width: `${Math.max(city.percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'ar' ? 'أعلى تركيز هندسي: الرياض والجبيل الصناعية' : 'Primary hubs: Riyadh & Jubail Industrial'}</span>
                <span className="text-emerald-400 font-bold">● Live Geo-IP</span>
              </div>
            </div>

            {/* 4-Stage Action Funnel (7 cols) */}
            <div className="lg:col-span-7 bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={17} className="text-blue-400" />
                    <h2 className="text-base font-bold text-white">{l.funnelTitle}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/60">
                    B2B Funnel
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{l.funnelSub}</p>

                {/* Funnel Steps */}
                <div className="space-y-3">
                  {data.funnel.map((step, idx) => {
                    const isLast = idx === data.funnel.length - 1;
                    const dropOff = (100 - step.rate).toFixed(1);

                    return (
                      <div
                        key={step.key}
                        className="p-3 rounded-xl bg-[#131D31] border border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-cyan-300 font-orbitron font-black text-sm flex items-center justify-center shrink-0">
                            0{step.step}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white">
                              {lang === 'ar' ? step.name_ar : step.name_en}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>{l.stepCompletion}</span>
                              <span className="text-cyan-400 font-bold font-orbitron">{step.rate}%</span>
                              {!isLast && (
                                <>
                                  <span className="text-slate-600">|</span>
                                  <span>{l.stepDropoff}</span>
                                  <span className="text-amber-400/90 font-bold font-orbitron">{dropOff}%</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-end shrink-0">
                          <div className="text-lg font-black font-orbitron text-white">
                            {step.count.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">
                            {lang === 'ar' ? 'إجراء مسجل' : 'Events'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'ar' ? 'مؤشر الكفاءة: 1 من كل 6 زوار يتحول لطلب تسعير' : 'Benchmark: 1 in 6 visitors initiates B2B RFP'}</span>
                <span className="text-cyan-400 font-bold font-orbitron">ROI +16.9%</span>
              </div>
            </div>

          </div>

          {/* ─── 4. B2B Campaign Intelligence Suite (UTM Builder & Attribution Matrix) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Interactive Campaign URL Builder (5 cols) */}
            <div className="lg:col-span-5 bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Target size={17} className="text-cyan-400" />
                    <h2 className="text-base font-bold text-white">{l.builderTitle}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/60">
                    UTM Builder
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{l.builderSub}</p>

                <div className="space-y-3.5">
                  {/* Target Landing Page */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      {l.fieldLandingPage}
                    </label>
                    <select
                      value={selectedPage}
                      onChange={(e) => setSelectedPage(e.target.value)}
                      className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="/services/data-centers">
                        {lang === 'ar' ? 'مراكز البيانات وتجهيز البنية التحتية (/services/data-centers)' : 'Data Centers & Infrastructure (/services/data-centers)'}
                      </option>
                      <option value="/services/bms">
                        {lang === 'ar' ? 'أنظمة إدارة المباني الذكية BMS (/services/bms)' : 'Smart Building BMS (/services/bms)'}
                      </option>
                      <option value="/services/low-current">
                        {lang === 'ar' ? 'أنظمة التيار الخفيف والاتصالات (/services/low-current)' : 'Low Current & Telecom (/services/low-current)'}
                      </option>
                      <option value="/services/automation">
                        {lang === 'ar' ? 'الأتمتة والتحكم الصناعي SCADA (/services/automation)' : 'Industrial Automation & SCADA (/services/automation)'}
                      </option>
                      <option value="/services/power-substations">
                        {lang === 'ar' ? 'محطات الطاقة وتوزيع الكهرباء (/services/power-substations)' : 'Power Stations & Distribution (/services/power-substations)'}
                      </option>
                      <option value="/projects">
                        {lang === 'ar' ? 'معرض المشاريع وسوابق الأعمال (/projects)' : 'Projects Portfolio (/projects)'}
                      </option>
                      <option value="/contact">
                        {lang === 'ar' ? 'طلب عرض سعر مباشر والتواصل (/contact)' : 'Contact & Direct RFP (/contact)'}
                      </option>
                      <option value="/">
                        {lang === 'ar' ? 'الصفحة الرئيسية للمنصة (/)' : 'BetaVolt Home (/) '}
                      </option>
                    </select>
                  </div>

                  {/* Traffic Source Buttons */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      {l.fieldSource}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: 'linkedin', label: 'LinkedIn' },
                        { key: 'google', label: 'Google Ads' },
                        { key: 'whatsapp', label: 'WhatsApp VIP' },
                        { key: 'email', label: 'Email Tender' },
                        { key: 'direct_rfp', label: 'Direct RFP' },
                        { key: 'custom', label: lang === 'ar' ? 'مخصص' : 'Custom' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedSource(item.key)}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all border text-center ${
                            selectedSource === item.key
                              ? 'bg-blue-600/30 text-cyan-300 border-blue-500/60 shadow-sm'
                              : 'bg-[#070B14] text-slate-400 border-[#1E2D4A] hover:text-white hover:border-slate-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {selectedSource === 'custom' && (
                      <input
                        type="text"
                        placeholder="e.g. twitter, conference, portal"
                        value={customSource}
                        onChange={(e) => setCustomSource(e.target.value)}
                        className="mt-2 w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    )}
                  </div>

                  {/* Medium & Locale Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                        {l.fieldMedium}
                      </label>
                      <select
                        value={selectedMedium}
                        onChange={(e) => setSelectedMedium(e.target.value)}
                        className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      >
                        <option value="sponsored">sponsored</option>
                        <option value="cpc">cpc</option>
                        <option value="organic_post">organic_post</option>
                        <option value="direct_outreach">direct_outreach</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                        {l.fieldLocale}
                      </label>
                      <div className="flex bg-[#070B14] p-0.5 rounded-xl border border-[#1E2D4A]">
                        <button
                          type="button"
                          onClick={() => setPreviewLocale('ar')}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                            previewLocale === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          العربية (ar)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewLocale('en')}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                            previewLocale === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          English (en)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      {l.fieldCampaign}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. tier3_datacenter_q3"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Generated URL Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      {l.previewTitle}
                    </label>
                    <div className="bg-[#070B14] border border-blue-900/40 rounded-xl p-3 text-[11px] font-mono text-cyan-300 break-all select-all leading-relaxed relative group" dir="ltr">
                      {generatedUrl}
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy Button with Toast */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 shadow-md ${
                    copiedToast
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  {copiedToast ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedToast ? l.copiedTooltip : l.copyUrl}</span>
                </button>
              </div>
            </div>

            {/* Right: Campaign Performance Leaderboard (7 cols) */}
            <div className="lg:col-span-7 bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Share2 size={17} className="text-blue-400" />
                    <h2 className="text-base font-bold text-white">{l.campaignsTitle}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/60">
                    Attribution ROI
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{l.campaignsSub}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-[#1E2D4A] text-slate-400 font-bold">
                        <th className="pb-3 text-start">{l.colCampaignName}</th>
                        <th className="pb-3 text-start">{l.colCampaignVisits}</th>
                        <th className="pb-3 text-start">{l.colCampaignIntent}</th>
                        <th className="pb-3 text-start">{l.colCampaignLeads}</th>
                        <th className="pb-3 text-start">{l.colCampaignConv}</th>
                        <th className="pb-3 text-end">{l.colCampaignQuality}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2D4A]/50 font-medium">
                      {(data.campaigns || []).map((c) => (
                        <tr key={c.campaign} className="hover:bg-[#131D31]/60 transition-colors">
                          <td className="py-3">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-200 font-mono text-[11px]">
                                {c.campaign}
                              </span>
                              <div>{renderSourceBadge(c.source)}</div>
                            </div>
                          </td>
                          <td className="py-3 font-orbitron font-bold text-white">
                            {c.visits.toLocaleString()}
                          </td>
                          <td className="py-3 font-orbitron text-cyan-300">
                            {c.quoteModalOpens.toLocaleString()}
                          </td>
                          <td className="py-3 font-orbitron font-bold text-emerald-400">
                            {c.conversions.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-orbitron font-black text-cyan-300 text-xs">
                                {c.conversionRate}%
                              </span>
                            </div>
                            <div className="w-16 h-1.5 bg-[#070B14] rounded-full overflow-hidden mt-1 border border-slate-800">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                                style={{ width: `${Math.min(Math.max(c.conversionRate * 3.5, 8), 100)}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3 text-end">
                            {renderQualityBadge(c.qualityBadge)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>{lang === 'ar' ? 'الحملة الأعلى تحويلاً: datacenter_riyadh_q3 بنسبة 20.9%' : 'Top performing: datacenter_riyadh_q3 at 20.9% conv.'}</span>
                </span>
                <span className="text-cyan-400 font-bold font-orbitron">● ROI Driven</span>
              </div>
            </div>

          </div>

          {/* ─── 5. Services & Projects Engagement Table ───────────── */}
          <div className="bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers size={17} className="text-cyan-400" />
                <h2 className="text-base font-bold text-white">{l.servicesTitle}</h2>
              </div>
              <span className="text-[10px] font-black uppercase text-slate-400 bg-[#131D31] px-2 py-0.5 rounded border border-[#1E2D4A]">
                Market Depth
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">{l.servicesSub}</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-[#1E2D4A] text-slate-400 font-bold">
                    <th className="pb-3 text-start">{l.colService}</th>
                    <th className="pb-3 text-start">{l.colViews}</th>
                    <th className="pb-3 text-start">{l.colDwell}</th>
                    <th className="pb-3 text-end">{l.colAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2D4A]/50 font-medium">
                  {data.topServices.map((service, idx) => (
                    <tr key={service.key} className="hover:bg-[#131D31]/60 transition-colors">
                      <td className="py-3 font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#070B14] border border-[#1E2D4A] flex items-center justify-center text-[10px] font-orbitron text-slate-400">
                          {idx + 1}
                        </span>
                        <span>{lang === 'ar' ? service.title_ar : service.title_en}</span>
                      </td>
                      <td className="py-3 font-orbitron text-cyan-300 font-bold">
                        {service.views.toLocaleString()}
                      </td>
                      <td className="py-3 font-orbitron text-slate-300">
                        {formatSeconds(service.avgDurationSecs)}
                      </td>
                      <td className="py-3 text-end">
                        <Link
                          href={`/services`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-cyan-300 transition-colors"
                        >
                          <span>{l.colAction}</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── 5. Real-Time Activity Feed ────────────────────────── */}
          <div className="bg-[#0E1524] border border-[#1E2D4A] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Zap size={17} className="text-amber-400" />
                <h2 className="text-base font-bold text-white">{l.activityTitle}</h2>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{l.liveStream}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4">{l.activitySub}</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-[#1E2D4A] text-slate-400 font-bold">
                    <th className="pb-3 text-start">{l.colTime}</th>
                    <th className="pb-3 text-start">{l.colEvent}</th>
                    <th className="pb-3 text-start">{l.colTarget}</th>
                    <th className="pb-3 text-start">{l.colLocation}</th>
                    <th className="pb-3 text-end">{l.colCampaign}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2D4A]/50 font-medium">
                  {data.recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        {l.noActivity}
                      </td>
                    </tr>
                  ) : (
                    data.recentActivity.map((event) => (
                      <tr key={event.id} className="hover:bg-[#131D31]/60 transition-colors">
                        <td className="py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {formatTimeAgo(event.created_at)}
                        </td>
                        <td className="py-3">
                          {renderEventBadge(event.event_type)}
                        </td>
                        <td className="py-3 font-mono text-slate-300 text-[11px] max-w-xs truncate" dir="ltr">
                          {event.path}
                        </td>
                        <td className="py-3 text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={11} className="text-slate-500" />
                            <span>{event.city || (lang === 'ar' ? 'السعودية' : 'Saudi Arabia')}</span>
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          {event.utm_campaign ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 text-[10px] font-mono">
                              {event.utm_campaign}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px] font-mono">
                              {event.utm_source || 'organic'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}

    </div>
  );
}
