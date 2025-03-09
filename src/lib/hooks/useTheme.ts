import { useContext } from 'react';
import { ThemeProviderContext } from '../../components/ThemeProvider';

/**
 * Hook to access theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
    
  return context;
};