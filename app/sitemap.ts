import type { MetadataRoute } from 'next';
import { TOOLS_REGISTRY, getToolCanonicalPath } from '@/lib/tools-registry';
import { CATEGORIES_DATA } from '@/lib/category-data';
import { APPROVED_DURATION_SLUGS } from '@/lib/duration-timers-data';
import { HOLIDAY_DEFINITIONS } from '@/lib/holidays-data';
import { SITE_BASE_URL, ROUTE_SEO_REGISTRY } from '@/lib/seo-metadata';

export const dynamic = 'force-static';

const RECENTLY_UPDATED_PATHS = new Set<string>([
  '',
  '/tools',
  '/days-until',
  '/sitemap',
  '/category/timers',
  '/category/events',
  '/category/education',
  '/category/productivity',
  '/category/fitness',
  '/category/world',
  '/category/calculators',
  '/speaker-timer',
  '/debate-timer',
  '/sermon-timer',
  '/classroom-timer',
  '/webinar-timer',
  '/stage-timer',
  '/presentation-timer',
  '/toastmasters-timer',
  '/30-second-timer',
  '/45-second-timer',
  '/90-second-timer',
  '/1-minute-timer',
  '/5-minute-timer',
  '/10-minute-timer',
  '/15-minute-timer',
  '/30-minute-timer',
  '/60-minute-timer',
]);

const STATIC_LEGAL_PATHS = new Set<string>([
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/accessibility',
]);

function getRouteLastModified(urlPath: string): string {
  if (RECENTLY_UPDATED_PATHS.has(urlPath) || urlPath.startsWith('/days-until/')) {
    return '2026-11-20T00:00:00.000Z';
  }
  if (STATIC_LEGAL_PATHS.has(urlPath)) {
    return '2026-09-01T00:00:00.000Z';
  }
  return '2026-10-15T00:00:00.000Z';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_BASE_URL.replace(/\/+$/, '').toLowerCase();

  // 1. Core static & informational pages (all indexable, canonical paths)
  const coreStaticPages = [
    '',
    '/tools',
    '/days-until',
    '/guides',
    '/guides/how-accurate-online-timers-work',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
    '/sitemap',
  ];

  // 2. Canonical category hub pages (/category/<slug>)
  const categoryHubPages = Object.keys(CATEGORIES_DATA).map(
    (slug) => `/category/${slug}`
  );

  // 3. Canonical interactive tool pages from TOOLS_REGISTRY (excluding noIndex utility viewers)
  const toolPages = Array.from(
    new Set(TOOLS_REGISTRY.map((tool) => getToolCanonicalPath(tool.slug)))
  ).filter((path) => {
    const seoEntry = ROUTE_SEO_REGISTRY[path];
    return !seoEntry?.noIndex;
  });

  // 4. Approved preset duration timer pages (1, 5, 10, 15, 30, 60 min + 30, 45, 90 sec)
  const durationPages = APPROVED_DURATION_SLUGS.map((slug) => `/${slug}`);

  // 5. Programmatic Holiday Countdown utility pages (/days-until/<slug>)
  const holidayPages = HOLIDAY_DEFINITIONS.map((h) => `/days-until/${h.slug}`);

  const categorySet = new Set(categoryHubPages);
  const toolSet = new Set(toolPages);
  const durationSet = new Set(durationPages);
  const holidaySet = new Set(holidayPages);

  const allPaths = Array.from(
    new Set([
      ...coreStaticPages,
      ...categoryHubPages,
      ...toolPages,
      ...durationPages,
      ...holidayPages,
    ])
  );

  return allPaths.map((urlPath) => {
    let priority = 0.6;
    let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly';

    if (urlPath === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (urlPath === '/tools' || urlPath === '/days-until' || categorySet.has(urlPath)) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (toolSet.has(urlPath)) {
      priority = 0.85;
      changeFrequency = 'weekly';
    } else if (holidaySet.has(urlPath)) {
      priority = 0.8;
      changeFrequency = 'daily';
    } else if (durationSet.has(urlPath) || urlPath.startsWith('/guides')) {
      priority = 0.8;
      changeFrequency = 'monthly';
    }

    return {
      url: `${baseUrl}${urlPath}`,
      lastModified: getRouteLastModified(urlPath),
      changeFrequency,
      priority,
    };
  });
}
