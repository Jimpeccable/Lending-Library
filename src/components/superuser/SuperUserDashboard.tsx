import React from 'react';
import { 
  Building, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Globe,
  Server,
  Shield
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface SuperUserDashboardProps {
  onSectionChange?: (section: string) => void;
}

const SuperUserDashboard: React.FC<SuperUserDashboardProps> = ({ onSectionChange }) => {
  const { libraries, items, members, loans } = useLibrary();
  const totalItems = items.length;
  const totalMembers = members.length;

  const platformStats = {
    totalLibraries: libraries.length,
    totalItems,
    totalMembers,
    totalRevenue: 15750.25,
    activeLoans: loans.filter(l => l.status === 'active').length,
    monthlyGrowth: 12.5
  };

  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      message: 'Database backup delayed by 15 minutes',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      message: `${libraries.filter(l => l.status === 'pending').length} library registration pending approval`,
      time: 'Just now',
      severity: 'low'
    },
    {
      id: '3',
      type: 'error',
      message: 'Payment gateway reported 2 failed transactions',
      time: '6 hours ago',
      severity: 'high'
    }
  ];

  const topLibrariesData = libraries.map(lib => ({
    id: lib.id,
    name: lib.name,
    members: members.filter(m => m.libraryId === lib.id).length,
    items: items.filter(i => i.libraryId === lib.id).length,
    loans: loans.filter(l => l.libraryId === lib.id).length,
    revenue: members.filter(m => m.libraryId === lib.id).reduce((sum, m) => sum + m.outstandingFees, 0)
  })).sort((a, b) => b.members - a.members).slice(0, 3);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600">Monitor and manage the entire ToyLibrary platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => onSectionChange?.('security')}>
            <Shield className="w-4 h-4 mr-2" />
            Security Center
          </Button>
          <Button onClick={() => window.alert('System health check initiated. All systems nominal.')}>
            <Server className="w-4 h-4 mr-2" />
            System Health
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Libraries</p>
              <p className="text-2xl font-bold text-gray-900">{platformStats.totalLibraries}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{platformStats.totalMembers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{platformStats.totalItems}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{platformStats.monthlyGrowth}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
              <Badge variant="danger">{systemAlerts.length}</Badge>
            </div>
            
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityBg(alert.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                    <Badge 
                      variant={alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </div>
          </Card>
        </div>

        {/* Top Performing Libraries */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Libraries</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {topLibrariesData.map((library, index) => (
              <div key={library.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{library.name}</h3>
                  <div className="text-xs text-gray-500 space-x-4">
                    <span>{library.members} members</span>
                    <span>{library.items} items</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">${library.revenue}</div>
                  <div className="text-xs text-gray-500">{library.loans} loans</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="text-sm font-medium text-gray-900">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response Time</span>
              <span className="text-sm font-medium text-gray-900">145ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Performance</span>
              <span className="text-sm font-medium text-green-600">Optimal</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => onSectionChange?.('libraries')}>
              <Building className="w-4 h-4 mr-2" />
              Approve New Libraries
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onSectionChange?.('support')}>
              <Users className="w-4 h-4 mr-2" />
              Manage Support Tickets
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onSectionChange?.('analytics')}>
              <Globe className="w-4 h-4 mr-2" />
              Platform Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onSectionChange?.('security')}>
              <Shield className="w-4 h-4 mr-2" />
              Security Audit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperUserDashboard;