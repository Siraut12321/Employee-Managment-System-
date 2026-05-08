'use client';

import { useEffect } from 'react';
import { useSalaryStore } from '@/store/salaryStore';
import { usePermission } from '@/hooks/usePermission';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatMonthYear, getEmployeeName } from '@/lib/utils';
import { MONTHS } from '@/constants';
import { toast } from 'sonner';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function SalaryTable() {
  const { can } = usePermission();
  const {
    salaries, total, page, totalPages, loading,
    filters, setFilters, fetchSalaries, markAsPaid,
  } = useSalaryStore();

  useEffect(() => { fetchSalaries(); }, [fetchSalaries]);

  const handleMarkPaid = async (id: string) => {
    try {
      await markAsPaid(id);
      toast.success('Marked as paid');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.month || ''}
          onChange={(e) => setFilters({ month: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        >
          <option value="">All Months</option>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>

        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.year || ''}
          onChange={(e) => setFilters({ year: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        >
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.status || ''}
          onChange={(e) => setFilters({ status: e.target.value || undefined, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Salary</TableHead>
              <TableHead>Status</TableHead>
              {can('canMarkPaid') && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: can('canMarkPaid') ? 8 : 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : salaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={can('canMarkPaid') ? 8 : 7} className="text-center py-16 text-muted-foreground">
                  No salary records found
                </TableCell>
              </TableRow>
            ) : (
              salaries.map((sal) => (
                <TableRow key={sal._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{getEmployeeName(sal.employeeId)}</p>
                      {typeof sal.employeeId === 'object' && sal.employeeId !== null && (
                        <p className="text-xs text-muted-foreground">
                          {(sal.employeeId as { employeeId?: string }).employeeId}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatMonthYear(sal.month, sal.year)}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(sal.baseSalary)}</TableCell>
                  <TableCell className="text-sm text-green-600">
                    {sal.bonus > 0 ? `+${formatCurrency(sal.bonus)}` : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-red-500">
                    {sal.deductions > 0 ? `-${formatCurrency(sal.deductions)}` : '—'}
                  </TableCell>
                  <TableCell className="text-sm font-semibold">{formatCurrency(sal.netSalary)}</TableCell>
                  <TableCell>
                    <Badge variant={sal.status === 'paid' ? 'default' : 'secondary'}>
                      {sal.status}
                    </Badge>
                  </TableCell>
                  {can('canMarkPaid') && (
                    <TableCell className="text-right">
                      {sal.status === 'pending' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkPaid(sal._id)}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Mark Paid
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {sal.paidDate ? new Date(sal.paidDate).toLocaleDateString() : 'Paid'}
                        </span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} records)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setFilters({ page: page - 1 })}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setFilters({ page: page + 1 })}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
