// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { User } from 'lucide-react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { UserProfile } from '@/components/layout/user-profile';

export default async function PlatformLayout({ children }: { children: React.ReactNode; }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  // Fetch profile data, including the user's role
  const { data: profileData } = await supabase
    .from('profiles')
    .select(`*, students(*)`)
    .eq('id', user.id)
    .single();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <User className="h-6 w-6 text-green-500" />
              <span>Smart Student Hub</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            {/* Pass the user's role to the sidebar */}
            <SidebarNav role={profileData?.role} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="flex-1">
            <h1 className="text-lg font-semibold capitalize">{profileData?.role} Portal</h1>
          </div>
          <UserProfile profileData={profileData} />
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}