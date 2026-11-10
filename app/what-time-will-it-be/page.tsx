import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WhatTimeWillItBeComponent from '@/components/tools/WhatTimeWillItBeComponent';

export const metadata: Metadata = {
  title: 'What Time Will It Be? – Future & Past Clock Time Calculator | WebCountDownTimer',
  description:
    'Find out what time it will be in 15, 20, 30, or 45 minutes, or any number of hours from now. Supports live current time, custom start times, and 12h/24h formats.',
  alternates: {
    canonical: '/what-time-will-it-be',
  },
};

export default function WhatTimeWillItBePage() {
  const tool = getToolBySlug('what-time-will-it-be')!;

  return (
    <ToolPageLayout tool={tool}>
      <WhatTimeWillItBeComponent />
    </ToolPageLayout>
  );
}
