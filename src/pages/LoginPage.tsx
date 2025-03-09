import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, AlertCircle, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/hooks';
import { toast } from 'sonner';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log in');
      toast.error('Failed to log in');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      
      await loginWithGoogle();
      toast.success('Logged in with Google successfully');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log in with Google');
      toast.error('Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-surface-800 shadow-soft-xl rounded-xl p-8 border border-surface-200 dark:border-surface-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-surface-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
              Welcome back! Please enter your details
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="Enter your password"
                />
              </div>
              <div className="mt-1 flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 flex items-center justify-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="relative flex items-center justify-center">
              <div className="border-t border-surface-200 dark:border-surface-700 w-full" />
              <div className="bg-white dark:bg-surface-800 px-3 text-sm text-surface-500 dark:text-surface-400">or</div>
              <div className="border-t border-surface-200 dark:border-surface-700 w-full" />
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="btn-outline w-full py-2.5 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
              >
                Sign up
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;