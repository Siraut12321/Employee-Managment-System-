'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '@/constants';
import { motion } from 'framer-motion';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'hr_manager', 'accountant', 'viewer']),
});

type FormData = z.infer<typeof schema>;

export function CreateAdminForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { role: 'viewer' },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await authApi.createAdmin(data);
      toast.success(`Admin "${data.name}" created successfully`);
      reset({ role: 'viewer' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create admin');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Create Admin User
          </CardTitle>
          <CardDescription>
            Add a new admin with a specific role and access level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name *</Label>
                <Input id="admin-name" placeholder="Jane Smith" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email *</Label>
                <Input id="admin-email" type="email" placeholder="jane@company.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password *</Label>
                <Input id="admin-password" type="password" placeholder="Min 6 characters" {...register('password')} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-role">Role *</Label>
                <select
                  id="admin-role"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  {...register('role')}
                >
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role descriptions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { role: 'super_admin', desc: 'Full access' },
                { role: 'hr_manager', desc: 'Employees & departments' },
                { role: 'accountant', desc: 'Salary & payroll' },
                { role: 'viewer', desc: 'Read-only access' },
              ].map(({ role, desc }) => (
                <div key={role} className="p-2 bg-muted rounded-lg text-xs">
                  <p className="font-medium">{ROLE_LABELS[role]}</p>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              <UserPlus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
