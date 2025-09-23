// app/(platform)/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, CheckCircle, Hourglass } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createClient();

  // Fetch institutional metrics
  const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
  const { count: facultyCount } = await supabase.from('faculty').select('*', { count: 'exact', head: true });
  const { count: verifiedActivitiesCount } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'APPROVED');
  const { count: pendingActivitiesCount } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('approval_status', 'PENDING');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{studentCount ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{facultyCount ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Activities</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{verifiedActivitiesCount ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities Pending Approval</CardTitle>
            <Hourglass className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{pendingActivitiesCount ?? 0}</div></CardContent>
        </Card>
      </div>
      {/* Other dashboard components like charts will go here later */}
    </div>
  );
}