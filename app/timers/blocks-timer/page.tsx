import { buildPageMetadata } from '@/lib/seo-metadata';
import { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import BlocksTimerComponent from '@/components/tools/BlocksTimerComponent';

const tool = TOOLS_REGISTRY.find((t) => t.slug === 'blocks-timer');

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/blocks-timer');
}

export default function TimersBlocksTimerPage() {
  if (!tool) return null;

  return (
    <ToolPageLayout tool={tool}>
      <BlocksTimerComponent />
    </ToolPageLayout>
  );
}
