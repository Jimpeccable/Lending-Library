import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const Analytics: React.FC = () => {
  const { libraries, items, members } = useLibrary();

  const metrics = [
    {
      label: 'Total Platform Revenue',
      value: '$158,240',
      change: '+12.5%',
      trend: 'up',
      icon: CreditCard,
      color: 'blue'
    },
    {
      label: 'Active Subscriptions',
      value: libraries.length.toString(),
      change: '+2',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Total Platform Members',
      value: members.length.toString(),
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'teal'
    },
    {
      label: 'Total Items Cataloged',
      value: items.length.toString(),
      change: '+45',
      trend: 'up',
      icon: Package,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">Deep dive into platform-wide performance and growth</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button>
            Download Report
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center text-xs font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 ml-0.5" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Projection</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[40, 60, 45, 70, 85, 65, 90, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-gray-500 mt-2">M{i+1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Library Distribution</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Metropolitan', value: 45, color: 'bg-blue-500' },
              { label: 'Suburban', value: 35, color: 'bg-teal-500' },
              { label: 'Rural', value: 15, color: 'bg-orange-500' },
              { label: 'Other', value: 5, color: 'bg-gray-400' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Libraries</h3>
          <Button variant="ghost" size="sm">Detailed View</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2 border-b">Library Name</th>
                <th className="px-4 py-2 border-b">Growth</th>
                <th className="px-4 py-2 border-b">Utilization</th>
                <th className="px-4 py-2 border-b text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {libraries.map((lib) => (
                <tr key={lib.id} className="text-sm">
                  <td className="px-4 py-3 font-medium text-gray-900">{lib.name}</td>
                  <td className="px-4 py-3 text-green-600">+14.2%</td>
                  <td className="px-4 py-3 text-gray-600">88%</td>
                  <td className="px-4 py-3 text-right font-medium">$4,250.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
