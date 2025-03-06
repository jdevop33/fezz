import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { getUser } from '../lib/pouchesDb';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  isOwner?: boolean;
}

function ProtectedRoute({ children, isAdmin = false, isOwner = false }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user) {
          setIsAuthenticated(false);
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // If we need to check for special permissions
        if (isAdmin || isOwner) {
          const userProfile = await getUser(user.uid);
          
          if (isOwner) {
            // Owner check takes precedence - owners should have access to everything
            setHasAccess(userProfile?.isOwner === true);
          } else if (isAdmin) {
            // Admin check - either isAdmin or isOwner should grant access
            setHasAccess(userProfile?.isAdmin === true || userProfile?.isOwner === true);
          }
        } else {
          // Regular authenticated route
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [isAdmin, isOwner]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;