import React, { useState, useEffect } from 'react';
import { createInitialOwner, createNewOwnerAccount, checkIfOwnerExists } from '../lib/createOwner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface OwnerSetupProps {
  onSetupComplete: () => void;
  adminToken?: string;
}

function OwnerSetup({ onSetupComplete, adminToken }: OwnerSetupProps) {
  const [setupMode, setSetupMode] = useState<'new' | 'existing'>('new');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if an owner already exists
  useEffect(() => {
    async function checkOwner() {
      try {
        setCheckingOwner(true);
        const ownerExists = await checkIfOwnerExists();
        
        // If an owner exists and no token is provided, redirect to login
        if (ownerExists && !adminToken) {
          toast.error('Setup is already complete. Please log in.');
          navigate('/login');
        }
        
      } catch (error) {
        console.error('Error checking owner status:', error);
      } finally {
        setCheckingOwner(false);
      }
    }
    
    checkOwner();
  }, [navigate, adminToken]);

  const validateForm = () => {
    setError('');
    
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (setupMode === 'new') {
      if (!displayName) {
        setError('Owner name is required');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (setupMode === 'existing') {
        // Promote existing user to owner
        await createInitialOwner(email, password);
        toast.success('Existing user promoted to owner successfully!');
      } else {
        // Create new user and set as owner
        await createNewOwnerAccount(email, password, displayName);
        toast.success('New owner account created successfully!');
      }
      
      onSetupComplete();
    } catch (err: unknown) {
      console.error('Owner setup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create owner account');
      toast.error('Failed to create owner account');
    } finally {
      setLoading(false);
    }
  };

  if (checkingOwner) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg dark:bg-surface-800 flex justify-center">
        <div className="h-10 w-10 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg dark:bg-surface-800">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Create Owner Account
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex mb-4 bg-surface-100 rounded-lg overflow-hidden dark:bg-surface-700">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              setupMode === 'new' 
                ? 'bg-primary-600 text-white' 
                : 'bg-transparent text-surface-700 dark:text-surface-300'
            }`}
            onClick={() => setSetupMode('new')}
          >
            Create New Account
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              setupMode === 'existing' 
                ? 'bg-primary-600 text-white' 
                : 'bg-transparent text-surface-700 dark:text-surface-300'
            }`}
            onClick={() => setSetupMode('existing')}
          >
            Use Existing Account
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder={setupMode === 'existing' ? "Enter existing user email" : "Enter email for new owner"}
          />
          {setupMode === 'existing' && (
            <p className="mt-1 text-sm text-gray-500 dark:text-surface-400">
              Must be an existing user in the system
            </p>
          )}
        </div>
        
        {setupMode === 'new' && (
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
              Owner Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input w-full"
              placeholder="Enter owner's full name"
            />
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
            {setupMode === 'existing' ? 'Current Password' : 'Password'}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder={setupMode === 'existing' ? "Enter user's current password" : "Create a secure password"}
          />
        </div>
        
        {setupMode === 'new' && (
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input w-full"
              placeholder="Confirm password"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5"
          >
            {loading ? 'Setting Up Owner...' : setupMode === 'existing' ? 'Promote to Owner' : 'Create Owner Account'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-surface-400">
          {setupMode === 'existing' 
            ? 'This action will promote an existing user to owner status.'
            : 'This will create a new user with owner privileges.'}
          <br />
          Only do this once to set up the initial owner.
        </p>
      </div>
    </div>
  );
}

export default OwnerSetup;