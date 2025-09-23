// components/reports/nirf-report-generator.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Download, Target, Users, GraduationCap, Award, Eye } from 'lucide-react';

interface NIRFReportGeneratorProps {
  metrics: {
    totalStudents: number;
    totalFaculty: number;
    facultyStudentRatio: string;
    totalActivities: number;
    verifiedActivities: number;
    activitySuccessRate: number;
  };
}

export function NIRFReportGenerator({ metrics }: NIRFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Calculate NIRF ranking parameters with weightages
  const nirfParameters = [
    {
      id: 'TLR',
      name: 'Teaching, Learning & Resources',
      weightage: 30,
      score: Math.min(100, (1 / parseFloat(metrics.facultyStudentRatio)) * 100 * 15),
      maxScore: 100,
      icon: Users,
      description: 'Faculty-student ratio, faculty qualifications, and financial resources',
      subParameters: [
        {
          name: 'Faculty-Student Ratio',
          score: Math.min(100, (1 / parseFloat(metrics.facultyStudentRatio)) * 100 * 15),
          weight: 40,
          details: `Current: 1:${metrics.facultyStudentRatio} | Optimal: 1:15`
        },
        {
          name: 'Faculty with PhD',
          score: 75, // Placeholder - would come from database
          weight: 25,
          details: 'Percentage of faculty with doctoral degrees'
        },
        {
          name: 'Financial Resources',
          score: 80, // Placeholder
          weight: 20,
          details: 'Budget allocation and utilization efficiency'
        },
        {
          name: 'Facilities',
          score: 85, // Placeholder
          weight: 15,
          details: 'Infrastructure and learning resources'
        }
      ]
    },
    {
      id: 'RPC',
      name: 'Research and Professional Practice',
      weightage: 30,
      score: 72,
      maxScore: 100,
      icon: Award,
      description: 'Publications, patents, research projects, and professional practice',
      subParameters: [
        {
          name: 'Publications',
          score: 70, // Placeholder - would come from research_publications table
          weight: 30,
          details: 'Peer-reviewed publications per faculty'
        },
        {
          name: 'Patents',
          score: 65, // Placeholder - would come from patents table
          weight: 15,
          details: 'Published and granted patents'
        },
        {
          name: 'Research Projects',
          score: 75, // Placeholder
          weight: 25,
          details: 'Funded research projects and consultancy'
        },
        {
          name: 'Professional Practice',
          score: 80,
          weight: 30,
          details: 'Industry collaboration and practice'
        }
      ]
    },
    {
      id: 'GO',
      name: 'Graduation Outcomes',
      weightage: 20,
      score: metrics.activitySuccessRate,
      maxScore: 100,
      icon: GraduationCap,
      description: 'Graduate employment, higher studies, and entrepreneurship',
      subParameters: [
        {
          name: 'Placement Rate',
          score: 85, // Placeholder - would come from placements table
          weight: 50,
          details: 'Percentage of students placed in employment'
        },
        {
          name: 'Higher Studies',
          score: 70, // Placeholder - would come from higher_studies table
          weight: 30,
          details: 'Students pursuing further education'
        },
        {
          name: 'Entrepreneurship',
          score: 60, // Placeholder
          weight: 20,
          details: 'Student-led startup initiatives'
        }
      ]
    },
    {
      id: 'OI',
      name: 'Outreach and Inclusivity',
      weightage: 10,
      score: 82,
      maxScore: 100,
      icon: Target,
      description: 'Diversity, regional reach, and social inclusion',
      subParameters: [
        {
          name: 'Regional Diversity',
          score: 80, // Placeholder - would come from student demographics
          weight: 30,
          details: 'Students from different states/regions'
        },
        {
          name: 'Women Participation',
          score: 85, // Placeholder
          weight: 30,
          details: 'Female student and faculty representation'
        },
        {
          name: 'Economically Disadvantaged',
          score: 75, // Placeholder
          weight: 25,
          details: 'Students from economically weaker sections'
        },
        {
          name: 'Facilities for Disabled',
          score: 90, // Placeholder
          weight: 15,
          details: 'Accessibility and support for disabled students'
        }
      ]
    },
    {
      id: 'PR',
      name: 'Perception',
      weightage: 10,
      score: 78,
      maxScore: 100,
      icon: Eye,
      description: 'Employer and academic peer perception',
      subParameters: [
        {
          name: 'Employer Perception',
          score: 80, // Placeholder - would come from employer_feedback table
          weight: 50,
          details: 'Employer satisfaction with graduates'
        },
        {
          name: 'Academic Peer Perception',
          score: 75, // Placeholder
          weight: 50,
          details: 'Peer institution and academic recognition'
        }
      ]
    }
  ];

  // Calculate overall NIRF score
  const overallScore = nirfParameters.reduce((sum, param) => {
    return sum + (param.score * param.weightage / 100);
  }, 0);

  const estimatedRank = overallScore >= 90 ? '1-50' : 
                        overallScore >= 80 ? '51-100' : 
                        overallScore >= 70 ? '101-200' : 
                        overallScore >= 60 ? '201-300' : '300+';

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setReportGenerated(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              NIRF Ranking Report
            </span>
            <div className="flex gap-2">
              <Badge variant="outline">Score: {overallScore.toFixed(1)}/100</Badge>
              <Badge>Est. Rank: {estimatedRank}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            National Institutional Ranking Framework (NIRF) assessment based on five key parameters 
            with specific weightages for comprehensive institutional evaluation and ranking.
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? 'Generating Report...' : 'Generate NIRF Report'}
            </Button>
            {reportGenerated && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={75} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Calculating weighted scores and generating NIRF submission report...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Parameter Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Breakdown</TabsTrigger>
          <TabsTrigger value="submission">Submission Format</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {nirfParameters.map((param) => {
              const Icon = param.icon;
              const weightedScore = (param.score * param.weightage) / 100;
              
              return (
                <Card key={param.id}>
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
                        <div className="text-lg font-bold">{param.score.toFixed(1)}/100</div>
                        <div className="text-sm text-muted-foreground">
                          Weighted: {weightedScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">{param.description}</div>
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
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {nirfParameters.map((param) => (
            <Card key={param.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <param.icon className="h-5 w-5" />
                  {param.name} - Detailed Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {param.subParameters.map((sub, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{sub.name}</div>
                        <div className="flex gap-2">
                          <Badge variant="outline">Weight: {sub.weight}%</Badge>
                          <Badge>{sub.score}/100</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{sub.details}</div>
                      <Progress value={sub.score} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NIRF Submission Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Overall Score</div>
                    <div className="text-2xl font-bold">{overallScore.toFixed(2)}/100</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Estimated Ranking Band</div>
                    <div className="text-2xl font-bold">{estimatedRank}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Parameter-wise Contribution:</div>
                  {nirfParameters.map((param) => (
                    <div key={param.id} className="flex justify-between text-sm">
                      <span>{param.name} ({param.weightage}%)</span>
                      <span className="font-medium">{((param.score * param.weightage) / 100).toFixed(2)} points</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Data Requirements for Complete Assessment:</div>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Faculty qualification and research output data</li>
                    <li>• Student placement and higher studies records</li>
                    <li>• Financial statements and budget allocation</li>
                    <li>• Employer and peer feedback surveys</li>
                    <li>• Student demographic and diversity metrics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}