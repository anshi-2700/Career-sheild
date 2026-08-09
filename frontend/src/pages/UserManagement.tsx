import React, { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Users, Search, Trash2, Ban, CheckCircle2, Phone, AlertCircle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // App-side state notifications & modals
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err: any) {
      setNotification({ type: 'error', message: getErrorMessage(err, 'Failed to fetch user directory.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (userId: number, currentSuspended: boolean, userName: string) => {
    try {
      const formData = new FormData();
      formData.append('suspend', (!currentSuspended).toString());
      await api.put(`/admin/users/${userId}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNotification({
        type: 'success',
        message: `Account status for "${userName}" successfully updated to ${!currentSuspended ? 'Suspended' : 'Active'}.`
      });
      fetchUsers();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: getErrorMessage(err, 'Failed to update user account status.')
      });
    }
  };

  const confirmDeleteUser = (user: any) => {
    setUserToDelete(user);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    const targetUser = userToDelete;
    setUserToDelete(null);

    try {
      await api.delete(`/admin/users/${targetUser.id}`);
      setNotification({
        type: 'success',
        message: `User account "${targetUser.full_name}" (${targetUser.email}) permanently deleted.`
      });
      fetchUsers();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: getErrorMessage(err, 'Failed to delete user account.')
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone_number && u.phone_number.includes(searchTerm))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* App Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Permanently Delete User Account?"
        message={`Are you sure you want to permanently delete the user account for ${userToDelete?.full_name} (${userToDelete?.email})? This action cannot be undone.`}
        confirmLabel="Yes, Delete Account"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={executeDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" /> User Directory & RBAC
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Super Admin portal for searching, suspending, and managing user accounts.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>
      </div>

      {/* App Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between gap-3 border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-medium">Loading user accounts...</div>
      ) : (
        <div className="human-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{u.full_name}</p>
                      <p className="text-slate-500 text-xs font-medium">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {u.phone_number ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {u.phone_number}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded font-bold text-[10px] uppercase ${u.role === 'super_admin' ? 'human-badge-rose' : 'human-badge-emerald'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_suspended ? (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5" /> Suspended
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {u.role !== 'super_admin' && (
                        <>
                          <button
                            onClick={() => handleToggleSuspend(u.id, u.is_suspended, u.full_name)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                              u.is_suspended
                                ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800'
                                : 'bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900'
                            }`}
                          >
                            {u.is_suspended ? 'Activate' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(u)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 rounded-lg font-bold transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
