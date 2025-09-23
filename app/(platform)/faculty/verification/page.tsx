// app/(platform)/faculty/verification/page.tsx
import { createClient } from "@/lib/supabase/server";
import { VerificationQueue } from "@/components/faculty/verification-queue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerificationPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all activities that are pending and assigned to the current faculty member
  // We also "join" the related data we need to display
  const { data: activities, error } = await supabase
    .from('activities')
    .select(`
      *,
      students (
        profiles ( full_name )
      ),
      activity_categories ( name ),
      activity_proofs ( file_url )
    `)
    .eq('verifier_id', user?.id)
    .eq('approval_status', 'PENDING');

  if (error) {
    console.error("Error fetching activities for verification:", error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Verification Queue</CardTitle>
        <CardDescription>
          Review and approve or reject student-submitted activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerificationQueue activities={activities || []} />
      </CardContent>
    </Card>
  );
}
