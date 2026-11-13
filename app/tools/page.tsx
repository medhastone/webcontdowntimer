import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import ToolsDirectoryClient from '@/components/pages/ToolsDirectoryClient';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/tools');
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'All Time Tools', path: '/tools' },
        ]}
      />
      <ToolsDirectoryClient />
    </>
  );
}
