'use client';

import { useAuthStore } from '@/store/authStore';
import { PERMISSIONS } from '@/constants';

type PermissionKey = keyof typeof PERMISSIONS;

export function usePermission() {
  const role = useAuthStore((s) => s.admin?.role);

  const can = (permission: PermissionKey): boolean => {
    if (!role) return false;
    return (PERMISSIONS[permission] as readonly string[]).includes(role);
  };

  return { can, role };
}
