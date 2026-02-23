import React from 'react';
import {
  Database,
  Lock,
  Cloud,
  ShieldCheck,
  Zap,
  Server,
  Code,
  Globe
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const FutureRequirements: React.FC = () => {
  const sections = [
    {
      title: 'Database Migration',
      icon: Database,
      items: [
        { name: 'MongoDB Integration', status: 'ready', description: 'Replace localStorage with MongoDB Atlas. Requires setting up a Node.js/Express backend with Mongoose.' },
        { name: 'Supabase Support', status: 'ready', description: 'Alternative PostgreSQL option. Use Supabase client for real-time updates and built-in Auth.' },
        { name: 'Data Schema Validation', status: 'planned', description: 'Implement Zod or Joi schemas for all models (Items, Users, Loans) before migration.' }
      ]
    },
    {
      title: 'Authentication & Security',
      icon: Lock,
      items: [
        { name: 'JWT Implementation', status: 'required', description: 'Move from client-side session management to secure JWT tokens with HttpOnly cookies.' },
        { name: 'OAuth2 Social Login', status: 'planned', description: 'Add Google and Facebook login capabilities via Firebase Auth or Supabase Auth.' },
        { name: 'RBAC Enhancements', status: 'ready', description: 'Move role checks to middleware level on the server side.' }
      ]
    },
    {
      title: 'Infrastructure & DevOps',
      icon: Cloud,
      items: [
        { name: 'Vercel/Netlify Deployment', status: 'ready', description: 'Configure CI/CD pipelines for automatic frontend deployment.' },
        { name: 'AWS S3 Asset Storage', status: 'required', description: 'Migrate toy images from local paths to a cloud storage provider.' },
        { name: 'Environment Config', status: 'ready', description: 'Set up .env variables for API endpoints and keys.' }
      ]
    },
    {
      title: 'Feature Roadmap',
      icon: Zap,
      items: [
        { name: 'Real-time Notifications', status: 'planned', description: 'Implement WebSockets (Socket.io) for instant messaging and overdue alerts.' },
        { name: 'Multi-Library Global Search', status: 'planned', description: 'Allow users to search for toys across multiple nearby libraries.' },
        { name: 'Payment Gateway', status: 'planned', description: 'Integrate Stripe for membership fees and late payment processing.' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Future Requirements</h1>
          <p className="text-gray-600">Technical roadmap for production scaling and database integration</p>
        </div>
        <Badge variant="primary" className="w-fit">v1.0 Roadmap</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <Card key={idx} title={
              <div className="flex items-center space-x-2">
                <Icon className="w-5 h-5 text-blue-600" />
                <span>{section.title}</span>
              </div>
            }>
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-l-2 border-gray-100 pl-4 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <Badge
                        variant={
                          item.status === 'ready' ? 'success' :
                          item.status === 'planned' ? 'primary' : 'warning'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-600 text-white border-none">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Ready for Scale</h3>
            <p className="text-blue-100 max-w-2xl">
              The application architecture has been designed with clean separation between the UI and data layer.
              To connect to a production database, you simply need to implement the API service layer following
              the patterns established in <code>LibraryContext.tsx</code> and <code>AuthContext.tsx</code>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                <Server className="w-4 h-4" />
                <span>Node.js Backend Ready</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                <Code className="w-4 h-4" />
                <span>TypeScript Interface Match</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                <Globe className="w-4 h-4" />
                <span>CORS Configured</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FutureRequirements;
