// app/(platform)/superadmin/analytics/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, GraduationCap, Award, BarChart3, PieChart } from 'lucide-react';

export default async function AnalyticsPage() {
  const supabase = createClient();

  // Fetch analytics data
  const [
    { count: totalStudents },
    { count: totalFaculty },
    { count: totalActivities },
    { count: verifiedActivities },
    { data: activityTrends }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('faculty').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'APPROVED'),
    supabase.from('activities')
      .select('created_at, approval_status')
      .order('created_at', { ascending: false })
      .limit(100)
  ]);

  // Calculate metrics
  const approvalRate = totalActivities ? ((verifiedActivities || 0) / totalActivities * 100) : 0;
  const facultyStudentRatio = totalFaculty && totalStudents ? totalStudents / totalFaculty : 0;

  // Group activities by month for trend analysis
  const monthlyData = (activityTrends || []).reduce((acc: Record<string, { total: number; approved: number }>, activity) => {
    const month = new Date(activity.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!acc[month]) {
      acc[month] = { total: 0, approved: 0 };
    }
    acc[month].total++;
    if (activity.approval_status === 'APPROVED') {
      acc[month].approved++;
    }
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).slice(-6).map(([month, data]) => ({
    month,
    total: data.total,
    approved: data.approved,
    rate: data.total > 0 ? (data.approved / data.total * 100).toFixed(1) : '0'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive institutional analytics and insights</p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Activity approval rate</p>
            <Progress value={approvalRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Ratio</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:{facultyStudentRatio.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Students per faculty</p>
            <div className="mt-2">
              <Badge variant={facultyStudentRatio <= 20 ? 'default' : 'secondary'}>
                {facultyStudentRatio <= 20 ? 'Optimal' : 'High Load'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Engagement</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStudents ? ((totalActivities || 0) / totalStudents * 100).toFixed(1) : '0'}%
            </div>
            <p className="text-xs text-muted-foreground">Activities per student</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <Award className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(approvalRate * 0.4 + (facultyStudentRatio <= 20 ? 100 : 60) * 0.6).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Composite quality index</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Activity Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="naac-insights">NAAC Insights</TabsTrigger>
          <TabsTrigger value="nirf-tracking">NIRF Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{data.month}</span>
                        <span className="font-medium">{data.approved}/{data.total} ({data.rate}%)</span>
                      </div>
                      <Progress value={parseFloat(data.rate)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Activity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approved Activities</span>
                    <Badge>{verifiedActivities || 0}</Badge>
                  </div>
                  <Progress value={approvalRate} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Activities</span>
                    <Badge variant="secondary">{(totalActivities || 0) - (verifiedActivities || 0)}</Badge>
                  </div>
                  <Progress value={100 - approvalRate} className="h-2" />
                  
                  <div className="text-center pt-4">
                    <div className="text-2xl font-bold">{totalActivities || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Activities</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Institutional Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Faculty Utilization</span>
                    <span className="text-sm font-medium">
                      {facultyStudentRatio <= 20 ? 'Optimal' : 'Overloaded'}
                    </span>
                  </div>
                  <Progress value={facultyStudentRatio <= 20 ? 85 : 45} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Activity Processing</span>
                    <span className="text-sm font-medium">{approvalRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={approvalRate} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Student Participation</span>
                    <span className="text-sm font-medium">
                      {totalStudents ? ((totalActivities || 0) / totalStudents * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
                  <Progress 
                    value={totalStudents ? Math.min(100, (totalActivities || 0) / totalStudents * 100) : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    +{chartData.length > 1 ? 
                      ((chartData[chartData.length - 1]?.total || 0) - (chartData[0]?.total || 0)) : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Activity Growth (6 months)</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">{(totalStudents || 0) + (totalFaculty || 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Approval Rate</span>
                    <Badge variant={approvalRate >= 80 ? 'default' : 'secondary'}>
                      {approvalRate >= 80 ? 'Excellent' : approvalRate >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Faculty Ratio</span>
                    <Badge variant={facultyStudentRatio <= 20 ? 'default' : 'secondary'}>
                      {facultyStudentRatio <= 15 ? 'Excellent' : facultyStudentRatio <= 20 ? 'Good' : 'High'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="naac-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NAAC Readiness Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Curricular Aspects</div>
                    <Progress value={85} className="mt-1 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">85% - Good Progress</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Teaching-Learning & Evaluation</div>
                    <Progress value={facultyStudentRatio <= 20 ? 80 : 60} className="mt-1 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {facultyStudentRatio <= 20 ? '80% - Good' : '60% - Needs Improvement'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Research & Innovation</div>
                    <Progress value={70} className="mt-1 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">70% - Data Collection Needed</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Infrastructure</div>
                    <Progress value={82} className="mt-1 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">82% - Good Infrastructure</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Student Support</div>
                    <Progress value={approvalRate} className="mt-1 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {approvalRate.toFixed(1)}% - Based on Activity Success
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Governance & Leadership</div>
                    <Progress value={88} className="mt-1 h-2" />
                    <div className="text-xs text-muted-foreground mt-1">88% - Strong Governance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nirf-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NIRF Parameter Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="font-medium">Teaching, Learning & Resources (30%)</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Faculty-Student Ratio</span>
                        <span>1:{facultyStudentRatio.toFixed(0)}</span>
                      </div>
                      <Progress value={Math.min(100, (15 / facultyStudentRatio) * 100)} className="h-1.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="font-medium">Research & Professional Practice (30%)</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Research Output</span>
                        <span>Assessment Needed</span>
                      </div>
                      <Progress value={70} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {(((15 / facultyStudentRatio) * 100) * 0.3 + 70 * 0.3 + 80 * 0.4).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated NIRF Score</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {facultyStudentRatio <= 15 ? '50-100' : facultyStudentRatio <= 20 ? '100-200' : '200+'}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Rank Band</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">75%</div>
                    <div className="text-sm text-muted-foreground">Data Completeness</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}