import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/hooks/useCart';
import { initializeDatabase } from './lib/initDb';

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
const LoginPage = lazyWithSuspense(() => import('./pages/LoginPage'));

// Create a simple products page that uses our ProductList component
const ProductsPage = lazyWithSuspense(() => Promise.resolve({
  default: () => {
    const ProductList = React.lazy(() => import('./components/products/ProductList'));
    const ShoppingCart = React.lazy(() => import('./components/products/ShoppingCart'));
    const { useCart } = require('./lib/hooks');
    
    // Create the products page component
    const ProductsPageComponent = () => {
      const [isCartOpen, setIsCartOpen] = useState(false);
      const { itemCount } = useCart();
      
      return (
        <div className="container mx-auto px-4 py-8">
          {/* Header with title and cart button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Pouches Products</h1>
            <button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => setIsCartOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart ({itemCount})</span>
            </button>
          </div>
          
          {/* Product list */}
          <Suspense fallback={<PageLoader />}>
            <ProductList showFilters={true} />
          </Suspense>
          
          {/* Shopping cart */}
          <Suspense fallback={null}>
            <ShoppingCart 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
            />
          </Suspense>
        </div>
      );
    };
    
    return <ProductsPageComponent />;
  }
}));

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
    path: "/products",
    element: <ProductsPage />
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
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  // Initialize the database when the app starts - only when explicitly requested
  useEffect(() => {
    // Start with app ready to use - we'll only initialize DB on demand
    setDbInitialized(true);

    // Check if initialization is requested
    const shouldInitDb = new URLSearchParams(window.location.search).has('init-db');
    
    if (shouldInitDb) {
      console.log('Database initialization requested via URL parameter');
      setInitError(null); // Clear any previous errors
      
      // Initialize in a non-blocking way - app is already usable
      (async () => {
        try {
          console.log('Starting database initialization...');
          await initializeDatabase();
          console.log('Database initialization completed successfully!');
        } catch (error) {
          console.error('Error during database initialization:', error);
          setInitError(error instanceof Error ? error : new Error('Failed to initialize database'));
        }
      })();
    } else {
      console.log('Database initialization not requested. App ready to use with existing data.');
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
            </div>
          )}
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;