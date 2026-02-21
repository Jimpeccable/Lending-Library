import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, RotateCcw, Star } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { Loan, Item } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

const MyLoans: React.FC = () => {
  const { loans, items } = useLibrary();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<(Loan & { item: Item }) | null>(null);
  const [renewalReason, setRenewalReason] = useState('');

  // Filter loans for current user
  const userLoans = loans.filter(loan => loan.borrowerId === user?.id);
  
  const currentLoans = userLoans
    .filter(loan => loan.status === 'active')
    .map(loan => {
      const item = items.find(item => item.id === loan.itemId);
      return { ...loan, item };
    })
    .filter(loan => loan.item);

  const loanHistory = userLoans
    .filter(loan => loan.status === 'returned')
    .map(loan => {
      const item = items.find(item => item.id === loan.itemId);
      return {
        id: loan.id,
        itemName: item?.name || 'Unknown Item',
        checkoutDate: loan.checkoutDate,
        returnDate: loan.returnDate || loan.updatedAt,
        status: 'returned',
        rating: 5
      };
    });

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleRenewRequest = (loan: Loan & { item: Item }) => {
    setSelectedLoan(loan);
    setIsRenewModalOpen(true);
  };

  const submitRenewalRequest = () => {
    // In a real app, this would submit the renewal request
    console.log('Renewal request:', { selectedLoan, renewalReason });
    setIsRenewModalOpen(false);
    setSelectedLoan(null);
    setRenewalReason('');
  };

  const renderCurrentLoans = () => (
    <div className="space-y-4">
      {currentLoans.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No active loans</h3>
            <p className="text-gray-600 mt-2">You don't have any items currently borrowed.</p>
            <Button className="mt-4">Browse Items</Button>
          </div>
        </Card>
      ) : (
        currentLoans.map((loan) => {
          const daysUntilDue = getDaysUntilDue(loan.dueDate);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
          
          return (
            <Card key={loan.id}>
              <div className="flex items-center space-x-4">
                <img
                  src={loan.item!.imageUrls[0]}
                  alt={loan.item!.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{loan.item!.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{loan.item!.category}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Checked out:</span>
                      <span className="ml-1 font-medium">{new Date(loan.checkoutDate).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Due:</span>
                      <span className="ml-1 font-medium">{new Date(loan.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    {isOverdue ? (
                      <Badge variant="danger">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {Math.abs(daysUntilDue)} days overdue
                      </Badge>
                    ) : isDueSoon ? (
                      <Badge variant="warning">
                        <Clock className="w-3 h-3 mr-1" />
                        Due in {daysUntilDue} days
                      </Badge>
                    ) : (
                      <Badge variant="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {daysUntilDue} days remaining
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRenewRequest(loan)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Renew
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Library
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );

  const renderLoanHistory = () => (
    <div className="space-y-4">
      {loanHistory.map((loan) => (
        <Card key={loan.id}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{loan.itemName}</h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span>Borrowed: {new Date(loan.checkoutDate).toLocaleDateString()}</span>
                <span>Returned: {new Date(loan.returnDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="success">Returned</Badge>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < loan.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
          <p className="text-gray-600">Track your borrowed items and loan history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentLoans.length}</div>
            <div className="text-sm text-gray-600">Active Loans</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{loanHistory.length}</div>
            <div className="text-sm text-gray-600">Total Borrowed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {currentLoans.filter(loan => {
                const days = getDaysUntilDue(loan.dueDate);
                return days <= 3 && days >= 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Due Soon</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">4.8</div>
            <div className="text-sm text-gray-600">Avg Rating Given</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card padding={false}>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'current'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Current Loans ({currentLoans.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Loan History ({loanHistory.length})
            </button>
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'current' ? renderCurrentLoans() : renderLoanHistory()}

      {/* Renewal Request Modal */}
      <Modal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        title="Request Loan Renewal"
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
                <p className="text-sm text-gray-600">
                  Current due date: {new Date(selectedLoan.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for renewal (optional)
              </label>
              <textarea
                value={renewalReason}
                onChange={(e) => setRenewalReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Let us know why you need more time with this item..."
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Renewal requests are subject to availability and library policies. 
                You'll receive a notification once your request is reviewed.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsRenewModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitRenewalRequest}>
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyLoans;