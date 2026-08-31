import { getRequestConfig } from 'next-intl/server';
import { unstable_cache } from 'next/cache';
import { routing } from './routing';
import { getContent } from '@/lib/content-store';
import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';

const staticMessageMap: Record<string, Record<string, unknown>> = {
  en: enMessages as Record<string, unknown>,
  ar: arMessages as Record<string, unknown>,
};

function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined && source[key] !== null) {
      result[key] = source[key];
    }
  }
  return result;
}

/* Cache translated messages for 60 s — invalidated by admin save via revalidateTag */
const fetchMessages = unstable_cache(
  async (locale: string) => {
    try {
      return await getContent(`messages.${locale}`);
    } catch {
      return null;
    }
  },
  ['site-messages'],
  { tags: ['site-messages'], revalidate: 60 },
);

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
    locale = routing.defaultLocale;
  }

  const staticMessages = staticMessageMap[locale] ?? staticMessageMap.ar;
  const dbMessages     = await fetchMessages(locale);
  const messages       = dbMessages ? deepMerge(staticMessages, dbMessages) : staticMessages;

  return { locale, messages };
});
