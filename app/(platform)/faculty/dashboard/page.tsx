// app/(platform)/faculty/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hourglass, ListChecks, Users, UserCheck, CheckCircle } from 'lucide-react';

// Component for the standard Faculty View
async function StandardFacultyDashboard({ profile, user }: { profile: any, user: any }) {
  const supabase = createClient();
  const { count: pendingCount } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })
    .eq('verifier_id', user?.id)
    .eq('approval_status', 'PENDING');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Professor'}!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Pending Verifications</CardTitle>
            <Hourglass className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Activities awaiting your personal review</p>
            <Button asChild className="mt-4">
              <Link href="/faculty/verification">
                <ListChecks className="mr-2 h-4 w-4" /> Go to Your Queue
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Component for the HOD View
async function HODDashboard({ profile }: { profile: any }) {
  const supabase = createClient();
  const { data: stats, error } = await supabase.rpc('get_hod_dashboard_stats');
  if (error) console.error("Error fetching HOD stats:", error);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">HOD Dashboard: {profile?.full_name}</h1>
      <Card>
        <CardHeader><CardTitle>Department Overview</CardTitle></CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats?.students ?? 0}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats?.faculty ?? 0}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Activities</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats?.verified ?? 0}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
                <Hourglass className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats?.pending ?? 0}</div></CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page Component that decides which view to show
export default async function FacultyDashboardRouter() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user?.id)
    .single();

  if (profile?.role === 'hod') {
    return <HODDashboard profile={profile} />;
  }
  
  return <StandardFacultyDashboard profile={profile} user={user} />;
}