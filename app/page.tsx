// app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

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

    // Add the 'admin', 'superadmin', and 'hod' roles to the redirect logic
    if (profile?.role === "admin") {
      redirect("/admin/dashboard");
    } else if (profile?.role === "superadmin") {
      redirect("/superadmin/dashboard");
    } else if (profile?.role === "hod") {
      redirect("/hod/dashboard");
    } else if (profile?.role === "faculty") {
      redirect("/faculty/dashboard");
    } else if (profile?.role === "student") {
      redirect("/student/dashboard");
    }
  }
  redirect("/login");
}
