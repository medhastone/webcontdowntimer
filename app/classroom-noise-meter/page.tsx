import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import ClassroomNoiseMeterComponent from '@/components/tools/ClassroomNoiseMeterComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/classroom-noise-meter');
}

export default function ClassroomNoiseMeterPage() {
  const tool = getToolBySlug('classroom-noise-meter')!;

  return (
    <ToolPageLayout tool={tool}>
      <ClassroomNoiseMeterComponent />
    </ToolPageLayout>
  );
}
