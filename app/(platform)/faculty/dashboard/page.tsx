// app/(platform)/faculty/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hourglass, ListChecks } from 'lucide-react';

export default async function FacultyDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the faculty's name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id)
    .single();

  // Fetch the count of activities pending this faculty's verification
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
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Hourglass className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Activities awaiting your review</p>
            <Button asChild className="mt-4">
              <Link href="/faculty/verification">
                <ListChecks className="mr-2 h-4 w-4" /> Go to Verification Queue
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}