import OpenAI from 'openai';

// تحقق من وجود مفتاح API
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
}) : null;

// تحليل الصورة باستخدام OpenAI Vision
// تحليل الصورة باستخدام OpenAI Vision (gpt-4o)
export async function analyzeImageWithOpenAI(imageFile: File, problemType: string): Promise<string> {
  if (!openai) {
    return 'تحليل تجريبي: تم فحص الصورة وتبدو المكونات في حالة جيدة عموماً. يُنصح بالمتابعة الدورية والفحص اليدوي للتأكد من السلامة.';
  }

  try {
    // تحويل الصورة إلى base64 وإزالة البادئة
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const cleanedBase64 = result.replace(/^data:image\/\w+;base64,/, '');
        resolve(cleanedBase64);
      };
      reader.readAsDataURL(imageFile);
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // مهم جداً: استخدام gpt-4o لدعم الصور
      messages: [
        {
          role: "system",
          content: `أنت خبير صيانة طائرات متخصص في التحليل البصري. مهمتك تحليل صور مكونات الطائرات وتقديم تقييم فني دقيق.

المعايير:

نوع المشكلة المحتملة: ${problemType}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "قم بتحليل هذه الصورة لمكون الطائرة وقدم تقييماً فنياً شاملاً يتضمن: الحالة العامة، أي مشاكل مرئية، مستوى المخاطر، والتوصيات."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return response.choices[0]?.message?.content || 'لم أتمكن من تحليل الصورة. يرجى المحاولة مرة أخرى.';
  } catch (error) {
    console.error('خطأ في تحليل الصورة:', error);

    const fallbackAnalysis = {
      'engine': 'تحليل تجريبي للمحرك: يُنصح بفحص مستوى الزيت، درجة الحرارة، والاهتزازات. تأكد من عدم وجود تسريبات أو أصوات غير طبيعية.',
      'electrical': 'تحليل تجريبي للنظام الكهربائي: افحص التوصيلات، مستوى البطارية، والأسلاك. تأكد من عدم وجود حروق أو تآكل في المكونات.',
      'hydraulic': 'تحليل تجريبي للنظام الهيدروليكي: افحص مستوى السوائل، الضغط، والخراطيم. ابحث عن علامات التسرب أو التآكل.',
      'structural': 'تحليل تجريبي للهيكل: افحص وجود تشققات، تآكل، أو تلف في المعدن. تأكد من سلامة البراغي والوصلات.'
    };

    return fallbackAnalysis[problemType as keyof typeof fallbackAnalysis] || 'حدث خطأ في تحليل الصورة. يُنصح بالفحص اليدوي المفصل والاستعانة بخبير الصيانة.';
  }
}

// الرد على رسائل المحادثة باستخدام OpenAI
export async function getChatResponse(message: string, context: string, imageFile?: File): Promise<string> {
  if (!openai) {
    // ردود تجريبية ذكية
    const responses = [
      'فهمت استفسارك. بناءً على الخبرة، أنصح بفحص المكون بعناية والتأكد من عدم وجود تشققات أو تآكل.',
      'هذا سؤال مهم. من المهم اتباع إجراءات السلامة والتأكد من إيقاف تشغيل النظام قبل الفحص.',
      'بناءً على الوصف، يبدو أن المشكلة قد تكون بسيطة. أنصح بالتوثيق الدقيق وأخذ صور إضافية.',
      'ممتاز! هذا النوع من الفحص مهم جداً. تأكد من استخدام الأدوات المناسبة وتسجيل جميع الملاحظات.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  try {
    let userContent: any = message;
    if (imageFile) {
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const cleanedBase64 = result.replace(/^data:image\/\w+;base64,/, '');
          resolve(cleanedBase64);
        };
        reader.readAsDataURL(imageFile);
      });
      userContent = [
        { type: 'text', text: message },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: 'high' } }
      ];
    }
    const response = await openai.chat.completions.create({
      model: imageFile ? 'gpt-4o' : 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في صيانة الطائرات. مهمتك مساعدة الفنيين في التشخيص وحل المشاكل.\n\nالسياق الحالي: ${context}\n\nإرشادات الرد:\n- قدم نصائح عملية وقابلة للتطبيق\n- اذكر إجراءات السلامة عند الضرورة\n- ركز على الحلول العملية`
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من فهم استفسارك. يرجى إعادة صياغة السؤال.';
  } catch (error) {
    console.error('خطأ في الحصول على رد المحادثة:', error);
    return 'حدث خطأ في النظام. أنصح بالمتابعة مع المشرف المختص للحصول على المساعدة.';
  }
}
export interface PredictiveAnalysis {
  component: string;
  risk: 'high' | 'medium' | 'low';
  predictedFailure: string;
  confidence: number;
  symptoms: string[];
  recommendation: string;
  description: string;
  steps: Array<{
    title: string;
    description: string;
    tip: string;
  }>;
}

export interface ImageAnalysisResult {
  findings: string[];
  riskLevel: 'high' | 'medium' | 'low';
  recommendations: string[];
  overallCondition: string;
  detailedReport: string;
}

const AIRCRAFT_MAINTENANCE_PROMPT = `
أنت خبير صيانة طائرات متخصص في التحليل التنبؤي والفحص البصري. مهمتك تحليل البيانات والصور لتقديم تقارير فنية دقيقة.

المهام الأساسية:
1. تحليل البيانات التشغيلية للطائرات
2. التنبؤ بالأعطال المحتملة
3. تحليل الصور الفنية للمكونات
4. تقديم توصيات الصيانة الوقائية

معايير التحليل:
- استخدم المعايير الدولية لصيانة الطائرات (IATA, ICAO)
- قدم تحليلاً دقيقاً ومفصلاً
- اذكر مستوى المخاطر بوضوح
- قدم خطوات عملية للإصلاح
- استخدم اللغة العربية الفصحى

عند تحليل الصور:
- حدد نوع المكون أو النظام
- اذكر أي علامات تآكل أو تلف
- قيم الحالة العامة
- قدم توصيات محددة
`;

export async function analyzePredictiveData(aircraftData: any): Promise<PredictiveAnalysis> {
  // استخدام بيانات وهمية للعرض التوضيحي
  return {
    component: 'مضخة الوقود',
    risk: 'medium',
    predictedFailure: '7 أيام',
    confidence: 85,
    symptoms: ['انخفاض ضغط الوقود', 'اهتزاز طفيف'],
    recommendation: 'مراقبة دورية',
    description: 'تحليل تجريبي للبيانات',
    steps: [
      {
        title: 'فحص الضغط',
        description: 'قياس ضغط النظام',
        tip: 'استخدم المقاييس المعايرة'
      }
    ]
  };
}

export async function analyzeImage(imageFile: File, problemType: string = 'مكون عام'): Promise<ImageAnalysisResult> {
  if (!openai) {
    // استخدام بيانات وهمية للعرض التوضيحي
    return {
      findings: ['المكون في حالة جيدة', 'لا توجد علامات تآكل واضحة'],
      riskLevel: 'low',
      recommendations: ['متابعة الفحص الدوري', 'تنظيف المكون'],
      overallCondition: 'حالة جيدة',
      detailedReport: 'تحليل تجريبي للصورة - المكون يبدو في حالة مقبولة'
    };
  }
  try {
    const analysisText = await analyzeImageWithOpenAI(imageFile, problemType);
    // تحليل نص OpenAI إلى كائن مفصل (بسيط)
    return {
      findings: [analysisText],
      riskLevel: analysisText.includes('عالي') ? 'high' : analysisText.includes('متوسط') ? 'medium' : 'low',
      recommendations: [],
      overallCondition: '',
      detailedReport: analysisText
    };
  } catch (error) {
    return {
      findings: ['حدث خطأ في تحليل الصورة'],
      riskLevel: 'medium',
      recommendations: [],
      overallCondition: '',
      detailedReport: 'حدث خطأ في تحليل الصورة'
    };
  }
}

export async function generateMaintenanceReport(analysisData: any): Promise<string> {
  // استخدام تقرير وهمي للعرض التوضيحي
  return JSON.stringify({
    reportId: 'RPT-' + Date.now(),
    aircraft: analysisData.aircraft || {},
    inspector: { name: 'نظام تجريبي', date: new Date().toLocaleDateString('ar-SA') },
    overallScore: 85,
    overallStatus: 'حالة جيدة',
    sections: [],
    aiRecommendations: [],
    notes: 'تقرير تجريبي',
    summary: 'تحليل أولي للطائرة'
  });
}

// تحليل الصورة باستخدام برومبت مخصص للتنبؤات (يطلب فقط الحقول المطلوبة بصيغة JSON)
export async function analyzeImageWithOpenAIPredictivePrompt(imageFile: File, problemType: string): Promise<string> {
  if (!openai) {
    return '';
  }
  try {
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const cleanedBase64 = result.replace(/^data:image\/\w+;base64,/, '');
        resolve(cleanedBase64);
      };
      reader.readAsDataURL(imageFile);
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `أنت خبير صيانة طائرات محترف. مهمتك تحليل صور مكونات الطائرات بدقة عالية.\n\nيرجى أن يكون ردك دائماً بصيغة JSON فقط وبدون أي شرح أو نص إضافي، ويحتوي فقط على الحقول التالية:\n- riskLevel: (high | medium | low)\n- overallCondition: (string)\n- findings: (array of strings)\n- recommendations: (array of strings)\n- detailedReport: (string)\n\nمثال للرد:\n{\n  "riskLevel": "high",\n  "overallCondition": "حالة حرجة",\n  "findings": ["تآكل شديد", "تسريب زيت"],\n  "recommendations": ["استبدال الجزء فوراً", "مراقبة مستمرة"],\n  "detailedReport": "تم رصد تآكل وتسريب زيت في المكون. ينصح بالاستبدال الفوري."\n}\n\nنوع المشكلة: ${problemType}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "قم بتحليل هذه الصورة لمكون الطائرة وأعد فقط JSON كما في المثال أعلاه."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('خطأ في تحليل الصورة (برومبت التنبؤات):', error);
    return '';
  }
}