import { buildPageMetadata } from '@/lib/seo-metadata';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { StageMonitorFromQuery } from '@/components/tools/StageQueryWrappers';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/stage-timer/viewer');
}

export default function StageTimerViewerPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Stage Timer', path: '/stage-timer' },
          { name: 'Confidence Monitor', path: '/stage-timer/viewer' },
        ]}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xl">
            Connecting to Stage Confidence Monitor...
          </div>
        }
      >
        <StageMonitorFromQuery />
      </Suspense>
    </>
  );
}
