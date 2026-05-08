'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/employees': 'Employees',
  '/dashboard/employees/new': 'Add Employee',
  '/dashboard/departments': 'Departments',
  '/dashboard/salary': 'Salary',
  '/dashboard/settings': 'Settings',
};

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const admin = useAuthStore((s) => s.admin);

  useEffect(() => setMounted(true), []);

  const label = ROUTE_LABELS[pathname] ?? 'Dashboard';
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="md:hidden w-8" /> {/* spacer for mobile menu button */}
      <h2 className="font-semibold text-base hidden md:block">{label}</h2>
      <div className="flex items-center gap-2 ml-auto">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="hidden md:flex"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        )}
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
        <div className="text-sm text-muted-foreground hidden md:block">
          {admin?.email}
        </div>
      </div>
    </header>
  );
}
