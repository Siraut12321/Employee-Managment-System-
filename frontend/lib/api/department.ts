import apiClient from './client';
import { Department, DepartmentFormData } from '@/types';

export const departmentApi = {
  getDepartments: () =>
    apiClient.get<Department[]>('/departments'),

  createDepartment: (data: DepartmentFormData) =>
    apiClient.post<Department>('/departments', data),

  updateDepartment: (id: string, data: Partial<DepartmentFormData>) =>
    apiClient.put<Department>(`/departments/${id}`, data),

  deleteDepartment: (id: string) =>
    apiClient.delete(`/departments/${id}`),
};
