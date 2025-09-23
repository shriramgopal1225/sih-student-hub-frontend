// app/(platform)/faculty/verification/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveActivity(activityId: string, studentId: string, creditsToAward: number) {
  const supabase = createClient();

  // 1. Update the activity's status to APPROVED
  const { error: activityUpdateError } = await supabase
    .from('activities')
    .update({ approval_status: 'APPROVED' })
    .eq('activity_id', activityId);

  if (activityUpdateError) {
    console.error("Approval Error (Activity Update):", activityUpdateError);
    return { error: activityUpdateError.message };
  }

  // 2. Increment the student's total_credits
  // We use an RPC call to safely increment the value on the database
  const { error: creditsUpdateError } = await supabase.rpc('increment_student_credits', {
    student_id_to_update: studentId,
    credits_to_add: creditsToAward
  });

  if (creditsUpdateError) {
    console.error("Approval Error (Credits Update):", creditsUpdateError);
    // At this point, the activity is approved but credits might not be.
    // In a production app, you might want to handle this more gracefully (e.g., revert the approval).
    return { error: creditsUpdateError.message };
  }

  // 3. Revalidate paths to refresh the UI
  revalidatePath('/faculty/verification');
  revalidatePath('/faculty/dashboard');
  return { success: true };
}

export async function rejectActivity(activityId: string, feedback: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('activities')
    .update({ approval_status: 'REJECTED', feedback: feedback })
    .eq('activity_id', activityId);

  if (error) {
    console.error("Rejection Error:", error);
    return { error: error.message };
  }

  revalidatePath('/faculty/verification');
  revalidatePath('/faculty/dashboard');
  return { success: true };
}