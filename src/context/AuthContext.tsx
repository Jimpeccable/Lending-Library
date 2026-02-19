import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, fullName: string, role: 'host' | 'borrower') => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'host@example.com',
    fullName: 'Library Host',
    role: 'host',
    status: 'active',
    libraryId: 'lib1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'borrower@example.com',
    fullName: 'John Borrower',
    role: 'borrower',
    status: 'active',
    libraryId: 'lib1',
    membershipTierId: 'tier1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'admin@example.com',
    fullName: 'Super Administrator',
    role: 'super-user',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage or use mockUsers
    const storedAllUsers = localStorage.getItem('all_users');
    if (storedAllUsers) {
      setAllUsers(JSON.parse(storedAllUsers));
    } else {
      setAllUsers(mockUsers);
      localStorage.setItem('all_users', JSON.stringify(mockUsers));
    }

    // Simulate auth check on app start
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, we accept any password if user exists
    const user = allUsers.find(u => u.email === email);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
  };

  const register = async (email: string, password: string, fullName: string, role: 'host' | 'borrower') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email already exists
    if (allUsers.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    // Simulate registration
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
      status: 'active',
      libraryId: role === 'host' ? `lib-${Date.now()}` : 'lib1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true
    });
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, status, updatedAt: new Date().toISOString() } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));

    // If current user is updated, update authState too
    if (authState.user?.id === userId) {
      const updatedUser = { ...authState.user, status, updatedAt: new Date().toISOString() };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register, updateUserStatus, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};