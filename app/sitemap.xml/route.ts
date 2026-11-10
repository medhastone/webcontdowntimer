import { NextResponse } from 'next/server';
import { TOOLS_REGISTRY, getToolCanonicalPath } from '@/lib/tools-registry';
import { ALL_HOME_TOOLS } from '@/lib/home-data';
import { CATEGORIES_DATA } from '@/lib/category-data';
import { APPROVED_DURATION_SLUGS } from '@/lib/duration-timers-data';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = (process.env.APP_URL || 'https://WebCountDownTimer.com').replace(/\/+$/, '');
  const lastMod = new Date().toISOString().split('T')[0];

  // 1. Core static & informational pages
  const coreStaticPages = [
    '',
    '/tools',
    '/guides',
    '/education',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
    '/sitemap',
  ];

  // 2. Category hubs dynamically derived from CATEGORIES_DATA + canonical category paths
  const categoryHubPages = Array.from(
    new Set([
      '/education',
      '/category/timers',
      '/category/events',
      '/category/education',
      '/category/productivity',
      '/category/fitness',
      '/category/world',
      '/category/world-clock',
      '/category/calculators',
      ...Object.keys(CATEGORIES_DATA).map((slug) =>
        slug === 'education' ? '/education' : `/category/${slug}`
      ),
    ])
  );

  // 3. All interactive tool pages from TOOLS_REGISTRY, ALL_HOME_TOOLS, and category tool items
  const categoryItemPaths = Object.values(CATEGORIES_DATA).flatMap((cat) =>
    cat.tools.map((t) => t.href)
  );
  const registryToolPaths = TOOLS_REGISTRY.map((t) => getToolCanonicalPath(t.slug));
  const homeToolPaths = ALL_HOME_TOOLS.map((t) => t.href);

  const toolPages = Array.from(
    new Set([...registryToolPaths, ...homeToolPaths, ...categoryItemPaths])
  ).filter((p) => p.startsWith('/'));

  // 4. All preset duration timer pages
  const durationPages = APPROVED_DURATION_SLUGS.map((slug) => `/${slug}`);

  const categorySet = new Set(categoryHubPages);
  const toolSet = new Set(toolPages);
  const durationSet = new Set(durationPages);

  const allUrls = Array.from(
    new Set([...coreStaticPages, ...categoryHubPages, ...toolPages, ...durationPages])
  );

  const getUrlMeta = (path: string): { priority: string; changefreq: string } => {
    if (path === '') {
      return { priority: '1.0', changefreq: 'daily' };
    }
    if (path === '/tools' || categorySet.has(path)) {
      return { priority: '0.9', changefreq: 'weekly' };
    }
    if (toolSet.has(path)) {
      return { priority: '0.85', changefreq: 'weekly' };
    }
    if (durationSet.has(path)) {
      return { priority: '0.8', changefreq: 'monthly' };
    }
    return { priority: '0.6', changefreq: 'monthly' };
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map((urlPath) => {
    const { priority, changefreq } = getUrlMeta(urlPath);
    const fullUrl = escapeXml(`${baseUrl}${urlPath}`);
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
