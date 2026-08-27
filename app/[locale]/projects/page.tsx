import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { supabase } from '@/lib/supabase';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import type { Project, ProjectCategory } from '@/lib/projects-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects – BetaVolt Engineering & Contracting',
  description:
    'Explore BetaVolt\'s portfolio of completed projects across Data Centers, Low Current & Smart Systems, Power & Electrical, and Infrastructure.',
};

type Props = { params: Promise<{ locale: string }> };

async function fetchProjects(): Promise<Project[]> {
  try {

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return [];

    return data.map(row => ({
      id:       row.id,
      category: row.category as ProjectCategory,
      image:    row.image_url,
      gallery:  row.gallery ?? [],
      location: { en: row.location_en, ar: row.location_ar },
      mapUrl:   row.map_url || undefined,
      title:    { en: row.title_en,    ar: row.title_ar    },
      challenge:{ en: row.challenge_en,ar: row.challenge_ar },
      solution: { en: row.solution_en, ar: row.solution_ar  },
    }));
  } catch {
    return [];
  }
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const [t, projects] = await Promise.all([
    getTranslations('projects_page'),
    fetchProjects(),
  ]);

  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 bg-grid bg-slate-50 dark:bg-transparent overflow-hidden">

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(75,163,227,0.13) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(75,163,227,0.25), transparent)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-blue-600/70 dark:text-brand-blue/70 mb-4 sm:mb-5">
            <span className="block w-8 h-px bg-blue-400/40 dark:bg-brand-blue/40" aria-hidden="true" />
            {t('eyebrow')}
            <span className="block w-8 h-px bg-blue-400/40 dark:bg-brand-blue/40" aria-hidden="true" />
          </p>
          <h1 className="font-black tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-slate-900 dark:text-white mb-5 sm:mb-6">
            {t('title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ── Grid + Filter ── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsGrid locale={locale} initialProjects={projects} />
        </div>
      </section>

    </main>
  );
}
