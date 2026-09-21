import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.betavolt.com.sa';

/**
 * 🗺️ Dynamic Next.js XML Sitemap Generator for BetaVolt
 *
 * Provides complete search crawler discovery for bilingual routes (Arabic & English)
 * with explicit hreflang alternates, priority weighting, and change frequencies.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/services', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.85, changeFrequency: 'monthly' as const },
  ];

  const currentDate = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // Arabic canonical version (primary)
    entries.push({
      url: `${BASE_URL}/ar${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ar: `${BASE_URL}/ar${route.path}`,
          en: `${BASE_URL}/en${route.path}`,
          'x-default': `${BASE_URL}/ar${route.path}`,
        },
      },
    });

    // English localized version
    entries.push({
      url: `${BASE_URL}/en${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ar: `${BASE_URL}/ar${route.path}`,
          en: `${BASE_URL}/en${route.path}`,
          'x-default': `${BASE_URL}/ar${route.path}`,
        },
      },
    });
  }

  return entries;
}
