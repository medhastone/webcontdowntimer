import { buildPageMetadata } from '@/lib/seo-metadata';
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import StageTimerComponent from '@/components/tools/StageTimerComponent';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/stage-timer');
}

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

  return (
    <div>
      <StageTimerComponent initialViewMode={view} initialRoomId={room} />
      {view === 'operator' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ToolSpecificContentSection slug="stage-timer" toolName="Stage Timer" />
        </section>
      )}
    </div>
  );
}

export default async function StageTimerPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; room?: string }>;
}) {
  return <StageTimerWrapper searchParams={searchParams} />;
}
