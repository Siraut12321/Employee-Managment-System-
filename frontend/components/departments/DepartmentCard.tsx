'use client';

import { Department } from '@/types';
import { usePermission } from '@/hooks/usePermission';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DepartmentCardProps {
  department: Department;
  index: number;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}

export function DepartmentCard({ department, index, onEdit, onDelete }: DepartmentCardProps) {
  const { can } = usePermission();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">{department.name}</h3>
                {department.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{department.description}</p>
                )}
              </div>
            </div>
            {can('canManageDepartments') && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(department)}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(department)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              {department.employeeCount ?? 0} employees
            </Badge>
            <Badge variant={department.isActive ? 'default' : 'outline'} className="text-xs">
              {department.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
