import { create } from 'zustand';
import { Salary, SalaryFormData, SalaryFilters, DashboardStats, SalaryAnalytics } from '@/types';
import { salaryApi } from '@/lib/api/salary';

interface SalaryStore {
  salaries: Salary[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  filters: SalaryFilters;
  dashboardStats: DashboardStats | null;
  analytics: SalaryAnalytics[];
  lastFetched: number | null;
  statsFetched: number | null;
  setFilters: (filters: Partial<SalaryFilters>) => void;
  fetchSalaries: () => Promise<void>;
  createSalary: (data: SalaryFormData) => Promise<void>;
  updateSalary: (id: string, data: Partial<SalaryFormData>) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  fetchAnalytics: (year?: number) => Promise<void>;
}

export const useSalaryStore = create<SalaryStore>((set, get) => ({
  salaries: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  filters: { page: 1, limit: 10 },
  dashboardStats: null,
  analytics: [],
  lastFetched: null,
  statsFetched: null,

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().fetchSalaries();
  },

  fetchSalaries: async () => {
    const { lastFetched, loading } = get();
    if (loading || (lastFetched && Date.now() - lastFetched < 30_000)) return;
    set({ loading: true });
    try {
      const res = await salaryApi.getSalaries(get().filters);
      set({
        salaries: res.data.salaries,
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

  createSalary: async (data) => {
    await salaryApi.createSalary(data);
    set({ lastFetched: null });
    get().fetchSalaries();
  },

  updateSalary: async (id, data) => {
    await salaryApi.updateSalary(id, data);
    set({ lastFetched: null });
    get().fetchSalaries();
  },

  markAsPaid: async (id) => {
    await salaryApi.markAsPaid(id);
    set({ lastFetched: null });
    get().fetchSalaries();
  },

  fetchDashboardStats: async () => {
    const { statsFetched } = get();
    if (statsFetched && Date.now() - statsFetched < 30_000) return;
    try {
      const res = await salaryApi.getDashboardStats();
      set({ dashboardStats: res.data, statsFetched: Date.now() });
    } catch {
      // errors handled by apiClient interceptor
    }
  },

  fetchAnalytics: async (year) => {
    try {
      const res = await salaryApi.getAnalytics(year);
      set({ analytics: res.data });
    } catch {
      // errors handled by apiClient interceptor
    }
  },
}));
