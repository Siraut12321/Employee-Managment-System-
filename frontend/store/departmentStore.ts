import { create } from 'zustand';
import { Department, DepartmentFormData } from '@/types';
import { departmentApi } from '@/lib/api/department';

interface DepartmentStore {
  departments: Department[];
  loading: boolean;
  lastFetched: number | null;
  fetchDepartments: () => Promise<void>;
  createDepartment: (data: DepartmentFormData) => Promise<void>;
  updateDepartment: (id: string, data: Partial<DepartmentFormData>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

const CACHE_TTL = 30_000; // 30 seconds

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
  departments: [],
  loading: false,
  lastFetched: null,

  fetchDepartments: async () => {
    const { lastFetched, loading } = get();
    if (loading || (lastFetched && Date.now() - lastFetched < CACHE_TTL)) return;
    set({ loading: true });
    try {
      const res = await departmentApi.getDepartments();
      set({ departments: res.data, lastFetched: Date.now() });
    } catch {
      // errors handled by apiClient interceptor
    } finally {
      set({ loading: false });
    }
  },

  createDepartment: async (data) => {
    await departmentApi.createDepartment(data);
    set({ lastFetched: null });
    get().fetchDepartments();
  },

  updateDepartment: async (id, data) => {
    await departmentApi.updateDepartment(id, data);
    set({ lastFetched: null });
    get().fetchDepartments();
  },

  deleteDepartment: async (id) => {
    await departmentApi.deleteDepartment(id);
    set({ lastFetched: null });
    get().fetchDepartments();
  },
}));
