import { AdminUser, AdminRole } from '../types';

/**
 * Check if user has required role
 */
export function hasRole(user: AdminUser | null, role: AdminRole): boolean {
  if (!user) return false;
  return user.role === role || user.role === 'admin';
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(user: AdminUser | null, roles: AdminRole[]): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return roles.includes(user.role);
}

/**
 * Check if user has permission
 */
export function hasPermission(user: AdminUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(user: AdminUser | null, permissions: string[]): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return permissions.some(permission => user.permissions.includes(permission));
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: AdminRole): string {
  const roleNames: Record<AdminRole, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    inventory: 'Inventory Manager',
    orders: 'Order Manager',
    viewer: 'Viewer',
  };
  return roleNames[role] || role;
}

