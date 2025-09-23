// demo/superadmin-dashboard-demo.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, CheckCircle, Hourglass, FileText, TrendingUp, Building, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuperadminDashboardDemo() {
  // Mock data for demonstration
  const mockData = {
    totalStudents: 1250,
    totalFaculty: 85,
    totalAdmins: 5,
    verifiedActivities: 234,
    pendingActivities: 23,
    totalActivities: 257
  };

  const facultyStudentRatio = (mockData.totalStudents / mockData.totalFaculty).toFixed(2);
  const activityApprovalRate = ((mockData.verifiedActivities / mockData.totalActivities) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Superadmin Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
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
              <div className="text-2xl font-bold">{mockData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalFaculty}</div>
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
              <div className="text-2xl font-bold">{mockData.verifiedActivities}</div>
              <p className="text-xs text-muted-foreground">Approved student activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
              <Hourglass className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.pendingActivities}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Administrators</CardTitle>
              <UserCheck className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalAdmins}</div>
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
              <Button className="w-full">
                Generate NAAC Report
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
              <Button className="w-full">
                Generate NIRF Report
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
                <div className="text-2xl font-bold text-green-500">{mockData.totalStudents + mockData.totalFaculty}</div>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{mockData.totalActivities}</div>
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
    </div>
  );
}