import React, { useState } from 'react';
import { Save, Edit, CreditCard, Bell, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { membershipTiers, loans } = useLibrary();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '456 Oak Street, Sunshine, CA 90210',
    emergencyContact: 'Jane Doe - (555) 987-6543'
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dueReminders: true,
    reservationAlerts: true,
    newsletterUpdates: true,
    promotionalOffers: false
  });

  const membershipTier = membershipTiers.find(tier => tier.id === user?.membershipTierId) || membershipTiers[0];
  
  const userLoans = loans.filter(l => l.borrowerId === user?.id);

  const membershipStats = {
    joinDate: user?.createdAt || '2024-01-15',
    totalLoans: userLoans.length,
    currentLoans: userLoans.filter(l => l.status === 'active').length,
    favoriteItems: 5, // Keep mock for now
    outstandingFees: 0
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'membership', label: 'Membership', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const renderProfileTab = () => (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <Button 
          variant="outline" 
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-600">
              {user?.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          {isEditing && (
            <Button variant="outline">
              Change Photo
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Emergency Contact"
            value={profileData.emergencyContact}
            onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        
        <Input
          label="Address"
          value={profileData.address}
          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          disabled={!isEditing}
        />
      </div>
    </Card>
  );

  const renderMembershipTab = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Membership</h3>
        {membershipTier && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-900">{membershipTier.name}</h4>
              <div className="text-lg font-bold text-blue-900">
                ${membershipTier.price}/{membershipTier.billingInterval === 'monthly' ? 'mo' : 'yr'}
              </div>
            </div>
            <p className="text-sm text-blue-800 mb-3">{membershipTier.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Borrowing Limit:</span>
                <div className="font-medium text-blue-900">{membershipTier.borrowingLimit} items</div>
              </div>
              <div>
                <span className="text-blue-700">Loan Duration:</span>
                <div className="font-medium text-blue-900">{membershipTier.maxLoanDuration} days</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex space-x-3">
          <Button variant="outline">Change Plan</Button>
          <Button variant="outline">Billing History</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{membershipStats.totalLoans}</div>
            <div className="text-sm text-gray-600">Total Loans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{membershipStats.currentLoans}</div>
            <div className="text-sm text-gray-600">Current Loans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{membershipStats.favoriteItems}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${membershipStats.outstandingFees}</div>
            <div className="text-sm text-gray-600">Outstanding</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Member since:</span>
            <span className="font-medium">{new Date(membershipStats.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notificationPreferences).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <p className="text-sm text-gray-600">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'smsNotifications' && 'Receive notifications via SMS'}
                {key === 'dueReminders' && 'Get reminders when items are due'}
                {key === 'reservationAlerts' && 'Alerts when reserved items are available'}
                {key === 'newsletterUpdates' && 'Monthly newsletter with library updates'}
                {key === 'promotionalOffers' && 'Special offers and promotions'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationPreferences({ 
                  ...notificationPreferences, 
                  [key]: e.target.checked 
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Profile Visibility
              </label>
              <p className="text-sm text-gray-600">
                Control who can see your profile information
              </p>
            </div>
            <Select
              options={[
                { value: 'private', label: 'Private' },
                { value: 'library', label: 'Library Only' },
                { value: 'public', label: 'Public' }
              ]}
              value="library"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Activity Sharing
              </label>
              <p className="text-sm text-gray-600">
                Share your borrowing activity with other members
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Delete Account
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Account deletion is permanent and cannot be undone. All your data will be removed.
        </p>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <Badge variant="success">Active Member</Badge>
      </div>

      {/* Tabs */}
      <Card padding={false}>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'membership' && renderMembershipTab()}
      {activeTab === 'notifications' && renderNotificationsTab()}
      {activeTab === 'privacy' && renderPrivacyTab()}
    </div>
  );
};

export default Profile;