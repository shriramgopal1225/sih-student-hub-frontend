// app/(platform)/student/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Percent,
} from "lucide-react"; // Import new icons
import { ActivityChart } from "@/components/charts/activity-chart";
import { AddActivityModal } from "@/components/modals/add-activity-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// ... (ActivityItem component remains the same)
const ActivityItem = ({ status, title, time }: { status: 'APPROVED' | 'PENDING' | 'REJECTED', title: string, time: string }) => {
  const statusInfo = {
    APPROVED: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', text: 'text-green-800' },
    PENDING: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    REJECTED: { icon: CheckCircle, color: 'text-red-500', bg: 'bg-red-100', text: 'text-red-800' },
  };
  const currentStatus = statusInfo[status] || statusInfo.PENDING;
  const Icon = currentStatus.icon;

  return (
    <div className="flex items-start gap-4">
      <Icon className={`h-6 w-6 ${currentStatus.color}`} />
      <div className="grid gap-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
      <div className={`ml-auto rounded-md px-2 py-1 text-xs font-medium ${currentStatus.bg} ${currentStatus.text}`}>
        {status}
      </div>
    </div>
  );
};

export default async function StudentDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Data fetching for the dashboard
  const { data: profileData } = await supabase
    .from("profiles")
    .select(`*, students(*)`)
    .eq("id", user?.id)
    .single();
  // ... (rest of the data fetching remains the same)
  const { count: verifiedCount } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user?.id)
    .eq("approval_status", "APPROVED");
  const { count: pendingCount } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user?.id)
    .eq("approval_status", "PENDING");
  const { data: recentActivities } = await supabase
    .from("activities")
    .select("title, approval_status, created_at")
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);
  const { data: chartData } = await supabase.rpc(
    "get_student_dashboard_chart_data"
  );
  const initials =
    profileData?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || "U";

  return (
    <div className="relative min-h-full">
      <div className="grid gap-6">
        {/* --- BEAUTIFIED PROFILE HEADER SECTION --- */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              {/* Left Side: Avatar & Name (remains the same) */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profileData?.profile_photo_url || ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profileData?.full_name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome to your dashboard!
                  </p>
                </div>
              </div>

              {/* Right Side: Details with better alignment, spacing, and icons */}
              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-semibold">
                      {profileData?.students?.course}
                    </p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-10" />

                <div className="flex items-center gap-3">
                  <CalendarDays className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-semibold">
                      {profileData?.students?.year}
                    </p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-10" />

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">GPA / CGPA</p>
                    <p className="font-semibold">
                      {profileData?.students?.gpa || "N/A"} /{" "}
                      {profileData?.students?.cgpa || "N/A"}
                    </p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-10" />

                <div className="flex items-center gap-3">
                  <Percent className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="font-semibold">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* --- END PROFILE HEADER SECTION --- */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Stat Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Verified Activities
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Credits
              </CardTitle>
              <Award className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profileData?.students?.total_credits || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity and Chart Cards... */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Recent Activity & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    status={
                      activity.approval_status as
                        | "APPROVED"
                        | "PENDING"
                        | "REJECTED"
                    }
                    title={activity.title}
                    time={`${new Date(
                      activity.created_at
                    ).toLocaleDateString()}`}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No recent activities to show.
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityChart data={chartData || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <AddActivityModal />
      </div>
    </div>
  );
}
