import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'host@example.com', role: 'Library Host', color: 'bg-blue-50 border-blue-200' },
    { email: 'borrower@example.com', role: 'Borrower', color: 'bg-teal-50 border-teal-200' },
    { email: 'admin@example.com', role: 'Super User', color: 'bg-orange-50 border-orange-200' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </Card>

      {/* Demo Accounts */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Demo Accounts</h3>
          <p className="text-sm text-gray-600">
            Try the platform with these demo accounts (password: demo123)
          </p>
          
          <div className="grid gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => setFormData({ email: account.email, password: 'demo123' })}
                className={`text-left p-3 rounded-lg border transition-colors ${account.color} hover:opacity-80`}
              >
                <div className="font-medium text-gray-900">{account.role}</div>
                <div className="text-sm text-gray-600">{account.email}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;