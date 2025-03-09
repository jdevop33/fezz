import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../lib/hooks';
import { setDocument } from '../lib/pouchesDb';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  accountType: 'referrer' | 'distributor' | 'both';
  phone: string;
  businessDescription: string;
}

function SignupPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup, updateUserProfile } = useAuth();
  
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create the user account in Firebase Auth
      const userCredential = await signup(data.email, data.password);
      const userId = userCredential.user.uid;
      
      // Update user profile with display name
      await updateUserProfile(`${data.firstName} ${data.lastName}`);
      
      // Get role based on account type
      let role = 'wholesale';
      if (data.accountType === 'both') {
        role = 'distributor';
      }
      
      // Store all user data in Firestore only
      await setDocument(
        'users', 
        userId, 
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          displayName: `${data.firstName} ${data.lastName}`,
          companyName: data.companyName,
          accountType: data.accountType,
          phone: data.phone,
          businessDescription: data.businessDescription,
          status: 'pending', // Account needs approval
          role: role,
          approved: false, // Needs admin approval
          isAdmin: false,
          isOwner: false, // Default not an owner
          isReferrer: data.accountType === 'referrer' || data.accountType === 'both',
          isDistributor: data.accountType === 'distributor' || data.accountType === 'both',
          commissionRate: data.accountType === 'both' ? 10 : 5,
          createdOrders: []
        }
      );
      
      toast.success('Account created successfully! Please wait for admin approval.');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-primary-600 dark:text-primary-400" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white text-center">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 text-center">
            Join our wholesale distribution platform
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="card py-8 px-4 sm:px-10">
            {error && (
              <div className="mb-6 p-3 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                    First name
                  </label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    type="text"
                    className="input w-full"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                    Last name
                  </label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    type="text"
                    className="input w-full"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Email address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input w-full"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.email.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                    Password
                  </label>
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      } 
                    })}
                    type="password"
                    className="input w-full"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                    Confirm password
                  </label>
                  <input
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    type="password"
                    className="input w-full"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Company name
                </label>
                <input
                  {...register('companyName', { required: 'Company name is required' })}
                  type="text"
                  className="input w-full"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Account type
                </label>
                <select
                  {...register('accountType', { required: 'Account type is required' })}
                  className="input w-full"
                >
                  <option value="">Select account type</option>
                  <option value="referrer">Referrer (5% commission)</option>
                  <option value="distributor">Distributor (5% commission)</option>
                  <option value="both">Both Roles (10% commission)</option>
                </select>
                {errors.accountType && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.accountType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Phone number
                </label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  type="tel"
                  className="input w-full"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="businessDescription" className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Business description
                </label>
                <textarea
                  {...register('businessDescription', { required: 'Business description is required' })}
                  rows={4}
                  className="input w-full"
                  placeholder="Tell us about your business and experience..."
                />
                {errors.businessDescription && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.businessDescription.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-2.5"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;