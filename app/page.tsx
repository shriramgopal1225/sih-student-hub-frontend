// app/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Fetch the user's role from the profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Redirect based on the role found in the database
    if (profile?.role === 'faculty') {
      redirect('/faculty/dashboard');
    } else if (profile?.role === 'student') {
      redirect('/student/dashboard');
    }
    // Note: If an authenticated user has a role other than 'student' or 'faculty',
    // or if their profile is missing, they will be redirected to /login.
  }

  // If no user is logged in, redirect to login
  redirect('/login');
}