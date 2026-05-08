'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee';
import { Employee } from '@/types';
import { EmployeeDetail } from '@/components/employees/EmployeeDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    employeeApi.getEmployee(id)
      .then((res) => setEmployee(res.data))
      .catch(() => setError('Employee not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-9 w-24" />
        <Card><CardContent className="pt-6"><div className="flex gap-6"><Skeleton className="h-24 w-24 rounded-full" /><div className="space-y-2 flex-1"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-32" /></div></div></CardContent></Card>
        <div className="grid grid-cols-2 gap-6"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>{error || 'Employee not found'}</p>
      </div>
    );
  }

  return <EmployeeDetail employee={employee} />;
}
