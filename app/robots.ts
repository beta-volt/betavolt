import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.betavolt.com.sa';

/**
 * 🤖 Production Robots.txt Generator for BetaVolt
 *
 * Directs search crawlers to indexed public and service routes
 * while shielding private administrative portals and internal API endpoints.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ar/',
          '/en/',
          '/ar/services',
          '/en/services',
          '/ar/projects',
          '/en/projects',
          '/ar/about',
          '/en/about',
          '/ar/contact',
          '/en/contact',
          '/images/',
          '/img/',
          '/downloads/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/maintenance',
          '/*?*utm_*', // Prevent duplicate crawling of parameterized ad URLs
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
