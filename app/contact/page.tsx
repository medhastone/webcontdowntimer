import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import ContactPageClient from '@/components/pages/ContactPageClient';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/contact');
}

export default function Page() {
  return <ContactPageClient />;
}
