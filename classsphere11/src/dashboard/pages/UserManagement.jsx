import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  ShieldAlert, 
  ShieldCheck,
  Trash2,
  X,
  Loader2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newUserData, setNewUserData] = useState({ username: '', email: '', role: 'student' });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers(roleFilter, searchQuery);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendToggle = async (user) => {
    try {
      const updated = await adminService.updateUser(user._id, { isSuspended: !user.isSuspended });
      setUsers(users.map(u => u._id === updated._id ? updated : u));
    } catch (error) {
      console.error('Failed to toggle suspension:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await adminService.updateUser(selectedUser._id, selectedUser);
      setUsers(users.map(u => u._id === updated._id ? updated : u));
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const newUser = await adminService.createUser(newUserData);
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setNewUserData({ username: '', email: '', role: 'student' });
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Citizens</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage all users, roles, and platform permissions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center gap-3"
        >
          <UserPlus className="w-5 h-5" /> Enlist Member
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
            />
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            {['all', 'teacher', 'student', 'admin'].map(role => (
              <button 
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black capitalize transition-all ${roleFilter === role ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'}`}
              >
                {role}s
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left py-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">User</th>
                <th className="text-left py-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Role</th>
                <th className="text-left py-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                <th className="text-left py-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Joined</th>
                <th className="text-right py-4 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-teal-600/30 mx-auto" />
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user._id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 overflow-hidden">
                        {user.profilePicture ? <img src={user.profilePicture} alt="" /> : user.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none">{user.username}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                      user.role === 'teacher' ? 'bg-teal-50 text-teal-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span className="text-xs font-bold text-slate-600">{user.isSuspended ? 'Suspended' : 'Active'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-teal-600 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSuspendToggle(user)}
                        className={`p-2 hover:bg-white rounded-lg transition-all ${user.isSuspended ? 'text-emerald-500' : 'text-amber-500'}`}
                      >
                        {user.isSuspended ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Modify Member</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Update account profiles and roles</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Username</label>
                    <input 
                      type="text" required
                      value={selectedUser?.username || ''}
                      onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" required
                      value={selectedUser?.email || ''}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role Assignment</label>
                    <select 
                      value={selectedUser?.role || ''}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold appearance-none cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50">
                <h3 className="text-3xl font-black text-slate-900">Add New Member</h3>
                <p className="text-slate-500 font-medium mt-1">Enlist a new user to the platform.</p>
              </div>

              <form onSubmit={handleAddUser} className="p-10 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Username</label>
                    <input 
                      type="text" required
                      value={newUserData.username}
                      onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" required
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role</label>
                    <select 
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button" onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" disabled={isUpdating}
                    className="flex-[2] bg-teal-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
