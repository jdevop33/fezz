import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Debug component to show the current route path
 * Add this to your App.tsx to see which component is rendering
 */
const DebugComponentPath: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  // Map routes to component names for easier identification
  const routeMap: Record<string, string> = {
    '/': 'LandingPage',
    '/login': 'LoginPage',
    '/signup': 'SignupPage',
    '/products': 'ProductsPage (ProductListingPage)',
    '/dashboard': 'DashboardPage',
    '/admin': 'AdminDashboard',
    '/admin/products': 'ProductManagement',
    '/admin/categories': 'CategoryManagement',
    '/admin/approvals': 'PendingApprovals'
  };

  // Check if route matches product detail pattern
  const isProductDetail = location.pathname.match(/^\/products\/[\w-]+$/);
  const componentName = isProductDetail 
    ? 'ProductDetail' 
    : routeMap[location.pathname] || 'Unknown Component';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        color: 'lime',
        padding: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '50%',
        overflow: 'auto',
        border: '1px solid #333',
        borderRadius: '4px 0 0 0',
      }}
    >
      <button 
        onClick={() => setIsVisible(false)}
        style={{ 
          position: 'absolute', 
          top: '2px', 
          right: '2px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        X
      </button>
      <div>
        <strong>Current Route:</strong> {location.pathname}
      </div>
      <div>
        <strong>Component:</strong> {componentName}
      </div>
      <div>
        <button
          onClick={() => {
            console.log('Current route:', location.pathname);
            console.log('Current component:', componentName);
            console.log('Router structure:', document.getElementById('root'));
          }}
          style={{
            marginTop: '4px',
            background: '#333',
            border: 'none',
            color: 'white',
            padding: '2px 4px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Log Details to Console
        </button>
      </div>
    </div>
  );
};

export default DebugComponentPath;