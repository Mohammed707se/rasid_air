import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Plus, Search } from 'lucide-react';
import { inventoryData } from '../data/mockData';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'محرك', 'كهرباء', 'هيكل', 'أنظمة داخلية'];

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventoryData.filter(item => item.stockLevel <= item.minStock);
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.stockLevel * 1000), 0); // Assuming $1000 per unit

  const getStockStatus = (item: typeof inventoryData[0]) => {
    const percentage = (item.stockLevel / item.minStock) * 100;
    if (percentage <= 50) return { color: 'text-red-400', bg: 'bg-red-900/20', status: 'منخفض جداً' };
    if (percentage <= 100) return { color: 'text-yellow-400', bg: 'bg-yellow-900/20', status: 'منخفض' };
    return { color: 'text-green-400', bg: 'bg-green-900/20', status: 'طبيعي' };
  };

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">مخزون قطع الغيار</h1>
        <p className="text-gray-400">إدارة وتتبع قطع الغيار والمستلزمات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">إجمالي الأصناف</p>
              <p className="text-2xl font-bold text-blue-400">{inventoryData.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">مخزون منخفض</p>
              <p className="text-2xl font-bold text-red-400">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">القيمة الإجمالية</p>
              <p className="text-2xl font-bold text-green-400">${totalValue.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">يحتاج إعادة تخزين</p>
              <p className="text-2xl font-bold text-yellow-400">3</p>
            </div>
            <Package className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المخزون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">جميع الفئات</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة صنف جديد
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-bold text-red-400">تنبيه المخزون المنخفض</h3>
          </div>
          <div className="flex gap-4">
            {lowStockItems.map((item) => (
              <span key={item.id} className="text-sm bg-red-600 text-white px-2 py-1 rounded">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-right p-4 font-medium">اسم القطعة</th>
                <th className="text-right p-4 font-medium">الفئة</th>
                <th className="text-right p-4 font-medium">المخزون الحالي</th>
                <th className="text-right p-4 font-medium">الحد الأدنى</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">آخر تزويد</th>
                <th className="text-right p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{item.category}</td>
                    <td className="p-4">
                      <span className="font-bold">{item.stockLevel}</span>
                    </td>
                    <td className="p-4 text-gray-400">{item.minStock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(item.lastRestocked).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="btn-secondary text-xs px-2 py-1">تحديث</button>
                        <button className="btn-primary text-xs px-2 py-1">طلب تزويد</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">توقعات الذكاء الاصطناعي</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">توقعات الاستهلاك</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• مضخة الوقود: استهلاك متوقع خلال 15 يوم</li>
              <li>• إطار الهبوط: استهلاك متوقع خلال 30 يوم</li>
              <li>• مرشح الهواء: استهلاك متوقع خلال 45 يوم</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">توصيات التزويد</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• طلب 10 وحدات من مضخة الوقود</li>
              <li>• طلب 5 وحدات من إطار الهبوط</li>
              <li>• طلب 8 وحدات من مرشح الهواء</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;