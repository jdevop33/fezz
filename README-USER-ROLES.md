# User Role Management System

This document provides an overview of the user role management system implemented in the application.

## Core Components

### 1. Role and Permission Definitions

Located in `/src/lib/userRoles.ts`, this module defines:
- Available user roles (`retail`, `wholesale`, `distributor`, `admin`, `owner`)
- Granular permissions for each role
- Role descriptions for UI display
- Functions to check if a user has specific roles or permissions

### 2. Role-Based Authentication Components

#### ProtectedRoute Component

Located in `/src/components/ProtectedRoute.tsx`, this component:
- Protects routes based on user authentication status
- Checks for required roles or permissions
- Redirects to appropriate pages based on access level
- Works with both simple role checks and more complex permission checks

#### RoleBasedAccess Component

Located in `/src/components/RoleBasedAccess.tsx`, this component:
- Conditionally renders UI elements based on user roles or permissions
- Allows for granular access control within a page
- Provides loading state and fallback content options

### 3. User Management UI

#### User Role Management Page

Located in `/src/pages/admin/UserRoleManagement.tsx`, this page provides:
- List of all users with their roles and statuses
- Role assignment interface
- User approval workflow for business accounts
- Filtering and search functionality

#### Admin Management Page

Located in `/src/pages/admin/AdminManagement.tsx`, this page:
- Manages administrator accounts specifically
- Provides owner-only functionality for admin creation

## User Roles and Permissions

### Retail Customer
- Basic browsing and ordering permissions
- No special admin features
- Auto-approved on signup

### Wholesale Account
- All retail permissions
- Access to wholesale pricing
- Requires manual approval

### Distributor
- Can manage order fulfillment
- Can handle shipping
- Requires manual approval

### Administrator
- Can manage products, users and orders
- Can approve/reject business accounts
- Cannot manage other admins or system settings

### Owner
- Full system access
- Can manage administrators
- Can configure system settings

## Usage Examples

### Protecting a Route

```tsx
// Require admin role
<ProtectedRoute isAdmin>
  <AdminPage />
</ProtectedRoute>

// More granular permission control
<ProtectedRoute requiredPermission="manage_products">
  <ProductManagementPage />
</ProtectedRoute>
```

### Conditional UI Elements

```tsx
<RoleBasedAccess requiredPermission="manage_users">
  <button>Manage Users</button>
</RoleBasedAccess>
```

### Checking Permissions in Code

```tsx
// In a React component
const { checkPermission } = useUserRoles();

const handleAction = async () => {
  if (await checkPermission('manage_products')) {
    // Perform admin action
  } else {
    toast.error('You do not have permission to perform this action');
  }
};
```

## Setup and Initialization

The role system is automatically initialized with the application and syncs with Firebase Authentication and Firestore. When a user signs up, they are assigned the 'retail' role by default. Business accounts require manual approval by an admin or owner.

## Extending the System

To add new roles or permissions:
1. Update the `UserRole` and `Permission` types in `userRoles.ts`
2. Add the role to `ROLE_DESCRIPTIONS` and `ROLE_PERMISSIONS`
3. Update any relevant UI components to display the new role options