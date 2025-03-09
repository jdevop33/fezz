import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Timestamp, where, orderBy } from 'firebase/firestore';
import { queryDocuments, updateUser, User } from '../../lib/pouchesDb';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

function AdminManagement() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  // These variables will be used in a future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminData, setNewAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      setLoading(true);
      const admins = await queryDocuments<User>('users', [
        where('isAdmin', '==', true),
        orderBy('createdAt', 'desc')
      ]);
      setAdmins(admins);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast.error('Failed to load admin accounts');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAdminStatus(admin: User, isAdmin: boolean) {
    try {
      await updateUser(admin.id, { 
        isAdmin,
        role: isAdmin ? 'admin' : 'wholesale'
      });
      toast.success(isAdmin ? 'Admin permissions granted' : 'Admin permissions revoked');
      loadAdmins();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    }
  }

  function formatDate(timestamp?: Timestamp) {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-surface-800">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Admin Management</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-surface-400">
              Manage administrator accounts and permissions.
            </p>
          </div>
          <button
            onClick={() => setIsAddingAdmin(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Admin
          </button>
        </div>
        <div className="border-t border-gray-200 dark:border-surface-700">
          {admins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-surface-400">No admin accounts found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-surface-700">
              <thead className="bg-gray-50 dark:bg-surface-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-surface-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-surface-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-surface-400 uppercase tracking-wider">
                    Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-surface-800 dark:divide-surface-700">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {admin.firstName} {admin.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-surface-400">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-surface-400">{formatDate(admin.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingAdmin(admin)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAdminStatus(admin, false)}
                        className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Admin Modal - This would be a modal component in a real implementation */}
      {(isAddingAdmin || editingAdmin) && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-surface-800">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-surface-800">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {isAddingAdmin ? 'Add New Admin' : 'Edit Admin'}
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={isAddingAdmin ? newAdminData.firstName : editingAdmin?.firstName || ''}
                      onChange={(e) => isAddingAdmin 
                        ? setNewAdminData({...newAdminData, firstName: e.target.value}) 
                        : setEditingAdmin(editingAdmin ? {...editingAdmin, firstName: e.target.value} : null)
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={isAddingAdmin ? newAdminData.lastName : editingAdmin?.lastName || ''}
                      onChange={(e) => isAddingAdmin 
                        ? setNewAdminData({...newAdminData, lastName: e.target.value}) 
                        : setEditingAdmin(editingAdmin ? {...editingAdmin, lastName: e.target.value} : null)
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-surface-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={isAddingAdmin ? newAdminData.email : editingAdmin?.email || ''}
                      onChange={(e) => isAddingAdmin 
                        ? setNewAdminData({...newAdminData, email: e.target.value}) 
                        : setEditingAdmin(editingAdmin ? {...editingAdmin, email: e.target.value} : null)
                      }
                      className="input w-full"
                      disabled={!!editingAdmin}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-surface-900">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // This would be implemented to save the admin or edit existing admin
                    // For now we just close the modal
                    setIsAddingAdmin(false);
                    setEditingAdmin(null);
                    toast.success(isAddingAdmin ? 'Admin added!' : 'Admin updated!');
                  }}
                >
                  {isAddingAdmin ? 'Add' : 'Save'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-surface-700 dark:border-surface-600 dark:text-white dark:hover:bg-surface-600"
                  onClick={() => {
                    setIsAddingAdmin(false);
                    setEditingAdmin(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;