// components/reports/report-metrics.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';

interface ReportMetricsProps {
  metrics: {
    totalStudents: number;
    totalFaculty: number;
    facultyStudentRatio: string;
    totalActivities: number;
    verifiedActivities: number;
    activitySuccessRate: number;
    recentActivities: Array<{
      title: string;
      approval_status: string;
      created_at: string;
      activity_categories?: {
        name: string;
      } | null;
    }>;
  };
}

export function ReportMetrics({ metrics }: ReportMetricsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Faculty:Student Ratio</span>
              <span className="text-sm text-muted-foreground">1:{metrics.facultyStudentRatio}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              NAAC Standard: 1:15 - 1:20 (Engineering)
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Activity Success Rate</span>
              <span className="text-sm text-muted-foreground">{metrics.activitySuccessRate}%</span>
            </div>
            <Progress value={metrics.activitySuccessRate} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {metrics.verifiedActivities} of {metrics.totalActivities} activities approved
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Student Engagement</span>
              <span className="text-sm text-muted-foreground">
                {((metrics.totalActivities / metrics.totalStudents) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Average activities per student
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  {activity.approval_status === 'APPROVED' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-orange-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{activity.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.activity_categories?.name || 'General'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.approval_status === 'APPROVED' ? 'default' : 'secondary'}>
                    {activity.approval_status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}