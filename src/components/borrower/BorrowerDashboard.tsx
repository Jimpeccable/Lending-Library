import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Heart, 
  Clock, 
  Star,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const BorrowerDashboard: React.FC = () => {
  const { loans, items, reservations } = useLibrary();
  const { user } = useAuth();

  const userLoans = loans.filter(loan => loan.borrowerId === user?.id);
  const userReservations = reservations.filter(res => res.borrowerId === user?.id);
  
  const stats = {
    activeLoans: userLoans.filter(loan => loan.status === 'active').length,
    totalLoans: 12,
    activeReservations: userReservations.filter(res => res.status === 'active').length,
    favorites: 5
  };

  const currentLoans = userLoans.map(loan => {
    const item = items.find(item => item.id === loan.itemId);
    return { ...loan, item };
  }).filter(loan => loan.item);

  const upcomingDue = currentLoans.filter(loan => {
    const dueDate = new Date(loan.dueDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return dueDate <= threeDaysFromNow;
  });

  const recentActivities = [
    {
      id: '1',
      type: 'loan',
      message: 'You borrowed LEGO Creator 3-in-1 Set',
      time: '2 days ago',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'return',
      message: 'You returned Wooden Rainbow Rings',
      time: '1 week ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'reservation',
      message: 'Fisher-Price Smart Chair is ready for pickup',
      time: '1 week ago',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Manage your borrowed items and discover new toys</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            View Favorites
          </Button>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            Browse Items
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeLoans}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeReservations}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLoans}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Loans */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Current Loans</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            {currentLoans.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No active loans</h3>
                <p className="text-gray-600 mt-2">Browse our collection to find your next favorite toy!</p>
                <Button className="mt-4">Browse Items</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentLoans.map((loan) => {
                  const daysUntilDue = Math.ceil((new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
                  
                  return (
                    <div key={loan.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={loan.item!.imageUrls[0]}
                        alt={loan.item!.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{loan.item!.name}</h3>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {isOverdue ? (
                            <Badge variant="danger">Overdue</Badge>
                          ) : isDueSoon ? (
                            <Badge variant="warning">Due Soon</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">
                          Extend
                        </Button>
                        <Button variant="outline" size="sm">
                          Return
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {upcomingDue.length > 0 && (
                <Badge variant="warning">{upcomingDue.length}</Badge>
              )}
            </div>
            
            <div className="space-y-3">
              {upcomingDue.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">All caught up!</p>
                </div>
              ) : (
                upcomingDue.map((loan) => (
                  <div key={loan.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">
                        {loan.item!.name}
                      </p>
                      <p className="text-xs text-yellow-600">
                        Due {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Package className="w-4 h-4 mr-2" />
                Browse New Arrivals
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Manage Favorites
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Reservations
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Loan History
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-1 rounded ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDashboard;