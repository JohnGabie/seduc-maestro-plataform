import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Permission, mockUsers } from '@/data/mockUsers';

interface PermissionsContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isAdmin: () => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  // Default to admin user for demo purposes
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return currentUser.permissoes.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!currentUser) return false;
    return permissions.some(p => currentUser.permissoes.includes(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!currentUser) return false;
    return permissions.every(p => currentUser.permissoes.includes(p));
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  return (
    <PermissionsContext.Provider value={{
      currentUser,
      setCurrentUser,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      isAdmin
    }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}

// Wrapper component to conditionally render based on permissions
interface RequirePermissionProps {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({ 
  permission, 
  anyOf, 
  allOf, 
  children, 
  fallback = null 
}: RequirePermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyOf) {
    hasAccess = hasAnyPermission(anyOf);
  } else if (allOf) {
    hasAccess = hasAllPermissions(allOf);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
