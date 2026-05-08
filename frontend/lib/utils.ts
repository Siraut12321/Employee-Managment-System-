import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MONTHS } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
}

export function formatMonthYear(month: number, year: number): string {
  return `${MONTHS[month - 1]} ${year}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getDepartmentName(departmentId: unknown): string {
  if (!departmentId) return '—';
  if (typeof departmentId === 'object' && departmentId !== null && 'name' in departmentId) {
    return (departmentId as { name: string }).name;
  }
  return '—';
}

export function getEmployeeName(employeeId: unknown): string {
  if (!employeeId) return '—';
  if (typeof employeeId === 'object' && employeeId !== null && 'name' in employeeId) {
    return (employeeId as { name: string }).name;
  }
  return '—';
}
