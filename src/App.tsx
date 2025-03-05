import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';

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

// Auth check helper function
const requireAuth = (element: React.ReactNode) => {
  // This would normally check authentication state
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

// Admin auth check helper function
const requireAdmin = (element: React.ReactNode) => {
  // This would normally check admin permissions
  const isAdmin = true; // Replace with actual admin check
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return element;
};

// Create router with future flags enabled
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/dashboard",
    element: requireAuth(<DashboardPage />)
  },
  {
    path: "/admin",
    element: requireAdmin(<AdminDashboard />),
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
    </ThemeProvider>
  );
}

export default App;