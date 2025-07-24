import React, { useState } from 'react';
import { Send, Search, Filter, Mail, MessageSquare, Bell, Users } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: '1',
      member: 'John Borrower',
      lastMessage: 'Thank you for the reminder about the due date!',
      timestamp: '2 hours ago',
      unread: 0,
      status: 'active'
    },
    {
      id: '2',
      member: 'Sarah Johnson',
      lastMessage: 'Is it possible to extend my loan for the wooden blocks?',
      timestamp: '1 day ago',
      unread: 2,
      status: 'pending'
    },
    {
      id: '3',
      member: 'Mike Wilson',
      lastMessage: 'I accidentally damaged the toy car. What should I do?',
      timestamp: '2 days ago',
      unread: 1,
      status: 'urgent'
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'John Borrower',
      content: 'Hi! I wanted to ask about extending my loan for the LEGO set.',
      timestamp: '10:30 AM',
      isFromMember: true
    },
    {
      id: '2',
      sender: 'Library Host',
      content: 'Hello John! I can extend your loan for another week. Would that work for you?',
      timestamp: '10:45 AM',
      isFromMember: false
    },
    {
      id: '3',
      sender: 'John Borrower',
      content: 'That would be perfect! Thank you so much.',
      timestamp: '11:00 AM',
      isFromMember: true
    },
    {
      id: '4',
      sender: 'Library Host',
      content: 'Great! I\'ve updated your due date. You\'ll receive a confirmation email shortly.',
      timestamp: '11:05 AM',
      isFromMember: false
    },
    {
      id: '5',
      sender: 'John Borrower',
      content: 'Thank you for the reminder about the due date!',
      timestamp: '2:15 PM',
      isFromMember: true
    }
  ];

  const templates = [
    {
      id: '1',
      name: 'Overdue Reminder',
      subject: 'Friendly Reminder: Item Due Soon',
      content: 'Hi {member_name}, this is a friendly reminder that your borrowed item "{item_name}" is due on {due_date}. Please return it at your earliest convenience.'
    },
    {
      id: '2',
      name: 'Welcome Message',
      subject: 'Welcome to Our Toy Library!',
      content: 'Welcome {member_name}! We\'re excited to have you as part of our community. Here\'s everything you need to know to get started...'
    },
    {
      id: '3',
      name: 'Item Ready for Pickup',
      subject: 'Your Reserved Item is Ready!',
      content: 'Great news {member_name}! The item "{item_name}" you reserved is now available for pickup. Please collect it within 48 hours.'
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'border-l-red-500';
      case 'pending':
        return 'border-l-yellow-500';
      case 'active':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages & Communication</h1>
          <p className="text-gray-600">Communicate with members and manage notifications</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setIsComposeModalOpen(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {conversations.reduce((sum, conv) => sum + conv.unread, 0)}
            </div>
            <div className="text-sm text-gray-600">Unread Messages</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{conversations.length}</div>
            <div className="text-sm text-gray-600">Active Conversations</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {conversations.filter(conv => conv.status === 'urgent').length}
            </div>
            <div className="text-sm text-gray-600">Urgent Messages</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Message Templates</div>
          </div>
        </Card>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full text-left p-3 rounded-lg border-l-4 transition-colors ${
                    selectedConversation === conversation.id 
                      ? 'bg-blue-50 border-l-blue-500' 
                      : `bg-gray-50 hover:bg-gray-100 ${getStatusColor(conversation.status)}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{conversation.member}</span>
                    {conversation.unread > 0 && (
                      <Badge variant="primary" size="sm">{conversation.unread}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">{conversation.timestamp}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <div className="flex flex-col h-96">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">JB</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">John Borrower</h3>
                    <p className="text-sm text-gray-500">Active member</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromMember ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromMember
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isFromMember ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Message Templates */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Message Templates</h2>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Template
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-3">{template.content}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button size="sm" className="flex-1">Use</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        title="Compose Message"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Recipient"
            options={[
              { value: 'all', label: 'All Members' },
              { value: 'active', label: 'Active Members Only' },
              { value: 'overdue', label: 'Members with Overdue Items' },
              { value: 'individual', label: 'Select Individual Member' }
            ]}
            placeholder="Choose recipients..."
          />
          
          <Input
            label="Subject"
            placeholder="Message subject..."
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={6}
              placeholder="Type your message here..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsComposeModalOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messages;