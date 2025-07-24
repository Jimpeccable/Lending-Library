import React, { useState } from 'react';
import { Search, Filter, Calendar, CheckCircle, AlertTriangle, Clock, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { mockLoans, mockItems, mockMembers } from '../../data/mockData';
import { Loan } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const LoanManagement: React.FC = () => {
  const [loans] = useState<Loan[]>(mockLoans);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [returnCondition, setReturnCondition] = useState('');
  const [returnNotes, setReturnNotes] = useState('');

  const getLoansWithDetails = () => {
    return loans.map(loan => {
      const item = mockItems.find(item => item.id === loan.itemId);
      const borrower = { id: loan.borrowerId, name: 'John Borrower', email: 'john@example.com' }; // Mock borrower data
      return { ...loan, item, borrower };
    }).filter(loan => loan.item && loan.borrower);
  };

  const loansWithDetails = getLoansWithDetails();

  const filteredLoans = loansWithDetails.filter(loan => {
    const matchesSearch = loan.item!.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.borrower!.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'overdue':
        return 'danger';
      case 'returned':
        return 'success';
      case 'lost':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleReturnItem = (loan: any) => {
    setSelectedLoan(loan);
    setIsReturnModalOpen(true);
  };

  const processReturn = () => {
    // In a real app, this would update the loan status
    console.log('Processing return:', { selectedLoan, returnCondition, returnNotes });
    setIsReturnModalOpen(false);
    setSelectedLoan(null);
    setReturnCondition('');
    setReturnNotes('');
  };

  const statuses = ['active', 'overdue', 'returned', 'lost'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-600">Track and manage all library loans</p>
        </div>
        <Button>
          <CheckCircle className="w-4 h-4 mr-2" />
          Quick Return
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {loans.filter(loan => loan.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Loans</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {loans.filter(loan => {
                const daysUntilDue = getDaysUntilDue(loan.dueDate);
                return loan.status === 'active' && daysUntilDue < 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {loans.filter(loan => {
                const daysUntilDue = getDaysUntilDue(loan.dueDate);
                return loan.status === 'active' && daysUntilDue <= 3 && daysUntilDue >= 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Due Soon</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {loans.filter(loan => loan.status === 'returned').length}
            </div>
            <div className="text-sm text-gray-600">Returned Today</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search loans..."
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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </Card>

      {/* Loans Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item & Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checkout Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Remaining
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const daysUntilDue = getDaysUntilDue(loan.dueDate);
                const isOverdue = daysUntilDue < 0;
                const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
                
                return (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={loan.item!.imageUrls[0]}
                          alt={loan.item!.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {loan.item!.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.borrower!.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(loan.checkoutDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(loan.status)}>
                        {loan.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                         isDueSoon ? `${daysUntilDue} days left` : 
                         `${daysUntilDue} days`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {loan.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReturnItem(loan)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Return
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
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

      {/* Return Item Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Process Item Return"
        size="md"
      >
        {selectedLoan && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={selectedLoan.item!.imageUrls[0]}
                alt={selectedLoan.item!.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium text-gray-900">{selectedLoan.item!.name}</h3>
                <p className="text-sm text-gray-600">Borrowed by {selectedLoan.borrower!.name}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(selectedLoan.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <Select
              label="Item Condition on Return"
              value={returnCondition}
              onChange={(e) => setReturnCondition(e.target.value)}
              options={[
                { value: 'excellent', label: 'Excellent - No damage' },
                { value: 'good', label: 'Good - Minor wear' },
                { value: 'fair', label: 'Fair - Noticeable wear' },
                { value: 'damaged', label: 'Damaged - Needs repair' },
                { value: 'lost', label: 'Lost/Not returned' }
              ]}
              required
            />
            
            <Input
              label="Return Notes (Optional)"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Any additional notes about the return..."
            />
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={processReturn} disabled={!returnCondition}>
                Process Return
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LoanManagement;