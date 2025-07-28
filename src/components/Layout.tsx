import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Settings, 
  FileText, 
  Users, 
  Package, 
  TrendingUp,
  Plane,
  Zap
} from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'لوحة التحكم' },
    { path: '/live-tracking', icon: MapPin, label: 'المتابعة الحية' },
    { path: '/maintenance', icon: Settings, label: 'الصيانة الدورية' },
    { path: '/predictive', icon: TrendingUp, label: 'نظام التنبؤات' },
    { path: '/scheduling', icon: Users, label: 'جدولة الفنيين' },
    { path: '/inventory', icon: Package, label: 'مخزون قطع الغيار' },
    { path: '/reports', icon: FileText, label: 'التقرير الفني' }
  ];

  return (
    <div className="min-h-screen bg-primary text-primary flex">
      {/* Sidebar */}
      <div className="w-64 bg-secondary border-l border-gray-700/30 flex flex-col backdrop-blur-xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center glow-cyan">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-highlight">راصد</h1>
              <p className="text-sm text-secondary">منصة صيانة الطائرات الذكية</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center glow-blue">
              <span className="text-sm font-bold">أح</span>
            </div>
            <div>
              <p className="font-medium text-primary">حسين اليافعي</p>
              <p className="text-xs text-secondary">مشرف صيانة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;