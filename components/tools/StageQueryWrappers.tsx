'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import StageTimerComponent from '@/components/tools/StageTimerComponent';
import StageConfidenceMonitor from '@/components/tools/StageConfidenceMonitor';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import SharePageButton from '@/components/common/SharePageButton';

export function StageTimerFromQuery() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') === 'display' ? 'display' : 'operator';
  const room = searchParams.get('room') || 'global-product-summit';

  return (
    <>
      {view === 'operator' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 flex items-center justify-end">
          <SharePageButton variant="toolbar" />
        </div>
      )}
      <StageTimerComponent initialViewMode={view} initialRoomId={room} />
      {view === 'operator' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ToolSpecificContentSection slug="stage-timer" toolName="Stage Timer" />
        </section>
      )}
    </>
  );
}

export function StageMonitorFromQuery() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') || 'global-product-summit';

  return <StageConfidenceMonitor roomId={room} />;
}
