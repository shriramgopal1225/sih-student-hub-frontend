// app/(platform)/hod/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, Hourglass, GraduationCap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function HODDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch HOD's profile and department info
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id)
    .single();

  // For now, we'll use placeholder data since department structure isn't fully implemented
  // These would typically be filtered by department
  const [
    { count: departmentStudents },
    { count: departmentFaculty },
    { count: departmentActivities },
    { count: approvedActivities },
    { count: pendingActivities }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('faculty').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'APPROVED'),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'PENDING')
  ]);

  const approvalRate = departmentActivities ? ((approvedActivities || 0) / departmentActivities * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">HOD Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || 'Head of Department'}</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/hod/reports">
              <FileText className="mr-2 h-4 w-4" />
              Department Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/hod/department">
              <Users className="mr-2 h-4 w-4" />
              Manage Department
            </Link>
          </Button>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStudents ?? 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled in department</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Faculty</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentFaculty ?? 0}</div>
            <p className="text-xs text-muted-foreground">Teaching staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentActivities ?? 0}</div>
            <p className="text-xs text-muted-foreground">Department activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">Activity approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Management */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Activities</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedActivities ?? 0}</div>
            <p className="text-xs text-muted-foreground">Successfully verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
            <Hourglass className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActivities ?? 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Management Tools */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Faculty Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage department faculty, their qualifications, and research activities.
            </p>
            <Button asChild className="w-full">
              <Link href="/hod/department?tab=faculty">
                Manage Faculty
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate department-specific reports for NAAC and NIRF submissions.
            </p>
            <Button asChild className="w-full">
              <Link href="/hod/reports">
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{departmentStudents || 0}</div>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{departmentFaculty || 0}</div>
              <p className="text-sm text-muted-foreground">Faculty</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{departmentActivities || 0}</div>
              <p className="text-sm text-muted-foreground">Activities</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{approvalRate}%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}