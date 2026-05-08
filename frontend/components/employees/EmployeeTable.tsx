'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployeeStore } from '@/store/employeeStore';
import { useDepartmentStore } from '@/store/departmentStore';
import { useDebounce } from '@/hooks/useDebounce';
import { usePermission } from '@/hooks/usePermission';
import { useConfirm } from '@/hooks/useConfirm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Trash2, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, getDepartmentName, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function EmployeeTable() {
  const router = useRouter();
  const { can } = usePermission();
  const {
    employees, total, page, totalPages, loading,
    filters, selectedIds, setFilters, setSelectedIds,
    fetchEmployees, deleteEmployee, bulkDelete,
  } = useEmployeeStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);
  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setFilters({ search: debouncedSearch || undefined, page: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleDelete = (id: string) => {
    confirm('Delete Employee', 'This action cannot be undone.', async () => {
      try { await deleteEmployee(id); toast.success('Employee deleted'); }
      catch { toast.error('Failed to delete'); }
      closeConfirm();
    });
  };

  const handleBulkDelete = () => {
    confirm(`Delete ${selectedIds.length} employees`, 'This action cannot be undone.', async () => {
      try { await bulkDelete(selectedIds); toast.success('Employees deleted'); }
      catch { toast.error('Failed to delete'); }
      closeConfirm();
    });
  };

  const toggleSelect = (id: string) =>
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === employees.length ? [] : employees.map((e) => e._id));

  const colSpan = can('canManageEmployees') ? 8 : 7;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employees</h2>
          <p className="text-sm text-muted-foreground">{total} total</p>
        </div>
        {can('canManageEmployees') && (
          <Button onClick={() => router.push('/dashboard/employees/new')}>
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, email, position..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.department || ''}
          onChange={(e) => setFilters({ department: e.target.value || undefined, page: 1 })}
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.status || ''}
          onChange={(e) => setFilters({ status: e.target.value || undefined, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && can('canManageEmployees') && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>Clear</Button>
        </motion.div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {can('canManageEmployees') && (
                <TableHead className="w-10">
                  <input type="checkbox" checked={selectedIds.length === employees.length && employees.length > 0} onChange={toggleAll} className="rounded" />
                </TableHead>
              )}
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {can('canManageEmployees') && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                  <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-36" /></div></div></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-10 h-10 opacity-20" />
                    <p>No employees found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp._id} className="hover:bg-muted/50">
                  {can('canManageEmployees') && (
                    <TableCell>
                      <input type="checkbox" checked={selectedIds.includes(emp._id)} onChange={() => toggleSelect(emp._id)} className="rounded" />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={emp.profileImage} />
                        <AvatarFallback className="text-xs bg-primary/10">{getInitials(emp.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{emp.position}</TableCell>
                  <TableCell className="text-sm">{getDepartmentName(emp.departmentId)}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(emp.salary)}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>{emp.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(emp.joinDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/employees/${emp._id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {can('canManageEmployees') && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/employees/${emp._id}/edit`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(emp._id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages} ({total} total)</p>
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

      {/* Confirm Dialog */}
      <AlertDialog open={confirmState.open} onOpenChange={closeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmState.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmState.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmState.onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
