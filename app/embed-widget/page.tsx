import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import EmbedWidgetClient from '@/components/pages/EmbedWidgetClient';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/embed-widget');
}

export default function Page() {
  return <EmbedWidgetClient />;
}
