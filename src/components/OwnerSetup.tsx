import React, { useState } from 'react';
import { createInitialOwner } from '../lib/createOwner';
import { toast } from 'sonner';

interface OwnerSetupProps {
  onSetupComplete: () => void;
}

function OwnerSetup({ onSetupComplete }: OwnerSetupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await createInitialOwner(email, password);
      toast.success('Owner account created successfully!');
      onSetupComplete();
    } catch (err: any) {
      console.error('Owner setup error:', err);
      setError(err.message || 'Failed to create owner account');
      toast.error('Failed to create owner account');
    } finally {
      setLoading(false);
    }
  };

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
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
            User Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="Enter existing user email"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-surface-400">
            Must be an existing user in the system
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="Enter user's current password"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5"
          >
            {loading ? 'Creating Owner...' : 'Create Owner Account'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-surface-400">
          This action will promote an existing user to owner status.
          <br />
          Only do this once to set up the initial owner.
        </p>
      </div>
    </div>
  );
}

export default OwnerSetup;