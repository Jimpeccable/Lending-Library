import React, { useState } from 'react';
import { Save, Upload, Bell, CreditCard, Users, Shield, Globe } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';

const Settings: React.FC = () => {
  const { librarySettings, updateSettings } = useLibrary();
  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState(librarySettings);

  const [notificationSettings, setNotificationSettings] = useState({
    emailReminders: true,
    smsReminders: false,
    overdueNotifications: true,
    reservationAlerts: true,
    paymentReminders: true,
    membershipExpiry: true
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const handleSaveSettings = () => {
    updateSettings(localSettings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Library Name"
              value={localSettings.name}
              onChange={(e) => setLocalSettings({ ...localSettings, name: e.target.value })}
            />
            <Input
              label="Website"
              value={localSettings.website}
              onChange={(e) => setLocalSettings({ ...localSettings, website: e.target.value })}
            />
          </div>
          
          <Input
            label="Description"
            value={localSettings.description}
            onChange={(e) => setLocalSettings({ ...localSettings, description: e.target.value })}
          />
          
          <Input
            label="Address"
            value={localSettings.address}
            onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={localSettings.contactEmail}
              onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={localSettings.contactPhone}
              onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
            />
          </div>
          
          <Input
            label="Operating Hours"
            value={localSettings.hours}
            onChange={(e) => setLocalSettings({ ...localSettings, hours: e.target.value })}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Library Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                value="#3B82F6"
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <input
                type="color"
                value="#14B8A6"
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <p className="text-sm text-gray-600">
                {key === 'emailReminders' && 'Send email reminders for due dates and overdue items'}
                {key === 'smsReminders' && 'Send SMS notifications for urgent reminders'}
                {key === 'overdueNotifications' && 'Notify when items become overdue'}
                {key === 'reservationAlerts' && 'Alert when reserved items become available'}
                {key === 'paymentReminders' && 'Send payment due reminders'}
                {key === 'membershipExpiry' && 'Notify before membership expires'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
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

  const renderPolicySettings = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Policies</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Default Loan Duration (days)"
            type="number"
            value={localSettings.maxLoanDuration}
            onChange={(e) => setLocalSettings({ ...localSettings, maxLoanDuration: parseInt(e.target.value) })}
          />
          <Input
            label="Maximum Renewals"
            type="number"
            value={localSettings.maxRenewals}
            onChange={(e) => setLocalSettings({ ...localSettings, maxRenewals: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Late Fee per Day ($)"
            type="number"
            step="0.01"
            value={localSettings.lateFeePerDay}
            onChange={(e) => setLocalSettings({ ...localSettings, lateFeePerDay: parseFloat(e.target.value) })}
          />
          <Input
            label="Reservation Hold Period (days)"
            type="number"
            value={localSettings.reservationHoldDays}
            onChange={(e) => setLocalSettings({ ...localSettings, reservationHoldDays: parseInt(e.target.value) })}
          />
        </div>
        
        <Select
          label="Replacement Fee Policy"
          value="full_value"
          options={[
            { value: 'full_value', label: 'Full Replacement Value' },
            { value: 'depreciated', label: 'Depreciated Value' },
            { value: 'fixed_rate', label: 'Fixed Rate' }
          ]}
        />
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">
              Membership Required
            </label>
            <p className="text-sm text-gray-600">
              Require active membership to borrow items
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.membershipRequired}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                membershipRequired: e.target.checked 
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </Card>
  );

  const renderTeamSettings = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage team members and their permissions</p>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">LH</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Library Host</h4>
                <p className="text-sm text-gray-600">host@example.com</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">Owner</span>
              <p className="text-sm text-gray-500">All permissions</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center py-8">
          No additional team members yet. Invite team members to help manage your library.
        </p>
      </div>
    </Card>
  );

  const renderBillingSettings = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payments</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Payment Methods</h4>
            <p className="text-sm text-gray-600 mb-3">Configure how members can pay</p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Credit/Debit Cards</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">PayPal</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Bank Transfer</span>
              </label>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Currency Settings</h4>
            <p className="text-sm text-gray-600 mb-3">Set your default currency</p>
            <Select
              options={[
                { value: 'USD', label: 'USD - US Dollar' },
                { value: 'EUR', label: 'EUR - Euro' },
                { value: 'GBP', label: 'GBP - British Pound' },
                { value: 'CAD', label: 'CAD - Canadian Dollar' }
              ]}
              value="USD"
            />
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Tax Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              placeholder="8.25"
            />
            <Input
              label="Tax ID/Number"
              placeholder="Enter tax identification number"
            />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'policies':
        return renderPolicySettings();
      case 'team':
        return renderTeamSettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Settings</h1>
          <p className="text-gray-600">Configure your library preferences and policies</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
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
      {renderTabContent()}
    </div>
  );
};

export default Settings;