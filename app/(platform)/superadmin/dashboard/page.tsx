// app/(platform)/superadmin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, CheckCircle, Hourglass, FileText, TrendingUp, Building, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SuperadminDashboard() {
  const supabase = createClient();

  // Fetch comprehensive institutional metrics
  const [
    { count: totalStudents },
    { count: totalFaculty },
    { count: totalAdmins },
    { count: verifiedActivities },
    { count: pendingActivities },
    { count: totalActivities }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('faculty').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'APPROVED'),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'PENDING'),
    supabase.from('activities').select('*', { count: 'exact', head: true })
  ]);

  // Calculate key metrics
  const facultyStudentRatio = totalFaculty && totalStudents ? (totalStudents / totalFaculty).toFixed(2) : 'N/A';
  const activityApprovalRate = totalActivities ? ((verifiedActivities || 0) / totalActivities * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Superadmin Dashboard</h1>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/superadmin/reports">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/superadmin/analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents ?? 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFaculty ?? 0}</div>
            <p className="text-xs text-muted-foreground">Faculty members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty:Student Ratio</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:{facultyStudentRatio}</div>
            <p className="text-xs text-muted-foreground">NAAC/NIRF metric</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityApprovalRate}%</div>
            <p className="text-xs text-muted-foreground">Quality metric</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Activities</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedActivities ?? 0}</div>
            <p className="text-xs text-muted-foreground">Approved student activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
            <Hourglass className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActivities ?? 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Administrators</CardTitle>
            <UserCheck className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins ?? 0}</div>
            <p className="text-xs text-muted-foreground">Admin users</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>NAAC Report Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate comprehensive NAAC assessment reports for institutional accreditation.
            </p>
            <Button asChild className="w-full">
              <Link href="/superadmin/reports?type=naac">
                Generate NAAC Report
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NIRF Ranking Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate NIRF ranking submission reports with all required metrics.
            </p>
            <Button asChild className="w-full">
              <Link href="/superadmin/reports?type=nirf">
                Generate NIRF Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{(totalStudents || 0) + (totalFaculty || 0)}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{totalActivities ?? 0}</div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">Active</div>
              <p className="text-sm text-muted-foreground">System Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}