'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSalaryStore } from '@/store/salaryStore';
import { employeeApi } from '@/lib/api/employee';
import { Employee } from '@/types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MONTHS } from '@/constants';

const schema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  baseSalary: z.string().min(1, 'Base salary is required'),
  bonus: z.string().optional(),
  deductions: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface SalaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function SalaryDialog({ open, onOpenChange }: SalaryDialogProps) {
  const { createSalary } = useSalaryStore();
  const [employees, setEmployees] = useState<Employee[]>([]);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      month: String(new Date().getMonth() + 1),
      year: String(currentYear),
      bonus: '0',
      deductions: '0',
    },
  });

  const baseSalary = Number(watch('baseSalary') || 0);
  const bonus = Number(watch('bonus') || 0);
  const deductions = Number(watch('deductions') || 0);
  const netSalary = baseSalary + bonus - deductions;

  useEffect(() => {
    if (open) {
      employeeApi.getEmployees({ status: 'active', limit: 100 })
        .then((res) => setEmployees(res.data.employees));
    }
  }, [open]);

  useEffect(() => {
    if (!open) reset({
      month: String(new Date().getMonth() + 1),
      year: String(currentYear),
      bonus: '0',
      deductions: '0',
    });
  }, [open, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await createSalary({
        employeeId: data.employeeId,
        month: Number(data.month),
        year: Number(data.year),
        baseSalary: Number(data.baseSalary),
        bonus: Number(data.bonus || 0),
        deductions: Number(data.deductions || 0),
        notes: data.notes,
      });
      toast.success('Salary record created');
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Salary Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Employee */}
          <div className="space-y-2">
            <Label>Employee *</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('employeeId')}>
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>{e.name} — {e.employeeId}</option>
              ))}
            </select>
            {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId.message}</p>}
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Month *</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('month')}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Year *</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('year')}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Salary fields */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Base Salary *</Label>
              <Input type="number" placeholder="50000" {...register('baseSalary')} />
              {errors.baseSalary && <p className="text-xs text-destructive">{errors.baseSalary.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Bonus</Label>
              <Input type="number" placeholder="0" {...register('bonus')} />
            </div>
            <div className="space-y-2">
              <Label>Deductions</Label>
              <Input type="number" placeholder="0" {...register('deductions')} />
            </div>
          </div>

          {/* Net salary preview */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Net Salary</span>
            <span className="font-bold text-lg">
              ${netSalary.toLocaleString()}
            </span>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input placeholder="Optional notes..." {...register('notes')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
