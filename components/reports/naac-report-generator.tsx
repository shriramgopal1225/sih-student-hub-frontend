// components/reports/naac-report-generator.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface NAACReportGeneratorProps {
  metrics: {
    totalStudents: number;
    totalFaculty: number;
    facultyStudentRatio: string;
    totalActivities: number;
    verifiedActivities: number;
    activitySuccessRate: number;
  };
}

export function NAACReportGenerator({ metrics }: NAACReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Calculate NAAC criteria scores based on metrics
  const naacCriteria = [
    {
      id: 1,
      name: 'Curricular Aspects',
      score: 85,
      maxScore: 100,
      status: 'good',
      description: 'Curriculum design, implementation, and student progression',
      metrics: [
        `Academic flexibility: Good (Choice Based Credit System implemented)`,
        `Course completion rate: ${((metrics.verifiedActivities / metrics.totalActivities) * 100).toFixed(1)}%`,
        `Student progression: Active monitoring system in place`
      ]
    },
    {
      id: 2,
      name: 'Teaching-Learning and Evaluation',
      score: Math.min(100, (1 / parseFloat(metrics.facultyStudentRatio)) * 100 * 15),
      maxScore: 100,
      status: parseFloat(metrics.facultyStudentRatio) <= 20 ? 'good' : 'needs-improvement',
      description: 'Faculty-student ratio, teaching methodology, and evaluation processes',
      metrics: [
        `Faculty:Student Ratio: 1:${metrics.facultyStudentRatio}`,
        `Total Faculty: ${metrics.totalFaculty}`,
        `Total Students: ${metrics.totalStudents}`,
        `Teaching Load: ${parseFloat(metrics.facultyStudentRatio) <= 20 ? 'Optimal' : 'High'}`
      ]
    },
    {
      id: 3,
      name: 'Research, Innovations and Extension',
      score: 78,
      maxScore: 100,
      status: 'good',
      description: 'Research output, innovation, and extension activities',
      metrics: [
        `Research Publications: Assessment needed`,
        `Patents Filed: Data collection required`,
        `Extension Activities: ${metrics.verifiedActivities} verified activities`,
        `Community Engagement: Active participation recorded`
      ]
    },
    {
      id: 4,
      name: 'Infrastructure and Learning Resources',
      score: 82,
      maxScore: 100,
      status: 'good',
      description: 'Physical and academic infrastructure',
      metrics: [
        'Library Resources: Assessment needed',
        'Laboratory Facilities: Evaluation required',
        'IT Infrastructure: Current system operational',
        'Sports & Recreation: Facilities available'
      ]
    },
    {
      id: 5,
      name: 'Student Support and Progression',
      score: metrics.activitySuccessRate,
      maxScore: 100,
      status: metrics.activitySuccessRate >= 80 ? 'good' : 'needs-improvement',
      description: 'Student support services and career progression',
      metrics: [
        `Activity Participation: ${metrics.activitySuccessRate}%`,
        `Student Support Services: Active`,
        `Career Guidance: Available`,
        `Alumni Network: Established`
      ]
    },
    {
      id: 6,
      name: 'Governance, Leadership and Management',
      score: 88,
      maxScore: 100,
      status: 'good',
      description: 'Institutional governance and leadership effectiveness',
      metrics: [
        'Leadership Structure: Well-defined',
        'Decision Making: Participatory',
        'Quality Assurance: Systems in place',
        'Financial Management: Transparent'
      ]
    },
    {
      id: 7,
      name: 'Institutional Values and Best Practices',
      score: 90,
      maxScore: 100,
      status: 'excellent',
      description: 'Environmental consciousness and institutional values',
      metrics: [
        'Environmental Consciousness: Active initiatives',
        'Human Values: Promoted',
        'Best Practices: Documented',
        'Institutional Distinctiveness: Recognized'
      ]
    }
  ];

  const overallScore = naacCriteria.reduce((sum, criteria) => sum + criteria.score, 0) / naacCriteria.length;
  const grade = overallScore >= 90 ? 'A++' : overallScore >= 80 ? 'A+' : overallScore >= 70 ? 'A' : overallScore >= 60 ? 'B++' : 'B+';

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
              <FileText className="h-5 w-5" />
              NAAC Assessment Report
            </span>
            <Badge variant={overallScore >= 80 ? 'default' : 'secondary'}>
              Grade {grade} ({overallScore.toFixed(1)}/100)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            National Assessment and Accreditation Council (NAAC) comprehensive institutional evaluation 
            based on seven key criteria for quality assurance in higher education.
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? 'Generating Report...' : 'Generate NAAC Report'}
            </Button>
            {reportGenerated && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={66} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Compiling institutional data and generating assessment report...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="criteria">Detailed Criteria</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {naacCriteria.map((criteria) => (
              <Card key={criteria.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Criteria {criteria.id}
                    </CardTitle>
                    {criteria.status === 'excellent' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : criteria.status === 'good' ? (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
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
                      <span className="font-medium">{criteria.score.toFixed(1)}/{criteria.maxScore}</span>
                    </div>
                    <Progress value={criteria.score} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          {naacCriteria.map((criteria) => (
            <Card key={criteria.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Criteria {criteria.id}: {criteria.name}</span>
                  <Badge variant={criteria.status === 'excellent' ? 'default' : criteria.status === 'good' ? 'secondary' : 'outline'}>
                    {criteria.score.toFixed(1)}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Key Metrics:</div>
                    <ul className="space-y-1">
                      {criteria.metrics.map((metric, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {metric}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-sm">Faculty-Student Ratio</div>
                  <div className="text-sm text-muted-foreground">
                    Current ratio is 1:{metrics.facultyStudentRatio}. Consider recruitment to achieve optimal 1:15 ratio.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm">Research Output</div>
                  <div className="text-sm text-muted-foreground">
                    Implement systematic tracking of faculty publications and research projects.
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm">Data Collection</div>
                  <div className="text-sm text-muted-foreground">
                    Enhance data collection systems for comprehensive NAAC assessment.
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