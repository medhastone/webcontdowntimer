import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import EventSchedulePlannerDashboard from '@/components/tools/EventSchedulePlannerDashboard';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/meeting-planner');
}

export default function MeetingPlannerPage() {
  const specificContent = getToolSpecificContent('meeting-planner');
  const breadcrumbs = [
    { name: 'Home', item: 'https://WebCountDownTimer.com/' },
    { name: 'Tools', item: 'https://WebCountDownTimer.com/tools' },
    { name: 'Meeting Planner', item: 'https://WebCountDownTimer.com/meeting-planner' },
  ];

  return (
    <div>
      <SEOStructuredData
        toolName="Meeting Planner"
        description="Coordinate international meetings and global webinars with overlapping working-hour windows and automatic DST handling."
        url="https://WebCountDownTimer.com/meeting-planner"
        faqs={specificContent ? specificContent.faqs : []}
        breadcrumbs={breadcrumbs}
        steps={specificContent ? specificContent.howToUse : []}
        applicationCategory="UtilityApplication"
      />
      <EventSchedulePlannerDashboard />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolSpecificContentSection slug="meeting-planner" toolName="Meeting Planner" />
      </section>
    </div>
  );
}
