import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { getContent } from '@/lib/content-store';
import HeroMediaDisplay from './HeroMediaDisplay';
import type { HeroMedia } from '@/app/api/admin/content/home/media/route';
import { LeadMagnetTriggerButton } from '@/components/LeadMagnetModal';

/* ── SVG icons ── */
function BoltIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/></svg>; }
function SunIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>; }
function WifiIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>; }
function CameraIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function ServerIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>; }
function CpuIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/></svg>; }
function GearIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function GlobeIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function ArrowIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }

const SERVICE_ICONS = [BoltIcon, SunIcon, WifiIcon, CameraIcon, ServerIcon, CpuIcon, GearIcon, GlobeIcon];
const SERVICE_KEYS  = [
  'industrial_electrical', 'solar_energy', 'low_current', 'cctv_fire',
  'data_centers', 'bms', 'plc_scada', 'networks',
] as const;

export default async function Hero() {
  const t      = await getTranslations();
  const locale = await getLocale();
  const isAr   = locale === 'ar';

  const heroMedia = (await getContent('hero-media')) as HeroMedia | null;

  return (
    <section
      id="home"
      className="
        relative bg-slate-50 dark:bg-slate-900
        min-h-[calc(100vh-80px)]
        flex items-center
        pt-24 pb-16
        sm:pt-28 sm:pb-20
        lg:pt-32 lg:pb-24
        overflow-hidden
        transition-colors duration-300
      "
    >

      {/* ════════════════════════════════════════════════════════════
          LAYER 1 — Particle Mesh Grid (light + dark)
          Dots at every intersection + faint grid lines give the
          "particle mesh" look without CSS that conflicts with Tailwind.
          ════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: [
            /* dot node at each grid intersection */
            'radial-gradient(circle, rgba(75,163,227,0.28) 1.2px, transparent 1.2px)',
            /* horizontal lines */
            'linear-gradient(rgba(75,163,227,0.10) 1px, transparent 1px)',
            /* vertical lines */
            'linear-gradient(90deg, rgba(75,163,227,0.10) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '52px 52px',
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════
          LAYER 2 — Mesh bottom vignette (dark only)
          Smoothly dissolves the grid before the Stats Bar.
          ════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-56 opacity-0 dark:opacity-100 transition-opacity duration-700"
        style={{ background: 'linear-gradient(to top, #0f172a 0%, #0f172a 20%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════
          LAYER 3a — Light mode ambient blooms
          ════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute inset-0 dark:opacity-0 transition-opacity duration-500"
        style={{
          background: [
            'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(219,234,254,0.45) 0%, transparent 65%)',
            'radial-gradient(ellipse 50% 50% at 80% 60%, rgba(254,243,199,0.25) 0%, transparent 60%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════
          LAYER 3b — Dark mode ambient energy blooms
          Multiple layered radials create technological depth:
          • Large primary blue glow anchored behind the typography
          • Secondary right-side blue bloom behind the video column
          • Concentrated headline accent (blue core + amber shimmer)
          • Wide low-opacity field glow unifying the whole section
          ════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{
          background: [
            /* primary deep-blue glow — left/center, anchored to text */
            'radial-gradient(ellipse 60% 55% at 22% 42%, rgba(37,99,235,0.32) 0%, transparent 70%)',
            /* secondary blue bloom — upper right behind video */
            'radial-gradient(ellipse 55% 50% at 82% 32%, rgba(75,163,227,0.22) 0%, transparent 65%)',
            /* amber accent — subtle warmth near the headline */
            'radial-gradient(ellipse 35% 30% at 18% 28%, rgba(234,179,8,0.10) 0%, transparent 60%)',
            /* wide unified field — gives overall depth */
            'radial-gradient(ellipse 90% 75% at 50% 50%, rgba(30,64,175,0.10) 0%, transparent 80%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════
          LAYER 4 — Top edge accent line (dark only)
          ════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to right, transparent, rgba(75,163,227,0.35), transparent)' }}
        aria-hidden="true"
      />

      {/* ── Decorative pulse nodes ── */}
      <div className="pointer-events-none hidden lg:block absolute top-1/3 start-[4%] w-2 h-2 rounded-full bg-amber-400/50 dark:bg-amber-400/70 animate-pulse-slow" aria-hidden="true" />
      <div className="pointer-events-none hidden lg:block absolute bottom-1/3 end-[5%] w-1.5 h-1.5 rounded-full bg-blue-400/40 dark:bg-blue-400/60 animate-pulse-slow [animation-delay:1.4s]" aria-hidden="true" />
      <div className="pointer-events-none hidden xl:block absolute top-1/2 start-[11%] w-1 h-1 rounded-full bg-brand-blue/50 animate-pulse-slow [animation-delay:0.8s]" aria-hidden="true" />
      <div className="pointer-events-none hidden xl:block absolute top-[22%] end-[18%] w-1 h-1 rounded-full bg-amber-400/40 dark:bg-amber-400/60 animate-pulse-slow [animation-delay:2.2s]" aria-hidden="true" />

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center">

          {/* ── Content column (logical start) ── */}
          <div className="flex flex-col gap-5 text-start">

            {/* Eyebrow badge */}
            <div className="animate-fade-up [animation-delay:60ms]">
              <span className="
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                border border-blue-200 dark:border-blue-700/70
                bg-blue-50 dark:bg-blue-950/50
                text-blue-600 dark:text-blue-400
                text-xs font-bold tracking-[0.18em] uppercase
              ">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse shrink-0" aria-hidden="true" />
                {t('hero.headline_accent')}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="
                font-black tracking-tight
                text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem]
                text-slate-950 dark:text-white
                animate-fade-up [animation-delay:130ms]
              "
              style={isAr ? { lineHeight: '1.25' } : { lineHeight: '1.1' }}
            >
              {t('hero.headline_line1')}
              <br />
              <span className="text-blue-600 dark:text-blue-400">{t('hero.headline_line2')}</span>
            </h1>

            {/* Subtitle */}
            <p
              className="
                text-slate-600 dark:text-slate-400 leading-relaxed
                text-sm sm:text-base lg:text-[1.02rem]
                max-w-lg
                animate-fade-up [animation-delay:200ms]
              "
            >
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div
              className="
                flex flex-col sm:flex-row items-stretch sm:items-center
                gap-3
                animate-fade-up [animation-delay:270ms]
              "
            >
              <Link
                href="/projects"
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3.5
                  min-h-[48px]
                  rounded-lg
                  bg-blue-600 text-white font-bold
                  text-sm sm:text-[0.95rem]
                  shadow-lg shadow-blue-600/25 dark:shadow-blue-900/50
                  hover:bg-blue-700
                  transition-all duration-200 hover:scale-[1.03] active:scale-100
                "
              >
                {t('hero.cta_primary')}
                <span className="rtl:rotate-180 shrink-0" aria-hidden="true"><ArrowIcon /></span>
              </Link>

              <a
                href="#services"
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3.5
                  min-h-[48px]
                  rounded-lg
                  border border-slate-300 dark:border-slate-700
                  text-slate-700 dark:text-slate-300
                  font-semibold
                  bg-white dark:bg-slate-800/60
                  text-sm sm:text-[0.95rem]
                  hover:bg-slate-50 dark:hover:bg-slate-800
                  hover:border-slate-400 dark:hover:border-slate-600
                  hover:text-slate-900 dark:hover:text-white
                  transition-all duration-200
                "
              >
                {t('hero.cta_secondary')}
              </a>

              <LeadMagnetTriggerButton />
            </div>

            {/* Service Pills */}
            <div className="flex flex-wrap gap-2 animate-fade-up [animation-delay:340ms]">
              {SERVICE_KEYS.map((key, i) => {
                const Icon = SERVICE_ICONS[i];
                return (
                  <div
                    key={key}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1.5
                      rounded-full
                      border border-slate-200 dark:border-slate-700/80
                      bg-white dark:bg-slate-800/50
                      shadow-sm dark:shadow-none
                      text-slate-700 dark:text-slate-300
                      text-[0.72rem] font-medium
                      hover:border-blue-300/70 dark:hover:border-blue-500/60
                      hover:text-blue-700 dark:hover:text-blue-400
                      hover:shadow
                      transition-all duration-200 cursor-default select-none
                    "
                  >
                    <span className="text-amber-500 dark:text-amber-400 shrink-0" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="leading-none">{t(`services.${key}`)}</span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ── Media column (logical end) ── */}
          <div className="animate-fade-up [animation-delay:200ms]">
            <div
              className="
                relative
                rounded-3xl
                border-[6px] border-white dark:border-slate-800
                overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.12),0_6px_16px_rgba(0,0,0,0.06)]
                dark:shadow-[0_20px_70px_rgba(37,99,235,0.20),0_0_0_1px_rgba(75,163,227,0.12),0_6px_24px_rgba(0,0,0,0.5)]
                ring-1 ring-slate-200/80 dark:ring-blue-500/10
                transition-all duration-300
              "
            >
              <HeroMediaDisplay media={heroMedia} />

              {/* Subtle inner top gloss */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-10"
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)' }}
                aria-hidden="true"
              />
            </div>

            {/* Floating stat badge */}
            <div
              className="
                mt-3 ms-2
                inline-flex items-center gap-2.5
                px-4 py-2.5
                rounded-2xl
                border border-slate-200 dark:border-slate-700/70
                bg-white dark:bg-slate-800/70
                shadow-md dark:shadow-none
                backdrop-blur-sm
                transition-colors duration-300
                animate-fade-up [animation-delay:420ms]
              "
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700/60 text-blue-600 dark:text-blue-400 shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-[0.82rem] font-bold text-slate-900 dark:text-white">50+ {t('stats.stat1_label')}</span>
                <span className="text-[0.7rem] text-slate-500 dark:text-slate-400">{t('stats.stat4_label')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom fade into StatsBar ── */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
