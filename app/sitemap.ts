import type { MetadataRoute } from 'next';
import { TOOLS_REGISTRY, getToolCanonicalPath } from '@/lib/tools-registry';
import { CATEGORIES_DATA } from '@/lib/category-data';
import { APPROVED_DURATION_SLUGS } from '@/lib/duration-timers-data';
import { SITE_BASE_URL, ROUTE_SEO_REGISTRY } from '@/lib/seo-metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_BASE_URL.replace(/\/+$/, '');
  const lastModified = new Date();

  // 1. Core static & informational pages (all indexable, canonical paths)
  const coreStaticPages = [
    '',
    '/tools',
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
  // Only canonical keys from CATEGORIES_DATA (timers, events, education, productivity, fitness, world, calculators)
  const categoryHubPages = Object.keys(CATEGORIES_DATA).map(
    (slug) => `/category/${slug}`
  );

  // 3. Canonical interactive tool pages from TOOLS_REGISTRY + stage viewer
  const toolPages = Array.from(
    new Set([
      ...TOOLS_REGISTRY.map((tool) => getToolCanonicalPath(tool.slug)),
      '/stage-timer/viewer',
    ])
  ).filter((path) => {
    const seoEntry = ROUTE_SEO_REGISTRY[path];
    return !seoEntry?.noIndex;
  });

  // 4. Approved preset duration timer pages (1, 5, 10, 15, 30, 60 min + 30, 45, 90 sec)
  const durationPages = APPROVED_DURATION_SLUGS.map((slug) => `/${slug}`);

  const categorySet = new Set(categoryHubPages);
  const toolSet = new Set(toolPages);
  const durationSet = new Set(durationPages);

  const allPaths = Array.from(
    new Set([
      ...coreStaticPages,
      ...categoryHubPages,
      ...toolPages,
      ...durationPages,
    ])
  );

  return allPaths.map((urlPath) => {
    let priority = 0.6;
    let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly';

    if (urlPath === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (urlPath === '/tools' || categorySet.has(urlPath)) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (toolSet.has(urlPath)) {
      priority = 0.85;
      changeFrequency = 'weekly';
    } else if (durationSet.has(urlPath) || urlPath.startsWith('/guides')) {
      priority = 0.8;
      changeFrequency = 'monthly';
    }

    return {
      url: `${baseUrl}${urlPath}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}
