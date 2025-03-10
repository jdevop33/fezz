import React, { useState, useEffect } from 'react';
import { 
  getUsersBySpecificRole, 
  getApprovedBusinessAccounts, 
  getPendingApprovalUsers, 
  approveRejectUser, 
  changeUserRole
} from '../../lib/userRoles';
import { User } from '../../lib/types';
import { useUserRoles } from '../../lib/hooks/useUserRoles';
import RoleBasedAccess from '../../components/RoleBasedAccess';
import { Plus, Edit, UserCheck, UserX, AlertCircle, Search, ChevronDown, Trash } from 'lucide-react';
import { toast } from 'sonner';

const UserRoleManagement: React.FC = () => {
  const { isOwner, getAllRoles, getRoleDescription } = useUserRoles();
  
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Load users based on filter
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        let fetchedUsers: User[] = [];
        
        if (filter === 'all') {
          // Get users of all roles
          const allRoles = getAllRoles();
          for (const role of allRoles) {
            const usersWithRole = await getUsersBySpecificRole(role);
            fetchedUsers = [...fetchedUsers, ...usersWithRole];
          }
        } else if (filter === 'business') {
          fetchedUsers = await getApprovedBusinessAccounts();
        } else if (filter === 'pending') {
          fetchedUsers = await getPendingApprovalUsers();
          setPendingUsers(fetchedUsers);
          return; // Don't set as regular users
        } else {
          fetchedUsers = await getUsersBySpecificRole(filter as any);
        }
        
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, [filter, getAllRoles]);

  // Get pending users separately on component mount
  useEffect(() => {
    async function loadPendingUsers() {
      try {
        const pendingUsersList = await getPendingApprovalUsers();
        setPendingUsers(pendingUsersList);
      } catch (error) {
        console.error('Error loading pending users:', error);
      }
    }
    
    loadPendingUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.displayName?.toLowerCase().includes(searchLower) || false) ||
      (user.email.toLowerCase().includes(searchLower)) ||
      (user.companyName?.toLowerCase().includes(searchLower) || false)
    );
  });

  // Handle user role change
  const handleChangeRole = async () => {
    if (!selectedUser || !editRole) return;
    
    try {
      await changeUserRole(selectedUser.id, editRole as any);
      toast.success(`Role updated for ${selectedUser.displayName || selectedUser.email}`);
      
      // Update user in the list
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: editRole as any, isAdmin: editRole === 'admin', isOwner: editRole === 'owner' } 
          : user
      ));
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Handle user approval/rejection
  const handleApproveReject = async (userId: string, approved: boolean) => {
    try {
      await approveRejectUser(userId, approved, notes);
      
      // Update pending users list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      toast.success(approved ? 'User approved successfully' : 'User rejected');
    } catch (error) {
      console.error('Error approving/rejecting user:', error);
      toast.error('Failed to process user approval');
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role || 'retail');
    setShowEditModal(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">User Role Management</h1>
          <p className="text-surface-600">Manage user roles and access permissions</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Filter dropdown */}
          <div className="relative">
            <select
              className="rounded-md border border-surface-300 bg-white px-4 py-2 pr-10 text-sm text-surface-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="retail">Retail Customers</option>
              <option value="wholesale">Wholesale Accounts</option>
              <option value="distributor">Distributors</option>
              <option value="business">All Business Accounts</option>
              <option value="pending">Pending Approval</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown size={16} className="text-surface-400" />
            </div>
          </div>
          
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-md border border-surface-300 bg-white pl-10 pr-4 py-2 text-sm text-surface-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-surface-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Approvals Section */}
      {pendingUsers.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2 text-amber-500" />
            <h2 className="text-lg font-medium text-surface-900">Pending Approvals ({pendingUsers.length})</h2>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-surface-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">Requested On</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {pendingUsers.map(user => (
                  <tr key={user.id} className="hover:bg-surface-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {(user.displayName || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-surface-900">{user.displayName || 'Unnamed User'}</div>
                          <div className="text-sm text-surface-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                      {user.companyName || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        {user.role || 'Unknown Role'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                      {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleApproveReject(user.id, true)}
                        className="mr-3 text-green-600 hover:text-green-900"
                      >
                        <UserCheck size={18} />
                      </button>
                      <button
                        onClick={() => handleApproveReject(user.id, false)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <UserX size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* All Users Section */}
      <div className="overflow-x-auto rounded-lg border border-surface-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-64 w-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center">
              <Search size={24} className="text-surface-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-surface-900">No users found</h3>
            <p className="text-surface-500">
              {searchTerm ? 'Try adjusting your search term.' : 'There are no users in this category.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500">Company</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-surface-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {(user.displayName || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-surface-900">{user.displayName || 'Unnamed User'}</div>
                        <div className="text-sm text-surface-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.isOwner 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.isAdmin 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isOwner ? 'Owner' : user.isAdmin ? 'Admin' : user.role || 'Retail'}
                      </span>
                      {user.role && (
                        <span className="mt-1 text-xs text-surface-500">
                          {getRoleDescription(user.role)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      user.approved 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {user.approved ? 'Approved' : user.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                    {user.companyName || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    {/* Only owners can edit admins and owners */}
                    {isOwner || (!user.isAdmin && !user.isOwner) ? (
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-surface-900">
              Edit User: {selectedUser.displayName || selectedUser.email}
            </h2>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-surface-700">
                Role
              </label>
              <select
                className="w-full rounded-md border border-surface-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                {getAllRoles().map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)} - {getRoleDescription(role)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-md border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;