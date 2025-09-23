// components/modals/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// This file should ONLY contain the createActivity function for now.
export async function createActivity(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to create an activity.' };
    }
    const title = formData.get('title') as string;
    const categoryId = formData.get('category') as string;
    const startDate = formData.get('start_date') as string;
    const endDate = formData.get('end_date') as string;
    const facultyId = formData.get('faculty') as string;
    const description = formData.get('description') as string;
    const proofFile = formData.get('proof') as File;

    if (!title || !categoryId || !facultyId || !proofFile || proofFile.size === 0) {
      return { error: 'Please fill out all required fields and upload a proof file.' };
    }
    const fileExtension = proofFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `activity-proofs/${user.id}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('user_assets').upload(filePath, proofFile);
    if (uploadError) { throw uploadError; }
    const { data: urlData } = supabase.storage.from('user_assets').getPublicUrl(filePath);
    const publicURL = urlData.publicUrl;
    const { data: newActivity, error: activityError } = await supabase.from('activities').insert({ student_id: user.id, title: title, category_id: categoryId, start_date: startDate ? new Date(startDate).toISOString().split('T')[0] : null, end_date: endDate ? new Date(endDate).toISOString().split('T')[0] : null, verifier_id: facultyId, description: description, approval_status: 'PENDING', }).select().single();
    if (activityError) { throw activityError; }
    if (!newActivity) { throw new Error("Activity creation failed and returned no data."); }
    const { error: proofError } = await supabase.from('activity_proofs').insert({ activity_id: newActivity.activity_id, file_url: publicURL, public_id: filePath, file_type: proofFile.type, file_size: proofFile.size, });
    if (proofError) { throw proofError; }
    revalidatePath('/student/dashboard');
    return { success: 'Activity submitted successfully!' };
  } catch (error: unknown) {
    console.error("--- SERVER ACTION ERROR ---", error);
    return { error: error instanceof Error ? error.message : 'An unexpected server error occurred.' };
  }
}