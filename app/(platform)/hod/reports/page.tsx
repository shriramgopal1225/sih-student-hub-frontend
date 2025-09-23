// app/(platform)/hod/reports/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, BarChart3, Users, Award } from 'lucide-react';

export default function HODReportsPage() {
  // Mock department data
  const departmentMetrics = {
    name: "Computer Science & Engineering",
    faculty: 12,
    students: 156,
    publications: 34,
    projects: 8,
    placements: 142,
    avgCgpa: 8.2,
    researchFunding: 45.5 // in lakhs
  };

  const naacContribution = [
    { criterion: "Teaching-Learning & Evaluation", score: 88, target: 90 },
    { criterion: "Research & Innovation", score: 75, target: 80 },
    { criterion: "Faculty Development", score: 82, target: 85 },
    { criterion: "Student Support", score: 91, target: 90 }
  ];

  const nirfContribution = [
    { parameter: "Faculty Qualifications", score: 85, weight: "25%" },
    { parameter: "Research Output", score: 72, weight: "30%" },
    { parameter: "Student Outcomes", score: 91, weight: "20%" },
    { parameter: "Industry Engagement", score: 78, weight: "15%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Department Reports</h1>
          <p className="text-muted-foreground">{departmentMetrics.name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Department Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Strength</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentMetrics.faculty}</div>
            <p className="text-xs text-muted-foreground">Teaching staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Enrollment</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentMetrics.students}</div>
            <p className="text-xs text-muted-foreground">Current batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Publications</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentMetrics.publications}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((departmentMetrics.placements / departmentMetrics.students) * 100)}%</div>
            <p className="text-xs text-muted-foreground">{departmentMetrics.placements} placed</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="naac" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="naac">NAAC Contribution</TabsTrigger>
          <TabsTrigger value="nirf">NIRF Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance Report</TabsTrigger>
          <TabsTrigger value="research">Research Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="naac" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department NAAC Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {naacContribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.criterion}</span>
                      <div className="flex gap-2">
                        <Badge variant={item.score >= item.target ? 'default' : 'secondary'}>
                          {item.score}/{item.target}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.score >= item.target ? 'Target Achieved' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                    <Progress value={(item.score / item.target) * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Progress: {item.score}/{item.target} ({Math.round((item.score / item.target) * 100)}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nirf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NIRF Parameter Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {nirfContribution.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.parameter}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">Weight: {item.weight}</Badge>
                        <Badge variant={item.score >= 80 ? 'default' : 'secondary'}>
                          {item.score}/100
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      Weighted Contribution: {((item.score * parseInt(item.weight)) / 100).toFixed(1)} points
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average CGPA</span>
                  <span className="font-medium">{departmentMetrics.avgCgpa}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pass Percentage</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>First Class Percentage</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Distinction Percentage</span>
                  <span className="font-medium">42%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Faculty Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>PhD Holders</span>
                  <span className="font-medium">10/12 (83%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Publications per Faculty</span>
                  <span className="font-medium">{(departmentMetrics.publications / departmentMetrics.faculty).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Research Projects</span>
                  <span className="font-medium">{departmentMetrics.projects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Research Funding</span>
                  <span className="font-medium">₹{departmentMetrics.researchFunding}L</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Research Output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Journal Publications</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conference Publications</span>
                    <span className="font-medium">10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Book Chapters</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Patents Filed</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>SCI/Scopus Publications</span>
                    <span className="font-medium">18/24 (75%)</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Citations Received</span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>H-Index (Department)</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}