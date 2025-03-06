import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';
import { getPendingApprovals, approveUserAccount, User } from '../../lib/pouchesDb';

function PendingApprovals() {
  const [pendingProfiles, setPendingProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingProfiles();
  }, []);

  async function loadPendingProfiles() {
    try {
      setLoading(true);
      const profiles = await getPendingApprovals();
      setPendingProfiles(profiles);
    } catch (error) {
      console.error('Error loading pending profiles:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  }

  async function handleApproval(profileId: string, approved: boolean) {
    try {
      await approveUserAccount(profileId, approved);
      toast.success(approved ? 'Account approved' : 'Account rejected');
      loadPendingProfiles();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update account status');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  function formatDate(timestamp?: Timestamp) {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-surface-800">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pending Approvals</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-surface-400">Review and approve new account requests.</p>
        </div>
        <div className="border-t border-gray-200 dark:border-surface-700">
          {pendingProfiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-surface-400">No pending approvals</p>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200 dark:divide-surface-700">
              {pendingProfiles.map((profile) => (
                <li key={profile.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          {profile.accountType === 'referrer' && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              Referrer
                            </span>
                          )}
                          {profile.accountType === 'distributor' && (
                            <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              Distributor
                            </span>
                          )}
                          {profile.accountType === 'both' && (
                            <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                              Both Roles
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-surface-400">
                          Company: {profile.companyName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-surface-400">
                          Email: {profile.email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-surface-400">
                          Phone: {profile.phone}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-surface-400">
                          Applied: {formatDate(profile.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-surface-400 mt-2">
                          {profile.businessDescription}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleApproval(profile.id, true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(profile.id, false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:border-surface-600 dark:text-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingApprovals;