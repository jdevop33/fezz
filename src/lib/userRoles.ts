import { auth } from './firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from './types';
import { getUser, updateUser, getUsersByRole, queryDocuments, COLLECTIONS } from './pouchesDb';
import { where, orderBy } from 'firebase/firestore';

/**
 * Role Management System
 * 
 * This module handles the synchronization between Firebase Auth and Firestore user roles,
 * as well as role-based access control for the application.
 */

// Define the different user roles available
export type UserRole = 'retail' | 'wholesale' | 'distributor' | 'admin' | 'owner';

// Permission types that can be granted to roles
export type Permission = 
  // General user permissions
  | 'browse_products' 
  | 'place_orders' 
  | 'track_orders'
  // Wholesale specific
  | 'place_bulk_orders' 
  | 'get_wholesale_prices' 
  | 'earn_commissions'
  // Distributor specific
  | 'handle_orders' 
  | 'manage_shipping'
  // Admin permissions
  | 'manage_users' 
  | 'manage_products' 
  | 'verify_payments' 
  | 'assign_orders' 
  | 'manage_commissions'
  // Owner permissions
  | 'manage_admins'
  | 'view_all_financials'
  | 'approve_accounts';

// Define role descriptions
export const ROLE_DESCRIPTIONS = {
  retail: 'Regular customer who can place orders at retail prices',
  wholesale: 'Business customer who can buy at wholesale prices',
  distributor: 'Partner who handles order fulfillment and delivery',
  admin: 'System administrator with product and user management rights',
  owner: 'Business owner with full system access'
};

// Role to Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  retail: [
    'browse_products', 
    'place_orders', 
    'track_orders'
  ],
  wholesale: [
    'browse_products', 
    'place_orders', 
    'track_orders',
    'place_bulk_orders', 
    'get_wholesale_prices', 
    'earn_commissions'
  ],
  distributor: [
    'browse_products', 
    'place_orders', 
    'track_orders',
    'handle_orders', 
    'earn_commissions', 
    'manage_shipping'
  ],
  admin: [
    'browse_products', 
    'place_orders', 
    'track_orders',
    'manage_users', 
    'manage_products', 
    'verify_payments', 
    'assign_orders', 
    'manage_commissions'
  ],
  owner: [
    'browse_products', 
    'place_orders', 
    'track_orders',
    'manage_users', 
    'manage_products', 
    'verify_payments', 
    'assign_orders', 
    'manage_commissions',
    'manage_admins',
    'view_all_financials',
    'approve_accounts'
  ]
};

// Get current user profile from Firebase Auth and Firestore
export async function getCurrentUserProfile(): Promise<{authUser: FirebaseUser | null, userProfile: User | null}> {
  const authUser = auth.currentUser;
  
  if (!authUser) {
    return { authUser: null, userProfile: null };
  }
  
  const userProfile = await getUser(authUser.uid);
  return { authUser, userProfile };
}

// Check if current user has a specific role
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const { userProfile } = await getCurrentUserProfile();
  
  if (!userProfile) {
    return false;
  }
  
  const roles = Array.isArray(role) ? role : [role];
  
  // Owner has all roles
  if (userProfile.isOwner) {
    return true;
  }
  
  // Admin has admin role
  if (userProfile.isAdmin && roles.includes('admin')) {
    return true;
  }
  
  return userProfile.role ? roles.includes(userProfile.role) : false;
}

// Check if current user has a specific permission
export async function hasPermission(permission: Permission | Permission[]): Promise<boolean> {
  const { userProfile } = await getCurrentUserProfile();
  
  if (!userProfile) {
    return false;
  }
  
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  // Owner has all permissions
  if (userProfile.isOwner) {
    return true;
  }
  
  // Check role-based permissions
  if (userProfile.role) {
    const rolePermissions = ROLE_PERMISSIONS[userProfile.role] || [];
    
    // Admin also has admin permissions
    if (userProfile.isAdmin) {
      const adminPermissions = ROLE_PERMISSIONS['admin'];
      return permissions.every(p => rolePermissions.includes(p) || adminPermissions.includes(p));
    }
    
    return permissions.every(p => rolePermissions.includes(p));
  }
  
  return false;
}

// Change a user's role
export async function changeUserRole(userId: string, newRole: UserRole): Promise<void> {
  const { userProfile: currentUserProfile } = await getCurrentUserProfile();
  
  // Permission check: Only admins and owners can change roles
  const canChangeRoles = currentUserProfile?.isAdmin || currentUserProfile?.isOwner;
  
  // Extra check: Only owners can create other admins or owners
  const isChangingToAdminOrOwner = (newRole === 'admin' || newRole === 'owner');
  const canCreateAdminOrOwner = currentUserProfile?.isOwner;
  
  if (!canChangeRoles || (isChangingToAdminOrOwner && !canCreateAdminOrOwner)) {
    throw new Error('You do not have permission to change user roles');
  }
  
  // Get the target user
  const targetUser = await getUser(userId);
  if (!targetUser) {
    throw new Error('User not found');
  }
  
  // Owners can't have their role changed except by themselves
  if (targetUser.isOwner && currentUserProfile?.id !== targetUser.id) {
    throw new Error('Owner roles can only be changed by the owner themselves');
  }
  
  // Update role
  const updates: Partial<User> = { role: newRole };
  
  // Special handling for admin/owner status
  if (newRole === 'admin') {
    updates.isAdmin = true;
  } else if (newRole === 'owner') {
    updates.isAdmin = true;
    updates.isOwner = true;
  } else {
    // If downgrading from admin/owner, remove those flags
    if (targetUser.isAdmin || targetUser.isOwner) {
      updates.isAdmin = false;
      updates.isOwner = false;
    }
  }
  
  // Automatically approve retail users
  if (newRole === 'retail') {
    updates.approved = true;
    updates.status = 'active';
  } else if (!targetUser.approved) {
    // For other roles, keep pending status until approval
    updates.status = 'pending';
  }
  
  await updateUser(userId, updates);
}

// Get users with pending approval
export async function getPendingApprovalUsers(): Promise<User[]> {
  return queryDocuments<User>(COLLECTIONS.USERS, [
    where('status', '==', 'pending'),
    where('approved', '==', false),
    orderBy('createdAt', 'desc')
  ]);
}

// Approve or reject a user account
export async function approveRejectUser(userId: string, approved: boolean, notes?: string): Promise<void> {
  const { userProfile: currentUserProfile } = await getCurrentUserProfile();
  
  // Permission check: Only admins and owners can approve users
  if (!currentUserProfile?.isAdmin && !currentUserProfile?.isOwner) {
    throw new Error('You do not have permission to approve user accounts');
  }
  
  const updates: Partial<User> = {
    approved,
    status: approved ? 'active' : 'rejected'
  };
  
  if (notes) {
    updates.notes = notes;
  }
  
  await updateUser(userId, updates);
}

// Get all users of a specific role
export async function getUsersBySpecificRole(role: UserRole): Promise<User[]> {
  return getUsersByRole(role);
}

// Get approved business accounts (wholesale and distributors)
export async function getApprovedBusinessAccounts(): Promise<User[]> {
  return queryDocuments<User>(COLLECTIONS.USERS, [
    where('approved', '==', true),
    where('status', '==', 'active'),
    where('role', 'in', ['wholesale', 'distributor']),
    orderBy('companyName', 'asc')
  ]);
}

// Get all admin users
export async function getAdminUsers(includeOwners: boolean = true): Promise<User[]> {
  const constraints = [
    where('isAdmin', '==', true),
    orderBy('displayName', 'asc')
  ];
  
  if (!includeOwners) {
    constraints.push(where('isOwner', '==', false));
  }
  
  return queryDocuments<User>(COLLECTIONS.USERS, constraints);
}

// Check if current user is allowed to access a specific feature
export async function canAccess(feature: string): Promise<boolean> {
  // Map features to required permissions
  const featureToPermission: Record<string, Permission[]> = {
    'manage_products': ['manage_products'],
    'view_orders': ['track_orders'],
    'manage_orders': ['verify_payments', 'assign_orders'],
    'approve_users': ['approve_accounts'],
    'view_wholesale_prices': ['get_wholesale_prices'],
    'view_commissions': ['earn_commissions'],
    'manage_commissions': ['manage_commissions'],
    'view_financials': ['view_all_financials'],
    'manage_admins': ['manage_admins'],
    'place_bulk_orders': ['place_bulk_orders']
  };
  
  const requiredPermissions = featureToPermission[feature];
  if (!requiredPermissions) {
    return false;
  }
  
  return hasPermission(requiredPermissions);
}