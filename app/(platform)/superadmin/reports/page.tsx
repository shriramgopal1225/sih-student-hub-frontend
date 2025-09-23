// app/(platform)/superadmin/reports/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, TrendingUp, Users, GraduationCap, Award } from 'lucide-react';
import { NAACReportGenerator } from '@/components/reports/naac-report-generator';
import { NIRFReportGenerator } from '@/components/reports/nirf-report-generator';
import { ReportMetrics } from '@/components/reports/report-metrics';

export default async function ReportsPage() {
  const supabase = createClient();

  // Fetch comprehensive data for NAAC/NIRF reports
  const [
    { count: totalStudents },
    { count: totalFaculty },
    { count: totalActivities },
    { count: verifiedActivities }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('faculty').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'APPROVED')
  ]);

  // Fetch recent activities separately with simpler structure
  const { data: recentActivities } = await supabase
    .from('activities')
    .select('title, created_at, approval_status')
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate key metrics
  const facultyStudentRatio = totalFaculty && totalStudents ? (totalStudents / totalFaculty).toFixed(2) : 'N/A';
  const activitySuccessRate = totalActivities ? ((verifiedActivities || 0) / totalActivities * 100).toFixed(1) : '0';

  const metrics = {
    totalStudents: totalStudents || 0,
    totalFaculty: totalFaculty || 0,
    facultyStudentRatio,
    totalActivities: totalActivities || 0,
    verifiedActivities: verifiedActivities || 0,
    activitySuccessRate: parseFloat(activitySuccessRate),
    recentActivities: (recentActivities || []).map(activity => ({
      title: String(activity.title || ''),
      approval_status: String(activity.approval_status || ''),
      created_at: String(activity.created_at || ''),
      activity_categories: { name: 'General' } // Simplified for now
    }))
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">NAAC/NIRF Reports</h1>
          <p className="text-muted-foreground">Generate comprehensive institutional assessment reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
        </div>
      </div>

      {/* Quick Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty:Student Ratio</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:{facultyStudentRatio}</div>
            <p className="text-xs text-muted-foreground">NAAC Key Metric</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Student count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitySuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Quality indicator</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Activities</CardTitle>
            <Award className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedActivities || 0}</div>
            <p className="text-xs text-muted-foreground">Co-curricular activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="naac">NAAC Report</TabsTrigger>
          <TabsTrigger value="nirf">NIRF Report</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  NAAC Assessment Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive NAAC (National Assessment and Accreditation Council) report 
                  covering all assessment criteria including Teaching-Learning, Research, Infrastructure, 
                  and Student Support.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">Generate NAAC Report</Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  NIRF Ranking Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate NIRF (National Institutional Ranking Framework) report with weighted 
                  metrics for Teaching-Learning Resources, Research, Graduation Outcomes, 
                  Outreach & Inclusivity, and Perception.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">Generate NIRF Report</Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <ReportMetrics metrics={metrics} />
        </TabsContent>

        <TabsContent value="naac" className="space-y-6">
          <NAACReportGenerator metrics={metrics} />
        </TabsContent>

        <TabsContent value="nirf" className="space-y-6">
          <NIRFReportGenerator metrics={metrics} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced analytics and trends coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}