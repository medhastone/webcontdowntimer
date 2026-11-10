import { Metadata } from 'next';
import CategoryLandingPageComponent from '@/components/category/CategoryLandingPageComponent';
import { getCategoryData, CATEGORIES_DATA } from '@/lib/category-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = [...Object.keys(CATEGORIES_DATA), 'everyday', 'stage', 'world-clock'];
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getCategoryData(slug);
  return {
    title: `${data.title} | WebCountDownTimer`,
    description: data.description,
    alternates: {
      canonical: `https://WebCountDownTimer.com/category/${slug}`,
    },
  };
}

export default async function DynamicCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getCategoryData(slug);
  return <CategoryLandingPageComponent data={data} />;
}
