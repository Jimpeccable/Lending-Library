import React from 'react';
import { Users, UserX, UserCheck, MoreVertical, Search, Filter, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const UserManagement: React.FC = () => {
  const { allUsers, updateUserStatus } = useAuth();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super-user':
        return <Badge variant="danger">Super Admin</Badge>;
      case 'host':
        return <Badge variant="warning">Host</Badge>;
      case 'borrower':
        return <Badge variant="info">Borrower</Badge>;
      default:
        return <Badge variant="neutral">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Monitor and manage all users across the platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Moderation Logs
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 border-b border-gray-200">User</th>
                <th className="px-6 py-3 border-b border-gray-200">Role</th>
                <th className="px-6 py-3 border-b border-gray-200">Library ID</th>
                <th className="px-6 py-3 border-b border-gray-200">Status</th>
                <th className="px-6 py-3 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <UserIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {user.libraryId || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status || 'active')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {user.role !== 'super-user' && (
                        <>
                          {user.status === 'suspended' ? (
                            <button
                              onClick={() => updateUserStatus(user.id, 'active')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Activate"
                            >
                              <UserCheck className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => updateUserStatus(user.id, 'suspended')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Suspend"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                      <button className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
