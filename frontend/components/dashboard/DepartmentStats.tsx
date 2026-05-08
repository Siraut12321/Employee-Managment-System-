'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Building2, Users } from 'lucide-react';
import { Department } from '@/types';
import { motion } from 'framer-motion';

interface DepartmentStatsProps {
  departments: Department[];
  loading?: boolean;
}

export function DepartmentStats({ departments, loading }: DepartmentStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const topDepts = departments
    .sort((a, b) => (b.employeeCount || 0) - (a.employeeCount || 0))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Top Departments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topDepts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No departments yet</p>
          </div>
        ) : (
          topDepts.map((dept, index) => (
            <motion.div
              key={dept._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{dept.name}</p>
                {dept.description && (
                  <p className="text-xs text-muted-foreground truncate">{dept.description}</p>
                )}
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {dept.employeeCount || 0}
              </Badge>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
