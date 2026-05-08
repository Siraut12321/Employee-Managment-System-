'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SalaryAnalytics } from '@/types';
import { MONTH_SHORT } from '@/constants';
import { formatCurrency } from '@/lib/utils';

interface SalaryChartProps {
  data: SalaryAnalytics[];
  loading?: boolean;
}

export function SalaryChart({ data, loading }: SalaryChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    month: MONTH_SHORT[item._id - 1],
    payroll: item.totalPayroll,
    bonus: item.totalBonus,
    deductions: item.totalDeductions,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Payroll Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
            />
            <Legend />
            <Bar dataKey="payroll" fill="hsl(var(--primary))" name="Payroll" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bonus" fill="hsl(var(--chart-2))" name="Bonus" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
