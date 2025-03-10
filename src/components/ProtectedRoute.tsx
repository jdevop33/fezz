import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { useUserRoles } from '../lib/hooks/useUserRoles';
import { UserRole, Permission } from '../lib/userRoles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission | Permission[];
  requiredFeature?: string;
  redirectTo?: string;
  isAdmin?: boolean; // For backward compatibility
  isOwner?: boolean; // For backward compatibility
}

function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission, 
  requiredFeature,
  redirectTo = "/dashboard", 
  isAdmin = false, 
  isOwner = false 
}: ProtectedRouteProps) {
  const { currentUser, loading: authLoading } = useAuth();
  const { 
    loading: rolesLoading, 
    checkRole, 
    checkPermission, 
    checkAccess,
    isAdmin: userIsAdmin,
    isOwner: userIsOwner
  } = useUserRoles();
  
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkUserAccess() {
      try {
        if (!currentUser) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Handle backward compatibility with isAdmin and isOwner props
        if (isOwner) {
          setHasAccess(userIsOwner);
        } else if (isAdmin) {
          setHasAccess(userIsAdmin || userIsOwner);
        } 
        // Check specific role, permission, or feature requirements
        else if (requiredRole) {
          setHasAccess(await checkRole(requiredRole));
        } else if (requiredPermission) {
          setHasAccess(await checkPermission(requiredPermission));
        } else if (requiredFeature) {
          setHasAccess(await checkAccess(requiredFeature));
        } else {
          // If no specific requirements, just need to be authenticated
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Access check error:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && !rolesLoading) {
      checkUserAccess();
    }
  }, [
    currentUser, 
    authLoading, 
    rolesLoading,
    isAdmin, 
    isOwner,
    userIsAdmin,
    userIsOwner,
    requiredRole,
    requiredPermission,
    requiredFeature,
    checkRole,
    checkPermission,
    checkAccess
  ]);

  // Show loading spinner
  if (authLoading || rolesLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to specified route if not authorized
  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  // If authorized, render children
  return <>{children}</>;
}

export default ProtectedRoute;