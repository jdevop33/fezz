import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './lib/AuthContext';
import { CartProvider } from './lib/hooks/useCart';
import { ProductProvider } from './contexts/ProductContext';

// Loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
);

// Wrap lazy components with Suspense
const lazyWithSuspense = <P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>
) => {
  const LazyComponent = lazy(importFn);
  
  // TypeScript knows LazyComponent expects props of type P
  return function WithSuspense(props: P): JSX.Element {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Lazy load pages for better performance
const LandingPage = lazyWithSuspense(() => import('./pages/LandingPage'));
const SignupPage = lazyWithSuspense(() => import('./pages/SignupPage'));
const DashboardPage = lazyWithSuspense(() => import('./pages/DashboardPage'));
const AdminDashboard = lazyWithSuspense(() => import('./pages/AdminDashboard'));
const ProductManagement = lazyWithSuspense(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazyWithSuspense(() => import('./pages/admin/CategoryManagement'));
const PendingApprovals = lazyWithSuspense(() => import('./pages/admin/PendingApprovals'));
const AdminManagement = lazyWithSuspense(() => import('./pages/admin/AdminManagement'));
const SystemSettings = lazyWithSuspense(() => import('./pages/admin/SystemSettings'));
const LoginPage = lazyWithSuspense(() => import('./pages/LoginPage'));
const SetupPage = lazyWithSuspense(() => import('./pages/SetupPage'));
const NotFoundPage = lazyWithSuspense(() => import('./pages/NotFoundPage'));

// Create a product listing page that uses our enhanced ProductListingPage component
const ProductsPage = lazyWithSuspense(() => import('./components/products/ProductListingPage'));

// Additional owner pages
const PaymentsOverview = lazyWithSuspense(() => import('./pages/admin/PaymentsOverview'));
const ReportsPage = lazyWithSuspense(() => import('./pages/admin/ReportsPage'));

// Import our real ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ProductDetail from './components/products/ProductDetail';
import DebugComponentPath from './components/DebugComponentPath';

// Layout component to wrap routes with the Navbar and Debug component in DEV
const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    {import.meta.env.DEV && <DebugComponentPath />}
  </>
);

// Create router with future flags enabled
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "signup",
        element: <SignupPage />
      },
      {
        path: "setup",
        element: <SetupPage />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
      {
        path: "products/:productId",
        element: <ProductDetail />
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute isAdmin><AdminDashboard /></ProtectedRoute>,
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
      },
      
      // Finance (Owner-only routes)
      {
        path: "payments",
        element: <ProtectedRoute isOwner><PaymentsOverview /></ProtectedRoute>
      },
      {
        path: "reports",
        element: <ProtectedRoute isOwner><ReportsPage /></ProtectedRoute>
      },
      
      // Admin Management (Owner-only routes)
      {
        path: "admins",
        element: <ProtectedRoute isOwner><AdminManagement /></ProtectedRoute>
      },
      {
        path: "system",
        element: <ProtectedRoute isOwner><SystemSettings /></ProtectedRoute>
      }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true
  },
});

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  // Initialize the database when the app starts
  useEffect(() => {
    // First set the app as ready to use to avoid blocking the UI
    setDbInitialized(true);
    
    // We'll check for explicit initialization via URL parameter
    const shouldInitDb = new URLSearchParams(window.location.search).has('init-db');
    
    // Also check local storage to see if we've initialized before
    const hasInitialized = localStorage.getItem('dbInitialized') === 'true';
    
    // Improved initialization with more robust checks and fallbacks
    if (shouldInitDb || !hasInitialized) {
      console.log(`Database initialization ${shouldInitDb ? 'requested via URL parameter' : 'has not been done yet'}`);
      setInitError(null); // Clear any previous errors
      
      // Initialize in a non-blocking way - app is already usable
      (async () => {
        try {
          console.log('Starting application initialization...');
          
          // Use the initializeDatabase function from initDb.ts
          const initModule = await import('./lib/initDb');
          // Check if initializeApplication exists
          if (typeof initModule.initializeApplication === 'function') {
            await initModule.initializeApplication();
          } else {
            // Fall back to initializeDatabase if the other function doesn't exist
            await initModule.initializeDatabase();
          }
          
          console.log('Application initialization completed successfully!');
          
          // Mark as initialized in local storage
          localStorage.setItem('dbInitialized', 'true');
        } catch (error) {
          console.error('Error during application initialization:', error);
          setInitError(error instanceof Error ? error : new Error('Failed to initialize database'));
        }
      })();
    } else {
      console.log('Database already initialized. App ready to use with existing data.');
    }
  }, []);

  // Show loading screen while database is initializing
  if (!dbInitialized) {
    return <PageLoader />;
  }

  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
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
            {initError && (
              <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center p-2 z-50">
                Database initialization error: {initError.message}
                <button 
                  onClick={() => setInitError(null)}
                  className="ml-2 px-2 py-0.5 bg-red-600 rounded hover:bg-red-700"
                >
                  Dismiss
                </button>
              </div>
            )}
            <RouterProvider router={router} />
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;