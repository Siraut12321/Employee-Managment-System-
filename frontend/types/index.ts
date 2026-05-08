export type Role = 'super_admin' | 'hr_manager' | 'accountant' | 'viewer';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  setAuth: (admin: Admin, token: string) => void;
  clearAuth: () => void;
}

// Department
export interface Department {
  _id: string;
  name: string;
  description?: string;
  managerId?: Employee | null;
  isActive: boolean;
  employeeCount?: number;
  createdAt: string;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
  managerId?: string;
}

// Employee
export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  departmentId: Department | string;
  salary: number;
  status: EmployeeStatus;
  joinDate: string;
  profileImage?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone?: string;
  position: string;
  departmentId: string;
  salary: number;
  status: EmployeeStatus;
  joinDate: string;
  address?: string;
}

// Salary
export type SalaryStatus = 'pending' | 'paid';

export interface Salary {
  _id: string;
  employeeId: Employee | string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: SalaryStatus;
  paidDate?: string;
  notes?: string;
  createdAt: string;
}

export interface SalaryFormData {
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
  notes?: string;
}

// API Responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmployeesResponse {
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SalariesResponse {
  salaries: Salary[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  monthlyPayroll: number;
  payrollGrowth: string;
}

export interface SalaryAnalytics {
  _id: number;
  totalPayroll: number;
  totalBonus: number;
  totalDeductions: number;
  count: number;
}

// Filters
export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface SalaryFilters {
  month?: number;
  year?: number;
  status?: string;
  employeeId?: string;
  page?: number;
  limit?: number;
}
