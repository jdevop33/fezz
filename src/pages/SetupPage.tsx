import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import OwnerSetup from '../components/OwnerSetup';
import { checkIfOwnerExists } from '../lib/createOwner';

function SetupPage() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [ownerExists, setOwnerExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const adminToken = searchParams.get('admin-setup');
  
  useEffect(() => {
    async function checkOwnerStatus() {
      try {
        setLoading(true);
        const hasOwner = await checkIfOwnerExists();
        setOwnerExists(hasOwner);
        
        // If an owner exists and no admin token is provided, redirect to login
        if (hasOwner && !adminToken) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking owner status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkOwnerStatus();
  }, [navigate, adminToken]);
  
  const handleSetupComplete = () => {
    setSetupComplete(true);
    // Redirect to admin dashboard after a delay
    setTimeout(() => {
      navigate('/admin');
    }, 3000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            System Setup
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-surface-400 sm:mt-4">
            Configure essential settings for your platform
          </p>
        </div>
        
        {setupComplete ? (
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto text-center dark:bg-surface-800">
            <CheckCircle2 className="h-16 w-16 text-success-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Setup Complete!
            </h2>
            <p className="mt-2 text-gray-500 dark:text-surface-400">
              Owner account has been created successfully. You will be redirected to the admin dashboard shortly.
            </p>
            <Link 
              to="/admin" 
              className="mt-6 inline-block btn-primary py-2.5 px-4"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : ownerExists && !adminToken ? (
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto text-center dark:bg-surface-800">
            <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Setup Already Complete
            </h2>
            <p className="mt-2 text-gray-500 dark:text-surface-400">
              An owner account already exists for this platform. Please log in with your credentials.
            </p>
            <Link 
              to="/login" 
              className="mt-6 inline-block btn-primary py-2.5 px-4"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {ownerExists 
                ? 'Additional Owner Setup (Admin Mode)'
                : 'Initial Owner Configuration'}
            </h2>
            {ownerExists && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md max-w-md mx-auto mb-6 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                <p className="text-sm font-medium">
                  Warning: An owner account already exists. Creating another owner account is only recommended in special circumstances.
                </p>
              </div>
            )}
            <div className="mb-12">
              <OwnerSetup 
                onSetupComplete={handleSetupComplete} 
                adminToken={adminToken || undefined} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SetupPage;