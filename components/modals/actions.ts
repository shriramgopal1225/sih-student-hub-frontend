// components/modals/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createActivity(formData: FormData) {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to create an activity.' };
    }

    // 1. Get all the form data
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

    // 2. Upload the proof file to Supabase Storage
    const fileExtension = proofFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `activity-proofs/${user.id}/${fileName}`; // This will be our public_id

    const { error: uploadError } = await supabase.storage
      .from('user_assets')
      .upload(filePath, proofFile);

    if (uploadError) { throw uploadError; }
    
    // Get the public URL of the file we just uploaded
    const { data: urlData } = supabase.storage.from('user_assets').getPublicUrl(filePath);
    const publicURL = urlData.publicUrl;

    // 3. Insert the new activity into the 'activities' table
    const { data: newActivity, error: activityError } = await supabase
      .from('activities')
      .insert({
        student_id: user.id,
        title: title,
        category_id: categoryId,
        start_date: startDate ? new Date(startDate).toISOString().split('T')[0] : null,
        end_date: endDate ? new Date(endDate).toISOString().split('T')[0] : null,
        verifier_id: facultyId,
        description: description,
        approval_status: 'PENDING',
      })
      .select()
      .single();
    
    if (activityError) { throw activityError; }
    if (!newActivity) { throw new Error("Activity creation failed and returned no data."); }

    // --- THIS IS THE CORRECTED INSERT STATEMENT ---
    // 4. Insert the proof record into the 'activity_proofs' table
    const { error: proofError } = await supabase
      .from('activity_proofs')
      .insert({
        activity_id: newActivity.activity_id,
        file_url: publicURL,           // Use the correct column 'file_url'
        public_id: filePath,          // Use the file path as the 'public_id'
        file_type: proofFile.type,
        file_size: proofFile.size,
      });
    // --- END OF CORRECTION ---
    
    if (proofError) { throw proofError; }
    
    // 5. Revalidate and return success
    revalidatePath('/student/dashboard');
    return { success: 'Activity submitted successfully!' };

  } catch (error: unknown) {
    console.error("--- SERVER ACTION ERROR ---");
    console.error(error);
    console.error("--------------------------");
    
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
        return { error: `Database error: ${(error as { code: string; message: string }).message}` };
    }
    
    return { error: 'An unexpected server error occurred. Check the server logs.' };
  }
}