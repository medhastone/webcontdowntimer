import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import StageTimerComponent from '@/components/tools/StageTimerComponent';

export const metadata: Metadata = {
  title: 'Audience & Stage Confidence Monitor | WebCountDownTimer',
  description: 'Full-screen, high-contrast, distraction-free audience and presenter confidence monitor.',
  robots: {
    index: false,
    follow: true,
  },
};

export default async function RemoteStageDisplayPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolved = await params;
  const roomId = resolved.roomId || 'annual-conf-2026';

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#0B1120] text-white flex items-center justify-center font-mono">Connecting to Stage Sync...</div>}>
      <StageTimerComponent initialViewMode="display" initialRoomId={roomId} />
    </Suspense>
  );
}
