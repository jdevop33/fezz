import React, { useState } from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import OwnerSetup from '../components/OwnerSetup';

function SetupPage() {
  const [setupComplete, setSetupComplete] = useState(false);
  const navigate = useNavigate();
  
  const handleSetupComplete = () => {
    setSetupComplete(true);
    // Redirect to admin dashboard after a delay
    setTimeout(() => {
      navigate('/admin');
    }, 3000);
  };
  
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
        ) : (
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Initial Configuration
            </h2>
            <div className="mb-12">
              <OwnerSetup onSetupComplete={handleSetupComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SetupPage;