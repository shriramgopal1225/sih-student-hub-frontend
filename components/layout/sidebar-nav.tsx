// components/layout/sidebar-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarNav({ role }: { role: string | null | undefined }) {
  const pathname = usePathname();

  // Define links for different roles
  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: Home },
    { href: '/student/activities', label: 'My Activities', icon: FileText },
  ];

  const facultyLinks = [
    { href: '/faculty/dashboard', label: 'Dashboard', icon: Home },
    { href: '/faculty/verification', label: 'Verification Queue', icon: CheckSquare },
  ];

  const navLinks = role === 'faculty' ? facultyLinks : studentLinks; // Default to student links

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900',
              isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-500'
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