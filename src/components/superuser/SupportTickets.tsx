import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Reply
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-1024',
      subject: 'Unable to process membership payment',
      sender: 'John Borrower',
      role: 'borrower',
      priority: 'high',
      status: 'open',
      timestamp: '2 hours ago',
      lastMessage: 'I tried multiple cards but keep getting a generic error message...'
    },
    {
      id: 'TKT-1023',
      subject: 'New library registration inquiry',
      sender: 'Sarah Greenfield',
      role: 'guest',
      priority: 'medium',
      status: 'in-progress',
      timestamp: '5 hours ago',
      lastMessage: 'Is there a limit to how many items we can start with?'
    },
    {
      id: 'TKT-1022',
      subject: 'Incorrect loan due date',
      sender: 'Library Host',
      role: 'host',
      priority: 'low',
      status: 'closed',
      timestamp: '1 day ago',
      lastMessage: 'Thank you for fixing the system configuration.'
    }
  ]);

  const updateTicketStatus = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="success">Low</Badge>;
      default:
        return <Badge variant="neutral">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="danger" outline>Open</Badge>;
      case 'in-progress':
        return <Badge variant="warning" outline>In Progress</Badge>;
      case 'closed':
        return <Badge variant="success" outline>Closed</Badge>;
      default:
        return <Badge variant="neutral" outline>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Help users and resolve platform-wide issues</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Resolve All
          </Button>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            New Update
          </Button>
        </div>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center space-x-4 p-4 border-l-4 border-red-500">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Unassigned</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 p-4 border-l-4 border-yellow-500">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 p-4 border-l-4 border-green-500">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Resolved (24h)</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, sender, or subject..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono font-bold text-blue-600">{ticket.id}</span>
                  <h3 className="text-sm font-semibold text-gray-900">{ticket.subject}</h3>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{ticket.timestamp}</span>
                  {getStatusBadge(ticket.status)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    <span>{ticket.sender}</span>
                    <span className="text-gray-300">•</span>
                    <span className="capitalize">{ticket.role}</span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                  {ticket.status !== 'closed' && (
                    <button
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                      title="Close Ticket"
                      onClick={() => updateTicketStatus(ticket.id, 'closed')}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Reply"
                    onClick={() => window.alert(`Replying to ${ticket.id}...`)}
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500 line-clamp-1 italic">
                "{ticket.lastMessage}"
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <Button variant="ghost" className="text-sm text-gray-600">
            View All Tickets
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SupportTickets;
