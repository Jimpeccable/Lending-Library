import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Bell
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Input from '../ui/Input';

interface HostDashboardProps {
  onSectionChange: (section: string) => void;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ onSectionChange }) => {
  const { items, members, loans, membershipTiers, checkoutItem } = useLibrary();
  const { allUsers } = useAuth();
  const [isQuickCheckoutOpen, setIsQuickCheckoutOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const stats = {
    totalItems: items.length,
    availableItems: items.filter(item => item.status === 'available').length,
    totalMembers: members.length,
    activeLoans: loans.filter(loan => loan.status === 'active').length,
    overdueLoans: loans.filter(loan => {
      const dueDate = new Date(loan.dueDate);
      const today = new Date();
      return loan.status === 'active' && dueDate < today;
    }).length,
    revenue: members.reduce((sum, member) => {
      const tier = membershipTiers.find(t => t.id === member.membershipTierId);
      return sum + (tier?.price || 0) + (member.outstandingFees || 0);
    }, 0)
  };

  const recentActivities = [
    ...loans.map(loan => {
      const item = items.find(i => i.id === loan.itemId);
      const user = allUsers.find(u => u.id === loan.borrowerId);
      return {
        id: loan.id,
        type: loan.status === 'returned' ? 'return' : 'checkout',
        message: `${user?.fullName || 'Someone'} ${loan.status === 'returned' ? 'returned' : 'checked out'} ${item?.name || 'an item'}`,
        time: new Date(loan.updatedAt).toLocaleDateString(),
        icon: loan.status === 'returned' ? Package : BookOpen,
        color: loan.status === 'returned' ? 'text-green-600' : 'text-blue-600'
      };
    }),
    ...members.map(member => {
      const user = allUsers.find(u => u.id === member.userId);
      return {
        id: member.id,
        type: 'member',
        message: `New member registration: ${user?.fullName || 'Unknown'}`,
        time: new Date(member.joinDate).toLocaleDateString(),
        icon: Users,
        color: 'text-teal-600'
      };
    })
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const handleQuickCheckout = () => {
    if (selectedItemId && selectedMemberId && dueDate) {
      const member = members.find(m => m.id === selectedMemberId);
      if (member) {
        checkoutItem(selectedItemId, member.userId, new Date(dueDate).toISOString());
        setIsQuickCheckoutOpen(false);
        setSelectedItemId('');
        setSelectedMemberId('');
        setDueDate('');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your library.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button onClick={() => setIsQuickCheckoutOpen(true)}>
            <Package className="w-4 h-4 mr-2" />
            Quick Checkout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeLoans}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
              <Badge variant="danger">{stats.overdueLoans}</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Overdue Items</span>
                </div>
                <Badge variant="danger">{stats.overdueLoans}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Low Stock</span>
                </div>
                <Badge variant="warning">3</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">New Messages</span>
                </div>
                <Badge variant="primary">2</Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSectionChange('inventory')}
              >
                <Package className="w-4 h-4 mr-2" />
                Inventory Management
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSectionChange('members')}
              >
                <Users className="w-4 h-4 mr-2" />
                Member Directory
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSectionChange('loans')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Loan Management
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSectionChange('reports')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Checkout Modal */}
      <Modal
        isOpen={isQuickCheckoutOpen}
        onClose={() => setIsQuickCheckoutOpen(false)}
        title="Quick Checkout"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Select Item"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            options={items
              .filter(item => item.status === 'available')
              .map(item => ({ value: item.id, label: `${item.name} (${item.barcode})` }))
            }
            placeholder="Choose an item..."
            required
          />

          <Select
            label="Select Member"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            options={members.map(member => {
              const user = allUsers.find(u => u.id === member.userId);
              return { value: member.id, label: user?.fullName || `Member ${member.id}` };
            })}
            placeholder="Choose a member..."
            required
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsQuickCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleQuickCheckout}
              disabled={!selectedItemId || !selectedMemberId || !dueDate}
            >
              Confirm Checkout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HostDashboard;