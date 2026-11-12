import { buildPageMetadata } from '@/lib/seo-metadata';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import StageConfidenceMonitor from '@/components/tools/StageConfidenceMonitor';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/stage-timer/viewer');
}

function ViewerWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ room?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xl">
          Connecting to Stage Confidence Monitor...
        </div>
      }
    >
      <ViewerInner searchParams={searchParams} />
    </Suspense>
  );
}

async function ViewerInner({
  searchParams,
}: {
  searchParams?: Promise<{ room?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const room = resolved.room || 'global-product-summit';

  return <StageConfidenceMonitor roomId={room} />;
}

export default async function StageTimerViewerPage({
  searchParams,
}: {
  searchParams?: Promise<{ room?: string }>;
}) {
  return <ViewerWrapper searchParams={searchParams} />;
}
