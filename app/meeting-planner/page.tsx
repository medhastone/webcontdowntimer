import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import EventSchedulePlannerDashboard from '@/components/tools/EventSchedulePlannerDashboard';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/meeting-planner');
}

export default function MeetingPlannerPage() {
  return (
    <div>
      <EventSchedulePlannerDashboard />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolSpecificContentSection slug="meeting-planner" toolName="Meeting Planner" />
      </section>
    </div>
  );
}
