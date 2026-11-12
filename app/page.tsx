import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import HomePageClient from '@/components/pages/HomePageClient';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/');
}

export default function Page() {
  return <HomePageClient />;
}
