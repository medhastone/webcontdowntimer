import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import ToolsDirectoryClient from '@/components/pages/ToolsDirectoryClient';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/tools');
}

export default function Page() {
  return <ToolsDirectoryClient />;
}
