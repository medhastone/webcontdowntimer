import { buildPageMetadata } from '@/lib/seo-metadata';
import { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import AestheticTimerComponent from '@/components/tools/AestheticTimerComponent';

const tool = TOOLS_REGISTRY.find((t) => t.slug === 'aesthetic-timer');

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/aesthetic-timer');
}

export default function TimersAestheticTimerPage() {
  if (!tool) return null;

  return (
    <ToolPageLayout tool={tool}>
      <AestheticTimerComponent />
    </ToolPageLayout>
  );
}
