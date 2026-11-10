import { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import AestheticTimerComponent from '@/components/tools/AestheticTimerComponent';

const tool = TOOLS_REGISTRY.find((t) => t.slug === 'aesthetic-timer');

export const metadata: Metadata = {
  title: 'Aesthetic Timer – A Beautiful Online Countdown | WebCountDownTimer',
  description:
    tool?.description ||
    'A calm and customizable visual timer with Minimal Ivory, Warm Sunset, Forest Green, Soft Pastel, Dark Academia, Monochrome, Paper Texture, and Coastal Blue themes.',
  keywords: tool?.keywords,
  alternates: {
    canonical: '/timers/aesthetic-timer',
  },
  openGraph: {
    title: 'Aesthetic Timer – A Beautiful Online Countdown | WebCountDownTimer',
    description:
      tool?.description ||
      'A calm and customizable visual timer to help you focus, be productive and enjoy your time.',
    type: 'website',
  },
};

export default function AestheticTimerPage() {
  if (!tool) return null;

  return (
    <ToolPageLayout tool={tool}>
      <AestheticTimerComponent />
    </ToolPageLayout>
  );
}
