// app/(platform)/student/activities/page.tsx
import { createClient } from "@/lib/supabase/server";
import { ActivityTable } from "@/components/student/activity-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityHeatmap } from "@/components/student/activity-heatmap";

type StudentActivityFromRPC = {
  activity_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  approval_status: "APPROVED" | "PENDING" | "REJECTED";
  category_id: string;
  verifier_id: string | null;
  category_name: string | null;
  feedback: string | null;
};

export default async function MyActivitiesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: activities } = await supabase.rpc("get_student_activities");

  const formattedActivities =
    activities?.map((activity: StudentActivityFromRPC) => ({
      id: activity.activity_id,
      title: activity.title,
      description: activity.description,
      start_date: activity.start_date,
      end_date: activity.end_date,
      category: activity.category_name || "N/A",
      submissionDate: new Date(activity.created_at).toLocaleDateString(),
      status: activity.approval_status,
      feedback: activity.feedback,
      category_id: activity.category_id,
      verifier_id: activity.verifier_id,
    })) || [];

  const { data: approvedActivities } = await supabase.from("activities").select("updated_at").eq("student_id", user?.id).eq("approval_status", "APPROVED");
  const heatmapData = approvedActivities?.reduce((acc, activity) => {
    const date = activity.updated_at.split("T")[0];
    const existingEntry = acc.find((day) => day.date === date);
    if (existingEntry) { existingEntry.count += 1; } else { acc.push({ date: date, count: 1 }); }
    return acc;
  }, [] as { date: string; count: number }[]);

  return (
    <div className="space-y-6">
      <Card className="bg-green-50">
        <CardHeader><CardTitle>Activity Heatmap</CardTitle><CardDescription>Your activity consistency over the past year based on approval dates.</CardDescription></CardHeader>
        <CardContent><div className="h-[200px] w-full"><ActivityHeatmap data={heatmapData || []} /></div></CardContent>
      </Card>
      <Card className="bg-green-50">
        <CardHeader><CardTitle>My Activities</CardTitle><CardDescription>Search, filter, and track all your submitted activities.</CardDescription></CardHeader>
        <CardContent><ActivityTable data={formattedActivities} /></CardContent>
      </Card>
    </div>
  );
}