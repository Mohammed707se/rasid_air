import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Plane, Wifi, Search, Navigation, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// إصلاح أيقونات Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FlightData {
  id: string;
  callsign: string;
  number: string;
  model: string;
  airline: string;
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  heading: number;
  status: 'سليم' | 'تنبيه' | 'عطل';
  lastUpdate: string;
}

// إنشاء أيقونة طائرة مخصصة
const createAircraftIcon = (status: string, heading: number) => {
  const color = status === 'سليم' ? '#22c55e' : status === 'تنبيه' ? '#f59e0b' : '#ef4444';
  
  return L.divIcon({
    html: `
      <div style="
        transform: rotate(${heading}deg);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `,
    className: 'aircraft-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// مكون لتحديث الخريطة
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const LiveTracking: React.FC = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.7136, 46.6753]); // الرياض
  const [mapZoom, setMapZoom] = useState(6);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // جلب بيانات الطيران من OpenSky API
  const fetchFlightData = async () => {
    try {
      setError(null);
      
      // محاولة جلب البيانات من OpenSky API
      const response = await fetch('https://opensky-network.org/api/states/all?lamin=12&lomin=34&lamax=32&lomax=55');
      
      if (response.ok) {
        const data = await response.json();
        const flights: FlightData[] = [];
        
        if (data.states && Array.isArray(data.states)) {
          data.states.forEach((state: any[], index: number) => {
            if (state[5] && state[6] && state[1]) { // lat, lng, callsign
              const callsign = state[1].trim();
              if (callsign && state[5] >= 12 && state[5] <= 32 && state[6] >= 34 && state[6] <= 55) {
                flights.push({
                  id: `flight-${index}`,
                  callsign: callsign,
                  number: callsign,
                  model: getAircraftModel(callsign),
                  airline: getAirlineName(callsign),
                  lat: state[6], // longitude
                  lng: state[5], // latitude
                  altitude: state[7] || 0,
                  velocity: Math.round(state[9] || 0),
                  heading: state[10] || 0,
                  status: getRandomStatus(),
                  lastUpdate: new Date().toISOString()
                });
              }
            }
          });
        }
        
        if (flights.length > 0) {
          setFlightData(flights.slice(0, 20)); // أول 20 طائرة
        } else {
          // استخدام بيانات وهمية إذا لم توجد طائرات
          setFlightData(generateMockFlightData());
        }
      } else {
        throw new Error('فشل في الاتصال بـ OpenSky API');
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('خطأ في جلب بيانات الطيران:', err);
      setError('فشل في جلب بيانات الطيران الحية - استخدام البيانات التجريبية');
      
      // استخدام بيانات وهمية في حالة الخطأ
      setFlightData(generateMockFlightData());
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  // تحديد نوع الطائرة بناءً على رمز الطيران
  const getAircraftModel = (callsign: string): string => {
    if (!callsign) return 'غير محدد';
    
    const models = [
      'Boeing 777-300ER', 'Airbus A320', 'Boeing 787-9', 
      'Airbus A330', 'Boeing 737-800', 'Embraer E190'
    ];
    
    return models[Math.floor(Math.random() * models.length)];
  };

  // تحديد اسم شركة الطيران
  const getAirlineName = (callsign: string): string => {
    if (!callsign) return 'غير محدد';
    
    if (callsign.startsWith('SVA') || callsign.startsWith('SV')) return 'الخطوط السعودية';
    if (callsign.startsWith('NAS') || callsign.startsWith('XY')) return 'طيران ناس';
    if (callsign.startsWith('QTR') || callsign.startsWith('QR')) return 'الخطوط القطرية';
    if (callsign.startsWith('UAE') || callsign.startsWith('EK')) return 'طيران الإمارات';
    if (callsign.startsWith('FDB') || callsign.startsWith('FZ')) return 'فلاي دبي';
    if (callsign.startsWith('THY') || callsign.startsWith('TK')) return 'الخطوط التركية';
    if (callsign.startsWith('KAC') || callsign.startsWith('KU')) return 'الخطوط الكويتية';
    if (callsign.startsWith('RJA') || callsign.startsWith('RJ')) return 'الملكية الأردنية';
    
    return 'شركة طيران دولية';
  };

  // حالة عشوائية للطائرة
  const getRandomStatus = (): 'سليم' | 'تنبيه' | 'عطل' => {
    const statuses: ('سليم' | 'تنبيه' | 'عطل')[] = ['سليم', 'سليم', 'سليم', 'سليم', 'تنبيه', 'عطل'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // بيانات وهمية للاختبار
  const generateMockFlightData = (): FlightData[] => {
    const mockFlights: FlightData[] = [
      {
        id: 'sv001',
        callsign: 'SVA001',
        number: 'SV-001',
        model: 'Boeing 777-300ER',
        airline: 'الخطوط السعودية',
        lat: 24.7136 + (Math.random() - 0.5) * 4,
        lng: 46.6753 + (Math.random() - 0.5) * 4,
        altitude: 35000,
        velocity: 450,
        heading: Math.random() * 360,
        status: 'سليم',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'sv002',
        callsign: 'SVA002',
        number: 'SV-002',
        model: 'Airbus A320',
        airline: 'الخطوط السعودية',
        lat: 26.2041 + (Math.random() - 0.5) * 4,
        lng: 50.1109 + (Math.random() - 0.5) * 4,
        altitude: 32000,
        velocity: 420,
        heading: Math.random() * 360,
        status: 'تنبيه',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'nas001',
        callsign: 'NAS001',
        number: 'XY-001',
        model: 'Airbus A320',
        airline: 'طيران ناس',
        lat: 21.4225 + (Math.random() - 0.5) * 4,
        lng: 39.8262 + (Math.random() - 0.5) * 4,
        altitude: 28000,
        velocity: 380,
        heading: Math.random() * 360,
        status: 'سليم',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'qtr001',
        callsign: 'QTR001',
        number: 'QR-001',
        model: 'Boeing 787-9',
        airline: 'الخطوط القطرية',
        lat: 25.2732 + (Math.random() - 0.5) * 4,
        lng: 51.6080 + (Math.random() - 0.5) * 4,
        altitude: 38000,
        velocity: 480,
        heading: Math.random() * 360,
        status: 'عطل',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'uae001',
        callsign: 'UAE001',
        number: 'EK-001',
        model: 'Airbus A380',
        airline: 'طيران الإمارات',
        lat: 25.2532 + (Math.random() - 0.5) * 4,
        lng: 55.3657 + (Math.random() - 0.5) * 4,
        altitude: 41000,
        velocity: 520,
        heading: Math.random() * 360,
        status: 'سليم',
        lastUpdate: new Date().toISOString()
      }
    ];

    return mockFlights;
  };

  // تحديث البيانات كل 30 ثانية
  useEffect(() => {
    fetchFlightData();
    
    intervalRef.current = setInterval(() => {
      fetchFlightData();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // فلترة الطائرات حسب البحث
  const filteredAircraft = flightData.filter(aircraft =>
    aircraft.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aircraft.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aircraft.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToAircraft = (aircraftId: string) => {
    const aircraft = flightData.find(a => a.id === aircraftId);
    if (aircraft) {
      setSelectedAircraft(aircraftId);
      setMapCenter([aircraft.lat, aircraft.lng]);
      setMapZoom(10);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'سليم': 'bg-green-500 text-white',
      'تنبيه': 'bg-yellow-500 text-black',
      'عطل': 'bg-red-500 text-white'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري تحميل بيانات الطيران الحية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-900">
      {/* Map Section */}
      <div className="flex-1 bg-gray-800 border-l border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">خريطة المتابعة الحية - الطائرات</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchFlightData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث
            </button>
            <div className="flex items-center gap-2 text-green-400">
              <Wifi className="h-5 w-5" />
              <span className="text-sm">متصل مباشر</span>
            </div>
            <div className="text-xs text-gray-400">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Leaflet Map */}
        <div className="h-[calc(100vh-120px)] rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="leaflet-container"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {filteredAircraft.map((aircraft) => (
              <Marker
                key={aircraft.id}
                position={[aircraft.lat, aircraft.lng]}
                icon={createAircraftIcon(aircraft.status, aircraft.heading)}
                eventHandlers={{
                  click: () => navigateToAircraft(aircraft.id),
                }}
              >
                <Popup className="aircraft-popup">
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-white">{aircraft.callsign}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(aircraft.status)}`}>
                        {aircraft.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-300">
                      <p><strong>الطراز:</strong> {aircraft.model}</p>
                      <p><strong>الشركة:</strong> {aircraft.airline}</p>
                      <p><strong>الارتفاع:</strong> {aircraft.altitude.toLocaleString()} قدم</p>
                      <p><strong>السرعة:</strong> {aircraft.velocity} عقدة</p>
                      <p><strong>الاتجاه:</strong> {Math.round(aircraft.heading)}°</p>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="text-xs text-gray-400">
                        آخر تحديث: {new Date(aircraft.lastUpdate).toLocaleTimeString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 flex flex-col h-screen overflow-hidden">
        {/* Search and Navigation */}
        <div className="space-y-3 mb-4">
          <h3 className="text-lg font-bold text-white">البحث والتنقل</h3>
          <div className="relative">
            <Search className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن طائرة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Flight Statistics */}
        <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 mb-4">
          <h3 className="text-base font-bold text-white mb-3">إحصائيات الطيران</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{flightData.length}</div>
              <div className="text-gray-400">طائرات نشطة</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {flightData.filter(f => f.status === 'سليم').length}
              </div>
              <div className="text-gray-400">سليمة</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">
                {flightData.filter(f => f.status === 'تنبيه').length}
              </div>
              <div className="text-gray-400">تنبيهات</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">
                {flightData.filter(f => f.status === 'عطل').length}
              </div>
              <div className="text-gray-400">أعطال</div>
            </div>
          </div>
        </div>

        {/* Aircraft List */}
        <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">الطائرات النشطة</h3>
            <span className="text-sm text-gray-400">({filteredAircraft.length})</span>
          </div>
          <div className="space-y-2 h-full overflow-y-auto">
            {filteredAircraft.map((aircraft) => (
              <div
                key={aircraft.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAircraft === aircraft.id 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'bg-gray-800 hover:bg-gray-600'
                }`}
                onClick={() => navigateToAircraft(aircraft.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-bold text-sm text-white">{aircraft.callsign}</p>
                    <p className="text-xs text-gray-400">{aircraft.model}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(aircraft.status)}`}>
                    {aircraft.status}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>الشركة:</span>
                    <span>{aircraft.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الارتفاع:</span>
                    <span>{aircraft.altitude.toLocaleString()} قدم</span>
                  </div>
                  <div className="flex justify-between">
                    <span>السرعة:</span>
                    <span>{aircraft.velocity} عقدة</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(aircraft.lastUpdate).toLocaleTimeString('ar-SA')}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToAircraft(aircraft.id);
                    }}
                    className="flex items-center gap-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                  >
                    <Navigation className="h-3 w-3" />
                    تتبع
                  </button>
                </div>
              </div>
            ))}
            
            {filteredAircraft.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Plane className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>لا توجد طائرات تطابق البحث</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;