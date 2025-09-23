// app/(platform)/admin/user-management/page.tsx
import { createClient } from '@/lib/supabase/server';
import { UserManagementTabs } from '@/components/admin/user-management-tabs';

export default async function UserManagementPage() {
  const supabase = createClient();

  // Fetch all students with their profile info
  const { data: students } = await supabase
    .from('students')
    .select(`*, profiles(full_name, email)`);

  // Fetch all faculty with their profile info
  const { data: faculty } = await supabase
    .from('faculty')
    .select(`*, profiles(full_name, email)`);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <UserManagementTabs students={students || []} faculty={faculty || []} />
    </div>
  );
}