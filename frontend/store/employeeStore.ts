import { create } from 'zustand';
import { Employee, EmployeeFilters } from '@/types';
import { employeeApi } from '@/lib/api/employee';

interface EmployeeStore {
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  filters: EmployeeFilters;
  selectedIds: string[];
  lastFetched: number | null;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  setSelectedIds: (ids: string[]) => void;
  fetchEmployees: () => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  filters: { page: 1, limit: 10 },
  selectedIds: [],
  lastFetched: null,

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters }, lastFetched: null }));
    get().fetchEmployees();
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  fetchEmployees: async () => {
    const { lastFetched, loading } = get();
    if (loading || (lastFetched && Date.now() - lastFetched < 30_000)) return;
    set({ loading: true });
    try {
      const res = await employeeApi.getEmployees(get().filters);
      set({
        employees: res.data.employees,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages,
        lastFetched: Date.now(),
      });
    } catch {
      // errors handled by apiClient interceptor
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployee: async (id) => {
    await employeeApi.deleteEmployee(id);
    set({ lastFetched: null });
    get().fetchEmployees();
  },

  bulkDelete: async (ids) => {
    await employeeApi.bulkDelete(ids);
    set({ selectedIds: [], lastFetched: null });
    get().fetchEmployees();
  },
}));
