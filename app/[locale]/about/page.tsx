import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us – BetaVolt Engineering & Contracting',
  description:
    'BetaVolt delivers precision-engineered electrical, low current, and smart infrastructure solutions across Saudi Arabia and the UAE.',
};

type Props = { params: Promise<{ locale: string }> };
type Lang  = 'en' | 'ar';
interface Bilingual { en: string; ar: string }

// ── Types from about-content.json ─────────────────────────────────────────
interface DnaNode  { gold: boolean; title: Bilingual; body: Bilingual }
interface StatCard { value: Bilingual; label: Bilingual }
interface WhyCard  { icon: string; gold: boolean; title: Bilingual; body: Bilingual }
interface MapCfg   { embedUrl: string; mapsUrl: string; label: Bilingual }
interface AboutContent {
  dna:   DnaNode[];
  stats: StatCard[];
  why:   WhyCard[];
  map:   MapCfg;
}

async function loadAboutContent(): Promise<AboutContent> {
  const EMPTY: AboutContent = { dna: [], stats: [], why: [], map: { embedUrl: '', mapsUrl: '', label: { en: '', ar: '' } } };
  try {
    const db = await getContent('about-content');
    if (db) return db as unknown as AboutContent;
  } catch { /* fall through */ }
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'about-content.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return EMPTY;
  }
}

/**
 * Defensively normalizes any Google Maps URL (place links, coordinates, or embed endpoints)
 * into a valid, frame-embeddable URL with output=embed and language parameter.
 */
function normalizeMapEmbedUrl(rawUrl: string, lang: Lang = 'ar'): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // If already a standard embed URL with output=embed
  if (url.includes('output=embed')) {
    if (!url.includes('hl=')) {
      url += (url.includes('?') ? '&' : '?') + 'hl=' + lang;
    }
    return url;
  }

  // Extract !3d(lat)!4d(lng) from Google Maps place URLs
  const pinMatch = url.match(/!3d([0-9.-]+)!4d([0-9.-]+)/);
  if (pinMatch) {
    return `https://maps.google.com/maps?q=${pinMatch[1]},${pinMatch[2]}&z=16&output=embed&hl=${lang}`;
  }

  // Extract @lat,lng from Google Maps place or viewport URLs
  const atMatch = url.match(/@([0-9.-]+),([0-9.-]+)/);
  if (atMatch) {
    return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=16&output=embed&hl=${lang}`;
  }

  // Extract q=lat,lng from search URLs
  const qMatch = url.match(/[?&]q=([0-9.-]+,[0-9.-]+)/);
  if (qMatch) {
    return `https://maps.google.com/maps?q=${qMatch[1]}&z=16&output=embed&hl=${lang}`;
  }

  return url;
}

// ── Icon components ────────────────────────────────────────────────────────

function BadgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

function WhyIcon({ name }: { name: string }) {
  switch (name) {
    case 'clock':   return <ClockIcon />;
    case 'headset': return <HeadsetIcon />;
    case 'star':    return <StarIcon />;
    case 'shield':  return <ShieldIcon />;
    case 'zap':     return <ZapIcon />;
    default:        return <BadgeIcon />;
  }
}

// ── Shared eyebrow component ───────────────────────────────────────────────

function Eyebrow({ label }: { label: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-500 mb-4">
      <span className="block w-6 h-px bg-brand-blue/40" aria-hidden="true" />
      {label}
      <span className="block w-6 h-px bg-brand-blue/40" aria-hidden="true" />
    </p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const lang = locale as Lang;
  const t    = await getTranslations('about');
  const { dna, stats, why, map } = await loadAboutContent();
  const safeEmbedUrl = normalizeMapEmbedUrl(map.embedUrl, lang);

  return (
    <main className="overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white">

      {/* ── 1. Blueprint Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[72vh] flex items-center justify-center pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-slate-50 dark:bg-[#07111F]"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(148,163,184,0.15) 1px,transparent 1px),linear-gradient(to bottom,rgba(148,163,184,0.15) 1px,transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(75,163,227,0.10) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right,transparent,rgba(75,163,227,0.3),transparent)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow label={t('eyebrow')} />
          <h1
            className="font-black tracking-tight leading-[1.1] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-slate-900 dark:text-white mb-6"
            style={lang === 'ar' ? { lineHeight: '1.5' } : undefined}
          >
            {t('hero_headline')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ── 2. Company DNA — Circuit Pathway ──────────────────────────── */}
      {dna.length > 0 && (
        <section className="py-20 sm:py-28 bg-white dark:bg-transparent">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Eyebrow label={t('dna_eyebrow')} />
              <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white">
                {t('dna_title')}
              </h2>
            </div>

            <div className="relative">
              <div
                className="absolute start-[13px] top-5 bottom-5 w-px"
                style={{
                  background:
                    'linear-gradient(to bottom,rgba(75,163,227,0.8),rgba(234,179,8,0.7),rgba(75,163,227,0.8))',
                }}
                aria-hidden="true"
              />

              <div className="flex flex-col">
                {dna.map((node, i) => (
                  <div key={i} className="relative flex items-start gap-6 sm:gap-8 pb-10 last:pb-0">
                    <div className="relative z-10 shrink-0 mt-1">
                      <div
                        className={[
                          'w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 ring-4 ring-slate-100 dark:ring-slate-900',
                          node.gold
                            ? 'border-brand-accent shadow-[0_0_14px_rgba(234,179,8,0.55)]'
                            : 'border-brand-blue  shadow-[0_0_14px_rgba(75,163,227,0.55)]',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            'w-2.5 h-2.5 rounded-full animate-pulse',
                            node.gold ? 'bg-brand-accent' : 'bg-brand-blue',
                          ].join(' ')}
                        />
                      </div>
                    </div>

                    <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 dark:backdrop-blur-md p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-brand-blue/40 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.10)] transition-all duration-300">
                      <h3
                        className={[
                          'text-base font-black mb-2 uppercase tracking-widest',
                          node.gold ? 'text-brand-accent' : 'text-brand-blue',
                        ].join(' ')}
                      >
                        {node.title[lang]}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        {node.body[lang]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Heavy Engineering Stats ────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="py-20 sm:py-28 border-y border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Eyebrow label={t('stats_eyebrow')} />
              <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white">
                {t('stats_title')}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-3 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 dark:backdrop-blur-md shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300"
                >
                  <p className="font-black text-2xl sm:text-3xl lg:text-4xl text-brand-accent tabular-nums leading-none">
                    {s.value[lang]}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-[0.9rem] font-medium leading-snug">
                    {s.label[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Glowing Map — Our Footprint ────────────────────────────── */}
      {safeEmbedUrl && (
        <section className="py-20 sm:py-28 bg-white dark:bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Eyebrow label={t('map_eyebrow')} />
              <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white">
                {t('map_title')}
              </h2>
            </div>

            <div className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 shadow-sm dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              <div className="relative w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden">
                <iframe
                  src={safeEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  className="dark:[filter:invert(90%)_hue-rotate(180deg)_saturate(0.85)_brightness(0.9)]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={map.label[lang]}
                />

                <div className="pointer-events-none absolute bottom-4 start-4">
                  <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-brand-blue/30 rounded-xl px-3 py-2 shadow-lg">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(75,163,227,0.8)]" />
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-white">
                      {map.label[lang]}
                    </span>
                  </div>
                </div>

                {map.mapsUrl && (
                  <div className="pointer-events-none absolute bottom-4 end-4">
                    <a
                      href={map.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-white bg-white/90 dark:bg-slate-900/90 hover:bg-brand-blue backdrop-blur-sm border border-brand-blue/30 hover:border-brand-blue px-3 py-2 rounded-xl transition-all duration-200 shadow-lg"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      {lang === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Why BetaVolt ───────────────────────────────────────────── */}
      {why.length > 0 && (
        <section className="py-20 sm:py-28 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Eyebrow label={t('why_eyebrow')} />
              <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white">
                {t('why_title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {why.map((card, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 dark:backdrop-blur-md shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute -top-10 -end-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: card.gold
                        ? 'radial-gradient(circle,rgba(234,179,8,0.15) 0%,transparent 70%)'
                        : 'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)',
                    }}
                    aria-hidden="true"
                  />

                  <div
                    className={[
                      'w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300',
                      card.gold
                        ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-brand-accent group-hover:bg-brand-accent/15 group-hover:border-brand-accent/40'
                        : 'bg-blue-50  border-blue-200  text-blue-600  dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-brand-blue  group-hover:bg-brand-blue/15  group-hover:border-brand-blue/40',
                    ].join(' ')}
                  >
                    <WhyIcon name={card.icon} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {card.title[lang]}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">
                    {card.body[lang]}
                  </p>

                  <div
                    className={[
                      'absolute bottom-0 inset-x-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-start',
                      card.gold
                        ? 'bg-gradient-to-r from-brand-accent/70 via-brand-accent/35 to-transparent'
                        : 'bg-gradient-to-r from-brand-blue/70  via-brand-blue/35  to-transparent',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
