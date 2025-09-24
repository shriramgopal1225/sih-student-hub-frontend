// components/layout/sidebar-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, CheckSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarNav({ role }: { role: string | null | undefined }) {
  const pathname = usePathname();

  // Define links for each role
  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: Home },
    { href: '/student/activities', label: 'My Activities', icon: FileText },
  ];

  const facultyLinks = [
    { href: '/faculty/dashboard', label: 'Dashboard', icon: Home },
    { href: '/faculty/verification', label: 'Verification Queue', icon: CheckSquare },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/user-management', label: 'User Management', icon: Users },
  ];

  // --- NEW: Dedicated links for the HOD ---
  const hodLinks = [
    { href: '/faculty/dashboard', label: 'HOD Dashboard', icon: Home },
    { href: '/admin/user-management', label: 'Department Users', icon: Users },
    { href: '/faculty/verification', label: 'My Verification Queue', icon: CheckSquare },
  ];

  // Updated logic to select the correct set of links
  let navLinks = studentLinks; // Default to student
  if (role === 'admin' || role === 'superadmin') {
    navLinks = adminLinks;
  } else if (role === 'hod') {
    navLinks = hodLinks;
  } else if (role === 'faculty') {
    navLinks = facultyLinks;
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
            className={cn( 'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900', isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-500' )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}