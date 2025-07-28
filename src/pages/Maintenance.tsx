import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, AlertTriangle, CheckCircle, Settings, Search } from 'lucide-react';
import { aircraftData, techniciansData } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const Maintenance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'سليم' | 'تنبيه' | 'عطل'>('all');

  // جدولة الصيانة للطائرات
  const maintenanceSchedule = [
    { aircraftId: '1', nextMaintenance: '2024-02-15', type: 'فحص دوري شامل', technicianId: '1', priority: 'medium' },
    { aircraftId: '2', nextMaintenance: '2024-02-10', type: 'صيانة المحرك', technicianId: '2', priority: 'high' },
    { aircraftId: '3', nextMaintenance: '2024-02-05', type: 'إصلاح عطل', technicianId: '3', priority: 'high' },
    { aircraftId: '4', nextMaintenance: '2024-02-20', type: 'فحص دوري', technicianId: '1', priority: 'low' },
    { aircraftId: '5', nextMaintenance: '2024-02-08', type: 'صيانة وقائية', technicianId: '4', priority: 'medium' },
    { aircraftId: '6', nextMaintenance: '2024-02-25', type: 'فحص دوري', technicianId: '5', priority: 'low' },
    { aircraftId: '7', nextMaintenance: '2024-02-03', type: 'إصلاح عاجل', technicianId: '2', priority: 'high' },
    { aircraftId: '8', nextMaintenance: '2024-02-18', type: 'فحص دوري', technicianId: '6', priority: 'medium' }
  ];

  const getTechnicianName = (id: string) => {
    return techniciansData.find(t => t.id === id)?.name || 'غير محدد';
  };

  const getAircraftData = (id: string) => {
    return aircraftData.find(a => a.id === id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500';
      default: return 'text-gray-400 bg-gray-800 border-gray-600';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'عادية';
    }
  };

  const filteredAircraft = aircraftData.filter(aircraft => {
    const matchesSearch = aircraft.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || aircraft.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getMaintenanceInfo = (aircraftId: string) => {
    return maintenanceSchedule.find(m => m.aircraftId === aircraftId);
  };

  const urgentMaintenance = maintenanceSchedule.filter(m => {
    const maintenanceDate = new Date(m.nextMaintenance);
    const today = new Date();
    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">الصيانة الدورية</h1>
        <p className="text-gray-400">إدارة وجدولة صيانة الطائرات</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">إجمالي الطائرات</p>
              <p className="text-2xl font-bold text-blue-400">{aircraftData.length}</p>
            </div>
            <Settings className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">صيانة عاجلة</p>
              <p className="text-2xl font-bold text-red-400">{urgentMaintenance.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">قيد الصيانة</p>
              <p className="text-2xl font-bold text-yellow-400">3</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">مكتملة اليوم</p>
              <p className="text-2xl font-bold text-green-400">5</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* أدوات التحكم */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن طائرة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="سليم">سليم</option>
            <option value="تنبيه">تنبيه</option>
            <option value="عطل">عطل</option>
          </select>
        </div>
      </div>


      {/* شبكة الطائرات */}
      <div className="grid grid-cols-4 gap-6">
        {filteredAircraft.map((aircraft) => {
          const maintenanceInfo = getMaintenanceInfo(aircraft.id);
          const maintenanceDate = maintenanceInfo ? new Date(maintenanceInfo.nextMaintenance) : null;
          const today = new Date();
          const diffDays = maintenanceDate ? Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
          const isOverdue = diffDays !== null && diffDays <= 0;
          
          return (
            <div key={aircraft.id} className={`aircraft-card ${isOverdue ? 'border-red-500 border-2 shadow-red-500/50' : ''}`}>
              <img
                src={aircraft.image}
                alt={aircraft.model}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{aircraft.number}</h3>
                  <StatusBadge status={aircraft.status} size="sm" />
                </div>
                
                <p className="text-sm text-gray-400">{aircraft.model}</p>
                <p className="text-sm text-gray-400">{aircraft.airline}</p>
                
                {maintenanceInfo && (
                  <div className="space-y-2">
                    <div className={`border rounded p-2 ${getPriorityColor(maintenanceInfo.priority)}`}>
                      <p className="text-xs font-medium">{maintenanceInfo.type}</p>
                      <p className="text-xs">
                        {diffDays !== null && diffDays <= 0 ? 'متأخرة' : 
                         diffDays !== null ? `خلال ${diffDays} أيام` : 'غير محدد'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <User className="h-3 w-3" />
                      <span>{getTechnicianName(maintenanceInfo.technicianId)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{maintenanceDate?.toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                )}
                
                <Link
                  to={`/maintenance/${aircraft.id}`}
                  className="block w-full text-center btn-primary mt-3"
                >
                  بدء الصيانة
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Maintenance;