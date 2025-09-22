// app/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Here you can add logic to check the user's role
    // and redirect to the appropriate dashboard.
    // For now, we'll default to the student dashboard.
    redirect('/student/dashboard');
  } else {
    // If no user, you can show a landing page or redirect to login
    redirect('/login');
  }
}