import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import EmbedWidgetClient from '@/components/pages/EmbedWidgetClient';
import SEOStructuredData from '@/components/common/SEOStructuredData';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/embed-widget');
}

export default function Page() {
  return (
    <>
      <SEOStructuredData
        toolName="Embeddable Timer Widget"
        description="Clean embeddable countdown and stage timer iframe widget for Notion, blogs, LMS lessons, and OBS overlays."
        url="https://WebCountDownTimer.com/embed-widget"
        breadcrumbs={[
          { name: 'Home', item: 'https://WebCountDownTimer.com' },
          { name: 'Embed Timer Widget', item: 'https://WebCountDownTimer.com/embed-timer' },
          { name: 'Embed Widget', item: 'https://WebCountDownTimer.com/embed-widget' },
        ]}
        applicationCategory="UtilitiesApplication"
      />
      <EmbedWidgetClient />
    </>
  );
}
