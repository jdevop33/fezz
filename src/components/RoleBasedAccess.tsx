import React, { useState, useEffect } from 'react';
import { UserRole, Permission } from '../lib/userRoles';
import { useUserRoles } from '../lib/hooks/useUserRoles';

/**
 * RoleBasedAccess Component
 * 
 * Renders child components only if the current user has the required role or permission.
 * This allows for declarative control over UI elements based on user roles.
 */

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission | Permission[];
  requiredFeature?: string;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredRole,
  requiredPermission,
  requiredFeature,
  fallback = null,
  showLoading = false
}) => {
  const { 
    loading, 
    checkRole, 
    checkPermission, 
    checkAccess
  } = useUserRoles();
  
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [accessChecked, setAccessChecked] = useState<boolean>(false);

  // Check if the user has access
  useEffect(() => {
    async function checkAccess() {
      try {
        if (requiredRole) {
          setHasAccess(await checkRole(requiredRole));
        } else if (requiredPermission) {
          setHasAccess(await checkPermission(requiredPermission));
        } else if (requiredFeature) {
          setHasAccess(await checkAccess(requiredFeature));
        } else {
          // If no requirements are specified, default to allowing access
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Error checking access permissions:', error);
        setHasAccess(false);
      } finally {
        setAccessChecked(true);
      }
    }

    if (!loading) {
      checkAccess();
    }
  }, [
    loading, 
    requiredRole, 
    requiredPermission, 
    requiredFeature,
    checkRole,
    checkPermission,
    checkAccess
  ]);

  // Show loading spinner while checking access
  if (loading || !accessChecked) {
    return showLoading ? (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
      </div>
    ) : null;
  }

  // If the user has access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Otherwise, render the fallback content (or nothing)
  return <>{fallback}</>;
};

export default RoleBasedAccess;