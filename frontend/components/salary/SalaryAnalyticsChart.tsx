'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { SalaryAnalytics } from '@/types';
import { MONTH_SHORT } from '@/constants';
import { formatCurrency } from '@/lib/utils';

interface SalaryAnalyticsChartProps {
  data: SalaryAnalytics[];
  loading?: boolean;
}

export function SalaryAnalyticsChart({ data, loading }: SalaryAnalyticsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-[260px] w-full" /></CardContent>
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
        <CardTitle>Payroll Trend — {new Date().getFullYear()}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
            No data available for this year
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
              />
              <Area
                type="monotone"
                dataKey="payroll"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#payrollGrad)"
                name="Net Payroll"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
