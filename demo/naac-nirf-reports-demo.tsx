// demo/naac-nirf-reports-demo.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, TrendingUp, Users, GraduationCap, Award, CheckCircle, AlertCircle } from 'lucide-react';

export default function NAACNIRFReportsDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Mock data
  const metrics = {
    totalStudents: 1250,
    totalFaculty: 85,
    facultyStudentRatio: '14.71',
    totalActivities: 257,
    verifiedActivities: 234,
    activitySuccessRate: 91.1
  };

  // Mock NAAC criteria data
  const naacCriteria = [
    {
      id: 1,
      name: 'Curricular Aspects',
      score: 85,
      status: 'good',
      description: 'Curriculum design, implementation, and student progression'
    },
    {
      id: 2,
      name: 'Teaching-Learning and Evaluation',
      score: 88,
      status: 'good',
      description: 'Faculty-student ratio, teaching methodology, and evaluation processes'
    },
    {
      id: 3,
      name: 'Research, Innovations and Extension',
      score: 78,
      status: 'good',
      description: 'Research output, innovation, and extension activities'
    },
    {
      id: 4,
      name: 'Infrastructure and Learning Resources',
      score: 82,
      status: 'good',
      description: 'Physical and academic infrastructure'
    },
    {
      id: 5,
      name: 'Student Support and Progression',
      score: 91,
      status: 'excellent',
      description: 'Student support services and career progression'
    },
    {
      id: 6,
      name: 'Governance, Leadership and Management',
      score: 88,
      status: 'good',
      description: 'Institutional governance and leadership effectiveness'
    },
    {
      id: 7,
      name: 'Institutional Values and Best Practices',
      score: 90,
      status: 'excellent',
      description: 'Environmental consciousness and institutional values'
    }
  ];

  const overallScore = naacCriteria.reduce((sum, criteria) => sum + criteria.score, 0) / naacCriteria.length;
  const grade = overallScore >= 90 ? 'A++' : overallScore >= 80 ? 'A+' : 'A';

  // Mock NIRF parameters
  const nirfParameters = [
    {
      name: 'Teaching, Learning & Resources',
      weightage: 30,
      score: 88,
      icon: Users
    },
    {
      name: 'Research and Professional Practice',
      weightage: 30,
      score: 72,
      icon: Award
    },
    {
      name: 'Graduation Outcomes',
      weightage: 20,
      score: 85,
      icon: GraduationCap
    },
    {
      name: 'Outreach and Inclusivity',
      weightage: 10,
      score: 82,
      icon: Users
    },
    {
      name: 'Perception',
      weightage: 10,
      score: 78,
      icon: TrendingUp
    }
  ];

  const nirfOverallScore = nirfParameters.reduce((sum, param) => sum + (param.score * param.weightage / 100), 0);
  const estimatedRank = nirfOverallScore >= 90 ? '1-50' : nirfOverallScore >= 80 ? '51-100' : '101-200';

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setReportGenerated(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <div className="text-2xl font-bold">1:{metrics.facultyStudentRatio}</div>
              <p className="text-xs text-muted-foreground">NAAC Key Metric</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Student count</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activitySuccessRate}%</div>
              <p className="text-xs text-muted-foreground">Quality indicator</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Activities</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.verifiedActivities}</div>
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
                    covering all assessment criteria.
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleGenerateReport} disabled={isGenerating}>
                      {isGenerating ? 'Generating...' : 'Generate NAAC Report'}
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {isGenerating && (
                    <div className="space-y-2">
                      <Progress value={66} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        Compiling institutional data...
                      </div>
                    </div>
                  )}
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
                    metrics for comprehensive ranking assessment.
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
          </TabsContent>

          <TabsContent value="naac" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    NAAC Assessment Report
                  </span>
                  <Badge variant="default">
                    Grade {grade} ({overallScore.toFixed(1)}/100)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {naacCriteria.map((criteria) => (
                    <Card key={criteria.id} className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            Criteria {criteria.id}
                          </CardTitle>
                          {criteria.status === 'excellent' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="font-medium text-sm">{criteria.name}</div>
                          <div className="text-xs text-muted-foreground">{criteria.description}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score:</span>
                            <span className="font-medium">{criteria.score}/100</span>
                          </div>
                          <Progress value={criteria.score} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nirf" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    NIRF Ranking Report
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline">Score: {nirfOverallScore.toFixed(1)}/100</Badge>
                    <Badge>Est. Rank: {estimatedRank}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {nirfParameters.map((param, index) => {
                    const Icon = param.icon;
                    const weightedScore = (param.score * param.weightage) / 100;
                    
                    return (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-blue-500" />
                              <div>
                                <CardTitle className="text-base">{param.name}</CardTitle>
                                <div className="text-sm text-muted-foreground">Weightage: {param.weightage}%</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{param.score}/100</div>
                              <div className="text-sm text-muted-foreground">
                                Weighted: {weightedScore.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <Progress value={param.score} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              Contribution to overall score: {weightedScore.toFixed(1)} points
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Institutional Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{overallScore.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">NAAC Score</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{nirfOverallScore.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">NIRF Score</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{estimatedRank}</div>
                    <div className="text-sm text-muted-foreground">Est. NIRF Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}