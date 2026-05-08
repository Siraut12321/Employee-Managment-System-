'use client';

import { useEffect } from 'react';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { useSalaryStore } from '@/store/salaryStore';
import { useDepartmentStore } from '@/store/departmentStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SalaryChart } from '@/components/dashboard/SalaryChart';
import { DepartmentStats } from '@/components/dashboard/DepartmentStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const admin = useAuthStore((s) => s.admin);
  const { dashboardStats, analytics, fetchDashboardStats, fetchAnalytics } = useSalaryStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  const statsLoading = !dashboardStats;
  const analyticsLoading = analytics.length === 0;
  const deptsLoading = departments.length === 0;

  useEffect(() => {
    fetchDashboardStats();
    fetchAnalytics(new Date().getFullYear());
    fetchDepartments();
  }, [fetchDashboardStats, fetchAnalytics, fetchDepartments]);

  const stats = [
    {
      title: 'Total Employees',
      value: dashboardStats?.totalEmployees ?? 0,
      description: `${dashboardStats?.activeEmployees ?? 0} active`,
      icon: Users,
    },
    {
      title: 'Departments',
      value: dashboardStats?.totalDepartments ?? 0,
      description: 'Active departments',
      icon: Building2,
    },
    {
      title: 'Monthly Payroll',
      value: dashboardStats ? formatCurrency(dashboardStats.monthlyPayroll) : '$0',
      description: 'Current month',
      icon: DollarSign,
    },
    {
      title: 'Payroll Growth',
      value: `${dashboardStats?.payrollGrowth ?? 0}%`,
      description: 'vs last month',
      icon: TrendingUp,
      trend: dashboardStats?.payrollGrowth,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{admin?.name}</span>
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} loading={statsLoading} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalaryChart data={analytics} loading={analyticsLoading} />
        </div>
        <QuickActions />
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentStats departments={departments} loading={deptsLoading} />
      </div>
    </div>
  );
}
