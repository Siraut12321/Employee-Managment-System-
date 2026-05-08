import apiClient from './client';
import { SalariesResponse, Salary, SalaryFormData, SalaryFilters, DashboardStats, SalaryAnalytics } from '@/types';

export const salaryApi = {
  getSalaries: (filters?: SalaryFilters) =>
    apiClient.get<SalariesResponse>('/salary', { params: filters }),

  createSalary: (data: SalaryFormData) =>
    apiClient.post<Salary>('/salary', data),

  updateSalary: (id: string, data: Partial<SalaryFormData & { status: string }>) =>
    apiClient.put<Salary>(`/salary/${id}`, data),

  markAsPaid: (id: string) =>
    apiClient.patch<Salary>(`/salary/${id}/pay`),

  getAnalytics: (year?: number) =>
    apiClient.get<SalaryAnalytics[]>('/salary/analytics', { params: { year } }),

  getDashboardStats: () =>
    apiClient.get<DashboardStats>('/salary/dashboard-stats'),
};
