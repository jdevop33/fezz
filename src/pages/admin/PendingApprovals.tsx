import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface PendingProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  is_referrer: boolean;
  is_distributor: boolean;
  created_at: string;
}

function PendingApprovals() {
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingProfiles();
  }, []);

  async function loadPendingProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingProfiles(data || []);
    } catch (error) {
      console.error('Error loading pending profiles:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  }

  async function handleApproval(profileId: string, approved: boolean) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: approved })
        .eq('id', profileId);

      if (error) throw error;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Pending Approvals</h2>
          <p className="mt-1 text-sm text-gray-500">Review and approve new account requests.</p>
        </div>
        <div className="border-t border-gray-200">
          {pendingProfiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No pending approvals</p>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {pendingProfiles.map((profile) => (
                <li key={profile.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {profile.first_name} {profile.last_name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          {profile.is_referrer && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Referrer
                            </span>
                          )}
                          {profile.is_distributor && (
                            <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Distributor
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Company: {profile.company_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Email: {profile.email}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleApproval(profile.id, true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(profile.id, false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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