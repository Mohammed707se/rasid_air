import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Plane, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Download,
  Camera,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Wrench,
  Activity,
  Gauge,
  Fuel,
  Battery,
  Navigation,
  Radio,
  Users,
  Wind
} from 'lucide-react';
import { aircraftData } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const AircraftDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const aircraft = aircraftData.find(a => a.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!aircraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">الطائرة غير موجودة</h1>
          <Link to="/" className="btn-primary">
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  const systemsStatus = [
    { 
      name: 'أنظمة الطيران', 
      status: 'سليم', 
      icon: Plane, 
      color: '#10b981',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      percentage: 98
    },
    { 
      name: 'نظام الوقود', 
      status: 'تنبيه', 
      icon: Fuel, 
      color: '#f59e0b',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      percentage: 75
    },
    { 
      name: 'الأنظمة الكهربائية', 
      status: 'سليم', 
      icon: Battery, 
      color: '#10b981',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      percentage: 94
    },
    { 
      name: 'أنظمة السلامة', 
      status: 'سليم', 
      icon: Shield, 
      color: '#10b981',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      percentage: 96
    },
    { 
      name: 'أنظمة الملاحة', 
      status: 'سليم', 
      icon: Navigation, 
      color: '#10b981',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      percentage: 92
    },
    { 
      name: 'أنظمة الاتصال', 
      status: 'سليم', 
      icon: Radio, 
      color: '#10b981',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      percentage: 89
    }
  ];

  const operationalData = [
    { label: 'ساعات الطيران الإجمالية', value: '12,450 ساعة', icon: Clock },
    { label: 'عدد الرحلات', value: '3,280 رحلة', icon: Plane },
    { label: 'آخر فحص دوري', value: '20 يناير 2024', icon: Calendar },
    { label: 'الفحص القادم', value: '25 فبراير 2024', icon: AlertTriangle },
    { label: 'معدل الاستخدام', value: '85%', icon: Activity },
    { label: 'كفاءة الوقود', value: '92%', icon: Fuel }
  ];

  const maintenanceHistory = [
    { id: '1', date: '2024-01-20', type: 'فحص دوري شامل', technician: 'أحمد محمد', status: 'مكتمل', notes: 'جميع الأنظمة تعمل بشكل طبيعي' },
    { id: '2', date: '2024-01-15', type: 'صيانة المحرك', technician: 'فاطمة علي', status: 'مكتمل', notes: 'استبدال مرشح الهواء' },
    { id: '3', date: '2024-01-10', type: 'فحص النظام الكهربائي', technician: 'محمد السعد', status: 'مكتمل', notes: 'إصلاح أسلاك طفيفة' },
    { id: '4', date: '2024-01-05', type: 'فحص الهيكل الخارجي', technician: 'نورا أحمد', status: 'مكتمل', notes: 'لا توجد مشاكل' }
  ];

  const currentAlerts = [
    { id: '1', severity: 'medium', message: 'تسرب طفيف في نظام الوقود', time: '2 ساعات', icon: Fuel },
    { id: '2', severity: 'low', message: 'حاجة لصيانة دورية قريباً', time: '1 يوم', icon: Wrench }
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Plane },
    { id: 'history', label: 'سجل الصيانة', icon: FileText },
    { id: 'alerts', label: 'التنبيهات', icon: AlertTriangle },
    { id: 'manual', label: 'دليل الصيانة', icon: Download }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'سليم':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'تنبيه':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'خلل':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-tajawal">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-[#00CFFF] transition-colors p-2 rounded-lg hover:bg-gray-700/50"
          >
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#00CFFF] mb-1">{aircraft.number}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{aircraft.model}</span>
              <span>•</span>
              <span>{aircraft.airline}</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(aircraft.status)}
                <StatusBadge status={aircraft.status} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panoramic Aircraft Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={aircraft.image}
          alt={aircraft.model}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-card p-4 border border-gray-600/30">
            <h2 className="text-xl font-bold text-[#00CFFF] mb-2">{aircraft.model}</h2>
            <p className="text-gray-300">طائرة تجارية حديثة مجهزة بأحدث التقنيات</p>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link 
            to="/maintenance" 
            className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 group"
          >
            <Camera className="h-8 w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-white">بدء فحص بصري</span>
          </Link>
          
          <button className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 border border-green-500/30 hover:border-green-400/50 group">
            <Eye className="h-8 w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-white">عرض التنبيهات</span>
          </button>
          
          <button className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 group">
            <Download className="h-8 w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-white">تحميل السجلات</span>
          </button>
          
          <Link 
            to={`/maintenance/${aircraft.id}`} 
            className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 border border-red-500/30 hover:border-red-400/50 group"
          >
            <Settings className="h-8 w-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-white">بدء صيانة فورية</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Aircraft Information Card */}
          <div className="glass-card p-6 border border-gray-600/30">
            <div className="flex items-center gap-3 mb-6">
              <Plane className="h-6 w-6 text-[#00CFFF]" />
              <h3 className="text-xl font-bold text-[#00CFFF]">معلومات الطائرة</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  رقم التسجيل
                </span>
                <span className="font-bold text-[#00CFFF]">{aircraft.number}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  الطراز
                </span>
                <span className="font-medium text-white">{aircraft.model}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  شركة الطيران
                </span>
                <span className="font-medium text-white">{aircraft.airline}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  آخر فحص
                </span>
                <span className="font-medium text-white">
                  {new Date(aircraft.lastInspection).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>

          {/* Operational Data Card */}
          <div className="glass-card p-6 border border-gray-600/30">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-[#00CFFF]" />
              <h3 className="text-xl font-bold text-[#00CFFF]">بيانات التشغيل</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {operationalData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <Icon className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="font-bold text-white text-sm">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Status Card */}
          <div className="glass-card p-6 border border-gray-600/30">
            <div className="flex items-center gap-3 mb-6">
              <Gauge className="h-6 w-6 text-[#00CFFF]" />
              <h3 className="text-xl font-bold text-[#00CFFF]">الحالة الحالية</h3>
            </div>
            
            <div className="space-y-3">
              {systemsStatus.slice(0, 4).map((system, index) => {
                const Icon = system.icon;
                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${system.borderColor} ${system.bgColor} transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: system.color }} />
                        <span className="text-sm font-medium text-white">{system.name}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: system.color }}>
                        {system.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${system.percentage}%`,
                          backgroundColor: system.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Systems Status Grid */}
        <div className="mt-6 max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-[#00CFFF] mb-6 text-center">حالة الأنظمة التفصيلية</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {systemsStatus.map((system, index) => {
              const Icon = system.icon;
              return (
                <div 
                  key={index} 
                  className={`glass-card p-6 border ${system.borderColor} ${system.bgColor} hover:scale-105 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" style={{ color: system.color }} />
                    <h4 className="font-bold text-white">{system.name}</h4>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm" style={{ color: system.color }}>{system.status}</span>
                    <span className="text-lg font-bold" style={{ color: system.color }}>
                      {system.percentage}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${system.percentage}%`,
                        backgroundColor: system.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="flex gap-2 mb-6 border-b border-gray-700/50 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#00CFFF] border-b-2 border-[#00CFFF] bg-blue-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="glass-card p-6 border border-gray-600/30">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-[#00CFFF] mb-4">ملخص الحالة</h4>
                  <div className="space-y-3">
                    {systemsStatus.slice(0, 4).map((system, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-white">{system.name}</span>
                        <span className="font-medium" style={{ color: system.color }}>
                          {system.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-[#00CFFF] mb-4">إحصائيات التشغيل</h4>
                  <div className="space-y-3">
                    {operationalData.slice(0, 4).map((item, index) => (
                      <div key={index} className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-400">{item.label}:</span>
                        <span className="font-bold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h4 className="text-lg font-bold text-[#00CFFF] mb-4">سجل الصيانة</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="text-right p-4 font-medium text-gray-300">التاريخ</th>
                        <th className="text-right p-4 font-medium text-gray-300">نوع الصيانة</th>
                        <th className="text-right p-4 font-medium text-gray-300">الفني</th>
                        <th className="text-right p-4 font-medium text-gray-300">الحالة</th>
                        <th className="text-right p-4 font-medium text-gray-300">الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenanceHistory.map((record) => (
                        <tr key={record.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                          <td className="p-4 text-white">{new Date(record.date).toLocaleDateString('ar-SA')}</td>
                          <td className="p-4 font-medium text-white">{record.type}</td>
                          <td className="p-4 text-gray-400">{record.technician}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                              {record.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400">{record.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div>
                <h4 className="text-lg font-bold text-[#00CFFF] mb-4">التنبيهات الحالية</h4>
                {currentAlerts.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                    <p>لا توجد تنبيهات حالياً</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentAlerts.map((alert) => {
                      const Icon = alert.icon;
                      return (
                        <div
                          key={alert.id}
                          className={`border rounded-lg p-4 ${
                            alert.severity === 'high' ? 'border-red-500/50 bg-red-500/10' :
                            alert.severity === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                            'border-blue-500/50 bg-blue-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-5 w-5 ${
                                alert.severity === 'high' ? 'text-red-400' :
                                alert.severity === 'medium' ? 'text-yellow-400' :
                                'text-blue-400'
                              }`} />
                              <span className="font-medium text-white">{alert.message}</span>
                            </div>
                            <span className="text-sm text-gray-400">منذ {alert.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manual' && (
              <div>
                <h4 className="text-lg font-bold text-[#00CFFF] mb-4">دليل الصيانة - {aircraft.model}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'دليل الصيانة العام',
                    'مخططات الأسلاك',
                    'دليل قطع الغيار',
                    'إرشادات السلامة',
                    'دليل استكشاف الأخطاء',
                    'دليل الفحص الدوري'
                  ].map((manual, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <span className="flex-1 text-white">{manual}</span>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftDetail;