import React, { useState } from 'react';
import { Calendar, User, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { techniciansData, aircraftData } from '../data/mockData';

const Scheduling: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-25');
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  const scheduleData = {
    '2024-01-25': [
      { id: '1', technicianId: '1', aircraftId: '1', task: 'فحص دوري شامل', time: '08:00', duration: 4, status: 'scheduled' },
      { id: '2', technicianId: '2', aircraftId: '3', task: 'إصلاح عطل المحرك', time: '09:00', duration: 6, status: 'in-progress' },
      { id: '3', technicianId: '3', aircraftId: '2', task: 'فحص الهيكل الخارجي', time: '13:00', duration: 3, status: 'completed' },
      { id: '4', technicianId: '5', aircraftId: '7', task: 'صيانة طارئة', time: '14:00', duration: 2, status: 'overdue' }
    ]
  };

  const currentSchedule = scheduleData[selectedDate as keyof typeof scheduleData] || [];

  const getTechnicianName = (id: string) => {
    return techniciansData.find(t => t.id === id)?.name || 'غير محدد';
  };

  const getAircraftNumber = (id: string) => {
    return aircraftData.find(a => a.id === id)?.number || 'غير محدد';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-900/20';
      case 'in-progress':
        return 'border-blue-500 bg-blue-900/20';
      case 'overdue':
        return 'border-red-500 bg-red-900/20';
      default:
        return 'border-gray-600 bg-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in-progress':
        return 'جاري';
      case 'overdue':
        return 'متأخر';
      default:
        return 'مجدول';
    }
  };

  return (
    <div className="p-6 h-screen flex gap-6">
      {/* Main Schedule */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">جدولة الفنيين</h1>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
            <span className="text-gray-400">
              {currentSchedule.length} مهام مجدولة
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">جدول اليوم</h3>
          <div className="space-y-4">
            {currentSchedule.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 ${getStatusColor(task.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(task.status)}
                    <div>
                      <h4 className="font-bold">{task.task}</h4>
                      <p className="text-sm text-gray-400">
                        {getTechnicianName(task.technicianId)} - {getAircraftNumber(task.aircraftId)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{task.time}</p>
                    <p className="text-sm text-gray-400">{task.duration} ساعات</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-600 text-white' :
                    task.status === 'in-progress' ? 'bg-blue-600 text-white' :
                    task.status === 'overdue' ? 'bg-red-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {getStatusText(task.status)}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs px-2 py-1">إعادة جدولة</button>
                    <button className="btn-primary text-xs px-2 py-1">تفاصيل</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Alerts */}
        <div className="mt-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h3 className="font-bold text-red-400">تنبيهات الفحوصات المتأخرة</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm">• الطائرة KU-601 - فحص دوري متأخر منذ 3 أيام</p>
            <p className="text-sm">• الطائرة SV-002 - صيانة المحرك متأخرة منذ يوم واحد</p>
          </div>
        </div>
      </div>

      {/* Technicians Panel */}
      <div className="w-80 space-y-6">
        {/* Technician Status */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">حالة الفنيين</h3>
          <div className="space-y-3">
            {techniciansData.map((technician) => (
              <div
                key={technician.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTechnician === technician.id 
                    ? 'bg-blue-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedTechnician(technician.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{technician.name}</p>
                      <p className="text-xs text-gray-400">{technician.specialization}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    technician.status === 'متاح' ? 'bg-green-600 text-white' :
                    technician.status === 'مشغول' ? 'bg-yellow-600 text-black' :
                    'bg-gray-600 text-white'
                  }`}>
                    {technician.status}
                  </span>
                </div>
                {technician.currentAssignment && (
                  <p className="text-xs text-gray-400 mt-1">
                    مُكلف بـ: {technician.currentAssignment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">إجراءات سريعة</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary">إضافة مهمة جديدة</button>
            <button className="w-full btn-secondary">عرض الجدول الأسبوعي</button>
            <button className="w-full btn-secondary">إرسال تنبيهات</button>
            <button className="w-full btn-secondary">تقرير الإنتاجية</button>
          </div>
        </div>

        {/* Workload Summary */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">ملخص أعباء العمل</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">المهام المكتملة</span>
              <span className="font-bold text-green-400">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">المهام الجارية</span>
              <span className="font-bold text-blue-400">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">المهام المتأخرة</span>
              <span className="font-bold text-red-400">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">الفنيون المتاحون</span>
              <span className="font-bold text-gray-300">3/6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;