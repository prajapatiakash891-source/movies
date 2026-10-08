import React, { useEffect, useState } from 'react';
import { Shield, Trash2, Users, AlertTriangle } from 'lucide-react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import PageLoader from '../../components/PageLoader';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      console.error('Role update failed', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/admin/users/${deleteId}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete user failed', err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black text-white">Manage Registered Users</h1>
        <p className="text-xs text-muted mt-1">Control user roles, permissions, and account statuses</p>
      </div>

      <div className="glass-panel rounded-2xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-dark-card/80 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-white">{u.name}</span>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="px-2.5 py-1 bg-dark-card border border-dark-border text-[10px] font-bold text-neutral-300 hover:text-white rounded-lg"
                        title="Toggle Admin Role"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => setDeleteId(u._id)}
                        className="p-1.5 bg-dark-card border border-dark-border text-neutral-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <Modal isOpen={Boolean(deleteId)} onClose={() => setDeleteId(null)} title="Confirm User Deletion">
          <div className="space-y-4 text-center p-2">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-bold text-white">Delete User Account?</h4>
            <p className="text-xs text-muted">This will permanently delete the user account and associated review data.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-dark-card border border-dark-border text-white text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md">
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;
