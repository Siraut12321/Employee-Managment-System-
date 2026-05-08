'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Building2, DollarSign, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';

export function QuickActions() {
  const router = useRouter();
  const { can } = usePermission();

  const actions = [
    {
      label: 'Add Employee',
      icon: UserPlus,
      href: '/dashboard/employees/new',
      show: can('canManageEmployees'),
    },
    {
      label: 'New Department',
      icon: Building2,
      href: '/dashboard/departments',
      show: can('canManageDepartments'),
    },
    {
      label: 'Add Salary',
      icon: DollarSign,
      href: '/dashboard/salary',
      show: can('canManageSalary'),
    },
    {
      label: 'View Reports',
      icon: Download,
      href: '/dashboard/salary',
      show: true,
    },
  ].filter((a) => a.show);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map(({ label, icon: Icon, href }) => (
          <Button
            key={label}
            variant="outline"
            className="h-16 flex-col gap-2 text-xs"
            onClick={() => router.push(href)}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
