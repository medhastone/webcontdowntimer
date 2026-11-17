import { buildPageMetadata } from '@/lib/seo-metadata';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { StageTimerFromQuery } from '@/components/tools/StageQueryWrappers';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/stage-timer');
}

export default function StageTimerPage() {
  const specificContent = getToolSpecificContent('stage-timer');
  const breadcrumbs = [
    { name: 'Home', item: 'https://WebCountDownTimer.com/' },
    { name: 'Tools', item: 'https://WebCountDownTimer.com/tools' },
    { name: 'Stage Timer', item: 'https://WebCountDownTimer.com/stage-timer' },
  ];

  return (
    <div>
      <SEOStructuredData
        toolName="Stage Timer"
        description="Sync a backstage operator console with a fullscreen stage confidence monitor. Flash silent cues, adjust live minutes, and track speaker overtime."
        url="https://WebCountDownTimer.com/stage-timer"
        faqs={specificContent ? specificContent.faqs : []}
        breadcrumbs={breadcrumbs}
        steps={specificContent ? specificContent.howToUse : []}
        applicationCategory="UtilityApplication"
      />
      <Suspense
        fallback={
          <div className="p-8 text-center font-mono text-sm text-slate-500">
            Loading Stage Timer Controller...
          </div>
        }
      >
        <StageTimerFromQuery />
      </Suspense>
    </div>
  );
}
