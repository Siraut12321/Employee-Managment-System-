'use client';

import { useEffect, useState } from 'react';
import { useDepartmentStore } from '@/store/departmentStore';
import { usePermission } from '@/hooks/usePermission';
import { useConfirm } from '@/hooks/useConfirm';
import { Department } from '@/types';
import { DepartmentCard } from '@/components/departments/DepartmentCard';
import { DepartmentDialog } from '@/components/departments/DepartmentDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function DepartmentsPage() {
  const { departments, loading, fetchDepartments, deleteDepartment } = useDepartmentStore();
  const { can } = usePermission();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | undefined>(undefined);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const handleEdit = (dept: Department) => {
    setEditTarget(dept);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditTarget(undefined);
    setDialogOpen(true);
  };

  const handleDelete = (dept: Department) => {
    confirm(
      `Delete "${dept.name}"`,
      dept.employeeCount
        ? `This department has ${dept.employeeCount} employee(s). Remove them first.`
        : 'This action cannot be undone.',
      async () => {
        try {
          await deleteDepartment(dept._id);
          toast.success('Department deleted');
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg || 'Failed to delete department');
        }
        closeConfirm();
      }
    );
  };

  const totalEmployees = departments.reduce((sum, d) => sum + (d.employeeCount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-sm text-muted-foreground">
            {departments.length} departments · {totalEmployees} total employees
          </p>
        </div>
        {can('canManageDepartments') && (
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> New Department
          </Button>
        )}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3"
        >
          <Building2 className="w-16 h-16 opacity-20" />
          <p className="text-lg font-medium">No departments yet</p>
          <p className="text-sm">Create your first department to get started</p>
          {can('canManageDepartments') && (
            <Button onClick={handleAdd} className="mt-2">
              <Plus className="w-4 h-4 mr-2" /> Create Department
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departments.map((dept, index) => (
            <DepartmentCard
              key={dept._id}
              department={dept}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditTarget(undefined);
        }}
        department={editTarget}
      />

      {/* Delete Confirm */}
      <AlertDialog open={confirmState.open} onOpenChange={closeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmState.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmState.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmState.onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
