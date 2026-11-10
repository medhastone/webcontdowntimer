import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RandomNamePickerComponent from '@/components/tools/RandomNamePickerComponent';

export const metadata: Metadata = {
  title: 'Random Name Picker – Fair Student & Raffle Selector | WebCountDownTimer',
  description:
    'Unbiased Fisher-Yates random name selector for teachers, classrooms, standups, and giveaways. Supports winner removal, draw history, and CSV/TXT import.',
};

export default function RandomNamePickerPage() {
  const tool = getToolBySlug('random-name-picker')!;

  return (
    <ToolPageLayout tool={tool}>
      <RandomNamePickerComponent />
    </ToolPageLayout>
  );
}
