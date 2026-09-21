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
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content-store';
import '@/app/globals.css';

const BASE_URL = 'https://www.betavolt.com.sa';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const faviconUrl = (await getContent('favicon')) as string | null;

  const title = isAr
    ? 'بيتافولت للمقاولات | مراكز البيانات، أنظمة BMS، والتحكم الذكي'
    : 'BetaVolt Contracting | Data Centers, BMS & Smart Systems KSA';

  const description = isAr
    ? 'شركة بيتافولت للمقاولات الكهروميكانيكية المتخصصة في بنية مراكز البيانات (Tier III/IV)، أنظمة التحكم الذكي والمباني (BMS)، والتيار الخفيف، والشبكات الكهربائية في السعودية.'
    : 'BetaVolt is an enterprise B2B electromechanical contractor in Saudi Arabia specializing in Tier III/IV Data Centers, Building Management Systems (BMS), ELV, and smart infrastructure.';

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: isAr ? '%s | بيتافولت للمقاولات' : '%s | BetaVolt Contracting',
    },
    description,
    keywords: [
      'مقاول مراكز بيانات الرياض',
      'Data Center Contractor Saudi Arabia',
      'أنظمة BMS الرياض',
      'Building Management System KSA',
      'مقاول تيار خفيف',
      'Low Current Systems Contractor',
      'مقاول كهروميكانيك نيوم',
      'MEP Contractor Riyadh',
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ar: `${BASE_URL}/ar`,
        en: `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/ar`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      siteName: isAr ? 'بيتافولت للمقاولات' : 'BetaVolt Contracting',
      locale: isAr ? 'ar_SA' : 'en_US',
      type: 'website',
    },
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
        <JsonLd locale={locale as 'ar' | 'en'} />
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
