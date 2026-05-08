export type Role = 'super_admin' | 'hr_manager' | 'accountant' | 'viewer';

export interface JwtPayload {
  id: string;
  role: Role;
}
