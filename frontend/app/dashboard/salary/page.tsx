'use client';

import { useEffect, useState } from 'react';
import { useSalaryStore } from '@/store/salaryStore';
import { usePermission } from '@/hooks/usePermission';
import { SalaryTable } from '@/components/salary/SalaryTable';
import { SalaryDialog } from '@/components/salary/SalaryDialog';
import { SalaryAnalyticsChart } from '@/components/salary/SalaryAnalyticsChart';
import { SalarySummaryCards } from '@/components/salary/SalarySummaryCards';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SalaryPage() {
  const { can } = usePermission();
  const { salaries, analytics, loading, fetchSalaries, fetchAnalytics } = useSalaryStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSalaries();
    fetchAnalytics(new Date().getFullYear());
  }, [fetchSalaries, fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Salary Management</h2>
          <p className="text-sm text-muted-foreground">Manage payroll, bonuses, and deductions</p>
        </div>
        {can('canManageSalary') && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Salary Record
          </Button>
        )}
      </motion.div>

      {/* Summary Cards */}
      <SalarySummaryCards salaries={salaries} loading={loading} />

      {/* Tabs: Records + Analytics */}
      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Salary Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <SalaryTable />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <SalaryAnalyticsChart
            data={analytics}
            loading={analytics.length === 0 && loading}
          />
        </TabsContent>
      </Tabs>

      {/* Add Salary Dialog */}
      <SalaryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
