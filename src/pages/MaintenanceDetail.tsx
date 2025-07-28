import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  MessageCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Play,
  X,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Settings,
  ChevronRight,
  FileText,
  Brain,
  Upload,
  Loader,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Save,
  Plus
} from 'lucide-react';
import { Send } from 'lucide-react';
import { aircraftData } from '../data/mockData';
import { analyzePredictiveData, analyzeImage, generateMaintenanceReport, getChatResponse } from '../services/openai';

const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const aircraft = aircraftData.find(a => a.id === id);
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<{ [key: number]: boolean }>({});
  const [showSmartInspection, setShowSmartInspection] = useState(false);
  type ChatMessage = {
    id: number;
    sender: 'ai' | 'user';
    message: string;
    timestamp: string;
    image?: string;
  };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      message: 'مرحباً بك في نظام الفحص الذكي المدعوم بالذكاء الاصطناعي! سأقوم بإرشادك خطوة بخطوة وتحليل البيانات لتقديم توصيات دقيقة.',
      timestamp: new Date().toLocaleTimeString('ar-SA')
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [smartInspectionCompleted, setSmartInspectionCompleted] = useState(false);
  const [sectionImages, setSectionImages] = useState<{ [key: number]: File[] }>({});
  const [sectionImagePreviews, setSectionImagePreviews] = useState<{ [key: number]: string[] }>({});
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [currentTaskIndex, setCurrentTaskIndex] = useState<{ [key: number]: number }>({});
  const [chatImage, setChatImage] = useState<File | null>(null);
  const [sectionImageAnalyses, setSectionImageAnalyses] = useState<{ [sectionIndex: number]: string[] }>({});

  if (!aircraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">الطائرة غير موجودة</h1>
          <Link to="/maintenance" className="btn-primary">
            العودة لقائمة الصيانة
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: 0,
      name: 'الهيكل الخارجي',
      status: 'completed',
      icon: Shield,
      color: '#10b981',
      bgGradient: 'from-green-900/30 to-emerald-900/20',
      borderColor: 'border-green-500/40'
    },
    {
      id: 1,
      name: 'المحرك',
      status: 'in-progress',
      icon: Zap,
      color: '#f59e0b',
      bgGradient: 'from-yellow-900/30 to-orange-900/20',
      borderColor: 'border-yellow-500/40'
    },
    {
      id: 2,
      name: 'الكهرباء',
      status: 'pending',
      icon: Settings,
      color: '#3b82f6',
      bgGradient: 'from-blue-900/30 to-cyan-900/20',
      borderColor: 'border-blue-500/40'
    },
    {
      id: 3,
      name: 'الأنظمة الداخلية',
      status: 'pending',
      icon: Shield,
      color: '#8b5cf6',
      bgGradient: 'from-purple-900/30 to-violet-900/20',
      borderColor: 'border-purple-500/40'
    }
  ];

  const sectionTasks = {
    0: [
      {
        id: 'ext-1',
        title: 'فحص الجناح الأيمن',
        description: 'تأكد من عدم وجود تشققات أو تآكل في سطح الجناح',
        estimatedTime: '30 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'ext-2',
        title: 'فحص الجناح الأيسر',
        description: 'افحص حالة الجناح الأيسر والتأكد من سلامة الهيكل',
        estimatedTime: '30 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'ext-3',
        title: 'فحص جسم الطائرة',
        description: 'فحص شامل لجسم الطائرة من الأمام والخلف',
        estimatedTime: '45 دقيقة',
        priority: 'متوسطة',
      },
      {
        id: 'ext-4',
        title: 'فحص الذيل والدفة',
        description: 'التأكد من سلامة الذيل وأسطح التحكم',
        estimatedTime: '25 دقيقة',
        priority: 'عالية',
      }
    ],
    1: [
      {
        id: 'eng-1',
        title: 'فحص المحرك الأيمن',
        description: 'فحص حالة المحرك الأيمن والمكونات الخارجية',
        estimatedTime: '60 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'eng-2',
        title: 'فحص المحرك الأيسر',
        description: 'فحص المحرك الأيسر وأنابيب الوقود',
        estimatedTime: '60 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'eng-3',
        title: 'فحص أنظمة الوقود',
        description: 'التحقق من سلامة خطوط الوقود والمضخات',
        estimatedTime: '40 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'eng-4',
        title: 'اختبار الأداء',
        description: 'إجراء اختبارات الأداء الأساسية',
        estimatedTime: '90 دقيقة',
        priority: 'متوسطة',
      }
    ],
    2: [
      {
        id: 'elec-1',
        title: 'فحص الأسلاك الرئيسية',
        description: 'فحص حالة الأسلاك والتوصيلات الكهربائية',
        estimatedTime: '45 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'elec-2',
        title: 'اختبار البطارية',
        description: 'فحص حالة البطارية ومستوى الشحن',
        estimatedTime: '30 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'elec-3',
        title: 'فحص أنظمة الإضاءة',
        description: 'اختبار جميع أنظمة الإضاءة الداخلية والخارجية',
        estimatedTime: '35 دقيقة',
        priority: 'متوسطة',
      },
      {
        id: 'elec-4',
        title: 'اختبار الأنظمة الإلكترونية',
        description: 'فحص أنظمة الملاحة والاتصالات',
        estimatedTime: '50 دقيقة',
        priority: 'عالية',
      }
    ],
    3: [
      {
        id: 'int-1',
        title: 'فحص أنظمة الأكسجين',
        description: 'التحقق من سلامة أنظمة الأكسجين والضغط',
        estimatedTime: '40 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'int-2',
        title: 'فحص مخارج الطوارئ',
        description: 'اختبار جميع مخارج الطوارئ وآليات الفتح',
        estimatedTime: '35 دقيقة',
        priority: 'عالية',
      },
      {
        id: 'int-3',
        title: 'فحص أحزمة الأمان',
        description: 'فحص حالة أحزمة الأمان وآليات القفل',
        estimatedTime: '30 دقيقة',
        priority: 'متوسطة',
      },
      {
        id: 'int-4',
        title: 'فحص أنظمة الإنذار',
        description: 'اختبار أنظمة الإنذار والتنبيه',
        estimatedTime: '25 دقيقة',
        priority: 'متوسطة',
      }
    ]
  };

  const currentTasks = sectionTasks[activeSection as keyof typeof sectionTasks] || [];
  const currentSectionData = sections[activeSection];

  const handleTaskComplete = () => {
    const currentTaskId = currentTasks[currentTaskIndex[activeSection] || 0]?.id;
    if (currentTaskId) {
      setCompletedTasks(prev => ({
        ...prev,
        [currentTaskId]: true
      }));

      const nextTaskIndex = (currentTaskIndex[activeSection] || 0) + 1;

      if (nextTaskIndex >= currentTasks.length) {
        // إنهاء القسم والانتقال للتالي
        setCompletedSections(prev => ({
          ...prev,
          [activeSection]: true
        }));

        if (activeSection < sections.length - 1) {
          setActiveSection(activeSection + 1);
          setCurrentTaskIndex(prev => ({
            ...prev,
            [activeSection + 1]: 0
          }));
        }
      } else {
        // الانتقال للمهمة التالية في نفس القسم
        setCurrentTaskIndex(prev => ({
          ...prev,
          [activeSection]: nextTaskIndex
        }));
      }
    }
  };

  const isSectionCompleted = (sectionIndex: number) => {
    return completedSections[sectionIndex] || false;
  };

  const isTaskCompleted = (taskId: string) => {
    return completedTasks[taskId] || false;
  };

  const getCurrentTask = () => {
    const taskIndex = currentTaskIndex[activeSection] || 0;
    return currentTasks[taskIndex];
  };

  const getCompletedTasksInSection = () => {
    return currentTasks.filter(task => isTaskCompleted(task.id)).length;
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'متوسطة': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'منخفضة': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-800 border-gray-600';
    }
  };

  const handleAIAnalysis = async () => {
    if (!aircraft) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzePredictiveData({
        number: aircraft.number,
        model: aircraft.model,
        flightHours: Math.floor(Math.random() * 10000) + 5000,
        lastMaintenance: aircraft.lastInspection,
        status: aircraft.status
      });

      const aiMessage = {
        id: Date.now(),
        sender: 'ai' as const,
        message: `تحليل ذكي مكتمل! بناءً على البيانات، أنصح بالتركيز على: ${analysis.component}. مستوى المخاطر: ${analysis.risk}. التوصية: ${analysis.recommendation}`,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setAiRecommendations([analysis.recommendation, ...analysis.symptoms]);

    } catch (error) {
      console.error('خطأ في التحليل:', error);
      const errorMessage = {
        id: Date.now(),
        sender: 'ai' as const,
        message: 'عذراً، حدث خطأ في التحليل. سأستمر في مساعدتك بناءً على الخبرة المتراكمة.',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() || chatImage) {
      const userMessage = {
        id: Date.now(),
        sender: 'user' as const,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('ar-SA'),
        image: chatImage ? URL.createObjectURL(chatImage) : undefined
      };
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsAnalyzing(true);
      try {
        // بناء السياق من بيانات الطائرة والقسم الحالي
        const context = `الطائرة: ${aircraft?.number || ''} - ${aircraft?.model || ''}\nالقسم: ${sections[activeSection]?.name || ''}`;
        const aiResponse = await getChatResponse(newMessage, context, chatImage || undefined);
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai' as const,
          message: aiResponse,
          timestamp: new Date().toLocaleTimeString('ar-SA')
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 2,
          sender: 'ai' as const,
          message: 'حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
          timestamp: new Date().toLocaleTimeString('ar-SA')
        };
        setChatMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsAnalyzing(false);
        setChatImage(null);
      }
    }
  };

  const generateComprehensiveReport = async () => {
    if (!aircraft) return;

    setIsAnalyzing(true);
    try {
      const reportData = {
        aircraft: {
          number: aircraft.number,
          model: aircraft.model,
          airline: aircraft.airline,
          status: aircraft.status
        },
        completedSections: completedSections
      };

      const finalReport = await generateMaintenanceReport(reportData);

      navigate('/reports', {
        state: {
          fromMaintenance: true,
          reportData: reportData,
          finalReport: finalReport
        }
      });

    } catch (error) {
      console.error('خطأ في إنشاء التقرير:', error);
      alert('حدث خطأ في إنشاء التقرير. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completedSectionsCount = Object.keys(completedSections).length;
  const totalSections = sections.length;
  const progressPercentage = (completedSectionsCount / totalSections) * 100;
  const completedTasksCount = getCompletedTasksInSection();

  // التحقق من إكمال جميع الأقسام
  const allSectionsCompleted = completedSectionsCount === totalSections;

  const handleSectionImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const preview = e.target?.result as string;
        setSectionImages(prev => ({
          ...prev,
          [sectionIndex]: [...(prev[sectionIndex] || []), file]
        }));
        setSectionImagePreviews(prev => ({
          ...prev,
          [sectionIndex]: [...(prev[sectionIndex] || []), preview]
        }));
        // ضع مؤشر تحميل
        setSectionImageAnalyses(prev => ({
          ...prev,
          [sectionIndex]: [...(prev[sectionIndex] || []), '__loading__']
        }));
        try {
          const sectionName = sections[sectionIndex]?.name || 'مكون عام';
          const analysis = await analyzeImage(file, sectionName);
          setSectionImageAnalyses(prev => {
            const arr = [...(prev[sectionIndex] || [])];
            arr[arr.length - 1] = analysis.detailedReport;
            return { ...prev, [sectionIndex]: arr };
          });
        } catch (error) {
          setSectionImageAnalyses(prev => {
            const arr = [...(prev[sectionIndex] || [])];
            arr[arr.length - 1] = '';
            return { ...prev, [sectionIndex]: arr };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSectionImage = (sectionIndex: number, imageIndex: number) => {
    setSectionImages(prev => ({
      ...prev,
      [sectionIndex]: (prev[sectionIndex] || []).filter((_, index) => index !== imageIndex)
    }));
    setSectionImagePreviews(prev => ({
      ...prev,
      [sectionIndex]: (prev[sectionIndex] || []).filter((_, index) => index !== imageIndex)
    }));
    setSectionImageAnalyses(prev => ({
      ...prev,
      [sectionIndex]: (prev[sectionIndex] || []).filter((_, index) => index !== imageIndex)
    }));
  };

  // استخرج التوصيات من نص التحليل (يفصل الأسطر أو النقاط أو الفواصل)
  function extractAiRecommendations(text: string): string[] {
    if (!text) return [];
    // جرب الفصل على \n أو النقاط أو الفواصل
    let lines = text.split(/\n|\u2022|\u2023|\-|\*/).map(l => l.trim()).filter(Boolean);
    // إذا كلها سطر واحد، جرب الفصل على الفواصل
    if (lines.length <= 1) {
      lines = text.split(/[،,]/).map(l => l.trim()).filter(Boolean);
    }
    return lines;
  }

  // اجمع توصيات الصور مع توصيات aiRecommendations
  const allSectionImageRecs = (sectionImageAnalyses[activeSection] || []).flatMap(extractAiRecommendations);
  const allAiRecs = [...aiRecommendations, ...allSectionImageRecs].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-tajawal">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            to="/maintenance"
            className="text-gray-400 hover:text-[#00CFFF] transition-colors p-2 rounded-lg hover:bg-gray-700/50"
          >
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#00CFFF] mb-1">صيانة الطائرة {aircraft.number}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{aircraft.model}</span>
              <span>•</span>
              <span>{aircraft.airline}</span>
              <span>•</span>
              <span>الأقسام المكتملة: {completedSectionsCount}/{totalSections}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm px-6 py-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between relative max-w-6xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 to-gray-700 transform -translate-y-1/2 rounded-full"></div>

          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === index;
            const isCompleted = isSectionCompleted(index);
            const isInProgress = section.status === 'in-progress';

            return (
              <div
                key={section.id}
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => setActiveSection(index)}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 backdrop-blur-sm ${isCompleted
                    ? 'bg-gradient-to-br from-green-500/80 to-emerald-600/80 border-green-400 shadow-lg shadow-green-500/30'
                    : isInProgress
                      ? 'bg-gradient-to-br from-blue-500/80 to-cyan-600/80 border-blue-400 shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 border-gray-600 hover:border-gray-500'
                    } ${isActive ? 'scale-110 shadow-2xl' : 'hover:scale-105'}`}
                  style={{
                    boxShadow: isActive ? `0 0 30px ${section.color}40` : undefined
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-8 w-8 text-white" />
                  ) : (
                    <Icon className="h-8 w-8 text-white" />
                  )}
                </div>

                <div className={`mt-3 text-center transition-all duration-300 ${isActive ? 'text-[#00CFFF]' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  <p className="font-bold text-sm">{section.name}</p>
                  <p className="text-xs opacity-75">
                    {isCompleted ? 'مكتمل' : isInProgress ? 'جاري' : 'في الانتظار'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Tasks Panel - Right */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentSectionData.bgGradient} border ${currentSectionData.borderColor}`}
            >
              <currentSectionData.icon className="h-6 w-6" style={{ color: currentSectionData.color }} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#00CFFF]">{currentSectionData.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{completedTasksCount}/{currentTasks.length} مهام مكتملة</span>
                <span>القسم {isSectionCompleted(activeSection) ? 'مكتمل' : `جاري (${completedTasksCount}/${currentTasks.length})`}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${isSectionCompleted(activeSection)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                    style={{ width: `${(completedTasksCount / currentTasks.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {currentTasks.map((task, index) => (
              <div
                key={task.id}
                className={`glass-card border transition-all duration-300 p-4 ${isTaskCompleted(task.id)
                  ? 'border-green-500/50 bg-green-900/20'
                  : index === (currentTaskIndex[activeSection] || 0)
                    ? 'border-blue-500/50 bg-blue-900/20'
                    : 'border-gray-600/50 hover:border-gray-500/70'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isTaskCompleted(task.id)
                      ? 'bg-green-600 text-white'
                      : index === (currentTaskIndex[activeSection] || 0)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                      }`}>
                      {isTaskCompleted(task.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-base text-white">{task.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">{task.estimatedTime}</span>
                    {isTaskCompleted(task.id) && (
                      <span className="text-xs text-green-400 font-bold">✓ مكتملة</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Actions */}
          <div className="mt-6 space-y-3">
            {!isSectionCompleted(activeSection) ? (
              <>
                {getCurrentTask() && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-blue-300 mb-2">المهمة الحالية:</h4>
                    <p className="text-sm text-blue-200">{getCurrentTask().title}</p>
                    <p className="text-xs text-blue-300 opacity-75 mt-1">{getCurrentTask().description}</p>
                  </div>
                )}
                <button
                  onClick={handleTaskComplete}
                  disabled={!getCurrentTask() || isTaskCompleted(getCurrentTask()?.id || '')}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 disabled:hover:scale-100"
                >
                  <CheckCircle className="h-5 w-5" />
                  {getCurrentTask() ? `إنهاء: ${getCurrentTask().title}` : 'لا توجد مهام'}
                </button>
              </>
            ) : (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-green-400 mb-1">تم إنهاء القسم بنجاح!</h3>
                <p className="text-sm text-gray-300">جميع المهام مكتملة ومسجلة</p>
              </div>
            )}

            {allSectionsCompleted && (
              <button
                onClick={generateComprehensiveReport}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
              >
                {isAnalyzing ? <Loader className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                إنشاء التقرير الشامل
              </button>
            )}
          </div>
        </div>

        {/* Visual Guide Panel - Left */}
        <div className="w-1/2 p-6 border-r border-gray-700/50 overflow-y-auto">
          <div className="h-full flex flex-col">
            {/* Visual Instructions */}
            <div className="flex-1 mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#00CFFF]">
                <Eye className="h-6 w-6" />
                الدليل البصري للفحص
              </h3>

              <div className="space-y-4 mb-6">
                {/* صور مقترحة حسب القسم */}
                {activeSection === 0 && (
                  <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/50">
                    <img
                      src="https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="فحص الهيكل الخارجي"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
                {activeSection === 1 && (
                  <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/50">
                    <img
                      src="https://images.pexels.com/photos/159832/aircraft-engine-aircraft-maintenance-159832.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="فحص المحرك"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
                {activeSection === 2 && (
                  <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/50">
                    <img
                      src="https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="فحص النظام الكهربائي"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
                {activeSection === 3 && (
                  <div className="bg-gray-800/50 rounded-xl h-64 flex items-center justify-center border border-gray-700/50">
                    <img
                      src="https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="فحص الأنظمة الداخلية"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Current Task Visual Guide */}
              {getCurrentTask() && (
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-xl p-4 border border-blue-500/30 mb-4">
                  <h4 className="font-bold text-blue-300 mb-2">إرشادات المهمة الحالية</h4>
                  <p className="text-sm text-blue-200 mb-2">{getCurrentTask().title}</p>
                  <p className="text-xs text-blue-300 opacity-75">{getCurrentTask().description}</p>
                  <div className="mt-3 p-2 bg-blue-800/30 rounded-lg">
                    <p className="text-xs text-blue-200">
                      💡 <span className="font-medium">نصيحة:</span> تأكد من اتباع إجراءات السلامة واستخدام الأدوات المناسبة
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Inspection Button */}
            <div className="space-y-3">
              <button
                onClick={() => setShowSmartInspection(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-105"
              >
                <Brain className="h-6 w-6" />
                بدء الفحص الذكي المتقدم
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <Info className="h-3 w-3" />
                <span>مدعوم بالذكاء الاصطناعي لتحليل دقيق ومفصل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Inspection Modal */}
      {showSmartInspection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-3xl border border-gray-600/50 w-full max-w-7xl h-[90vh] flex overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-8 border-b border-gray-600/30 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-xl z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Brain className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    🧠 الفحص الذكي المتقدم
                  </h3>
                  <p className="text-base text-gray-300 font-medium">
                    {aircraft.number} - {currentSectionData.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSmartInspection(false)}
                className="text-gray-400 hover:text-white p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-110"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* Main Interface */}
            <div className="flex w-full pt-24">
              {/* AI Assistant Chat - Right */}
              <div className="w-1/2 p-8 border-l border-gray-600/30 flex flex-col bg-gradient-to-br from-gray-900/50 to-gray-800/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">المساعد الذكي المتقدم</h3>
                    <p className="text-sm text-gray-300">مدعوم بالذكاء الاصطناعي</p>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">نصائح للحصول على أفضل النتائج:</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• اشرح المشكلة بالتفصيل</li>
                    <li>• ارفق صور واضحة للمكون</li>
                    <li>• اذكر أي أصوات أو اهتزازات غير طبيعية</li>
                  </ul>
                </div>

                {/* AI Recommendations */}
                {allAiRecs.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl border border-purple-500/30 shadow-lg">
                    <h4 className="text-base font-bold text-purple-300 mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      توصيات الذكاء الاصطناعي:
                    </h4>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                      {allAiRecs.map((rec, index) => (
                        <div key={index} className="text-sm text-purple-200 flex items-start gap-2 p-2 bg-purple-800/20 rounded-lg">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-sm p-3 rounded-lg ${message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm shadow-lg'
                          : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 rounded-bl-sm shadow-lg'
                          }`}
                      >
                        {message.image && (
                          <img src={message.image} alt="صورة مرفقة" className="mb-2 w-32 h-32 object-cover rounded-lg border border-blue-400" />
                        )}
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <p className="text-xs opacity-75 mt-2">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب استفسارك أو وصف المشكلة..."
                    className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isAnalyzing}
                  />
                  <label className="cursor-pointer flex items-center justify-center bg-gray-700 hover:bg-blue-700 text-white rounded-xl px-3 py-2 transition-all duration-200">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setChatImage(e.target.files[0]);
                        }
                      }}
                      disabled={isAnalyzing}
                    />
                  </label>
                  <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:scale-105 font-medium flex items-center gap-2"
                    disabled={isAnalyzing || (!newMessage.trim() && !chatImage)}
                  >
                    <Send className="h-4 w-4" />
                    {isAnalyzing && <Loader className="h-4 w-4 animate-spin ml-2" />}
                  </button>
                </div>
                {chatImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={URL.createObjectURL(chatImage)} alt="صورة الشات" className="w-16 h-16 object-cover rounded-lg border border-blue-400" />
                    <button onClick={() => setChatImage(null)} className="text-red-400 hover:text-red-600 text-xs">إزالة الصورة</button>
                  </div>
                )}
              </div>

              {/* Image Upload Area - Left */}
              <div className="w-1/2 p-8 flex flex-col bg-gradient-to-br from-gray-800/30 to-gray-900/50">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  رفع صور الفحص
                </h3>

                <div className="flex-1 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl mb-6 border-2 border-dashed border-gray-600/50 p-6 overflow-y-auto backdrop-blur-sm">
                  <div className="space-y-6">
                    {(sectionImagePreviews[activeSection] || []).map((preview, index) => (
                      <div key={index} className="relative bg-gray-800/50 rounded-xl p-3 border border-gray-600/30 shadow-lg">
                        <img
                          src={preview}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeSectionImage(activeSection, index)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {/* أيقونة تحميل أثناء انتظار التحليل */}
                        {sectionImageAnalyses[activeSection] && sectionImageAnalyses[activeSection][index] === '__loading__' && (
                          <div className="absolute left-2 bottom-2">
                            <Loader className="h-6 w-6 animate-spin text-blue-400" />
                          </div>
                        )}
                      </div>
                    ))}

                    {(!sectionImages[activeSection] || sectionImages[activeSection].length < 3) && (
                      <div className="border-2 border-dashed border-gray-500/50 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all duration-300 bg-gray-800/30">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-300 text-base mb-2 font-medium">اسحب الصورة هنا أو انقر للرفع</p>
                        <p className="text-gray-500 text-sm mb-4">PNG, JPG حتى 10MB</p>
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm cursor-pointer inline-flex items-center gap-1 transition-colors">
                          <Camera className="h-4 w-4" />
                          اختيار صورة
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSectionImageUpload(e, activeSection)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {!smartInspectionCompleted ? (
                    <button
                      onClick={() => {
                        setSmartInspectionCompleted(true);
                        // إنهاء جميع الأقسام تلقائياً
                        const allSections = sections.reduce((acc, _, index) => {
                          acc[index] = true;
                          return acc;
                        }, {} as { [key: number]: boolean });
                        setCompletedSections(allSections);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105"
                    >
                      <CheckCircle className="h-5 w-5" />
                      إنهاء الفحص الذكي وجميع المهام
                    </button>
                  ) : (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <h3 className="text-lg font-bold text-green-400 mb-1">تم إنهاء الفحص الذكي!</h3>
                      <p className="text-sm text-gray-300">جميع المهام مكتملة تلقائياً</p>
                    </div>
                  )}

                  {/* Complete Step Button */}
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-105"
                  >
                    {isAnalyzing ? <Loader className="h-5 w-5 animate-spin" /> : <Brain className="h-5 w-5" />}
                    تحليل ذكي متقدم
                  </button>

                  {smartInspectionCompleted && (
                    <button
                      onClick={generateComprehensiveReport}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
                    >
                      <FileText className="h-5 w-5" />
                      إنشاء التقرير النهائي
                    </button>
                  )}

                  <button
                    onClick={() => setShowSmartInspection(false)}
                    className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/30"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceDetail;