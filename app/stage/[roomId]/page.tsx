import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import StageTimerComponent from '@/components/tools/StageTimerComponent';
import { buildPageMetadata } from '@/lib/seo-metadata';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';

export function generateStaticParams() {
  return [
    { roomId: 'global-product-summit' },
    { roomId: 'annual-conf-2026' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const roomId = resolved.roomId || 'live';
  const cleanRoom = roomId.slice(0, 14);
  const title = `Stage Display (${cleanRoom}) – Live Sync | WebCountDownTimer`;
  const description = `Full-screen high-contrast presenter confidence monitor for stage room ${cleanRoom}, synced in real time with the Stage Timer operator console.`;
  return buildPageMetadata(`/stage/${roomId}`, {
    title,
    description,
    noIndex: true,
  });
}

export default async function RemoteStageDisplayPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolved = await params;
  const roomId = resolved.roomId || 'annual-conf-2026';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Stage Timer', path: '/stage-timer' },
          { name: 'Live Stage Display', path: `/stage/${roomId}` },
        ]}
      />
      <Suspense fallback={<div className="fixed inset-0 bg-[#0B1120] text-white flex items-center justify-center font-mono">Connecting to Stage Sync...</div>}>
        <StageTimerComponent initialViewMode="display" initialRoomId={roomId} />
      </Suspense>
    </>
  );
}
