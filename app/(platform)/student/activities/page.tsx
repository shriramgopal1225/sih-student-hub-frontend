// app/(platform)/student/activities/page.tsx
import { createClient } from '@/lib/supabase/server';
import { ActivityTable } from '@/components/student/activity-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityHeatmap } from '@/components/student/activity-heatmap';

type StudentActivityFromRPC = {
  activity_id: string;
  title: string;
  created_at: string;
  approval_status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category_name: string | null;
};

export default async function MyActivitiesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch data for the table using our RPC
  const { data: activities } = await supabase.rpc('get_student_activities');

  const formattedActivities = activities?.map((activity: StudentActivityFromRPC) => ({
    id: activity.activity_id,
    title: activity.title,
    category: activity.category_name || 'N/A',
    submissionDate: new Date(activity.created_at).toLocaleDateString(),
    status: activity.approval_status,
  })) || [];

  // --- NEW: Fetch data for the heatmap ---
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data: approvedActivities } = await supabase
    .from('activities')
    .select('updated_at')
    .eq('student_id', user?.id)
    .eq('approval_status', 'APPROVED')
    .gte('updated_at', oneYearAgo.toISOString());

  // Process data into the format the heatmap library needs: { date: 'YYYY-MM-DD', count: N }
  const heatmapData = approvedActivities?.reduce((acc, activity) => {
    const date = activity.updated_at.split('T')[0]; // Get just the date part
    const existingEntry = acc.find(day => day.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date: date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[]);
  // --- END NEW ---

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <CardDescription>
            Your activity consistency over the past year based on approval dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={heatmapData || []} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Activities</CardTitle>
          <CardDescription>
            Search, filter, and track all your submitted activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable data={formattedActivities} />
        </CardContent>
      </Card>
    </div>
  );
}