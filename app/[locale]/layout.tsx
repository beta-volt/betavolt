import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/layout/ThemeProvider';
import AnalyticsBeacon from '@/components/AnalyticsBeacon';
import { getContent } from '@/lib/content-store';
import '@/app/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getContent('favicon') as string | null;
  return {
    title: 'BetaVolt – Engineering & Contracting',
    description:
      'BetaVolt specializes in electrical systems, low current, communications, solar energy, and smart infrastructure contracting.',
    ...(faviconUrl && {
      icons: { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl },
    }),
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={dir} className="min-h-screen flex flex-col justify-between">
      <ThemeProvider>
        <Suspense fallback={null}>
          <AnalyticsBeacon />
        </Suspense>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}
