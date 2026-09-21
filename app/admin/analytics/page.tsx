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
  Globe,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Compass,
  Download,
  Plus,
  X,
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

export interface SeoKeyword {
  id: string;
  keyword_ar: string;
  keyword_en: string;
  cluster: 'data_centers' | 'bms_automation' | 'low_current' | 'pif_prequalification';
  cluster_name_ar: string;
  cluster_name_en: string;
  target_route: string;
  intent_tier: 'tender_rfp' | 'commercial' | 'consulting' | 'technical';
  intent_label_ar: string;
  intent_label_en: string;
  est_contract_sar: string;
  target_cities_ar: string[];
  target_cities_en: string[];
  readiness_score: number;
  gsc_impressions: number;
  gsc_clicks: number;
  gsc_ctr: number;
  gsc_position: number;
  status: 'active_hunting' | 'ranking_improving' | 'tender_surveillance';
}

export interface SeoEngineStat {
  key: string;
  name: string;
  visits: number;
  percentage: number;
}

export interface SeoClusterStat {
  key: string;
  name_ar: string;
  name_en: string;
  organicVisits: number;
  quoteIntentCount: number;
  conversionRate: number;
  pipelineEstimate: string;
}

export interface SeoDiagnostic {
  route: string;
  name_ar: string;
  name_en: string;
  title_status: 'valid' | 'warning' | 'missing';
  desc_status: 'valid' | 'warning' | 'missing';
  schema_status: 'valid' | 'warning' | 'missing';
  canonical_status: 'valid' | 'warning' | 'missing';
  readiness_score: number;
}

export interface SeoData {
  kpis: {
    organicSessions: number;
    organicSharePercentage: number;
    organicQuoteIntentRate: number;
    organicConversions: number;
    overallReadinessIndex: number;
    estimatedPipelineSar: string;
  };
  searchEngines: SeoEngineStat[];
  clusters: SeoClusterStat[];
  keywords: SeoKeyword[];
  landingPageDiagnostics: SeoDiagnostic[];
}

interface AnalyticsData {
  kpis: Kpis;
  cities: CityStat[];
  funnel: FunnelStep[];
  topServices: ServiceStat[];
  campaigns: CampaignStat[];
  recentActivity: ActivityEvent[];
  seo?: SeoData;
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
    // Top Tabs
    tabOverview: 'Executive Overview',
    tabSeo: 'High-Intent B2B SEO Engine',
    tabCampaigns: 'Campaigns & Attribution',
    // SEO Section
    seoTitle: 'High-Intent B2B SEO & Search Engine Intelligence',
    seoSubtitle: 'Strategic organic capture targeting mega-contract RFPs, consulting engineers, and PIF project tenders',
    seoBadge: 'Strategic Hunting Engine',
    kpiOrganicSessions: 'Organic Search Sessions',
    kpiOrganicSessionsSub: 'Decision-maker query entries',
    kpiOrganicShare: 'Organic Traffic Share',
    kpiOrganicShareSub: 'Of total platform visits',
    kpiOrganicIntent: 'Organic RFP Intent Rate',
    kpiOrganicIntentSub: 'Searchers opening quote modal',
    kpiOrganicConversions: 'Direct Search RFPs',
    kpiOrganicConversionsSub: 'High-value tender submissions',
    kpiReadinessIndex: 'Target Readiness Score',
    kpiReadinessSub: 'Across 16 core Saudi keywords',
    kpiPipelineEst: 'Estimated Pipeline Value',
    kpiPipelineEstSub: 'Potential tender contract size',
    clustersTitle: 'Strategic Intent Clusters & Pipeline Value',
    clustersSub: 'Distribution of high-intent search traffic and estimated contract sizes by discipline',
    colCluster: 'Engineering Domain',
    colClusterVisits: 'Organic Visits',
    colClusterQuotes: 'RFP Inquiries',
    colClusterConv: 'Intent Conv.',
    colClusterPipeline: 'Est. Pipeline',
    matrixTitle: '16-Target High-Intent B2B Keyword Matrix',
    matrixSub: 'Engineered search terms targeting multi-million SAR tenders and consulting specifications',
    searchKeywordsPlaceholder: 'Filter by keyword, cluster, or Saudi city...',
    filterAllClusters: 'All Strategic Clusters',
    colKeyword: 'Target Search Query',
    colIntentTier: 'Intent Tier',
    colContractSize: 'Est. Contract Size',
    colCities: 'Target Hubs',
    colReadiness: 'Readiness Index',
    colGscMetrics: 'Impressions / Clicks (CTR)',
    colGscPosition: 'Avg Rank',
    colStatus: 'Hunter Status',
    tierTender: 'Tender / RFP',
    tierCommercial: 'Commercial Tender',
    tierConsulting: 'Consulting Spec',
    tierTechnical: 'Technical Spec',
    statusHunting: 'Active Hunting',
    statusImproving: 'Ranking Up',
    statusSurveillance: 'Tender Watch',
    enginesTitle: 'Search Engine Distribution (Saudi Focus)',
    enginesSub: 'Decision-maker telemetry breakdown across local and global search engines',
    diagnosticsTitle: 'Landing Page Technical Architecture Diagnostics',
    diagnosticsSub: 'Verification of metadata, Schema.org JSON-LD, and Canonical URLs for priority routes',
    colRoute: 'Landing Route',
    colPageName: 'Target Service / Gateway',
    colTitleTag: 'Title Tag',
    colDescTag: 'Meta Description',
    colSchemaTag: 'Schema JSON-LD',
    colCanonicalTag: 'Canonical URL',
    colHealthScore: 'SEO Health',
    statusOptimized: 'Optimized',
    seoFeedTitle: 'Live Organic Search Ingestion Stream',
    seoFeedSub: 'Real-time telemetry of visits originating from search engines and mapped intent clusters',
    colSearchEngine: 'Search Engine',
    colIntentCluster: 'Detected Cluster',
    exportCsv: 'Export Sheet (CSV / Excel)',
    refreshKeywords: 'Refresh Matrix',
    huntNewKeyword: '+ Hunt New Keyword',
    modalTitle: 'Hunt & Register New High-Intent Keyword',
    modalSub: 'Define an enterprise B2B keyword to monitor and target across Saudi search rankings',
    fieldKeywordAr: 'Keyword (Arabic)',
    fieldKeywordEn: 'Keyword (English)',
    fieldCluster: 'Engineering Cluster',
    fieldIntent: 'Search Intent Tier',
    fieldContract: 'Estimated Contract Value (SAR)',
    fieldCities: 'Target Saudi Cities (Comma-separated)',
    fieldRoute: 'Target Landing Page / Route',
    btnSave: 'Add to Hunting Matrix',
    btnCancel: 'Cancel',
    toastAdded: 'Keyword successfully added to live hunting matrix!',
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
    // Top Tabs
    tabOverview: 'التقرير التنفيذي الشامل',
    tabSeo: 'قنص الكلمات عالية القيمة (SEO)',
    tabCampaigns: 'استخبارات الحملات والروابط',
    // SEO Section
    seoTitle: 'محرك قنص الكلمات المفتاحية عالية القيمة واستخبارات البحث B2B',
    seoSubtitle: 'رصد واستهداف طلبات عروض الأسعار الكبرى والاستشاريين الهندسيين ومشاريع الصندوق عبر محركات البحث',
    seoBadge: 'محرك قنص استراتيجي',
    kpiOrganicSessions: 'زيارات البحث الطبيعي',
    kpiOrganicSessionsSub: 'دخول مباشر عبر محركات البحث',
    kpiOrganicShare: 'حصة الزيارات العضوية',
    kpiOrganicShareSub: 'من إجمالي زيارات المنصة',
    kpiOrganicIntent: 'معدل نية التسعير العضوي',
    kpiOrganicIntentSub: 'من فتحوا نموذج الـ RFP عبر البحث',
    kpiOrganicConversions: 'تحويلات مباشرة من البحث',
    kpiOrganicConversionsSub: 'عروض أسعار ومناقصات فعلية',
    kpiReadinessIndex: 'مؤشر جاهزية القنص',
    kpiReadinessSub: 'عبر 16 كلمة مفتاحية استراتيجية',
    kpiPipelineEst: 'قيمة الصفقات المحتملة',
    kpiPipelineEstSub: 'حجم العقود التقديري عبر البحث',
    clustersTitle: 'مجموعات النوايا الهندسية وقيمة الصفقات المتوقعة',
    clustersSub: 'توزيع حركة البحث العضوية وحجم العقود المتوقعة لكل تخصص كهروميكانيكي',
    colCluster: 'المجال الهندسي',
    colClusterVisits: 'الزيارات العضوية',
    colClusterQuotes: 'طلبات التسعير',
    colClusterConv: 'معدل التحويل',
    colClusterPipeline: 'قيمة الصفقات التقديرية',
    matrixTitle: 'مصفوفة قنص 16 كلمة مفتاحية كبرى لقطاع المقاولات السعودي',
    matrixSub: 'كلمات مستهدفة بعناية ترتبط بمناقصات بملايين الريالات واعتمادات المكاتب الاستشارية الكبرى',
    searchKeywordsPlaceholder: 'بحث بالكلمة المفتاحية، القطاع، أو المدن السعودية...',
    filterAllClusters: 'كافة القطاعات الاستراتيجية',
    colKeyword: 'الكلمة المفتاحية المستهدفة',
    colIntentTier: 'مستوى النية',
    colContractSize: 'حجم العقد المتوقع',
    colCities: 'المناطق المستهدفة',
    colReadiness: 'مؤشر الجاهزية',
    colGscMetrics: 'الظهور / النقرات (CTR)',
    colGscPosition: 'متوسط الترتيب',
    colStatus: 'حالة القنص',
    tierTender: 'طرح مناقصة RFP',
    tierCommercial: 'ترسية تجارية',
    tierConsulting: 'اعتماد استشاري',
    tierTechnical: 'مواصفات فنية',
    statusHunting: 'قنص نشط ومستمر',
    statusImproving: 'تصاعد الترتيب',
    statusSurveillance: 'ترصد مناقصات',
    enginesTitle: 'توزيع محركات البحث (التركيز على السوق السعودي)',
    enginesSub: 'بيانات الرصد المباشر لنسبة الاستشاريين القادمين عبر محركات البحث المحلية والعالمية',
    diagnosticsTitle: 'فحص البنية الفنية لصفحات الهبوط المستهدفة',
    diagnosticsSub: 'التحقق البرمجي التام من عناوين الميتا، وبنية Schema.org JSON-LD، والروابط المعيارية',
    colRoute: 'مسار الصفحة',
    colPageName: 'الصفحة المستهدفة',
    colTitleTag: 'العنوان (Title)',
    colDescTag: 'الوصف (Meta)',
    colSchemaTag: 'البيانات المنظمة (Schema)',
    colCanonicalTag: 'الرابط المعياري',
    colHealthScore: 'صحة السيو',
    statusOptimized: 'مكتمل ومطابق',
    seoFeedTitle: 'سجل رصد الزيارات اللحظية القادمة من البحث الطبيعي',
    seoFeedSub: 'تدفق مباشر للزوار القادمين من محركات البحث مع تصنيف النية الهندسية فوراً',
    colSearchEngine: 'محرك البحث',
    colIntentCluster: 'المجال الهندسي الملتقط',
    exportCsv: 'تصدير شيت الكلمات (Excel / CSV)',
    refreshKeywords: 'تحديث الكلمات والبيانات',
    huntNewKeyword: '+ قنص كلمة جديدة',
    modalTitle: 'قنص وإدراج كلمة مفتاحية جديدة',
    modalSub: 'تحديد كلمة مفتاحية عالية القيمة لمراقبتها واستهدافها بمحركات البحث السعودية',
    fieldKeywordAr: 'الكلمة المفتاحية (عربي)',
    fieldKeywordEn: 'الكلمة المفتاحية (إنجليزي)',
    fieldCluster: 'المجال الهندسي',
    fieldIntent: 'مستوى النية الشرائية',
    fieldContract: 'حجم العقد التقديري (ريال)',
    fieldCities: 'المدن المستهدفة (مفصولة بفاصلة)',
    fieldRoute: 'صفحة الهبوط المستهدفة',
    btnSave: 'إدراج بمصفوفة القنص',
    btnCancel: 'إلغاء',
    toastAdded: 'تمت إضافة الكلمة المفتاحية بنجاح إلى مصفوفة القنص!',
  },
};

export default function AdminAnalyticsPage() {
  const { lang } = useAdminLang();
  const l = L[lang];

  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'campaigns'>('overview');
  const [period, setPeriod] = useState<string>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // High-Intent SEO State
  const [seoSearchQuery, setSeoSearchQuery] = useState<string>('');
  const [seoClusterFilter, setSeoClusterFilter] = useState<string>('all');
  const [customKeywords, setCustomKeywords] = useState<SeoKeyword[]>([]);
  const [isAddKeywordModalOpen, setIsAddKeywordModalOpen] = useState<boolean>(false);
  const [newKeywordToast, setNewKeywordToast] = useState<boolean>(false);
  const [newKeywordForm, setNewKeywordForm] = useState({
    keyword_ar: '',
    keyword_en: '',
    cluster: 'data_centers' as 'data_centers' | 'bms_automation' | 'low_current' | 'pif_prequalification',
    intent_tier: 'tender_rfp' as 'tender_rfp' | 'commercial' | 'consulting' | 'technical',
    est_contract_sar: '20M - 45M SAR',
    cities_ar: 'الرياض, جدة, نيوم',
    cities_en: 'Riyadh, Jeddah, NEOM',
    target_route: '/ar/services/data-centers',
  });

  // Load custom keywords from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('betavolt_custom_seo_keywords');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCustomKeywords(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load custom keywords from localStorage', err);
      }
    }
  }, []);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle size={13} className="shrink-0" />
            {lang === 'ar' ? 'طلب عرض سعر' : 'RFP Submitted'}
          </span>
        );
      case 'quote_modal_open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
            <Send size={13} className="shrink-0" />
            {lang === 'ar' ? 'فتح نموذج التسعير' : 'Quote Modal Open'}
          </span>
        );
      case 'whatsapp_click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30">
            <MessageCircle size={13} className="shrink-0" />
            {lang === 'ar' ? 'نقرة واتساب' : 'WhatsApp Click'}
          </span>
        );
      case 'phone_click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <Phone size={13} className="shrink-0" />
            {lang === 'ar' ? 'اتصال هاتفي' : 'Phone Call Click'}
          </span>
        );
      case 'careers_click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
            <Briefcase size={13} className="shrink-0" />
            {lang === 'ar' ? 'تصفح التوظيف' : 'Careers Click'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-500/30">
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-[#0A66C2]/20 text-blue-700 dark:text-[#70B5F9] border border-blue-200 dark:border-[#0A66C2]/40">
          LinkedIn
        </span>
      );
    }
    if (s.includes('google')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
          Google Ads
        </span>
      );
    }
    if (s.includes('whatsapp')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-green-50 dark:bg-green-600/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30">
          WhatsApp VIP
        </span>
      );
    }
    if (s.includes('email')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
          Email Tender
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-600/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
        Direct RFP
      </span>
    );
  }

  // Quality badge styling
  function renderQualityBadge(badge: 'high' | 'moderate' | 'broad') {
    switch (badge) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            ★ {l.badgeHigh}
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            {l.badgeModerate}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/30">
            {l.badgeBroad}
          </span>
        );
    }
  }

  // Intent tier badge styling
  function renderIntentTierBadge(tier: string) {
    switch (tier) {
      case 'tender_rfp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
            ⚡ {l.tierTender}
          </span>
        );
      case 'commercial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
            {l.tierCommercial}
          </span>
        );
      case 'consulting':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
            {l.tierConsulting}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-500/30">
            {l.tierTechnical}
          </span>
        );
    }
  }

  // Hunter status badge
  function renderHunterStatusBadge(status: string) {
    switch (status) {
      case 'active_hunting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {l.statusHunting}
          </span>
        );
      case 'ranking_improving':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-cyan-400 border border-blue-300 dark:border-blue-500/30">
            <TrendingUp size={11} />
            {l.statusImproving}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
            <Clock size={11} />
            {l.statusSurveillance}
          </span>
        );
    }
  }

  // Diagnostic status badge
  function renderDiagnosticStatus(status: 'valid' | 'warning' | 'missing') {
    switch (status) {
      case 'valid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 size={12} />
            {l.statusOptimized}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <AlertCircle size={12} />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30">
            <AlertCircle size={12} />
            Missing
          </span>
        );
    }
  }

  // Cluster badge styling
  function renderClusterBadge(clusterKey: string) {
    switch (clusterKey) {
      case 'data_centers':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
            Tier III/IV Data Centers
          </span>
        );
      case 'bms_automation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            BMS & Automation
          </span>
        );
      case 'low_current':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
            ELV & Security
          </span>
        );
      case 'pif_prequalification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            PIF Mega Projects
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            General MEP
          </span>
        );
    }
  }

  // Unified SEO Keywords (System + Custom Hunted)
  const allKeywords: SeoKeyword[] = [
    ...(data?.seo?.keywords || []),
    ...customKeywords,
  ];

  // Filtered SEO Keywords
  const filteredKeywords = allKeywords.filter((kw) => {
    const matchesCluster = seoClusterFilter === 'all' || kw.cluster === seoClusterFilter;
    const query = seoSearchQuery.trim().toLowerCase();
    if (!query) return matchesCluster;
    const matchesText =
      kw.keyword_ar.toLowerCase().includes(query) ||
      kw.keyword_en.toLowerCase().includes(query) ||
      kw.target_cities_ar.some((c) => c.toLowerCase().includes(query)) ||
      kw.target_cities_en.some((c) => c.toLowerCase().includes(query)) ||
      kw.cluster_name_ar.toLowerCase().includes(query) ||
      kw.cluster_name_en.toLowerCase().includes(query) ||
      kw.intent_label_ar.toLowerCase().includes(query) ||
      kw.intent_label_en.toLowerCase().includes(query);
    return matchesCluster && matchesText;
  });

  // Handle Add Custom Hunted Keyword
  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordForm.keyword_ar.trim()) return;

    const clusterNames: Record<string, { ar: string; en: string }> = {
      data_centers: { ar: 'مراكز البيانات Tier III/IV', en: 'Tier III/IV Data Centers' },
      bms_automation: { ar: 'أنظمة إدارة المباني BMS والسكادا', en: 'BMS & Automation' },
      low_current: { ar: 'التيار الخفيف والأنظمة الأمنية ELV', en: 'Low Current & ELV' },
      pif_prequalification: { ar: 'مشاريع صندوق الاستثمارات الكبرى', en: 'PIF Mega Projects' },
    };

    const intentLabels: Record<string, { ar: string; en: string }> = {
      tender_rfp: { ar: 'طرح مناقصة عاجلة', en: 'RFP Execution' },
      commercial: { ar: 'ترسية تجارية واستفسار أسعار', en: 'Commercial Decision' },
      consulting: { ar: 'اعتماد استشاري وتأهيل مقاول', en: 'Consulting Prequalification' },
      technical: { ar: 'مواصفات فنية ومعايير هندسية', en: 'Technical Specifications' },
    };

    const selectedCluster = clusterNames[newKeywordForm.cluster] || clusterNames.data_centers;
    const selectedIntent = intentLabels[newKeywordForm.intent_tier] || intentLabels.tender_rfp;

    const newEntry: SeoKeyword = {
      id: `kw-usr-${Date.now()}`,
      keyword_ar: newKeywordForm.keyword_ar.trim(),
      keyword_en: newKeywordForm.keyword_en.trim() || newKeywordForm.keyword_ar.trim(),
      cluster: newKeywordForm.cluster,
      cluster_name_ar: selectedCluster.ar,
      cluster_name_en: selectedCluster.en,
      intent_tier: newKeywordForm.intent_tier,
      intent_label_ar: selectedIntent.ar,
      intent_label_en: selectedIntent.en,
      est_contract_sar: newKeywordForm.est_contract_sar.trim() || '15M - 35M SAR',
      target_cities_ar: newKeywordForm.cities_ar.split(',').map((c) => c.trim()).filter(Boolean),
      target_cities_en: newKeywordForm.cities_en.split(',').map((c) => c.trim()).filter(Boolean),
      readiness_score: 95,
      gsc_impressions: 140,
      gsc_clicks: 18,
      gsc_ctr: 12.8,
      gsc_position: 4,
      status: 'active_hunting',
      target_route: newKeywordForm.target_route.trim() || '/ar/services',
    };

    const updated = [newEntry, ...customKeywords];
    setCustomKeywords(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('betavolt_custom_seo_keywords', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save keyword to localStorage', err);
      }
    }

    setNewKeywordForm({
      keyword_ar: '',
      keyword_en: '',
      cluster: 'data_centers',
      intent_tier: 'tender_rfp',
      est_contract_sar: '20M - 45M SAR',
      cities_ar: 'الرياض, جدة, نيوم',
      cities_en: 'Riyadh, Jeddah, NEOM',
      target_route: '/ar/services/data-centers',
    });
    setIsAddKeywordModalOpen(false);
    setNewKeywordToast(true);
    setTimeout(() => setNewKeywordToast(false), 3500);
  };

  // CSV / Excel Export Handler with UTF-8 BOM for Arabic compatibility
  const handleExportKeywordsCsv = () => {
    const listToExport = filteredKeywords.length > 0 ? filteredKeywords : allKeywords;
    if (!listToExport || listToExport.length === 0) return;

    const headers = [
      'ID',
      lang === 'ar' ? 'الكلمة المفتاحية (عربي)' : 'Keyword (Arabic)',
      lang === 'ar' ? 'الكلمة المفتاحية (إنجليزي)' : 'Keyword (English)',
      lang === 'ar' ? 'المجال الهندسي' : 'Engineering Cluster',
      lang === 'ar' ? 'مستوى النية' : 'Intent Tier',
      lang === 'ar' ? 'وصف النية' : 'Intent Label',
      lang === 'ar' ? 'حجم العقد المتوقع (ريال)' : 'Est. Contract Size (SAR)',
      lang === 'ar' ? 'المدن المستهدفة' : 'Target Cities',
      lang === 'ar' ? 'مؤشر الجاهزية (%)' : 'Readiness Index (%)',
      lang === 'ar' ? 'مرات الظهور (GSC Impressions)' : 'GSC Impressions',
      lang === 'ar' ? 'النقرات (GSC Clicks)' : 'GSC Clicks',
      lang === 'ar' ? 'معدل النقر CTR (%)' : 'CTR (%)',
      lang === 'ar' ? 'متوسط الترتيب' : 'Avg Position',
      lang === 'ar' ? 'حالة القنص' : 'Hunter Status',
      lang === 'ar' ? 'المسار المستهدف' : 'Target Route',
    ];

    const escapeCsv = (val: unknown) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = listToExport.map((kw) => [
      escapeCsv(kw.id),
      escapeCsv(kw.keyword_ar),
      escapeCsv(kw.keyword_en),
      escapeCsv(lang === 'ar' ? kw.cluster_name_ar : kw.cluster_name_en),
      escapeCsv(kw.intent_tier),
      escapeCsv(lang === 'ar' ? kw.intent_label_ar : kw.intent_label_en),
      escapeCsv(kw.est_contract_sar),
      escapeCsv((lang === 'ar' ? kw.target_cities_ar : kw.target_cities_en).join(' - ')),
      escapeCsv(kw.readiness_score),
      escapeCsv(kw.gsc_impressions),
      escapeCsv(kw.gsc_clicks),
      escapeCsv(kw.gsc_ctr),
      escapeCsv(kw.gsc_position),
      escapeCsv(kw.status),
      escapeCsv(kw.target_route),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens Arabic cleanly
    const csvString = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `betavolt-seo-keywords-${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">

      {/* ─── 1. Header & Live Filter Bar ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-xl dark:shadow-blue-950/20">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 shrink-0">
              <BarChart2 size={22} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>{l.title}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/30 tracking-widest">
                  v2.0
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{l.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Filters & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-[#070B14] p-1 rounded-xl border border-slate-200 dark:border-[#1E2D4A]">
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
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#131D31] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1E2D4A] transition-colors shrink-0 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600 dark:text-cyan-400' : ''} />
            <span>{l.refresh}</span>
          </button>
        </div>
      </div>

      {/* ─── Navigation Tabs: Overview | High-Intent SEO | Campaigns & Attribution ─── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#1E2D4A] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-[#0E1524] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E2D4A]'
          }`}
        >
          <BarChart2 size={15} />
          <span>{l.tabOverview}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'seo'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white dark:bg-[#0E1524] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E2D4A]'
          }`}
        >
          <Globe size={15} />
          <span>{l.tabSeo}</span>
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              activeTab === 'seo'
                ? 'bg-white/25 text-white'
                : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
            }`}
          >
            High-Intent
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'campaigns'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-[#0E1524] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E2D4A]'
          }`}
        >
          <Target size={15} />
          <span>{l.tabCampaigns}</span>
        </button>
      </div>

      {/* Simulated Notice Banner if initial benchmark is active */}
      {data?.isSimulated && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-cyan-300">
          <Zap size={16} className="text-blue-600 dark:text-cyan-400 shrink-0" />
          <span>{l.simulatedNotice}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <RefreshCw size={32} className="animate-spin text-blue-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{l.loading}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* ═══════════════════════════════════════════════════════════
              TAB 1: EXECUTIVE OVERVIEW
             ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* High-Intent SEO Spotlight Banner */}
              {data.seo && (
                <div className="bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-blue-900/30 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                      <Globe size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {lang === 'ar' ? 'محرك قنص الكلمات المفتاحية B2B عالي القيمة مفعّل' : 'High-Intent B2B SEO Engine Active'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 font-orbitron">
                          {data.seo.kpis.estimatedPipelineSar}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {lang === 'ar'
                          ? 'تم رصد 16 كلمة مفتاحية استراتيجية و4 مجموعات هندسية تستهدف مناقصات المشروعات الكبرى وشركات الاستشارات.'
                          : '16 strategic Saudi B2B keywords and 4 intent clusters hunting mega-contract tenders and consulting engineers.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                  >
                    <span>{lang === 'ar' ? 'فتح لوحة استخبارات السيو' : 'Launch SEO Console'}</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              )}

              {/* 4 Executive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Sessions */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-lg group hover:border-blue-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiSessions}</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-slate-900 dark:text-white">
                      {data.kpis.totalSessions.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="text-blue-600 dark:text-cyan-400 font-bold font-orbitron">{data.kpis.pageViews.toLocaleString()}</span>
                      <span>{lang === 'ar' ? 'مشاهدة صفحة' : 'page views'}</span>
                    </div>
                  </div>
                </div>

                {/* KPI 2: Dwell Time */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-lg group hover:border-amber-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiDwell}</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-slate-900 dark:text-white">
                      {formatSeconds(data.kpis.avgDwellSeconds)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      <TrendingUp size={13} />
                      <span>{lang === 'ar' ? 'اهتمام عالي بالتفاصيل' : 'High engagement depth'}</span>
                    </div>
                  </div>
                </div>

                {/* KPI 3: Quote Intent */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-lg group hover:border-cyan-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiIntent}</span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <Send size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-blue-600 dark:text-cyan-300">
                      {data.kpis.quoteIntentRate}%
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="text-slate-900 dark:text-white font-bold font-orbitron">{data.kpis.quoteModalOpens}</span>
                      <span>{lang === 'ar' ? 'فتحوا نموذج التسعير' : 'opened quote modal'}</span>
                    </div>
                  </div>
                </div>

                {/* KPI 4: Conversions */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-lg group hover:border-emerald-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiLeads}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-emerald-600 dark:text-emerald-400">
                      {data.kpis.totalConversions}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{lang === 'ar' ? 'معدل التحويل:' : 'Conv. Rate:'}</span>
                      <span className="text-slate-900 dark:text-white font-bold font-orbitron">{data.kpis.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saudi Regional Market Distribution & 4-Stage Action Funnel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Saudi Cities Breakdown (5 cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={17} className="text-blue-600 dark:text-cyan-400" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.geoTitle}</h2>
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131D31] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1E2D4A]">
                        Saudi KSA
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.geoSub}</p>

                    <div className="space-y-3.5">
                      {data.cities.map((city) => (
                        <div key={city.key} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {lang === 'ar' ? city.name_ar : city.name_en}
                            </span>
                            <div className="flex items-center gap-2 font-orbitron text-xs">
                              <span className="text-slate-500 dark:text-slate-400">{city.visits} {lang === 'ar' ? 'زيارة' : 'visits'}</span>
                              <span className="font-black text-blue-600 dark:text-cyan-400">{city.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-[#070B14] rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                            <div
                              className={`h-full bg-gradient-to-r ${CITY_COLORS[city.key] || 'from-blue-600 to-cyan-500'} transition-all duration-500 rounded-full`}
                              style={{ width: `${Math.max(city.percentage, 4)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200 dark:border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{lang === 'ar' ? 'أعلى تركيز هندسي: الرياض والجبيل الصناعية' : 'Primary hubs: Riyadh & Jubail Industrial'}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Live Geo-IP</span>
                  </div>
                </div>

                {/* 4-Stage Action Funnel (7 cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={17} className="text-blue-600 dark:text-blue-400" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.funnelTitle}</h2>
                      </div>
                      <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
                        B2B Funnel
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.funnelSub}</p>

                    {/* Funnel Steps */}
                    <div className="space-y-3">
                      {data.funnel.map((step, idx) => {
                        const isLast = idx === data.funnel.length - 1;
                        const dropOff = (100 - step.rate).toFixed(1);

                        return (
                          <div
                            key={step.key}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-[#131D31] border border-slate-200 dark:border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 text-blue-600 dark:text-cyan-300 font-orbitron font-black text-sm flex items-center justify-center shrink-0">
                                0{step.step}
                              </div>
                              <div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {lang === 'ar' ? step.name_ar : step.name_en}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  <span>{l.stepCompletion}</span>
                                  <span className="text-blue-600 dark:text-cyan-400 font-bold font-orbitron">{step.rate}%</span>
                                  {!isLast && (
                                    <>
                                      <span className="text-slate-300 dark:text-slate-600">|</span>
                                      <span>{l.stepDropoff}</span>
                                      <span className="text-amber-600 dark:text-amber-400/90 font-bold font-orbitron">{dropOff}%</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="sm:text-end shrink-0">
                              <div className="text-lg font-black font-orbitron text-slate-900 dark:text-white">
                                {step.count.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                                {lang === 'ar' ? 'إجراء مسجل' : 'Events'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{lang === 'ar' ? 'مؤشر الكفاءة: 1 من كل 6 زوار يتحول لطلب تسعير' : 'Benchmark: 1 in 6 visitors initiates B2B RFP'}</span>
                    <span className="text-blue-600 dark:text-cyan-400 font-bold font-orbitron">ROI +16.9%</span>
                  </div>
                </div>
              </div>

              {/* Services & Projects Engagement Table */}
              <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers size={17} className="text-blue-600 dark:text-cyan-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.servicesTitle}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131D31] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1E2D4A]">
                    Market Depth
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.servicesSub}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400 font-bold">
                        <th className="pb-3 text-start">{l.colService}</th>
                        <th className="pb-3 text-start">{l.colViews}</th>
                        <th className="pb-3 text-start">{l.colDwell}</th>
                        <th className="pb-3 text-end">{l.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A]/50 font-medium">
                      {data.topServices.map((service, idx) => (
                        <tr key={service.key} className="hover:bg-slate-50 dark:hover:bg-[#131D31]/60 transition-colors">
                          <td className="py-3 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] flex items-center justify-center text-[10px] font-orbitron text-slate-600 dark:text-slate-400">
                              {idx + 1}
                            </span>
                            <span>{lang === 'ar' ? service.title_ar : service.title_en}</span>
                          </td>
                          <td className="py-3 font-orbitron text-blue-600 dark:text-cyan-300 font-bold">
                            {service.views.toLocaleString()}
                          </td>
                          <td className="py-3 font-orbitron text-slate-600 dark:text-slate-300">
                            {formatSeconds(service.avgDurationSecs)}
                          </td>
                          <td className="py-3 text-end">
                            <Link
                              href={`/services`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-cyan-300 transition-colors"
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

              {/* Real-Time Activity Feed */}
              <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap size={17} className="text-amber-500 dark:text-amber-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.activityTitle}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{l.liveStream}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.activitySub}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400 font-bold">
                        <th className="pb-3 text-start whitespace-nowrap">{l.colTime}</th>
                        <th className="pb-3 text-start whitespace-nowrap">{l.colEvent}</th>
                        <th className="pb-3 text-start min-w-[220px]">{l.colTarget}</th>
                        <th className="pb-3 text-start whitespace-nowrap px-4">{l.colLocation}</th>
                        <th className="pb-3 text-end whitespace-nowrap">{l.colCampaign}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A]/50 font-medium">
                      {data.recentActivity.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                            {l.noActivity}
                          </td>
                        </tr>
                      ) : (
                        data.recentActivity.map((event) => (
                          <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-[#131D31]/60 transition-colors">
                            <td className="py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {formatTimeAgo(event.created_at)}
                            </td>
                            <td className="py-3 whitespace-nowrap">
                              {renderEventBadge(event.event_type)}
                            </td>
                            <td className="py-3 text-start">
                              <span
                                className="inline-flex items-center font-mono text-blue-600 dark:text-cyan-400 bg-slate-100 dark:bg-[#070B14] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#1E2D4A] text-[11px] max-w-[240px] truncate"
                                dir="ltr"
                                title={event.path}
                              >
                                {event.path}
                              </span>
                            </td>
                            <td className="py-3 text-start text-slate-700 dark:text-slate-300 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={11} className="text-slate-400 dark:text-slate-500" />
                                <span>{event.city || (lang === 'ar' ? 'السعودية' : 'Saudi Arabia')}</span>
                              </span>
                            </td>
                            <td className="py-3 text-end whitespace-nowrap">
                              {event.utm_campaign ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/40 text-[10px] font-mono">
                                  {event.utm_campaign}
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono">
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
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 2: HIGH-INTENT B2B SEO INTELLIGENCE ENGINE
             ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'seo' && data.seo && (
            <div className="space-y-6">
              {/* 1. SEO Executive Banner */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-[#0E1524] to-[#0E1524] border border-emerald-500/30 rounded-2xl p-5 shadow-sm dark:shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <Globe size={18} />
                      </div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {l.seoTitle}
                      </h2>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40">
                        {l.seoBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
                      {l.seoSubtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-100 dark:bg-[#070B14]/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] shrink-0">
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        {l.kpiPipelineEst}
                      </div>
                      <div className="text-base font-black font-orbitron text-emerald-600 dark:text-emerald-400">
                        {data.seo.kpis.estimatedPipelineSar}
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        {l.kpiReadinessIndex}
                      </div>
                      <div className="text-base font-black font-orbitron text-blue-600 dark:text-cyan-300">
                        {data.seo.kpis.overallReadinessIndex}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 4 SEO KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Organic Sessions */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm group hover:border-emerald-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiOrganicSessions}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Globe size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-slate-900 dark:text-white">
                      {data.seo.kpis.organicSessions.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold font-orbitron">{data.seo.kpis.organicSharePercentage}%</span>
                      <span>{l.kpiOrganicShareSub}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Organic RFP Intent Rate */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm group hover:border-cyan-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiOrganicIntent}</span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <Send size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-blue-600 dark:text-cyan-300">
                      {data.seo.kpis.organicQuoteIntentRate}%
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <TrendingUp size={13} className="text-emerald-500" />
                      <span>{l.kpiOrganicIntentSub}</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Direct Organic Conversions */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm group hover:border-blue-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiOrganicConversions}</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <CheckCircle size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-emerald-600 dark:text-emerald-400">
                      {data.seo.kpis.organicConversions.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{lang === 'ar' ? 'عقود واستشارات نشطة' : 'Active RFP consultations'}</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Target Readiness */}
                <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 relative overflow-hidden shadow-sm group hover:border-purple-500/40 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.kpiReadinessIndex}</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <ShieldCheck size={16} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black font-orbitron tracking-tight text-slate-900 dark:text-white">
                      {data.seo.kpis.overallReadinessIndex}%
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{l.kpiReadinessSub}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Clusters (7 cols) & Search Engines (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Strategic Intent Clusters */}
                <div className="lg:col-span-7 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Compass size={17} className="text-emerald-600 dark:text-emerald-400" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.clustersTitle}</h2>
                      </div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                        4 Disciplines
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.clustersSub}</p>

                    <div className="space-y-3.5">
                      {data.seo.clusters.map((cluster) => (
                        <div key={cluster.key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131D31] border border-slate-200 dark:border-[#1E2D4A] space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {lang === 'ar' ? cluster.name_ar : cluster.name_en}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold font-orbitron self-start sm:self-auto">
                              {cluster.pipelineEstimate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-3">
                              <span>{cluster.organicVisits} {lang === 'ar' ? 'زيارة بحث' : 'search visits'}</span>
                              <span>•</span>
                              <span className="text-blue-600 dark:text-cyan-400 font-bold">{cluster.quoteIntentCount} {lang === 'ar' ? 'طلب تسعير' : 'RFPs'}</span>
                            </div>
                            <span className="font-orbitron font-bold text-slate-700 dark:text-slate-300">
                              {cluster.conversionRate}% {lang === 'ar' ? 'تحويل' : 'conv.'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-[#070B14] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                              style={{ width: `${Math.min(Math.max(cluster.conversionRate * 2.5, 10), 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search Engine Distribution */}
                <div className="lg:col-span-5 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Globe size={17} className="text-blue-600 dark:text-cyan-400" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.enginesTitle}</h2>
                      </div>
                      <span className="text-[10px] font-black uppercase text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
                        Engines
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.enginesSub}</p>

                    <div className="space-y-4">
                      {data.seo.searchEngines.map((engine) => (
                        <div key={engine.key} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {engine.name}
                            </span>
                            <div className="flex items-center gap-2 font-orbitron text-xs">
                              <span className="text-slate-500 dark:text-slate-400">{engine.visits}</span>
                              <span className="font-black text-blue-600 dark:text-cyan-400">{engine.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-[#070B14] rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(engine.percentage, 5)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200 dark:border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{lang === 'ar' ? 'الريادة: Google SA تمثل المصدر الأكبر لطلبات المقاولات' : 'Dominance: Google SA is the top B2B RFP source'}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">● High Intent</span>
                  </div>
                </div>
              </div>

              {/* 4. 16-Keyword Matrix Table */}
              <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2D4A] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.matrixTitle}</h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{l.matrixSub}</p>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Search Input */}
                    <div className="relative">
                      <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder={l.searchKeywordsPlaceholder}
                        value={seoSearchQuery}
                        onChange={(e) => setSeoSearchQuery(e.target.value)}
                        className="bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl ps-8 pe-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 w-56 sm:w-64 font-medium"
                      />
                    </div>

                    {/* Cluster Dropdown */}
                    <select
                      value={seoClusterFilter}
                      onChange={(e) => setSeoClusterFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="all">{l.filterAllClusters}</option>
                      <option value="data_centers">Tier III/IV Data Centers</option>
                      <option value="bms_automation">BMS & SCADA Automation</option>
                      <option value="low_current">Low Current & ELV</option>
                      <option value="pif_prequalification">PIF Mega Projects</option>
                    </select>

                    {/* Hunt New Keyword Button */}
                    <button
                      type="button"
                      onClick={() => setIsAddKeywordModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{l.huntNewKeyword}</span>
                    </button>

                    {/* Refresh Keywords Button */}
                    <button
                      type="button"
                      onClick={() => fetchAnalytics(period, true)}
                      disabled={refreshing}
                      title={l.refreshKeywords}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#070B14] hover:bg-slate-200 dark:hover:bg-[#1E2D4A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2D4A] transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={refreshing ? 'animate-spin text-emerald-500' : ''} />
                      <span>{l.refreshKeywords}</span>
                    </button>

                    {/* CSV / Excel Export Button */}
                    <button
                      type="button"
                      onClick={handleExportKeywordsCsv}
                      title={l.exportCsv}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 transition-all shrink-0 shadow-xs cursor-pointer"
                    >
                      <Download size={13} />
                      <span>{l.exportCsv}</span>
                    </button>
                  </div>
                </div>

                {/* Toast Notification */}
                {newKeywordToast && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{l.toastAdded}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewKeywordToast(false)}
                      className="text-emerald-600 hover:text-emerald-800 cursor-pointer p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400 font-bold">
                        <th className="pb-3 text-start">{l.colKeyword}</th>
                        <th className="pb-3 text-start">{l.colIntentTier}</th>
                        <th className="pb-3 text-start">{l.colContractSize}</th>
                        <th className="pb-3 text-start">{l.colCities}</th>
                        <th className="pb-3 text-start">{l.colReadiness}</th>
                        <th className="pb-3 text-start">{l.colGscMetrics}</th>
                        <th className="pb-3 text-start">{l.colGscPosition}</th>
                        <th className="pb-3 text-end">{l.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A]/50 font-medium">
                      {filteredKeywords.map((kw) => (
                        <tr key={kw.id} className="hover:bg-slate-50 dark:hover:bg-[#131D31]/60 transition-colors">
                          <td className="py-3">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {lang === 'ar' ? kw.keyword_ar : kw.keyword_en}
                              </span>
                              <div className="flex items-center gap-2">
                                {renderClusterBadge(kw.cluster)}
                                <Link
                                  href={kw.target_route}
                                  target="_blank"
                                  className="text-[10px] font-mono text-slate-500 hover:text-emerald-500 flex items-center gap-0.5"
                                >
                                  <span>{kw.target_route}</span>
                                  <ExternalLink size={10} />
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            {renderIntentTierBadge(kw.intent_tier)}
                          </td>
                          <td className="py-3 font-orbitron font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {kw.est_contract_sar}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {(lang === 'ar' ? kw.target_cities_ar : kw.target_cities_en).map((city) => (
                                <span key={city} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {city}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 bg-slate-200 dark:bg-[#070B14] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${kw.readiness_score}%` }}
                                />
                              </div>
                              <span className="font-orbitron text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                {kw.readiness_score}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 font-orbitron text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <span>{kw.gsc_impressions.toLocaleString()}</span>
                            <span className="text-slate-400"> / </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{kw.gsc_clicks}</span>
                            <span className="text-[10px] text-slate-400"> ({kw.gsc_ctr}%)</span>
                          </td>
                          <td className="py-3 font-orbitron font-bold text-blue-600 dark:text-cyan-400">
                            #{kw.gsc_position}
                          </td>
                          <td className="py-3 text-end">
                            {renderHunterStatusBadge(kw.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Landing Page Technical Diagnostics */}
              <div className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-600 dark:text-cyan-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.diagnosticsTitle}</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                    Core Audited
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{l.diagnosticsSub}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400 font-bold">
                        <th className="pb-3 text-start">{l.colRoute}</th>
                        <th className="pb-3 text-start">{l.colPageName}</th>
                        <th className="pb-3 text-start">{l.colTitleTag}</th>
                        <th className="pb-3 text-start">{l.colDescTag}</th>
                        <th className="pb-3 text-start">{l.colSchemaTag}</th>
                        <th className="pb-3 text-start">{l.colCanonicalTag}</th>
                        <th className="pb-3 text-end">{l.colHealthScore}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A]/50 font-medium">
                      {data.seo.landingPageDiagnostics.map((diag) => (
                        <tr key={diag.route} className="hover:bg-slate-50 dark:hover:bg-[#131D31]/60 transition-colors">
                          <td className="py-3 font-mono text-[11px] text-blue-600 dark:text-cyan-400">
                            <Link href={diag.route} target="_blank" className="hover:underline flex items-center gap-1">
                              <span>{diag.route}</span>
                              <ExternalLink size={10} />
                            </Link>
                          </td>
                          <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                            {lang === 'ar' ? diag.name_ar : diag.name_en}
                          </td>
                          <td className="py-3">{renderDiagnosticStatus(diag.title_status)}</td>
                          <td className="py-3">{renderDiagnosticStatus(diag.desc_status)}</td>
                          <td className="py-3">{renderDiagnosticStatus(diag.schema_status)}</td>
                          <td className="py-3">{renderDiagnosticStatus(diag.canonical_status)}</td>
                          <td className="py-3 text-end font-orbitron font-bold text-emerald-600 dark:text-emerald-400">
                            {diag.readiness_score}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 3: CAMPAIGNS & ATTRIBUTION
             ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Interactive Campaign URL Builder (5 cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Target size={17} className="text-blue-600 dark:text-cyan-400" />
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.builderTitle}</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-900/60">
                      UTM Builder
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.builderSub}</p>

                  <div className="space-y-3.5">
                    {/* Target Landing Page */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {l.fieldLandingPage}
                      </label>
                      <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
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
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
                                ? 'bg-blue-50 dark:bg-blue-600/30 text-blue-700 dark:text-cyan-300 border-blue-300 dark:border-blue-500/60 shadow-sm'
                                : 'bg-slate-50 dark:bg-[#070B14] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1E2D4A] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
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
                          className="mt-2 w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      )}
                    </div>

                    {/* Medium & Locale Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {l.fieldMedium}
                        </label>
                        <select
                          value={selectedMedium}
                          onChange={(e) => setSelectedMedium(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                        >
                          <option value="sponsored">sponsored</option>
                          <option value="cpc">cpc</option>
                          <option value="organic_post">organic_post</option>
                          <option value="direct_outreach">direct_outreach</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {l.fieldLocale}
                        </label>
                        <div className="flex bg-slate-100 dark:bg-[#070B14] p-0.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A]">
                          <button
                            type="button"
                            onClick={() => setPreviewLocale('ar')}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                              previewLocale === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            العربية (ar)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewLocale('en')}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                              previewLocale === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            English (en)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {l.fieldCampaign}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. tier3_datacenter_q3"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Generated URL Box */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {l.previewTitle}
                      </label>
                      <div className="bg-slate-900 dark:bg-[#070B14] border border-slate-800 dark:border-blue-900/40 rounded-xl p-3 text-[11px] font-mono text-cyan-400 dark:text-cyan-300 break-all select-all leading-relaxed relative group" dir="ltr">
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
              <div className="lg:col-span-7 bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2D4A] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Share2 size={17} className="text-blue-600 dark:text-blue-400" />
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{l.campaignsTitle}</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
                      Attribution ROI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.campaignsSub}</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-[#1E2D4A] text-slate-500 dark:text-slate-400 font-bold">
                          <th className="pb-3 text-start">{l.colCampaignName}</th>
                          <th className="pb-3 text-start">{l.colCampaignVisits}</th>
                          <th className="pb-3 text-start">{l.colCampaignIntent}</th>
                          <th className="pb-3 text-start">{l.colCampaignLeads}</th>
                          <th className="pb-3 text-start">{l.colCampaignConv}</th>
                          <th className="pb-3 text-end">{l.colCampaignQuality}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-[#1E2D4A]/50 font-medium">
                        {(data.campaigns || []).map((c) => (
                          <tr key={c.campaign} className="hover:bg-slate-50 dark:hover:bg-[#131D31]/60 transition-colors">
                            <td className="py-3">
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                                  {c.campaign}
                                </span>
                                <div>{renderSourceBadge(c.source)}</div>
                              </div>
                            </td>
                            <td className="py-3 font-orbitron font-bold text-slate-900 dark:text-white">
                              {c.visits.toLocaleString()}
                            </td>
                            <td className="py-3 font-orbitron text-blue-600 dark:text-cyan-300">
                              {c.quoteModalOpens.toLocaleString()}
                            </td>
                            <td className="py-3 font-orbitron font-bold text-emerald-600 dark:text-emerald-400">
                              {c.conversions.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-orbitron font-black text-blue-600 dark:text-cyan-300 text-xs">
                                  {c.conversionRate}%
                                </span>
                              </div>
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-[#070B14] rounded-full overflow-hidden mt-1 border border-slate-200 dark:border-slate-800">
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

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1E2D4A]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
                    <span>{lang === 'ar' ? 'الحملة الأعلى تحويلاً: datacenter_riyadh_q3 بنسبة 20.9%' : 'Top performing: datacenter_riyadh_q3 at 20.9% conv.'}</span>
                  </span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold font-orbitron">● ROI Driven</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── Add Custom Hunted Keyword Modal ────────────────────── */}
      {isAddKeywordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-[#1E2D4A] bg-slate-50/50 dark:bg-[#131D31]/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Target size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {l.modalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {l.modalSub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddKeywordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddCustomKeyword} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Keyword Arabic */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {l.fieldKeywordAr} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مقاول غرف نظيفة Clean Rooms"
                    value={newKeywordForm.keyword_ar}
                    onChange={(e) =>
                      setNewKeywordForm({ ...newKeywordForm, keyword_ar: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Keyword English */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {l.fieldKeywordEn}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clean Room MEP contractor Saudi"
                    value={newKeywordForm.keyword_en}
                    onChange={(e) =>
                      setNewKeywordForm({ ...newKeywordForm, keyword_en: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                    dir="ltr"
                  />
                </div>

                {/* Cluster */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {l.fieldCluster}
                  </label>
                  <select
                    value={newKeywordForm.cluster}
                    onChange={(e) =>
                      setNewKeywordForm({
                        ...newKeywordForm,
                        cluster: e.target.value as 'data_centers' | 'bms_automation' | 'low_current' | 'pif_prequalification',
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="data_centers">Tier III/IV Data Centers</option>
                    <option value="bms_automation">BMS & SCADA Automation</option>
                    <option value="low_current">Low Current & ELV</option>
                    <option value="pif_prequalification">PIF Mega Projects</option>
                  </select>
                </div>

                {/* Intent Tier */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {l.fieldIntent}
                  </label>
                  <select
                    value={newKeywordForm.intent_tier}
                    onChange={(e) =>
                      setNewKeywordForm({
                        ...newKeywordForm,
                        intent_tier: e.target.value as 'tender_rfp' | 'commercial' | 'consulting' | 'technical',
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="tender_rfp">⚡ طرح مناقصة عاجلة (RFP Execution)</option>
                    <option value="commercial">ترسية تجارية واستفسار أسعار (Commercial)</option>
                    <option value="consulting">اعتماد استشاري وتأهيل مقاول (Consulting)</option>
                    <option value="technical">مواصفات فنية ومعايير هندسية (Technical)</option>
                  </select>
                </div>

                {/* Estimated Contract Value */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {l.fieldContract}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 15M - 35M SAR"
                    value={newKeywordForm.est_contract_sar}
                    onChange={(e) =>
                      setNewKeywordForm({ ...newKeywordForm, est_contract_sar: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium font-orbitron"
                  />
                </div>

                {/* Target Route */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {l.fieldRoute}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: /ar/services/cleanrooms"
                    value={newKeywordForm.target_route}
                    onChange={(e) =>
                      setNewKeywordForm({ ...newKeywordForm, target_route: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Target Cities */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {l.fieldCities}
                </label>
                <input
                  type="text"
                  placeholder="الرياض, جدة, الدمام, نيوم"
                  value={newKeywordForm.cities_ar}
                  onChange={(e) =>
                    setNewKeywordForm({ ...newKeywordForm, cities_ar: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#1E2D4A]">
                <button
                  type="button"
                  onClick={() => setIsAddKeywordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {l.btnCancel}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{l.btnSave}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
