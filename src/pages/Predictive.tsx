import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertTriangle, BarChart3, Brain, Calendar, ArrowRight, CheckCircle, MessageCircle, Camera, X, Info, Play, Upload, FileImage, Loader } from 'lucide-react';
import { aircraftData } from '../data/mockData';
import { analyzePredictiveData, analyzeImage, generateMaintenanceReport, PredictiveAnalysis, ImageAnalysisResult, analyzeImageWithOpenAIPredictivePrompt } from '../services/openai';

const Predictive: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAircraft, setSelectedAircraft] = useState('all');
  const [timeRange, setTimeRange] = useState('7');
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: 'مرحباً! سأساعدك في التعامل مع هذا التنبيه. دعنا نبدأ بفحص المشكلة وتحديد الخطوات المطلوبة.',
      timestamp: new Date().toLocaleTimeString('ar-SA')
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [aiPredictions, setAiPredictions] = useState<PredictiveAnalysis[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  const predictions = [
    {
      id: '1',
      aircraftId: '3',
      component: 'مضخة الوقود',
      risk: 'high',
      predictedFailure: '3 أيام',
      confidence: 95,
      symptoms: ['انخفاض ضغط الوقود', 'اهتزاز غير طبيعي', 'ارتفاع درجة الحرارة'],
      recommendation: 'استبدال فوري مطلوب',
      description: 'تم اكتشاف تدهور في أداء مضخة الوقود الرئيسية. البيانات تشير إلى احتمالية عطل خلال 72 ساعة.',
      steps: [
        {
          title: 'فحص ضغط الوقود',
          description: 'قياس ضغط الوقود في النظام والتأكد من القراءات',
          tip: 'استخدم مقياس الضغط المعاير واتبع إجراءات السلامة'
        },
        {
          title: 'فحص المضخة بصرياً',
          description: 'فحص المضخة للبحث عن علامات التسرب أو التآكل',
          tip: 'تأكد من إيقاف تشغيل النظام قبل الفحص'
        },
        {
          title: 'اختبار الاهتزاز',
          description: 'قياس مستوى الاهتزاز وتسجيل القراءات',
          tip: 'استخدم جهاز قياس الاهتزاز في نقاط مختلفة'
        },
        {
          title: 'استبدال المضخة',
          description: 'إزالة المضخة القديمة وتركيب مضخة جديدة',
          tip: 'اتبع دليل الصيانة بدقة واستخدم العزم المحدد'
        },
        {
          title: 'اختبار النظام',
          description: 'تشغيل النظام واختبار الأداء النهائي',
          tip: 'راقب الضغط والاهتزاز لمدة 30 دقيقة على الأقل'
        }
      ]
    },
    {
      id: '2',
      aircraftId: '2',
      component: 'نظام الكهرباء الرئيسي',
      risk: 'medium',
      predictedFailure: '7 أيام',
      confidence: 78,
      symptoms: ['تذبذب في التيار', 'تنبيهات متقطعة'],
      recommendation: 'جدولة صيانة وقائية',
      description: 'تم رصد تذبذبات في النظام الكهربائي قد تؤدي إلى مشاكل في الأسبوع القادم.',
      steps: [
        {
          title: 'فحص التوصيلات',
          description: 'فحص جميع التوصيلات الكهربائية الرئيسية',
          tip: 'ابحث عن علامات الحروق أو التآكل'
        },
        {
          title: 'قياس الجهد',
          description: 'قياس الجهد في نقاط مختلفة من النظام',
          tip: 'استخدم الملتيميتر المعاير'
        },
        {
          title: 'تنظيف التوصيلات',
          description: 'تنظيف وإحكام التوصيلات المتآكلة',
          tip: 'استخدم مواد التنظيف المخصصة للكهرباء'
        },
        {
          title: 'اختبار النظام',
          description: 'تشغيل النظام والتأكد من استقرار الأداء',
          tip: 'راقب القراءات لمدة كافية'
        }
      ]
    }
  ];

  // تحليل البيانات التنبؤية بالذكاء الاصطناعي
  const handleAIPredictiveAnalysis = async () => {
    setIsLoadingPredictions(true);
    try {
      const newPredictions: PredictiveAnalysis[] = [];

      // تحليل عينة من الطائرات
      const sampleAircraft = aircraftData.slice(0, 3);

      for (const aircraft of sampleAircraft) {
        const analysis = await analyzePredictiveData({
          number: aircraft.number,
          model: aircraft.model,
          flightHours: Math.floor(Math.random() * 10000) + 5000,
          lastMaintenance: aircraft.lastInspection,
          status: aircraft.status
        });

        newPredictions.push(analysis);
      }

      setAiPredictions(newPredictions);
    } catch (error) {
      console.error('خطأ في التحليل التنبؤي:', error);
      alert('حدث خطأ في التحليل التنبؤي. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  // معالجة رفع الصورة
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // تحليل الصورة بالذكاء الاصطناعي
  const handleImageAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const analysisText = await analyzeImageWithOpenAIPredictivePrompt(selectedImage, 'مكون عام');
      let parsed: ImageAnalysisResult | null = null;
      try {
        parsed = JSON.parse(analysisText);
      } catch (e) {
        parsed = {
          findings: [],
          riskLevel: 'medium',
          recommendations: [],
          overallCondition: '',
          detailedReport: analysisText
        };
      }
      setAnalysisResult(parsed);
      // إنشاء تقرير شامل (اختياري)
      // const report = await generateMaintenanceReport(parsed);
      // console.log('تقرير الصيانة:', report);
    } catch (error) {
      console.error('خطأ في تحليل الصورة:', error);
      alert('حدث خطأ في تحليل الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredPredictions = selectedAircraft === 'all'
    ? [...predictions, ...aiPredictions]
    : [...predictions, ...aiPredictions].filter(p => p.aircraftId === selectedAircraft);

  const selectedPredictionData = predictions.find(p => p.id === selectedPrediction);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500';
      default: return 'text-gray-400 bg-gray-800 border-gray-600';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const getAircraftNumber = (id: string) => {
    return aircraftData.find(a => a.id === id)?.number || 'غير محدد';
  };

  const getAircraftData = (id: string) => {
    return aircraftData.find(a => a.id === id);
  };

  const riskStats = {
    high: predictions.filter(p => p.risk === 'high').length,
    medium: predictions.filter(p => p.risk === 'medium').length,
    low: predictions.filter(p => p.risk === 'low').length
  };

  const handleStepComplete = () => {
    if (!selectedPredictionData) return;

    const stepKey = `${selectedPrediction}-${currentStep}`;
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: true
    }));

    if (currentStep < selectedPredictionData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      setAllStepsCompleted(true);
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    const stepKey = `${selectedPrediction}-${stepIndex}`;
    return completedSteps[stepKey] || false;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        sender: 'user' as const,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai' as const,
        message: 'فهمت استفسارك. بناءً على البيانات المتاحة، أنصح بالتركيز على الخطوة الحالية وتوثيق جميع القراءات. هل تحتاج توضيحاً إضافياً؟',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };

      setChatMessages(prev => [...prev, userMessage, aiResponse]);
      setNewMessage('');
    }
  };

  // إذا تم اختيار تنبيه معين، اعرض صفحة التفاصيل
  if (selectedPrediction && selectedPredictionData) {
    const aircraft = getAircraftData(selectedPredictionData.aircraftId);

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedPrediction(null)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">التعامل مع التنبيه - {selectedPredictionData.component}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>الطائرة: {aircraft?.number}</span>
                <span>•</span>
                <span>مستوى المخاطر: {getRiskText(selectedPredictionData.risk)}</span>
                <span>•</span>
                <span>الثقة: {selectedPredictionData.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-6 bg-gray-800 border-b border-gray-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-3">وصف المشكلة</h2>
            <p className="text-gray-300 mb-4">{selectedPredictionData.description}</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">الأعراض المكتشفة:</h3>
                <div className="space-y-1">
                  {selectedPredictionData.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">معلومات الطائرة:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">الرقم:</span> {aircraft?.number}</p>
                  <p><span className="text-gray-400">الطراز:</span> {aircraft?.model}</p>
                  <p><span className="text-gray-400">الشركة:</span> {aircraft?.airline}</p>
                  <p><span className="text-gray-400">الحالة:</span> {aircraft?.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-300px)] bg-gray-900">
          {/* Steps Panel - Right */}
          <div className="w-1/2 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">خطوات التعامل</h2>
                <p className="text-sm text-gray-400">اتبع الخطوات بالترتيب</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {selectedPredictionData.steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${isStepCompleted(index)
                    ? 'border-green-500 bg-green-900/20'
                    : index === currentStep
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isStepCompleted(index)
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                      }`}>
                      {isStepCompleted(index) ? <CheckCircle className="h-3 w-3" /> : index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${isStepCompleted(index) ? 'text-green-400' :
                        index === currentStep ? 'text-blue-400' : 'text-white'
                        }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {index === currentStep && (
                    <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                      <div className="flex items-start gap-2">
                        <Info className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-300">
                          <span className="font-medium">نصيحة:</span> {step.tip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Complete Step Button */}
            {!allStepsCompleted ? (
              <button
                onClick={handleStepComplete}
                disabled={isStepCompleted(currentStep)}
                className={`w-full font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${isStepCompleted(currentStep)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                <CheckCircle className="h-5 w-5" />
                {isStepCompleted(currentStep) ? 'تم إنهاء الخطوة' :
                  currentStep < selectedPredictionData.steps.length - 1 ? 'إنهاء الخطوة' : 'إنهاء المعالجة'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-green-400 mb-1">تم حل المشكلة بنجاح!</h3>
                  <p className="text-sm text-gray-300">جميع الخطوات مكتملة ومسجلة</p>
                </div>
                <button
                  onClick={() => navigate('/reports', { state: { fromMaintenance: true } })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <FileText className="h-5 w-5" />
                  عرض التقرير النهائي
                </button>
              </div>
            )}
          </div>

          {/* Instructions Panel - Left */}
          <div className="w-1/2 p-6 border-r border-gray-700">
            <div className="h-full flex flex-col">
              {/* Instructions Image */}
              <div className="flex-1 mb-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  إرشادات الخطوة الحالية
                </h3>
                <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center border border-gray-700">
                  <img
                    src="https://images.pexels.com/photos/159832/aircraft-engine-aircraft-maintenance-159832.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="إرشادات الصيانة"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Start Chat Button */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowChatDialog(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg transition-all duration-300"
                >
                  <Play className="h-5 w-5" />
                  بدء المساعدة الذكية
                </button>

                <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                  <Info className="h-3 w-3" />
                  <span>سيتم تشغيل المساعد الذكي لإرشادك خطوة بخطوة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Dialog */}
        {showChatDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl h-[85vh] flex">
              {/* Chatbot Panel - Right */}
              <div className="w-1/2 p-6 border-l border-gray-700 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">المساعد الذكي</h3>
                      <p className="text-sm text-gray-400">مساعدك في التعامل مع التنبيه</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChatDialog(false)}
                    className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-sm p-3 rounded-lg ${message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-700 text-gray-200 rounded-bl-sm'
                          }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب استفسارك..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="btn-primary px-4 py-2 rounded-lg text-sm"
                  >
                    إرسال
                  </button>
                </div>
              </div>

              {/* Camera Panel - Left */}
              <div className="w-1/2 p-6 flex flex-col">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-400" />
                  كاميرا التوثيق
                </h3>

                <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center mb-4 border-2 border-gray-700">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">كاميرا توثيق الإصلاح</p>
                    <div className="space-y-2">
                      <button className="btn-primary w-full py-2">
                        تشغيل الكاميرا
                      </button>
                      <button className="btn-secondary w-full py-2">
                        التقاط صورة
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn-primary flex-1 py-2">
                    حفظ التقرير
                  </button>
                  <button
                    onClick={() => setShowChatDialog(false)}
                    className="btn-secondary flex-1 py-2"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // الصفحة الرئيسية لنظام التنبؤات
  return (
    <div className="p-6 h-screen overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">نظام التنبؤات</h1>
        <p className="text-gray-400">الصيانة التنبؤية المدعومة بالذكاء الاصطناعي</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">مخاطر عالية</p>
              <p className="text-2xl font-bold text-red-400">{riskStats.high}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">مخاطر متوسطة</p>
              <p className="text-2xl font-bold text-yellow-400">{riskStats.medium}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">مخاطر منخفضة</p>
              <p className="text-2xl font-bold text-green-400">{riskStats.low}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">دقة التنبؤ</p>
              <p className="text-2xl font-bold text-blue-400">87%</p>
            </div>
            <Brain className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleAIPredictiveAnalysis}
          disabled={isLoadingPredictions}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {isLoadingPredictions ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          تحليل ذكي للبيانات
        </button>

        <button
          onClick={() => setShowImageAnalysis(true)}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all duration-300"
        >
          <Camera className="h-4 w-4" />
          تحليل الصور
        </button>

        <select
          value={selectedAircraft}
          onChange={(e) => setSelectedAircraft(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="all">جميع الطائرات</option>
          {aircraftData.map((aircraft) => (
            <option key={aircraft.id} value={aircraft.id}>
              {aircraft.number} - {aircraft.model}
            </option>
          ))}
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="7">الأسبوع القادم</option>
          <option value="30">الشهر القادم</option>
          <option value="90">الـ 3 أشهر القادمة</option>
        </select>
      </div>

      {/* Predictions Grid */}
      <div className="grid gap-6 mb-6">
        {filteredPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`border rounded-lg p-6 cursor-pointer hover:scale-105 transition-all duration-300 ${getRiskColor(prediction.risk)}`}
            onClick={() => setSelectedPrediction(prediction.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1">{prediction.component}</h3>
                <p className="text-gray-400">
                  الطائرة: {getAircraftNumber(prediction.aircraftId)}
                </p>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-bold">{prediction.predictedFailure}</span>
                </div>
                <p className="text-sm text-gray-400">احتمال الفشل</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">مستوى المخاطر</p>
                <span className={`px-2 py-1 rounded text-sm font-medium ${prediction.risk === 'high' ? 'bg-red-600 text-white' :
                  prediction.risk === 'medium' ? 'bg-yellow-600 text-black' :
                    'bg-green-600 text-white'
                  }`}>
                  {getRiskText(prediction.risk)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">مستوى الثقة</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{prediction.confidence}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">التوصية</p>
                <p className="text-sm font-medium">{prediction.recommendation}</p>
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">الأعراض المكتشفة:</p>
              <div className="flex flex-wrap gap-2">
                {prediction.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Click to view details */}
            <div className="flex items-center justify-center gap-2 text-blue-400 text-sm font-medium">
              <span>انقر للتعامل مع التنبيه</span>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Model Performance */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-bold">أداء نموذج الذكاء الاصطناعي</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">87%</p>
            <p className="text-sm text-gray-400">دقة التنبؤ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">92%</p>
            <p className="text-sm text-gray-400">معدل الكشف</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">156</p>
            <p className="text-sm text-gray-400">التنبؤات الصحيحة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">24</p>
            <p className="text-sm text-gray-400">الأعطال المُتجنبة</p>
          </div>
        </div>
      </div>

      {/* Image Analysis Modal */}
      {showImageAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Camera className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold">تحليل الصور بالذكاء الاصطناعي</h3>
                  <p className="text-sm text-gray-400">ارفع صورة لمكون الطائرة للحصول على تحليل فني مفصل</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImageAnalysis(false);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setAnalysisResult(null);
                }}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Upload Section */}
                <div>
                  <h4 className="text-lg font-bold mb-4">رفع الصورة</h4>

                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">اسحب الصورة هنا أو انقر للاختيار</p>
                      <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        اختيار صورة
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="معاينة الصورة"
                        className="w-full h-64 object-cover rounded-lg border border-gray-600"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleImageAnalysis}
                          disabled={isAnalyzing}
                          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Brain className="h-4 w-4" />
                          )}
                          {isAnalyzing ? 'جاري التحليل...' : 'تحليل الصورة'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                            setAnalysisResult(null);
                          }}
                          className="btn-secondary"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Results Section */}
                <div>
                  <h4 className="text-lg font-bold mb-4">نتائج التحليل</h4>

                  {!analysisResult ? (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                      <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">ارفع صورة للحصول على التحليل</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Risk Level */}
                      <div className={`p-4 rounded-lg border ${analysisResult.riskLevel === 'high' ? 'border-red-500 bg-red-900/20' :
                        analysisResult.riskLevel === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                          'border-green-500 bg-green-900/20'
                        }`}>
                        <h5 className="font-bold mb-2">مستوى المخاطر</h5>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${analysisResult.riskLevel === 'high' ? 'bg-red-600 text-white' :
                          analysisResult.riskLevel === 'medium' ? 'bg-yellow-600 text-black' :
                            'bg-green-600 text-white'
                          }`}>
                          {analysisResult.riskLevel === 'high' ? 'عالي' :
                            analysisResult.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>

                      {/* Overall Condition */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h5 className="font-bold mb-2">الحالة العامة</h5>
                        <p className="text-sm text-gray-300">{analysisResult.overallCondition}</p>
                      </div>

                      {/* Findings */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h5 className="font-bold mb-2">الملاحظات المكتشفة</h5>
                        <ul className="space-y-1">
                          {analysisResult.findings.map((finding, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400">•</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h5 className="font-bold mb-2">التوصيات</h5>
                        <ul className="space-y-1">
                          {analysisResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Detailed Report */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h5 className="font-bold mb-2">التقرير المفصل</h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{analysisResult.detailedReport}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predictive;