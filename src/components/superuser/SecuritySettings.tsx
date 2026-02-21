import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  AlertOctagon,
  History,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('platform_security_settings');
    return saved ? JSON.parse(saved) : [
      { id: '2fa', label: 'Two-Factor Authentication', desc: 'Require 2FA for all administrative accounts', enabled: true },
      { id: 'ip', label: 'IP Whitelisting', desc: 'Restrict host logins to specific IP ranges', enabled: false },
      { id: 'timeout', label: 'Session Timeout', desc: 'Automatically logout inactive users after 30 minutes', enabled: true },
      { id: 'password', label: 'Password Complexity', desc: 'Enforce strong password requirements for all users', enabled: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('platform_security_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const securityLogs = [
    {
      id: 1,
      event: 'Failed Login Attempt',
      user: 'unknown@example.com',
      ip: '192.168.1.105',
      time: '10 minutes ago',
      severity: 'warning'
    },
    {
      id: 2,
      event: 'Bulk Data Export',
      user: 'host@example.com',
      ip: '45.12.98.33',
      time: '1 hour ago',
      severity: 'medium'
    },
    {
      id: 3,
      event: 'API Key Rotated',
      user: 'System',
      ip: 'Internal',
      time: '3 hours ago',
      severity: 'low'
    },
    {
      id: 4,
      event: 'User Suspension',
      user: 'admin@example.com',
      ip: '12.44.55.12',
      time: '5 hours ago',
      severity: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security & Privacy</h1>
          <p className="text-gray-600">Configure platform security and monitor system logs</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <AlertOctagon className="w-4 h-4 mr-2" />
          Emergency Lockdown
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Platform Access Controls
            </h3>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                    <p className="text-xs text-gray-500">{setting.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${setting.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => window.alert('Security configuration saved successfully!')}>Save Security Configuration</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <History className="w-5 h-5 mr-2 text-orange-600" />
              Recent Security Events
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2 border-b">Event</th>
                    <th className="px-4 py-2 border-b">User / IP</th>
                    <th className="px-4 py-2 border-b">Time</th>
                    <th className="px-4 py-2 border-b text-right">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {securityLogs.map((log) => (
                    <tr key={log.id} className="text-sm">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{log.event}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{log.user}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{log.ip}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{log.time}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          variant={log.severity === 'warning' ? 'danger' : log.severity === 'medium' ? 'warning' : 'neutral'}
                          size="sm"
                        >
                          {log.severity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-blue-600">View Full Audit Trail</Button>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-teal-600" />
              Service Status
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Core API', status: 'Operational', icon: Globe },
                { name: 'Primary DB', status: 'Operational', icon: Database },
                { name: 'Auth Service', status: 'Operational', icon: Lock },
                { name: 'Assets CDN', status: 'Operational', icon: Eye }
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svc.icon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{svc.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span className="text-xs font-medium text-green-600">{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gray-900 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-400" />
              API Management
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Manage external platform integrations and access tokens.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 border-none">
                Generate API Key
              </Button>
              <Button variant="outline" className="w-full text-white border-gray-700 hover:bg-gray-800">
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
