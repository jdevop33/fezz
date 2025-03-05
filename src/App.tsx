import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const PendingApprovals = lazy(() => import('./pages/admin/PendingApprovals'));

// Loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
);

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
    element: <LandingPage />,
    HydrateFallback: PageLoader,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    HydrateFallback: PageLoader,
  },
  {
    path: "/dashboard",
    element: requireAuth(<DashboardPage />),
    HydrateFallback: PageLoader,
  },
  {
    path: "/admin",
    element: requireAdmin(<AdminDashboard />),
    HydrateFallback: PageLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/products" replace />,
      },
      {
        path: "products",
        element: <ProductManagement />,
        HydrateFallback: PageLoader,
      },
      {
        path: "categories",
        element: <CategoryManagement />,
        HydrateFallback: PageLoader,
      },
      {
        path: "approvals",
        element: <PendingApprovals />,
        HydrateFallback: PageLoader,
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_fetcherPersist: true,
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