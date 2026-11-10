import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import ClassroomNoiseMeterComponent from '@/components/tools/ClassroomNoiseMeterComponent';

export const metadata: Metadata = {
  title: 'Classroom Noise Meter – Live Microphone Volume Monitor | WebCountDownTimer',
  description:
    'Privacy-first browser microphone volume monitor for classrooms. Displays relative ambient sound level (0–100) with customizable quiet threshold alerts and zero audio recording.',
};

export default function ClassroomNoiseMeterPage() {
  const tool = getToolBySlug('classroom-noise-meter')!;

  return (
    <ToolPageLayout tool={tool}>
      <ClassroomNoiseMeterComponent />
    </ToolPageLayout>
  );
}
