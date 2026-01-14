import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { User } from '@/types/index';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.users.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.users.delete(id);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage platform users and administrators</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <th className="text-left py-4 px-6 font-semibold">Email</th>
                <th className="text-left py-4 px-6 font-semibold">Name</th>
                <th className="text-left py-4 px-6 font-semibold">Role</th>
                <th className="text-left py-4 px-6 font-semibold">Created At</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <p className="text-lg">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600">{user.name || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 flex gap-3 justify-end">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
