export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MANAGER: 'hr_manager',
  ACCOUNTANT: 'accountant',
  VIEWER: 'viewer',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  hr_manager: 'HR Manager',
  accountant: 'Accountant',
  viewer: 'Viewer',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const POSITIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Lead Engineer',
  'Product Manager', 'Project Manager', 'HR Manager', 'HR Executive',
  'Accountant', 'Finance Manager', 'Designer', 'UI/UX Designer',
  'DevOps Engineer', 'QA Engineer', 'Data Analyst', 'Marketing Manager',
  'Sales Executive', 'Operations Manager', 'CEO', 'CTO', 'COO',
];

export const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export const SALARY_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
};

// Permissions per role
export const PERMISSIONS = {
  canManageEmployees: ['super_admin', 'hr_manager'],
  canManageDepartments: ['super_admin', 'hr_manager'],
  canManageSalary: ['super_admin', 'hr_manager', 'accountant'],
  canMarkPaid: ['super_admin', 'accountant'],
  canManageAdmins: ['super_admin'],
} as const;
