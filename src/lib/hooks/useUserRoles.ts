import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  UserRole, 
  Permission, 
  hasRole, 
  hasPermission, 
  canAccess,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS
} from '../userRoles';
import { User } from '../types';
import { getUser } from '../pouchesDb';

/**
 * Hook that provides role-based and permission-based access control
 */
export function useUserRoles() {
  const { currentUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the user profile from Firestore
  useEffect(() => {
    async function loadUserProfile() {
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profile = await getUser(currentUser.uid);
        setUserProfile(profile);
        setError(null);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to load user profile'));
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadUserProfile();
    }
  }, [currentUser, authLoading]);

  // Check if user has a specific role (or any of the roles in an array)
  const checkRole = useCallback(async (role: UserRole | UserRole[]): Promise<boolean> => {
    try {
      return await hasRole(role);
    } catch (err) {
      console.error('Error checking role:', err);
      return false;
    }
  }, []);

  // Check if user has a specific permission (or all permissions in an array)
  const checkPermission = useCallback(async (permission: Permission | Permission[]): Promise<boolean> => {
    try {
      return await hasPermission(permission);
    } catch (err) {
      console.error('Error checking permission:', err);
      return false;
    }
  }, []);

  // Check if user has access to a specific feature
  const checkAccess = useCallback(async (feature: string): Promise<boolean> => {
    try {
      return await canAccess(feature);
    } catch (err) {
      console.error('Error checking feature access:', err);
      return false;
    }
  }, []);

  // Get the display name for a role
  const getRoleDescription = useCallback((role: UserRole): string => {
    return ROLE_DESCRIPTIONS[role] || '';
  }, []);

  // Get permissions for a role
  const getRolePermissions = useCallback((role: UserRole): Permission[] => {
    return ROLE_PERMISSIONS[role] || [];
  }, []);

  // Get all available roles
  const getAllRoles = useCallback((): UserRole[] => {
    return Object.keys(ROLE_DESCRIPTIONS) as UserRole[];
  }, []);

  // Check if current user is an admin
  const isAdmin = userProfile?.isAdmin || false;
  
  // Check if current user is an owner
  const isOwner = userProfile?.isOwner || false;
  
  // Get the current user's role
  const userRole = userProfile?.role || null;

  return {
    userProfile,
    userRole,
    isAdmin,
    isOwner,
    loading,
    error,
    checkRole,
    checkPermission,
    checkAccess,
    getRoleDescription,
    getRolePermissions,
    getAllRoles,
    ROLE_DESCRIPTIONS,
    ROLE_PERMISSIONS
  };
}