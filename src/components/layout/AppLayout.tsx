import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plane, LayoutDashboard, Database, LineChart, History, Settings } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useDataStore();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/collect', label: 'Collect Data', icon: <Database size={20} /> },
    { path: '/predict', label: 'Prediction', icon: <LineChart size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className={`min-h-screen flex flex-col ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${settings.darkMode ? 'bg-gray-800' : 'bg-blue-600'} p-4 shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="text-blue-400" size={24} />
            <h1 className="text-xl font-bold">Aviator Predictor</h1>
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar navigation */}
        <aside className={`w-64 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hidden md:block`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? settings.darkMode 
                          ? 'bg-blue-700 text-white' 
                          : 'bg-blue-100 text-blue-700'
                        : settings.darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Mobile navigation */}
        <div className={`fixed bottom-0 left-0 right-0 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-up md:hidden z-10`}>
          <div className="flex justify-around items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`p-3 flex flex-col items-center gap-1 ${
                  location.pathname === item.path
                    ? settings.darkMode 
                      ? 'text-blue-400' 
                      : 'text-blue-600'
                    : settings.darkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-16 md:pb-6 overflow-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};