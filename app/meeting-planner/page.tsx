import type { Metadata } from 'next';
import EventSchedulePlannerDashboard from '@/components/tools/EventSchedulePlannerDashboard';

export const metadata: Metadata = {
  title: 'Plan Every Session – Event Schedule Builder & Meeting Planner | WebCountDownTimer',
  description:
    'Build a schedule, manage session timings and coordinate people across time zones. Professional event schedule builder and international meeting planner.',
  openGraph: {
    title: 'Plan Every Session – Event Schedule Builder & Meeting Planner | WebCountDownTimer',
    description:
      'Build a schedule, manage session timings and coordinate people across time zones.',
  },
};

export default function MeetingPlannerPage() {
  return <EventSchedulePlannerDashboard />;
}
