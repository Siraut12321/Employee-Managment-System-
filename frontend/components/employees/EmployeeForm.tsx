'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDepartmentStore } from '@/store/departmentStore';
import { employeeApi } from '@/lib/api/employee';
import { Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { POSITIONS } from '@/constants';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  departmentId: z.string().min(1, 'Department is required'),
  salary: z.string().min(1, 'Salary is required'),
  status: z.enum(['active', 'inactive']),
  joinDate: z.string().min(1, 'Join date is required'),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EmployeeFormProps {
  employee?: Employee;
}

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const router = useRouter();
  const { departments, fetchDepartments } = useDepartmentStore();
  const isEdit = !!employee;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: employee ? {
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position,
      departmentId: typeof employee.departmentId === 'object' ? employee.departmentId._id : employee.departmentId,
      salary: String(employee.salary),
      status: employee.status,
      joinDate: employee.joinDate.split('T')[0],
      address: employee.address || '',
    } : {
      status: 'active' as const,
      joinDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const payload = { ...data, salary: Number(data.salary) };
      if (isEdit) {
        await employeeApi.updateEmployee(employee._id, payload);
        toast.success('Employee updated successfully');
      } else {
        await employeeApi.createEmployee(payload);
        toast.success('Employee created successfully');
      }
      router.push('/dashboard/employees');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Something went wrong');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
          <p className="text-sm text-muted-foreground">
            {isEdit ? `Editing ${employee.name}` : 'Fill in the details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="john@company.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 234 567 8900" {...register('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St, City" {...register('address')} />
            </div>
          </CardContent>
        </Card>

        {/* Job Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Job Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <select id="position" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('position')}>
                <option value="">Select position</option>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <select id="departmentId" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('departmentId')}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (USD) *</Label>
              <Input id="salary" type="number" placeholder="50000" {...register('salary')} />
              {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date *</Label>
              <Input id="joinDate" type="date" {...register('joinDate')} />
              {errors.joinDate && <p className="text-xs text-destructive">{errors.joinDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select id="status" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
