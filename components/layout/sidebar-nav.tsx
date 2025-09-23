// components/layout/sidebar-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, CheckSquare, Users } from "lucide-react"; // Add Users icon
import { cn } from "@/lib/utils";

export function SidebarNav({ role }: { role: string | null | undefined }) {
  const pathname = usePathname();

  const studentLinks = [
    { href: "/student/dashboard", label: "Dashboard", icon: Home },
    { href: "/student/activities", label: "My Activities", icon: FileText },
  ];
  const facultyLinks = [
    { href: "/faculty/dashboard", label: "Dashboard", icon: Home },
    {
      href: "/faculty/verification",
      label: "Verification Queue",
      icon: CheckSquare,
    },
  ];
  // --- NEW: Admin Links ---
  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/user-management", label: "User Management", icon: Users },
  ];

  // --- NEW: Superadmin Links ---
  const superadminLinks = [
    { href: "/superadmin/dashboard", label: "Dashboard", icon: Home },
    { href: "/superadmin/user-management", label: "User Management", icon: Users },
    { href: "/superadmin/reports", label: "NAAC/NIRF Reports", icon: FileText },
    { href: "/superadmin/analytics", label: "Analytics", icon: CheckSquare },
  ];

  // --- NEW: HOD Links ---
  const hodLinks = [
    { href: "/hod/dashboard", label: "Dashboard", icon: Home },
    { href: "/hod/department", label: "Department Management", icon: Users },
    { href: "/hod/reports", label: "Department Reports", icon: FileText },
  ];

  // Logic to determine which links to show
  let navLinks = studentLinks; // Default to student
  if (role === "faculty") {
    navLinks = facultyLinks;
  } else if (role === "admin") {
    navLinks = adminLinks;
  } else if (role === "superadmin") {
    navLinks = superadminLinks;
  } else if (role === "hod") {
    navLinks = hodLinks;
  }

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
              isActive ? "bg-gray-200 text-gray-900" : "text-gray-500"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
