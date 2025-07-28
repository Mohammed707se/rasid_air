import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Download, 
  User, 
  Calendar, 
  Plane, 
  Shield, 
  Zap, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Brain,
  Eye,
  ChevronRight,
  Search,
  Filter,
  X,
  Wrench,
  Building2,
  Activity
} from 'lucide-react';

const Reports: React.FC = () => {
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // إذا جاء المستخدم من صفحة الصيانة، اعرض التقرير مباشرة
  React.useEffect(() => {
    if (location.state?.fromMaintenance) {
      setSelectedReport('1');
    }
  }, [location.state]);

  // قائمة التقارير
  const reportsList = [
    {
      id: '1',
      aircraftNumber: 'QR-103',
      aircraftModel: 'Boeing 787-9',
      airline: 'الخطوط القطرية',
      inspector: 'أحمد محمد علي',
      date: '25 يناير 2024',
      overallScore: 83,
      status: 'يحتاج مراجعة',
      statusColor: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/30',
      sections: [
        {
          name: 'المحرك',
          icon: Zap,
          percentage: 78,
          issues: 2,
          status: 'تنبيه',
          color: '#f59e0b',
          bgColor: 'bg-gradient-to-br from-yellow-900/30 to-orange-900/20',
          borderColor: 'border-yellow-500/40',
          shadowColor: 'shadow-yellow-500/20',
          checkpoints: [
            { name: 'فحص ضغط الزيت', score: 85, status: 'سليم', notes: 'ضغط الزيت ضمن المعدل الطبيعي' },
            { name: 'فحص درجة الحرارة', score: 92, status: 'سليم', notes: 'درجة الحرارة مستقرة' },
            { name: 'فحص الاهتزاز', score: 65, status: 'تنبيه', notes: 'اهتزاز طفيف يحتاج مراقبة' },
            { name: 'فحص استهلاك الوقود', score: 70, status: 'تنبيه', notes: 'استهلاك أعلى من المعتاد' },
            { name: 'فحص العادم', score: 88, status: 'سليم', notes: 'لا توجد مشاكل في العادم' }
          ]
        },
        {
          name: 'الهيكل الخارجي',
          icon: Shield,
          percentage: 95,
          issues: 1,
          status: 'سليم',
          color: '#10b981',
          bgColor: 'bg-gradient-to-br from-green-900/30 to-emerald-900/20',
          borderColor: 'border-green-500/40',
          shadowColor: 'shadow-green-500/20',
          checkpoints: [
            { name: 'فحص الجناح الأيمن', score: 98, status: 'سليم', notes: 'لا توجد تشققات أو تآكل' },
            { name: 'فحص الجناح الأيسر', score: 96, status: 'سليم', notes: 'حالة ممتازة' },
            { name: 'فحص جسم الطائرة', score: 94, status: 'سليم', notes: 'بعض الخدوش الطفيفة' },
            { name: 'فحص الذيل', score: 92, status: 'سليم', notes: 'سليم تماماً' },
            { name: 'فحص نوافذ القمرة', score: 90, status: 'سليم', notes: 'نظيفة وسليمة' }
          ]
        },
        {
          name: 'أنظمة الأمان',
          icon: Shield,
          percentage: 68,
          issues: 3,
          status: 'خلل',
          color: '#ef4444',
          bgColor: 'bg-gradient-to-br from-red-900/30 to-pink-900/20',
          borderColor: 'border-red-500/40',
          shadowColor: 'shadow-red-500/20',
          checkpoints: [
            { name: 'أنظمة الإنذار', score: 45, status: 'خلل', notes: 'بعض أجهزة الإنذار لا تعمل' },
            { name: 'مخارج الطوارئ', score: 75, status: 'سليم', notes: 'جميع المخارج تعمل بشكل طبيعي' },
            { name: 'أحزمة الأمان', score: 82, status: 'سليم', notes: 'حالة جيدة' },
            { name: 'أقنعة الأكسجين', score: 55, status: 'تنبيه', notes: 'بعض الأقنعة تحتاج استبدال' },
            { name: 'طفايات الحريق', score: 85, status: 'سليم', notes: 'جميع الطفايات صالحة' }
          ]
        },
        {
          name: 'النظام الكهربائي',
          icon: Settings,
          percentage: 92,
          issues: 0,
          status: 'سليم',
          color: '#10b981',
          bgColor: 'bg-gradient-to-br from-blue-900/30 to-cyan-900/20',
          borderColor: 'border-blue-500/40',
          shadowColor: 'shadow-blue-500/20',
          checkpoints: [
            { name: 'البطارية الرئيسية', score: 95, status: 'سليم', notes: 'شحن ممتاز وأداء مستقر' },
            { name: 'الأسلاك الكهربائية', score: 90, status: 'سليم', notes: 'لا توجد علامات تآكل' },
            { name: 'أنظمة الإضاءة', score: 94, status: 'سليم', notes: 'جميع الأضواء تعمل' },
            { name: 'أنظمة الملاحة', score: 88, status: 'سليم', notes: 'دقة عالية في القراءات' },
            { name: 'أنظمة الاتصال', score: 93, status: 'سليم', notes: 'إشارة قوية وواضحة' }
          ]
        }
      ]
    }
  ];

  const reportData = {
    aircraft: {
      registration: 'QR-103',
      model: 'Boeing 787-9',
      airline: 'الخطوط القطرية',
      status: 'يحتاج مراجعة'
    },
    inspector: {
      name: 'أحمد محمد علي',
      date: '25 يناير 2024'
    },
    notes: 'تم إجراء فحص شامل للطائرة وفقاً للمعايير الدولية. المحرك الأيسر يحتاج مراقبة إضافية خلال الأسبوع القادم.',
    aiRecommendations: [
      { 
        text: 'إعادة فحص النظام الهيدروليكي', 
        priority: 'عالية', 
        color: '#ef4444', 
        icon: Wrench,
        urgencyLevel: 1,
        badge: 'أولوية عالية'
      },
      { 
        text: 'استبدال مستشعرات الأمان', 
        priority: 'عالية', 
        color: '#ef4444', 
        icon: Shield,
        urgencyLevel: 1,
        badge: 'أولوية عالية'
      },
      { 
        text: 'مراقبة أداء المحرك الأيسر', 
        priority: 'متوسطة', 
        color: '#f59e0b', 
        icon: Activity,
        urgencyLevel: 2,
        badge: 'أولوية متوسطة'
      },
      { 
        text: 'فحص دوري للأسلاك الكهربائية', 
        priority: 'منخفضة', 
        color: '#10b981', 
        icon: Zap,
        urgencyLevel: 3,
        badge: 'أولوية منخفضة'
      }
    ]
  };

  const selectedReportData = reportsList.find(r => r.id === selectedReport);
  const sections = selectedReportData?.sections || [];

  const overallScore = 83;

  const getOverallScoreColor = (score: number) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getOverallScoreStatus = (score: number) => {
    if (score >= 70) return 'سليم';
    if (score >= 40) return 'تنبيه';
    return 'خلل';
  };

  const getCheckpointStatusColor = (status: string) => {
    switch (status) {
      case 'سليم': return 'text-green-400 bg-green-900/20';
      case 'تنبيه': return 'text-yellow-400 bg-yellow-900/20';
      case 'خلل': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const downloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob(['تقرير الصيانة الشامل - ' + reportData.aircraft.registration], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `maintenance-report-${reportData.aircraft.registration}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const OverallScoreCircle = () => {
    const scoreColor = getOverallScoreColor(overallScore);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (overallScore / 100) * circumference;

    return (
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#374151"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke={scoreColor}
            strokeWidth="6"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1"
              style={{ color: scoreColor }}
            >
              {overallScore}%
            </div>
            <div 
              className="text-sm font-medium px-2 sm:px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: scoreColor + '20',
                color: scoreColor 
              }}
            >
              {getOverallScoreStatus(overallScore)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'سليم':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'تنبيه':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'خلل':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredReports = reportsList.filter(report => {
    const matchesSearch = report.aircraftNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // إذا لم يتم اختيار تقرير، اعرض قائمة التقارير
  if (!selectedReport) {
    return (
      <div className="min-h-screen bg-[#0F111A] text-white font-tajawal p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">راصد 2.0 – منصة صيانة الطائرات الذكية</h1>
              <p className="text-gray-400">قائمة التقارير الفنية</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في التقارير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg pl-4 pr-10 py-3 text-white w-64 backdrop-blur-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white backdrop-blur-sm"
          >
            <option value="all">جميع الحالات</option>
            <option value="سليم">سليم</option>
            <option value="تنبيه">تنبيه</option>
            <option value="خلل">خلل</option>
          </select>

          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="h-4 w-4" />
            <span className="text-sm">{filteredReports.length} تقرير</span>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`${report.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${report.borderColor} cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Aircraft Info */}
                  <div className="flex items-center gap-3">
                    <Plane className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="text-xl font-bold">{report.aircraftNumber}</h3>
                      <p className="text-sm text-gray-400">{report.aircraftModel}</p>
                      <p className="text-sm text-gray-400">{report.airline}</p>
                    </div>
                  </div>

                  {/* Inspector */}
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-green-400" />
                    <div>
                      <p className="font-medium">{report.inspector}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <p className={`font-bold ${report.statusColor}`}>{report.status}</p>
                      <p className="text-sm text-gray-400">الحالة العامة</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {report.overallScore}%
                    </div>
                    <p className="text-sm text-gray-400">النتيجة العامة</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // عرض التقرير المفصل - محسن حسب المتطلبات
  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-tajawal p-2 sm:p-4 lg:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <button 
          onClick={downloadReport}
          className="bg-gradient-to-r from-[#009BEB] to-[#00CFFF] hover:from-[#007ACC] hover:to-[#00B8E6] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 shadow-lg hover:shadow-[#00CFFF]/30 hover:scale-105 glow-cyan order-2 sm:order-1"
        >
          <Download className="h-5 w-5" />
          تحميل التقرير الكامل
        </button>
        
        <div className="text-center order-1 sm:order-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#00CFFF] mb-1">راصد 2.0 - منصة صيانة الطائرات الذكية</h1>
          <p className="text-[#C9D1D9] text-sm sm:text-base">التقرير الفني الشامل</p>
        </div>

        <button
          onClick={() => setSelectedReport(null)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors order-3"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Overall Score - Left */}
        <div className="glass-card p-4 sm:p-6 flex flex-col items-center justify-center order-2 lg:order-1 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#00CFFF]">التقييم العام</h3>
          <OverallScoreCircle />
        </div>

        {/* Aircraft Info - Right */}
        <div className="glass-card p-4 sm:p-6 order-1 lg:order-2 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-[#00CFFF]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#00CFFF]">معلومات الطائرة</h3>
          </div>
          
          {/* Aircraft Status - Prominent */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[#C9D1D9] font-medium">الحالة العامة:</span>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-yellow-400 bg-yellow-900/40 px-3 py-1 rounded-full text-sm border border-yellow-500/30">
                  {reportData.aircraft.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[#8B949E] text-sm">✈️</span>
                <span className="text-[#C9D1D9] text-sm">رقم التسجيل:</span>
              </div>
              <span className="font-bold text-[#00CFFF] text-base">{reportData.aircraft.registration}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[#8B949E] text-sm">🛩️</span>
                <span className="text-[#C9D1D9] text-sm">الطراز:</span>
              </div>
              <span className="font-medium text-sm text-[#FFFFFF]">{reportData.aircraft.model}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#8B949E]" />
                <span className="text-[#C9D1D9] text-sm">الشركة:</span>
              </div>
              <span className="font-medium text-sm text-[#FFFFFF]">{reportData.aircraft.airline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* AI Recommendations - Left */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-500/30 order-2 xl:order-1 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-[#00CFFF]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#00CFFF]">توصيات الذكاء الاصطناعي</h3>
          </div>
          <div className="space-y-3">
            {reportData.aiRecommendations
              .sort((a, b) => a.urgencyLevel - b.urgencyLevel)
              .map((recommendation, index) => {
                const IconComponent = recommendation.icon;
                return (
                  <div key={index} className="glass-card p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: recommendation.color + '20' }}>
                        <IconComponent className="h-4 w-4" style={{ color: recommendation.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#FFFFFF] mb-2 font-medium leading-relaxed">{recommendation.text}</p>
                        <div className="flex items-center justify-between">
                          <span 
                            className="text-xs px-3 py-1 rounded-full font-bold border"
                            style={{ 
                              backgroundColor: recommendation.color + '15',
                              color: recommendation.color,
                              borderColor: recommendation.color + '40'
                            }}
                          >
                            {recommendation.badge}
                          </span>
                          <span className="text-xs text-[#8B949E]">
                            {recommendation.urgencyLevel === 1 ? '🔴' : 
                             recommendation.urgencyLevel === 2 ? '🟠' : '🟢'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Section Details - Right (2 columns) */}
        <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-3 order-1 xl:order-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                onClick={() => setSelectedSection(section.name)}
                className={`${section.bgColor} backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-5 border ${section.borderColor} cursor-pointer hover:scale-105 transition-all duration-300 ${section.shadowColor} shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: section.color }} />
                  <h4 className="font-bold text-sm sm:text-base text-[#FFFFFF]">{section.name}</h4>
                </div>
                
                {/* Mini Circle Chart */}
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={section.color}
                        strokeWidth="8"
                        strokeDasharray={`${section.percentage * 2.2} 220`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base sm:text-lg lg:text-xl font-bold" style={{ color: section.color }}>
                        {section.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-center">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-[#C9D1D9]">عدد الأعطال:</span>
                    <span className="font-bold text-[#FFFFFF]">{section.issues}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-[#C9D1D9]">الحالة:</span>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-bold border"
                      style={{ 
                        backgroundColor: section.color + '20',
                        color: section.color,
                        borderColor: section.color + '40'
                      }}
                    >
                      {section.status}
                    </span>
                  </div>
                </div>
                
                <div className="text-center mt-3">
                  <p className="text-xs text-[#8B949E] hover:text-[#00CFFF] transition-colors">انقر لعرض التفاصيل</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Details Modal */}
      {selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="glass-card w-full max-w-xs sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                {(() => {
                  const section = sections.find(s => s.name === selectedSection);
                  if (!section) return null;
                  const Icon = section.icon;
                  return (
                    <>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: section.color }} />
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#00CFFF]">{selectedSection}</h3>
                        <p className="text-xs sm:text-sm text-[#C9D1D9]">تفاصيل نقاط الفحص</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setSelectedSection(null)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              {(() => {
                const section = sections.find(s => s.name === selectedSection);
                if (!section || !section.checkpoints) return null;

                return (
                  <div className="space-y-4">
                    {/* Section Summary */}
                    <div className={`${section.bgColor} rounded-xl p-4 border ${section.borderColor} mb-6 shadow-lg`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold mb-3 text-[#00CFFF]">ملخص القسم</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-[#C9D1D9]">النسبة العامة:</span>
                              <span className="font-bold" style={{ color: section.color }}>
                                {section.percentage}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#C9D1D9]">عدد الأعطال:</span>
                              <span className="font-bold text-[#FFFFFF]">{section.issues}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#C9D1D9]">الحالة:</span>
                              <span 
                                className="px-2 py-1 rounded text-xs font-bold border"
                                style={{ 
                                  backgroundColor: section.color + '20',
                                  color: section.color,
                                  borderColor: section.color + '40'
                                }}
                              >
                                {section.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkpoints List */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold mb-4 text-[#00CFFF]">نقاط الفحص التفصيلية</h4>
                      {section.checkpoints.slice(0, 3).map((checkpoint, index) => (
                        <div
                          key={index}
                          className={`glass-card border p-4 ${getCheckpointStatusColor(checkpoint.status)} border-opacity-40 shadow-lg`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-sm sm:text-base text-[#FFFFFF]">{checkpoint.name}</h5>
                            <div className="flex items-center gap-3">
                              <span className="text-xl sm:text-2xl font-bold text-[#00CFFF]">
                                {checkpoint.score}%
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getCheckpointStatusColor(checkpoint.status)}`}>
                                {checkpoint.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-[#C9D1D9] mb-3 leading-relaxed">{checkpoint.notes}</p>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${checkpoint.score}%`,
                                  backgroundColor: checkpoint.status === 'سليم' ? '#10b981' :
                                                 checkpoint.status === 'تنبيه' ? '#f59e0b' : '#ef4444'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;