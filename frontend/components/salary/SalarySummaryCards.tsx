'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Salary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SalarySummaryCardsProps {
  salaries: Salary[];
  loading: boolean;
}

export function SalarySummaryCards({ salaries, loading }: SalarySummaryCardsProps) {
  const totalPayroll = salaries.reduce((s, r) => s + r.netSalary, 0);
  const totalBonus = salaries.reduce((s, r) => s + r.bonus, 0);
  const totalDeductions = salaries.reduce((s, r) => s + r.deductions, 0);
  const pendingCount = salaries.filter((r) => r.status === 'pending').length;

  const cards = [
    { title: 'Total Payroll', value: formatCurrency(totalPayroll), icon: DollarSign, color: 'text-primary' },
    { title: 'Total Bonus', value: formatCurrency(totalBonus), icon: TrendingUp, color: 'text-green-600' },
    { title: 'Total Deductions', value: formatCurrency(totalDeductions), icon: TrendingDown, color: 'text-red-500' },
    { title: 'Pending Payments', value: String(pendingCount), icon: Clock, color: 'text-yellow-600' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ title, value, icon: Icon, color }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={`w-4 h-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
