'use client';

import { useRouter } from 'next/navigation';
import { Employee } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Building2, DollarSign, Hash } from 'lucide-react';
import { formatCurrency, formatDate, getDepartmentName, getInitials } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EmployeeDetailProps {
  employee: Employee;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-muted rounded-lg mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function EmployeeDetail({ employee }: EmployeeDetailProps) {
  const router = useRouter();
  const { can } = usePermission();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        {can('canManageEmployees') && (
          <Button onClick={() => router.push(`/dashboard/employees/${employee._id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" /> Edit Employee
          </Button>
        )}
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={employee.profileImage} />
              <AvatarFallback className="text-2xl bg-primary/10">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold">{employee.name}</h1>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="w-fit mx-auto sm:mx-0">
                  {employee.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{employee.position}</p>
              <p className="text-sm text-muted-foreground font-mono">{employee.employeeId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone || '—'} />
            <InfoRow icon={MapPin} label="Address" value={employee.address || '—'} />
          </CardContent>
        </Card>

        {/* Job Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Job Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Hash} label="Employee ID" value={employee.employeeId} />
            <InfoRow icon={Building2} label="Department" value={getDepartmentName(employee.departmentId)} />
            <InfoRow icon={DollarSign} label="Salary" value={formatCurrency(employee.salary)} />
            <InfoRow icon={Calendar} label="Join Date" value={formatDate(employee.joinDate)} />
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground">
            <span>Created: {formatDate(employee.createdAt)}</span>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <span>Last updated: {formatDate(employee.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
