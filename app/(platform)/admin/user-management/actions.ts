'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { StudentCSVRow, FacultyCSVRow } from '@/lib/csv-utils';

export async function createNewUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = formData.get('role') as 'student' | 'faculty';
  const profilePhotoFile = formData.get('profilePhoto') as File;

  let publicURL = null;
  let userId = '';

  try {
    // 1. Create the user in Supabase Auth to get the ID
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
    });

    if (authError) throw authError;
    userId = authData.user.id;

    // 2. If a photo was provided, upload it to storage
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      const fileExtension = profilePhotoFile.name.split('.').pop();
      const filePath = `profile-photos/${userId}/${Date.now()}.${fileExtension}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('user_assets')
        .upload(filePath, profilePhotoFile);

      if (uploadError) throw uploadError;

      // 3. Get the public URL of the uploaded file
      const { data: urlData } = supabaseAdmin.storage.from('user_assets').getPublicUrl(filePath);
      publicURL = urlData.publicUrl;
    }

    // 4. Update the user's record in the 'profiles' table with the photo URL using upsert
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email: email,
      role: role,
      profile_photo_url: publicURL,
    });

    if (profileError) throw profileError;

    // 5. Create the role-specific record (student or faculty)
    if (role === 'student') {
      const enrollmentNo = formData.get('enrollmentNo') as string;
      const course = formData.get('course') as string;
      const year = formData.get('year') as string;
      const gpa = formData.get('gpa') as string;
      const cgpa = formData.get('cgpa') as string;
      const { error } = await supabaseAdmin.from('students').insert({ 
        id: userId, 
        enrollment_no: enrollmentNo, 
        course, 
        year: parseInt(year), 
        gpa: parseFloat(gpa) || null, 
        cgpa: parseFloat(cgpa) || null 
      });
      if (error) throw error;
    } else if (role === 'faculty') {
      const department = formData.get('department') as string;
      const designation = formData.get('designation') as string;
      const { error } = await supabaseAdmin.from('faculty').insert({ 
        id: userId, 
        department, 
        designation 
      });
      if (error) throw error;
    }

    revalidatePath('/admin/user-management');
    return { success: 'User created successfully!' };

  } catch (error: unknown) {
    console.error("--- CREATE USER FAILED ---", error);
    // If any step fails after the user is created, delete the user to clean up
    if (userId) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
    }
    let errorMessage = 'An unexpected server error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}

export async function bulkCreateUsers(
  users: (StudentCSVRow | FacultyCSVRow)[],
  role: 'student' | 'faculty'
) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[]
  };

  try {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // 1. Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        });

        if (authError) throw authError;
        const userId = authData.user.id;

        // 2. Create the profile record
        const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
          id: userId,
          full_name: user.full_name,
          email: user.email,
          role: role,
          profile_photo_url: user.profile_image_url || null,
        });

        if (profileError) throw profileError;

        // 3. Create the role-specific record
        if (role === 'student') {
          const studentData = user as StudentCSVRow;
          const { error } = await supabaseAdmin.from('students').insert({
            id: userId,
            enrollment_no: studentData.enrollment_no,
            course: studentData.course,
            year: studentData.year,
            gpa: studentData.gpa || null,
            cgpa: studentData.cgpa || null,
          });
          if (error) throw error;
        } else if (role === 'faculty') {
          const facultyData = user as FacultyCSVRow;
          const { error } = await supabaseAdmin.from('faculty').insert({
            id: userId,
            department: facultyData.department,
            designation: facultyData.designation,
          });
          if (error) throw error;
        }

        results.successful++;
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Row ${i + 1} (${user.email}): ${errorMessage}`);
        console.error(`Failed to create user ${user.email}:`, error);
      }
    }

    revalidatePath('/admin/user-management');

    if (results.failed === 0) {
      return { success: `Successfully created ${results.successful} ${role}(s)!` };
    } else if (results.successful === 0) {
      return { error: `Failed to create all users. Errors: ${results.errors.slice(0, 3).join('; ')}` };
    } else {
      return { 
        success: `Created ${results.successful} ${role}(s) successfully. ${results.failed} failed. First few errors: ${results.errors.slice(0, 3).join('; ')}` 
      };
    }

  } catch (error: unknown) {
    console.error("--- BULK CREATE USERS FAILED ---", error);
    let errorMessage = 'An unexpected server error occurred during bulk upload.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}