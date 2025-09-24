// app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin" || profile?.role === "superadmin") {
      redirect("/admin/dashboard");
    } else if (profile?.role === "faculty" || profile?.role === "hod") { // --- THIS IS THE FIX ---
      redirect("/faculty/dashboard");
    } else if (profile?.role === "student") {
      redirect("/student/dashboard");
    }
  }
  
  // If no user or no matching role, redirect to login
  redirect("/login");
}