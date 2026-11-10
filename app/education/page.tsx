import { Metadata } from 'next';
import CategoryLandingPageComponent from '@/components/category/CategoryLandingPageComponent';
import { getCategoryData } from '@/lib/category-data';

export const metadata: Metadata = {
  title: 'Classroom Timers & Education Tools | WebCountDownTimer',
  description:
    'Free online classroom timers, visual countdowns, student name pickers, and interval tools designed for teachers and learning environments at WebCountDownTimer.com.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/education',
  },
};

export default function EducationCategoryPage() {
  const data = getCategoryData('education');
  return <CategoryLandingPageComponent data={data} />;
}
