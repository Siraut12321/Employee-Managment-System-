'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee';
import { Employee } from '@/types';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeApi.getEmployee(id)
      .then((res) => setEmployee(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4"><Skeleton className="h-9 w-9" /><div className="space-y-1"><Skeleton className="h-7 w-40" /><Skeleton className="h-4 w-56" /></div></div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!employee) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Employee not found</div>;
  }

  return <EmployeeForm employee={employee} />;
}
