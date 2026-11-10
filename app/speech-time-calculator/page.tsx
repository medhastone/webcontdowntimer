import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SpeechTimeCalculatorComponent from '@/components/tools/SpeechTimeCalculatorComponent';

export const metadata: Metadata = {
  title: 'Speech Time Calculator – Words to Minutes Speaking Estimator | WebCountDownTimer',
  description:
    'Paste your script or enter a word count to calculate exact speaking duration at slow, conversational, keynote, or custom words-per-minute rates.',
};

export default function SpeechTimeCalculatorPage() {
  const tool = getToolBySlug('speech-time-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <SpeechTimeCalculatorComponent />
    </ToolPageLayout>
  );
}
