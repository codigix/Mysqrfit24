import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/admin-app/hooks/useAuth';
import { Button } from '@/components/ui/button';
import PropertiesManagement from '@/admin-app/components/admin/PropertiesManagement';
import LocationsManagement from '@/admin-app/components/admin/LocationsManagement';
import ImagesManagement from '@/admin-app/components/admin/ImagesManagement';
import UsersManagement from '@/admin-app/components/admin/UsersManagement';
import BlogManagement from '@/admin-app/components/admin/BlogManagement';
import SettingsManagement from '@/admin-app/components/admin/SettingsManagement';
import InquiriesManagement from '@/admin-app/components/admin/InquiriesManagement';
import { LogOut, Home, MapPin, Image, Users, BookOpen, Settings, MessageSquare, Menu, X, Building2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">MySqrfit</h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.email || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <nav className="bg-slate-900 text-white h-[calc(100vh-70px)] overflow-y-auto p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeTab === 'properties' && <PropertiesManagement />}
              {activeTab === 'locations' && <LocationsManagement />}
              {activeTab === 'images' && <ImagesManagement />}
              {activeTab === 'users' && <UsersManagement />}
              {activeTab === 'blog' && <BlogManagement />}
              {activeTab === 'inquiries' && <InquiriesManagement />}
              {activeTab === 'settings' && <SettingsManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
