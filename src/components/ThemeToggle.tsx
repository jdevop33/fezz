import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../lib/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle between light and dark modes with simple click
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleDropdown();
        }}
        className="rounded-md p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 relative group"
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
        <span className="sr-only">Toggle theme</span>
        <ChevronDown 
          className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 bottom-0"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-surface-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => { setTheme('light'); setIsOpen(false); }}
              className={`${theme === 'light' ? 'bg-surface-100 dark:bg-surface-700 text-primary-600' : ''} flex items-center w-full px-4 py-2 text-sm text-left hover:bg-surface-100 dark:hover:bg-surface-700`}
              role="menuitem"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </button>
            <button
              onClick={() => { setTheme('dark'); setIsOpen(false); }}
              className={`${theme === 'dark' ? 'bg-surface-100 dark:bg-surface-700 text-primary-600' : ''} flex items-center w-full px-4 py-2 text-sm text-left hover:bg-surface-100 dark:hover:bg-surface-700`}
              role="menuitem"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </button>
            <button
              onClick={() => { setTheme('system'); setIsOpen(false); }}
              className={`${theme === 'system' ? 'bg-surface-100 dark:bg-surface-700 text-primary-600' : ''} flex items-center w-full px-4 py-2 text-sm text-left hover:bg-surface-100 dark:hover:bg-surface-700`}
              role="menuitem"
            >
              <Monitor className="w-4 h-4 mr-2" />
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}