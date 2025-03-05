import React, { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './lib/AuthContext';

// Loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
);

// Wrap lazy components with Suspense
const lazyWithSuspense = (importFn: () => Promise<any>) => {
  const LazyComponent = lazy(importFn);
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load pages for better performance
const LandingPage = lazyWithSuspense(() => import('./pages/LandingPage'));
const SignupPage = lazyWithSuspense(() => import('./pages/SignupPage'));
const DashboardPage = lazyWithSuspense(() => import('./pages/DashboardPage'));
const AdminDashboard = lazyWithSuspense(() => import('./pages/AdminDashboard'));
const ProductManagement = lazyWithSuspense(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazyWithSuspense(() => import('./pages/admin/CategoryManagement'));
const PendingApprovals = lazyWithSuspense(() => import('./pages/admin/PendingApprovals'));
// Add a login page
const LoginPage = lazyWithSuspense(() => import('./pages/LoginPage'));

// Protected route wrapper component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for admin role if required
  if (requireAdmin) {
    // This would check a custom claim or a field in the user's Firestore document
    // For demo purposes, we're just checking if the email contains "admin"
    const isAdmin = currentUser.email?.includes('admin');
    
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

// Create router with future flags enabled
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  },
  {
    path: "/admin",
    element: <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/products" replace />
      },
      {
        path: "products",
        element: <ProductManagement />
      },
      {
        path: "categories",
        element: <CategoryManagement />
      },
      {
        path: "approvals",
        element: <PendingApprovals />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
    v7_normalizeFormMethod: true
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Toaster 
          position="top-right" 
          closeButton 
          theme="system"
          className="toaster-wrapper"
          toastOptions={{
            classNames: {
              toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-surface-900 group-[.toaster]:border-surface-200 group-[.toaster]:shadow-soft-xl dark:group-[.toaster]:bg-surface-800 dark:group-[.toaster]:text-surface-50 dark:group-[.toaster]:border-surface-700",
              title: "text-surface-900 dark:text-white text-sm font-medium",
              description: "text-surface-600 dark:text-surface-300 text-sm",
              success: "text-success-500"
            }
          }}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;