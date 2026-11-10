import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import StageConfidenceMonitor from '@/components/tools/StageConfidenceMonitor';

export const metadata: Metadata = {
  title: 'Stage Timer Confidence Monitor – Fullscreen Speaker Display | WebCountDownTimer',
  description:
    'Dedicated blackout confidence monitor for keynote speakers, stage talent, and presenters. Real-time zero-latency sync with the Stage Timer operator controller.',
};

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
