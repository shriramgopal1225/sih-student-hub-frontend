// components/layout/sidebar-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: Home },
    { href: '/student/activities', label: 'My Activities', icon: FileText },
  ];

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
              isActive
                ? 'bg-gray-100 text-gray-900' // Active link styles
                : 'text-gray-500' // Inactive link styles
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