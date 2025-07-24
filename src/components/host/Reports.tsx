import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Users, Package, DollarSign, FileText } from 'lucide-react';
import { mockItems, mockLoans, mockMembers } from '../../data/mockData';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Select';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30');

  const reportTypes = [
    { value: 'overview', label: 'Overview Report' },
    { value: 'inventory', label: 'Inventory Report' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'member', label: 'Member Activity Report' },
    { value: 'loan', label: 'Loan History Report' }
  ];

  const dateRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' }
  ];

  // Mock data calculations
  const totalItems = mockItems.length;
  const activeLoans = mockLoans.filter(loan => loan.status === 'active').length;
  const totalMembers = mockMembers.length;
  const monthlyRevenue = 1250.75;

  const popularItems = mockItems
    .map(item => ({
      ...item,
      loanCount: Math.floor(Math.random() * 20) + 1
    }))
    .sort((a, b) => b.loanCount - a.loanCount)
    .slice(0, 5);

  const categoryStats = mockItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
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
              <p className="text-2xl font-bold text-gray-900">${monthlyRevenue}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Items</h3>
          <div className="space-y-3">
            {popularItems.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.loanCount} loans</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-900">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / totalItems) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Item</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Value</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Condition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockItems.slice(0, 10).map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{item.category}</td>
                <td className="px-4 py-2 text-sm text-gray-600 capitalize">{item.status}</td>
                <td className="px-4 py-2 text-sm text-gray-900">${item.replacementValue}</td>
                <td className="px-4 py-2 text-sm text-gray-600 capitalize">{item.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${monthlyRevenue}</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">$125.50</div>
            <div className="text-sm text-gray-600">Outstanding Fees</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">$2,450.00</div>
            <div className="text-sm text-gray-600">Total Asset Value</div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Membership Fees</span>
            <span className="font-medium text-gray-900">$1,050.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Late Fees</span>
            <span className="font-medium text-gray-900">$125.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Replacement Fees</span>
            <span className="font-medium text-gray-900">$75.25</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${monthlyRevenue}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'inventory':
        return renderInventoryReport();
      case 'financial':
        return renderFinancialReport();
      case 'member':
        return (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Activity Report</h3>
            <p className="text-gray-600">Member activity analytics and engagement metrics would be displayed here.</p>
          </Card>
        );
      case 'loan':
        return (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan History Report</h3>
            <p className="text-gray-600">Comprehensive loan history and trends would be displayed here.</p>
          </Card>
        );
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Insights and data about your library performance</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Report Type"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            options={reportTypes}
          />
          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={dateRanges}
          />
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      {renderContent()}
    </div>
  );
};

export default Reports;