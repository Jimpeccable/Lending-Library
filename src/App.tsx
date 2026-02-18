import React, { useState } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { ToastProvider } from './context/ToastContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import HostDashboard from './components/host/HostDashboard';
import InventoryManagement from './components/host/InventoryManagement';
import MemberManagement from './components/host/MemberManagement';
import LoanManagement from './components/host/LoanManagement';
import Reports from './components/host/Reports';
import Financials from './components/host/Financials';
import Messages from './components/host/Messages';
import Settings from './components/host/Settings';
import BorrowerDashboard from './components/borrower/BorrowerDashboard';
import ItemBrowser from './components/borrower/ItemBrowser';
import MyLoans from './components/borrower/MyLoans';
import Favorites from './components/borrower/Favorites';
import { Reservations } from './components/borrower/Reservations';
import Profile from './components/borrower/Profile';
import SuperUserDashboard from './components/superuser/SuperUserDashboard';
import { Package } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">ToyLibrary</h1>
              <p className="text-sm text-gray-600">Share. Play. Grow.</p>
            </div>
          </div>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    if (user.role === 'host') {
      switch (activeSection) {
        case 'dashboard':
          return <HostDashboard />;
        case 'inventory':
          return <InventoryManagement />;
        case 'members':
          return <MemberManagement />;
        case 'loans':
          return <LoanManagement />;
        case 'reports':
          return <Reports />;
        case 'financials':
          return <Financials />;
        case 'messages':
          return <Messages />;
        case 'settings':
          return <Settings />;
        default:
          return <HostDashboard />;
      }
    } else if (user.role === 'borrower') {
      switch (activeSection) {
        case 'dashboard':
          return <BorrowerDashboard />;
        case 'browse':
          return <ItemBrowser />;
        case 'my-loans':
          return <MyLoans />;
        case 'favorites':
          return <Favorites />;
        case 'reservations':
          return <Reservations />;
        case 'messages':
          return <Messages />;
        case 'profile':
          return <Profile />;
        default:
          return <BorrowerDashboard />;
      }
    } else if (user.role === 'super-user') {
      return <SuperUserDashboard />;
    }
    
    return <div>Unknown user role</div>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LibraryProvider>
          <MainApp />
        </LibraryProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;