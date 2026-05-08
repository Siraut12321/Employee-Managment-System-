'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { ROLE_LABELS } from '@/constants';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard, Users, Building2, DollarSign,
  LogOut, Settings, Menu, Sun, Moon,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/employees', label: 'Employees', icon: Users },
  { href: '/dashboard/departments', label: 'Departments', icon: Building2 },
  { href: '/dashboard/salary', label: 'Salary', icon: DollarSign },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">EMS Admin</span>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavigate}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-2">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-1">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {admin?.name ? getInitials(admin.name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{admin?.name}</p>
            <Badge variant="secondary" className="text-xs mt-0.5">
              {admin?.role ? ROLE_LABELS[admin.role] : ''}
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function ThemeToggle({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'icon' }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8" />;
  const isDark = theme === 'dark';
  return (
    <Button
      variant="ghost"
      size={size}
      className={className}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {size === 'sm' && (isDark ? ' Light Mode' : ' Dark Mode')}
    </Button>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r sticky top-0 shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger>
            <div className="inline-flex items-center justify-center rounded-md border border-input bg-background shadow-md h-9 w-9 hover:bg-accent cursor-pointer">
              <Menu className="w-4 h-4" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
