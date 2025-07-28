import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, AlertTriangle, CheckCircle, Clock, Zap, X, MessageCircle, Camera, Upload, Send, Brain } from 'lucide-react';
import { aircraftData } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { analyzeImageWithOpenAI, getChatResponse } from '../services/openai';

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'سليم' | 'تنبيه' | 'عطل'>('all');
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', message: 'مرحباً! اشرح مشكلتك بالتفصيل وسأساعدك في التشخيص الفوري.', timestamp: new Date().toLocaleTimeString('ar-SA') }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isAnalyzingChat, setIsAnalyzingChat] = useState(false);
  const [analysisPoints, setAnalysisPoints] = useState<Array<{
    id: number;
    x: number;
    y: number;
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
  }>>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);

  const filteredAircraft = filter === 'all' 
    ? aircraftData 
    : aircraftData.filter(aircraft => aircraft.status === filter);

  const stats = {
    total: aircraftData.length,
    faults: aircraftData.filter(a => a.status === 'عطل').length,
    warnings: aircraftData.filter(a => a.status === 'تنبيه').length,
    completed: aircraftData.filter(a => a.status === 'سليم').length
  };

  const problemOptions = [
    { id: 'engine', label: 'مشكلة في المحرك', icon: '🔧' },
    { id: 'electrical', label: 'مشكلة كهربائية', icon: '⚡' },
    { id: 'hydraulic', label: 'مشكلة هيدروليكية', icon: '🔩' },
    { id: 'structural', label: 'مشكلة هيكلية', icon: '🛠️' }
  ];

  const handleProblemSelect = (problemId: string) => {
    setSelectedProblem(problemId);
    setCurrentStep(2);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // إضافة رسالة للمحادثة عند رفع الصورة
      const uploadMessage = {
        id: Date.now(),
        sender: 'user' as const,
        message: `📷 تم رفع صورة للتحليل - ${file.name}`,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setChatMessages(prev => [...prev, uploadMessage]);
    }
  };

  const handleImageAnalysis = async () => {
    if (!uploadedImageFile || !selectedProblem) return;
    
    setIsAnalyzingImage(true);
    
    try {
      const problemType = problemOptions.find(p => p.id === selectedProblem)?.label || 'مشكلة عامة';
      const analysis = await analyzeImageWithOpenAI(uploadedImageFile, problemType);
      
      // إنشاء نقاط تحليل عشوائية للعرض التوضيحي
      const mockPoints = [
        {
          id: 1,
          x: 25,
          y: 35,
          severity: 'high' as const,
          title: 'تسرب في نظام الوقود',
          description: 'تم اكتشاف تسرب طفيف في خط الوقود الرئيسي. يحتاج إلى إصلاح فوري لتجنب المخاطر.',
          recommendation: 'استبدال الخرطوم المتضرر وفحص الوصلات المجاورة'
        },
        {
          id: 2,
          x: 60,
          y: 45,
          severity: 'medium' as const,
          title: 'تآكل في المعدن',
          description: 'علامات تآكل طفيفة على السطح المعدني. لا تؤثر على الأداء حالياً ولكن تحتاج مراقبة.',
          recommendation: 'تنظيف المنطقة وتطبيق طلاء واقي'
        },
        {
          id: 3,
          x: 80,
          y: 25,
          severity: 'low' as const,
          title: 'تراكم الأتربة',
          description: 'تراكم طبيعي للأتربة والزيوت على السطح. لا يشكل خطراً ولكن يحتاج تنظيف دوري.',
          recommendation: 'تنظيف شامل باستخدام المذيبات المناسبة'
        }
      ];
      
      setAnalysisPoints(mockPoints);
      setShowAnalysisPopup(true);
      
      const aiMessage = {
        id: Date.now(),
        sender: 'ai' as const,
        message: `🤖 **تحليل الصورة بالذكاء الاصطناعي مكتمل:**\n\n${analysis}\n\n📍 **تم اكتشاف ${mockPoints.length} نقاط تحتاج انتباه** - انقر على النقاط في الصورة لمزيد من التفاصيل.\n\n---\n💡 **نصيحة:** احفظ هذا التحليل في سجل الصيانة للمراجعة المستقبلية.`,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('خطأ في تحليل الصورة:', error);
      const errorMessage = {
        id: Date.now(),
        sender: 'ai' as const,
        message: '❌ **خطأ في تحليل الصورة**\n\nعذراً، حدث خطأ في الاتصال بنظام التحليل. يرجى:\n• التأكد من جودة الصورة\n• المحاولة مرة أخرى\n• الاستعانة بخبير الصيانة عند الحاجة',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && !isAnalyzingChat) {
      const userMessage = {
        id: Date.now(),
        sender: 'user' as const,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // الحصول على رد من OpenAI
      handleAIResponse(newMessage);
    }
  };

  const handleAIResponse = async (message: string) => {
    setIsAnalyzingChat(true);
    try {
      const aircraftInfo = aircraftData.find(a => a.id === selectedAircraft);
      const problemType = problemOptions.find(p => p.id === selectedProblem)?.label || 'مشكلة عامة';
      
      const context = `الطائرة: ${aircraftInfo?.number || 'غير محدد'} - ${aircraftInfo?.model || 'غير محدد'}
نوع المشكلة: ${problemType}
حالة الطائرة: ${aircraftInfo?.status || 'غير محدد'}`;
      
      const aiResponse = await getChatResponse(message, context);
      
      const aiMessage = {
        id: Date.now(),
        sender: 'ai' as const,
        message: aiResponse,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('خطأ في الحصول على رد الذكاء الاصطناعي:', error);
      const errorMessage = {
        id: Date.now(),
        sender: 'ai' as const,
        message: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى أو التواصل مع المشرف الفني للمساعدة.',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzingChat(false);
    }
  };

  const resetDiagnosis = () => {
    setShowDiagnosis(false);
    setSelectedAircraft('');
    setSelectedProblem('');
    setCurrentStep(1);
    setChatMessages([
      { id: 1, sender: 'ai', message: 'مرحباً! اشرح مشكلتك بالتفصيل وسأساعدك في التشخيص الفوري.', timestamp: new Date().toLocaleTimeString('ar-SA') }
    ]);
    setNewMessage('');
    setUploadedImage(null);
    setUploadedImageFile(null);
    setAnalysisPoints([]);
    setSelectedPoint(null);
    setShowAnalysisPopup(false);
  };

  return (
    <div className="p-6 h-screen overflow-y-auto bg-primary">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-highlight">لوحة التحكم</h1>
            <p className="text-secondary">نظرة شاملة على حالة أسطول الطائرات</p>
          </div>
          <button
            onClick={() => setShowDiagnosis(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 glow-blue"
          >
            <Zap className="h-5 w-5" />
            تشخيص فوري
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium">عدد الطائرات</p>
              <p className="text-3xl font-bold text-highlight">{stats.total}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl">
              <Plane className="h-8 w-8 text-highlight" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium">عدد الأعطال</p>
              <p className="text-3xl font-bold" style={{color: '#EF4444'}}>{stats.faults}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl glow-red">
              <AlertTriangle className="h-8 w-8" style={{color: '#EF4444'}} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium">عدد التنبيهات</p>
              <p className="text-3xl font-bold" style={{color: '#FACC15'}}>{stats.warnings}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl glow-yellow">
              <Clock className="h-8 w-8" style={{color: '#FACC15'}} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium">الإصلاحات المكتملة</p>
              <p className="text-3xl font-bold" style={{color: '#22C55E'}}>{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl glow-green">
              <CheckCircle className="h-8 w-8" style={{color: '#22C55E'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            filter === 'all' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          جميع الطائرات
        </button>
        <button
          onClick={() => setFilter('سليم')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            filter === 'سليم' ? 'bg-green-500 text-white glow-green' : 'btn-secondary'
          }`}
        >
          سليم
        </button>
        <button
          onClick={() => setFilter('تنبيه')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            filter === 'تنبيه' ? 'bg-yellow-500 text-black glow-yellow' : 'btn-secondary'
          }`}
        >
          تنبيه
        </button>
        <button
          onClick={() => setFilter('عطل')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            filter === 'عطل' ? 'bg-red-500 text-white glow-red' : 'btn-secondary'
          }`}
        >
          عطل
        </button>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredAircraft.slice(0, 8).map((aircraft) => (
          <div key={aircraft.id} className="aircraft-card">
            <img
              src={aircraft.image}
              alt={aircraft.model}
              className="w-full h-32 object-cover rounded-xl mb-4"
            />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-highlight text-lg">{aircraft.number}</h3>
                <StatusBadge status={aircraft.status} size="sm" />
              </div>
              <p className="text-sm text-secondary truncate font-medium">{aircraft.model}</p>
              <p className="text-sm text-accent truncate">{aircraft.airline}</p>
              <p className="text-sm text-accent mb-3">
                آخر فحص: {new Date(aircraft.lastInspection).toLocaleDateString('ar-SA')}
              </p>
              <Link
                to={`/aircraft/${aircraft.id}`}
                className="block w-full text-center btn-primary text-sm"
              >
                دخول التفاصيل
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Instant Diagnosis Modal */}
      {showDiagnosis && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center glow-cyan">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-highlight">🧠 التشخيص الفوري – نظام ذكي لتشخيص مشاكل الطائرات</h3>
                  <p className="text-sm text-secondary mt-1">حدد الطائرة ونوع المشكلة للحصول على تشخيص دقيق</p>
                </div>
              </div>
              <button
                onClick={resetDiagnosis}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8">
              {/* Aircraft Selection */}
              <div className="w-full max-w-md">
                <h3 className="text-lg font-bold text-highlight mb-4 text-center">اختر الطائرة</h3>
                <div className="glass-card p-4 rounded-xl border border-gray-600">
                  <select
                    value={selectedAircraft}
                    onChange={(e) => setSelectedAircraft(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  >
                    <option value="">اختر الطائرة...</option>
                    {aircraftData.slice(0, 8).map((aircraft) => (
                      <option key={aircraft.id} value={aircraft.id}>
                        {aircraft.number} - {aircraft.model} - {aircraft.airline}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problem Type Selection */}
              {selectedAircraft && (
                <div className="w-full max-w-2xl">
                  <h3 className="text-xl font-bold text-highlight mb-6 text-center">حدد نوع المشكلة</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    {problemOptions.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => handleProblemSelect(problem.id)}
                        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 hover:border-cyan-500 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                            {problem.icon}
                          </div>
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {problem.label}
                          </h4>
                        </div>
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Start Diagnosis Button */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-10 py-3 rounded-xl text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30 glow-cyan"
                    >
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5" />
                        ابدأ التشخيص
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis Interface Modal */}
      {currentStep === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center glow-cyan">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-highlight">جلسة التشخيص النشطة</h3>
                  <p className="text-sm text-secondary">
                    {aircraftData.find(a => a.id === selectedAircraft)?.number} - 
                    {problemOptions.find(p => p.id === selectedProblem)?.label}
                  </p>
                </div>
              </div>
              <button
                onClick={resetDiagnosis}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Interface */}
            <div className="flex w-full pt-20">
              {/* Chat Section - Right */}
              <div className="w-1/2 p-6 border-l border-gray-700 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-highlight">المساعد الذكي</h3>
                    <p className="text-sm text-secondary">تحليل فوري للمشكلة</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-sm p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-700 text-gray-200 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.message}</p>
                        <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {isAnalyzingChat && (
                    <div className="flex justify-end">
                      <div className="bg-gray-700 text-gray-200 rounded-bl-sm p-3 max-w-sm">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span className="text-sm">جاري التحليل...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اشرح المشكلة بالتفصيل..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 disabled:opacity-50"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isAnalyzingChat}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={isAnalyzingChat || !newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzingChat ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Camera Section - Left */}
              <div className="w-1/2 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-highlight">رفع الصور</h3>
                    <p className="text-sm text-secondary">للتحليل بالذكاء الاصطناعي</p>
                  </div>
                </div>

                {/* Image Upload Area */}
                <div className="flex-1 bg-gray-900 rounded-lg mb-4 border-2 border-dashed border-gray-600 p-4 flex flex-col">
                  {uploadedImage ? (
                    <div className="flex-1 flex flex-col">
                      <div className="relative flex-1 mb-4 group">
                        <img
                          src={uploadedImage}
                          alt="صورة مرفوعة"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        
                        {/* نقاط التحليل */}
                        {analysisPoints.map((point) => (
                          <div
                            key={point.id}
                            className={`absolute w-6 h-6 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 animate-pulse ${
                              point.severity === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                              point.severity === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
                              'bg-blue-500 shadow-lg shadow-blue-500/50'
                            }`}
                            style={{
                              left: `${point.x}%`,
                              top: `${point.y}%`
                            }}
                            onClick={() => setSelectedPoint(point.id)}
                          >
                            <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>
                            <div className="relative w-full h-full rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{point.id}</span>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedImageFile(null);
                            setAnalysisPoints([]);
                            setSelectedPoint(null);
                          }}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Analyze Button */}
                      <button
                        onClick={handleImageAnalysis}
                        disabled={isAnalyzingImage}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                      >
                        {isAnalyzingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>جاري التحليل بالذكاء الاصطناعي...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="h-5 w-5" />
                            <span>🤖 تحليل بالذكاء الاصطناعي</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">اسحب الصورة هنا أو انقر للرفع</p>
                        <p className="text-gray-500 text-xs mb-4">PNG, JPG, JPEG - حتى 10MB</p>
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                          📷 اختر صورة
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Finish Button */}
                <button
                  onClick={() => {
                    // Here you would typically save the diagnosis and redirect
                    alert('تم حفظ التشخيص بنجاح!');
                    resetDiagnosis();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  إنهاء وبناء التقرير
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Points Popup */}
      {showAnalysisPopup && selectedPoint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl border border-gray-600/50 w-full max-w-2xl shadow-2xl backdrop-blur-xl">
            {(() => {
              const point = analysisPoints.find(p => p.id === selectedPoint);
              if (!point) return null;
              
              return (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        point.severity === 'high' ? 'bg-red-500 shadow-red-500/30' :
                        point.severity === 'medium' ? 'bg-yellow-500 shadow-yellow-500/30' :
                        'bg-blue-500 shadow-blue-500/30'
                      }`}>
                        {point.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{point.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            point.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            point.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {point.severity === 'high' ? 'أولوية عالية' :
                             point.severity === 'medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPoint(null);
                        setShowAnalysisPopup(false);
                      }}
                      className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* الوصف */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                      <h4 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-400 text-sm">📋</span>
                        </div>
                        وصف المشكلة
                      </h4>
                      <p className="text-gray-300 leading-relaxed">{point.description}</p>
                    </div>

                    {/* التوصية */}
                    <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                      <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-green-400 text-sm">💡</span>
                        </div>
                        التوصية
                      </h4>
                      <p className="text-green-200 leading-relaxed">{point.recommendation}</p>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                      <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 text-sm">⚙️</span>
                        </div>
                        معلومات فنية
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">الموقع:</span>
                          <span className="text-white font-medium">النقطة {point.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">مستوى الخطر:</span>
                          <span className={`font-medium ${
                            point.severity === 'high' ? 'text-red-400' :
                            point.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                          }`}>
                            {point.severity === 'high' ? 'عالي' :
                             point.severity === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">وقت الاكتشاف:</span>
                          <span className="text-white font-medium">{new Date().toLocaleTimeString('ar-SA')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">الحالة:</span>
                          <span className="text-yellow-400 font-medium">يحتاج انتباه</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-3 p-6 border-t border-gray-600/30">
                    <button
                      onClick={() => {
                        // إضافة إلى قائمة المهام
                        alert('تم إضافة المشكلة إلى قائمة المهام!');
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/30"
                    >
                      إضافة للمهام
                    </button>
                    <button
                      onClick={() => {
                        // تصدير التقرير
                        alert('تم تصدير تقرير المشكلة!');
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                    >
                      تصدير التقرير
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPoint(null);
                        setShowAnalysisPopup(false);
                      }}
                      className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 border border-gray-600/30"
                    >
                      إغلاق
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;