'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDepartmentStore } from '@/store/departmentStore';
import { Department } from '@/types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface DepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department;
}

export function DepartmentDialog({ open, onOpenChange, department }: DepartmentDialogProps) {
  const { createDepartment, updateDepartment } = useDepartmentStore();
  const isEdit = !!department;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (open) {
      reset(department ? { name: department.name, description: department.description || '' } : { name: '', description: '' });
    }
  }, [open, department, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (isEdit) {
        await updateDepartment(department._id, data);
        toast.success('Department updated');
      } else {
        await createDepartment(data);
        toast.success('Department created');
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Department' : 'New Department'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Department Name *</Label>
            <Input id="dept-name" placeholder="e.g. Engineering" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept-desc">Description</Label>
            <Input id="dept-desc" placeholder="Brief description..." {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
