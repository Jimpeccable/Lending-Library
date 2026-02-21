import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail, UserCheck, CreditCard } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';

import Modal from '../ui/Modal';

const MemberManagement: React.FC = () => {
  const { members, membershipTiers, addMember, updateMemberStatus } = useLibrary();
  const { allUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    userId: '',
    membershipTierId: '',
    status: 'active' as const
  });

  const filteredMembers = members.filter(member => {
    const user = allUsers.find(u => u.id === member.userId);
    const matchesSearch = !searchTerm ||
                         user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || member.status === statusFilter;
    const matchesTier = !tierFilter || member.membershipTierId === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getTierName = (tierId: string) => {
    const tier = membershipTiers.find(t => t.id === tierId);
    return tier?.name || 'Unknown';
  };

  const statuses = ['active', 'suspended', 'pending'];

  const { user: currentUser } = useAuth();
  const handleAddMember = () => {
    addMember({
      libraryId: currentUser?.libraryId || 'lib1',
      userId: newMember.userId,
      membershipTierId: newMember.membershipTierId,
      status: newMember.status
    });
    setIsAddModalOpen(false);
    setNewMember({ userId: '', membershipTierId: '', status: 'active' });
  };

  const availableUsers = allUsers.filter(user =>
    user.role === 'borrower' && !members.some(m => m.userId === user.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
          <p className="text-gray-600">Manage your library members and memberships</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <UserCheck className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{members.length}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {members.reduce((sum, m) => sum + m.activeLoans, 0)}
            </div>
            <div className="text-sm text-gray-600">Active Loans</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              ${members.reduce((sum, m) => sum + m.outstandingFees, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Outstanding Fees</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="All statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statuses.map(status => ({ 
              value: status, 
              label: status.charAt(0).toUpperCase() + status.slice(1) 
            }))}
          />
          <Select
            placeholder="All tiers"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            options={membershipTiers.map(tier => ({ value: tier.id, label: tier.name }))}
          />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Members Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => {
                const user = allUsers.find(u => u.id === member.userId);

                return (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user?.fullName.charAt(0).toUpperCase() || 'M'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.fullName || 'Unknown Member'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getTierName(member.membershipTierId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.activeLoans} / {member.totalLoans}
                    </div>
                    <div className="text-xs text-gray-500">
                      Active / Total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${member.outstandingFees > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      ${member.outstandingFees.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {member.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Suspend Member"
                          onClick={() => updateMemberStatus(member.id, 'suspended')}
                        >
                          <MoreHorizontal className="w-4 h-4 text-red-600" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Activate Member"
                          onClick={() => updateMemberStatus(member.id, 'active')}
                        >
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <CreditCard className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Select User"
            value={newMember.userId}
            onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
            options={availableUsers.map(user => ({
              value: user.id,
              label: `${user.fullName} (${user.email})`
            }))}
            placeholder="Choose a registered borrower"
            required
          />

          <Select
            label="Membership Tier"
            value={newMember.membershipTierId}
            onChange={(e) => setNewMember({ ...newMember, membershipTierId: e.target.value })}
            options={membershipTiers.map(tier => ({
              value: tier.id,
              label: `${tier.name} - $${tier.price}/${tier.billingInterval === 'monthly' ? 'mo' : 'yr'}`
            }))}
            placeholder="Select a tier"
            required
          />

          <Select
            label="Initial Status"
            value={newMember.status}
            onChange={(e) => setNewMember({ ...newMember, status: e.target.value as 'active' | 'suspended' | 'pending' })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' }
            ]}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={!newMember.userId || !newMember.membershipTierId}
            >
              Add Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemberManagement;