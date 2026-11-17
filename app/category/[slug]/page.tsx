import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import CategoryLandingPageComponent from '@/components/category/CategoryLandingPageComponent';
import { CATEGORIES_DATA } from '@/lib/category-data';
import { buildPageMetadata } from '@/lib/seo-metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  if (!(normalized in CATEGORIES_DATA)) {
    return buildPageMetadata(`/category/${normalized}`, { noIndex: true });
  }
  return buildPageMetadata(`/category/${normalized}`);
}

export default async function DynamicCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  if (slug !== normalized && normalized in CATEGORIES_DATA) {
    permanentRedirect(`/category/${normalized}`);
  }
  const data = CATEGORIES_DATA[normalized];
  if (!data) {
    notFound();
  }
  return <CategoryLandingPageComponent data={data} />;
}

