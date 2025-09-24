// app/(platform)/admin/user-management/page.tsx
import { createClient } from '@/lib/supabase/server';
import { UserManagementTabs } from '@/components/admin/user-management-tabs';
import { redirect } from 'next/navigation';

export default async function UserManagementPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  let students = [];
  let faculty = [];

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (!profile || !['admin', 'hod', 'superadmin'].includes(profile.role)) {
    redirect('/'); 
  }

  if (profile.role === 'hod') {
    const { data: hodData, error } = await supabase.rpc('get_hod_user_management_data');
    if (error) {
      console.error("Error fetching HOD data:", error);
    } else {
      students = hodData.students;
      faculty = hodData.faculty;
    }
  } else {
    const { data: studentData } = await supabase.from('students').select(`*, profiles(full_name, email, profile_photo_url)`);
    students = studentData || [];
    const { data: facultyData } = await supabase.from('faculty').select(`*, profiles(full_name, email, profile_photo_url)`);
    faculty = facultyData || [];
  }
    
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      {/* Pass the user's role to the tabs component */}
      <UserManagementTabs students={students} faculty={faculty} role={profile.role} />
    </div>
  );
}