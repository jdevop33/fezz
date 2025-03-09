import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, Users, Package, Battery as Category, Settings, LogOut, Shield, UserCog, CircleDollarSign, BarChart } from 'lucide-react';
import clsx from 'clsx';
import { ThemeToggle } from '../components/ThemeToggle';
import { auth } from '../lib/firebase';
import { getUser, User } from '../lib/pouchesDb';

// Navigation for admin users
const adminNavigation = [
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Category },
  { name: 'Pending Approvals', href: '/admin/approvals', icon: Users },
];

// Additional navigation items for owners
const ownerNavigation = [
  { name: 'Payments', href: '/admin/payments', icon: CircleDollarSign, ownerOnly: true },
  { name: 'Reports', href: '/admin/reports', icon: BarChart, ownerOnly: true },
  { name: 'Admin Management', href: '/admin/admins', icon: UserCog, ownerOnly: true },
  { name: 'System Settings', href: '/admin/system', icon: Shield, ownerOnly: true },
];

function AdminDashboard() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Loading state used for conditionally rendering content when data is ready
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await getUser(user.uid);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Combine navigation items based on user role
  const navigationItems = [...adminNavigation];
  
  // Only add owner-specific navigation if user is an owner
  if (currentUser?.isOwner) {
    navigationItems.push(...ownerNavigation);
  }

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between flex-shrink-0 px-4 pb-4 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <span className="ml-2 text-xl font-semibold">
                    {currentUser?.isOwner ? 'Owner' : 'Admin'}
                  </span>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="mt-5 flex-grow flex flex-col justify-between">
                <nav className="flex-1 px-2 space-y-1">
                  {navigationItems.map((item) => {
                    // Skip items that are owner-only if user is not an owner
                    if (item.ownerOnly && !currentUser?.isOwner) {
                      return null;
                    }
                    
                    const isActive = location.pathname === item.href || 
                                    (item.href !== '/admin/approvals' && location.pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/80',
                          'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            isActive 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-500 dark:group-hover:text-surface-400',
                            'mr-3 flex-shrink-0 h-5 w-5'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="px-2 py-4 space-y-1 border-t border-surface-200 dark:border-surface-700 mt-4">
                  <Link
                    to="/settings"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/80 transition-colors"
                  >
                    <Settings className="mr-3 h-5 w-5 text-surface-400 dark:text-surface-500 group-hover:text-surface-500 dark:group-hover:text-surface-400" />
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-surface-600 dark:text-surface-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-surface-400 dark:text-surface-500 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
                    Log out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-semibold">Admin</span>
            </div>
            <ThemeToggle />
          </div>
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {/* Render nested route content */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;