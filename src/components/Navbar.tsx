import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../lib/hooks';
import { useCart } from '../lib/hooks';

const Navbar = () => {
  // Router and auth
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  
  // State for mobile menu and search box
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close search when opening menu
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  // Toggle search box
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close mobile menu when opening search
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Handle keyboard accessibility
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'Products', 
      href: '/products',
      submenu: [
        { name: 'Nicotine Pouches', href: '/products?category=nicotine-pouches' },
        { name: 'New Arrivals', href: '/products?sort=newest' },
        { name: 'Best Sellers', href: '/products?sort=best-selling' }
      ]
    },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white shadow-md' : 'bg-white'} transition-all duration-200`}>
      {/* Top bar with announcements or promotions */}
      <div className="bg-primary-600 py-2 text-center text-sm font-medium text-white">
        <p>Free shipping on orders over $50 | Age verification required (21+)</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={handleMobileMenuToggle}
              onKeyDown={(e) => handleKeyDown(e, handleMobileMenuToggle)}
              className="inline-flex items-center justify-center rounded-md p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link to="/" className="flex items-center" aria-label="Go to homepage">
              <span className="text-xl font-bold text-primary-600">POUCHES</span>
              <span className="ml-1 text-xl font-light text-surface-900">World</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:ml-6 lg:flex lg:space-x-8" aria-label="Main navigation">
            {navItems.map((item) => (
              item.submenu ? (
                <div key={item.name} className="relative group">
                  <button 
                    className="flex items-center px-3 py-2 text-sm font-medium text-surface-700 hover:text-primary-600"
                    aria-expanded="false"
                  >
                    {item.name}
                    <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 z-10 mt-2 hidden w-48 origin-top-left rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 transition group-hover:block">
                    <div className="py-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href}
                          className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 text-sm font-medium text-surface-700 hover:text-primary-600"
                >
                  {item.name}
                </Link>
              )
            ))}

            {/* Admin link for admins */}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 text-sm font-medium text-surface-700 hover:text-primary-600"
              >
                Admin Dashboard
              </Link>
            )}

            {/* Owner link for owners */}
            {user?.isOwner && (
              <Link
                to="/admin/reports"
                className="px-3 py-2 text-sm font-medium text-primary-700 hover:text-primary-800"
              >
                Owner Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop right section: search, account, cart */}
          <div className="flex items-center">
            {/* Search button */}
            <button
              type="button"
              onClick={handleSearchToggle}
              onKeyDown={(e) => handleKeyDown(e, handleSearchToggle)}
              className="ml-2 rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Open search"
            >
              <Search size={20} aria-hidden="true" />
            </button>

            {/* Account link or sign in */}
            {user ? (
              <div className="relative ml-4 group">
                <button
                  className="flex items-center rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Your account"
                >
                  <User size={20} aria-hidden="true" />
                </button>
                <div className="absolute right-0 z-10 mt-2 hidden w-48 origin-top-right rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 transition group-hover:block">
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                    >
                      Your Account
                    </Link>
                    <Link
                      to="/dashboard/orders"
                      className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Sign in"
              >
                <User size={20} aria-hidden="true" />
              </Link>
            )}

            {/* Cart button */}
            <Link
              to="/cart"
              className="ml-4 flex items-center rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <span className="relative">
                <ShoppingCart size={20} aria-hidden="true" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search box overlay */}
      <div 
        className={`border-b border-surface-200 transition-all duration-200 ${
          isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-surface-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              placeholder="Search for products..."
              className="block w-full rounded-md border-0 bg-surface-50 py-2 pl-10 pr-3 text-surface-900 ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm"
              aria-label="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="sr-only">Search</button>
          </form>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`transition-all duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen 
            ? 'max-h-screen translate-x-0 opacity-100' 
            : 'max-h-0 -translate-x-full opacity-0 overflow-hidden'
        }`}
      >
        <div className="border-t border-surface-200 bg-white px-2 pt-2 pb-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between rounded-md px-3 py-2 text-base font-medium text-surface-900">
                      {item.name}
                      <ChevronDown size={16} className="text-surface-500" />
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Admin/Owner links in mobile menu */}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {user?.isOwner && (
              <Link
                to="/admin/reports"
                className="block rounded-md px-3 py-2 text-base font-medium text-primary-700 hover:bg-surface-50 hover:text-primary-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Owner Dashboard
              </Link>
            )}
          </div>
          
          <div className="mt-4 border-t border-surface-200 pt-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Account
                </Link>
                <Link 
                  to="/dashboard/orders" 
                  className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block rounded-md px-3 py-2 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;