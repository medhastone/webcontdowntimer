import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import StageTimerComponent from '@/components/tools/StageTimerComponent';

export const metadata: Metadata = {
  title: 'Stage Timer – Mobile & Desktop Live Event Controller | WebCountDownTimer',
  description:
    'Professional live event stage timer and conference confidence monitor. Mobile-first stage manager controller, real-time multi-screen sync, schedule management, and fullscreen audience display.',
};

function StageTimerWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; room?: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-sm text-slate-500">Loading Stage Timer Controller...</div>}>
      <StageTimerInner searchParams={searchParams} />
    </Suspense>
  );
}

async function StageTimerInner({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; room?: string }>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const view = resolved.view === 'display' ? 'display' : 'operator';
  const room = resolved.room || 'global-product-summit';

  return <StageTimerComponent initialViewMode={view} initialRoomId={room} />;
}

export default async function StageTimerPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; room?: string }>;
}) {
  return <StageTimerWrapper searchParams={searchParams} />;
}

