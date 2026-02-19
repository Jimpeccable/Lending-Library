import React, { useState } from 'react';
import { DollarSign, CreditCard, AlertCircle, TrendingUp, Download, Plus } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const Financials: React.FC = () => {
  const { items, members, membershipTiers } = useLibrary();
  const [isAddTierModalOpen, setIsAddTierModalOpen] = useState(false);
  const [newTier, setNewTier] = useState({
    name: '',
    description: '',
    price: '',
    billingInterval: 'monthly' as 'monthly' | 'yearly',
    borrowingLimit: '',
    maxLoanDuration: '',
    benefits: ''
  });

  // Real financial data
  const totalAssetValue = items.reduce((sum, item) => sum + item.replacementValue, 0);
  const outstandingFees = members.reduce((sum, member) => sum + member.outstandingFees, 0);
  const membershipRevenue = members.reduce((sum, member) => {
    const tier = membershipTiers.find(t => t.id === member.membershipTierId);
    return sum + (tier?.price || 0);
  }, 0);

  const financialStats = {
    monthlyRevenue: membershipRevenue + (outstandingFees * 0.1), // Just an estimate
    outstandingFees: outstandingFees,
    totalAssetValue: totalAssetValue,
    membershipRevenue: membershipRevenue,
    feeRevenue: outstandingFees * 0.1
  };

  const recentTransactions = [
    {
      id: '1',
      type: 'membership',
      member: 'John Borrower',
      amount: 25.00,
      date: '2024-12-20',
      status: 'completed'
    },
    {
      id: '2',
      type: 'late_fee',
      member: 'Sarah Johnson',
      amount: 5.50,
      date: '2024-12-19',
      status: 'pending'
    },
    {
      id: '3',
      type: 'membership',
      member: 'Mike Wilson',
      amount: 15.00,
      date: '2024-12-18',
      status: 'completed'
    }
  ];

  const handleAddTier = () => {
    // In a real app, this would save to the database
    console.log('Adding new tier:', newTier);
    setIsAddTierModalOpen(false);
    setNewTier({
      name: '',
      description: '',
      price: '',
      billingInterval: 'monthly',
      borrowingLimit: '',
      maxLoanDuration: '',
      benefits: ''
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'membership':
        return 'text-green-600';
      case 'late_fee':
        return 'text-red-600';
      case 'replacement_fee':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600">Manage membership tiers, payments, and financial reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddTierModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${financialStats.monthlyRevenue}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Fees</p>
              <p className="text-2xl font-bold text-gray-900">${financialStats.outstandingFees}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Asset Value</p>
              <p className="text-2xl font-bold text-gray-900">${financialStats.totalAssetValue}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Tiers */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Membership Tiers</h2>
            <Button variant="outline" size="sm" onClick={() => setIsAddTierModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Tier
            </Button>
          </div>
          
          <div className="space-y-4">
            {membershipTiers.map((tier) => (
              <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                  <div className="text-lg font-bold text-gray-900">
                    ${tier.price}/{tier.billingInterval === 'monthly' ? 'mo' : 'yr'}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Borrowing Limit:</span>
                    <div className="font-medium">{tier.borrowingLimit} items</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Loan Duration:</span>
                    <div className="font-medium">{tier.maxLoanDuration} days</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Benefits:</span>
                  <ul className="text-sm text-gray-700 mt-1">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTransactionTypeColor(transaction.type)}`}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-600">{transaction.member}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <Badge variant={getStatusVariant(transaction.status)} size="sm">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Membership Tier Modal */}
      <Modal
        isOpen={isAddTierModalOpen}
        onClose={() => setIsAddTierModalOpen(false)}
        title="Add Membership Tier"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tier Name"
              value={newTier.name}
              onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
              placeholder="e.g., Premium"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Price"
                type="number"
                value={newTier.price}
                onChange={(e) => setNewTier({ ...newTier, price: e.target.value })}
                placeholder="25.00"
              />
              <Select
                label="Billing"
                value={newTier.billingInterval}
                onChange={(e) => setNewTier({ ...newTier, billingInterval: e.target.value as 'monthly' | 'yearly' })}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]}
              />
            </div>
          </div>
          
          <Input
            label="Description"
            value={newTier.description}
            onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
            placeholder="Brief description of this tier"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Borrowing Limit"
              type="number"
              value={newTier.borrowingLimit}
              onChange={(e) => setNewTier({ ...newTier, borrowingLimit: e.target.value })}
              placeholder="5"
            />
            <Input
              label="Max Loan Duration (days)"
              type="number"
              value={newTier.maxLoanDuration}
              onChange={(e) => setNewTier({ ...newTier, maxLoanDuration: e.target.value })}
              placeholder="21"
            />
          </div>
          
          <Input
            label="Benefits (comma-separated)"
            value={newTier.benefits}
            onChange={(e) => setNewTier({ ...newTier, benefits: e.target.value })}
            placeholder="Priority reservations, Extended loan periods, Email notifications"
          />
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsAddTierModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTier}>Add Tier</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Financials;