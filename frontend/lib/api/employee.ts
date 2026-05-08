import apiClient from './client';
import { EmployeesResponse, Employee, EmployeeFormData, EmployeeFilters } from '@/types';

export const employeeApi = {
  getEmployees: (filters?: EmployeeFilters) =>
    apiClient.get<EmployeesResponse>('/employees', { params: filters }),

  getEmployee: (id: string) =>
    apiClient.get<Employee>(`/employees/${id}`),

  createEmployee: (data: EmployeeFormData) =>
    apiClient.post<Employee>('/employees', data),

  updateEmployee: (id: string, data: Partial<EmployeeFormData>) =>
    apiClient.put<Employee>(`/employees/${id}`, data),

  deleteEmployee: (id: string) =>
    apiClient.delete(`/employees/${id}`),

  bulkDelete: (ids: string[]) =>
    apiClient.delete('/employees/bulk', { data: { ids } }),

  uploadProfileImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post<{ profileImage: string }>(`/employees/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
