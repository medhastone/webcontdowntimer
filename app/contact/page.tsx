import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import ContactPageClient from '@/components/pages/ContactPageClient';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/contact');
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <ContactPageClient />
    </>
  );
}
