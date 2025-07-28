import { Aircraft, Technician, InventoryItem } from '../types';

export const aircraftData: Aircraft[] = [
  {
    id: '1',
    number: 'SV-001',
    model: 'Boeing 777-300ER',
    airline: 'الخطوط السعودية',
    status: 'سليم',
    lastInspection: '2024-01-20',
    image: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 24.7136, lng: 46.6753 }
  },
  {
    id: '2',
    number: 'SV-002',
    model: 'Airbus A320',
    airline: 'الخطوط السعودية',
    status: 'تنبيه',
    lastInspection: '2024-01-18',
    image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 26.2041, lng: 50.1109 }
  },
  {
    id: '3',
    number: 'QR-103',
    model: 'Boeing 787-9',
    airline: 'الخطوط القطرية',
    status: 'عطل',
    lastInspection: '2024-01-15',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 25.2732, lng: 51.6080 }
  },
  {
    id: '4',
    number: 'EK-201',
    model: 'Airbus A380',
    airline: 'طيران الإمارات',
    status: 'سليم',
    lastInspection: '2024-01-22',
    image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 25.2532, lng: 55.3657 }
  },
  {
    id: '5',
    number: 'MS-401',
    model: 'Boeing 737-800',
    airline: 'مصر للطيران',
    status: 'تنبيه',
    lastInspection: '2024-01-19',
    image: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 30.1127, lng: 31.4000 }
  },
  {
    id: '6',
    number: 'TK-501',
    model: 'Airbus A330',
    airline: 'الخطوط التركية',
    status: 'سليم',
    lastInspection: '2024-01-21',
    image: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 41.2753, lng: 28.7519 }
  },
  {
    id: '7',
    number: 'KU-601',
    model: 'Boeing 777-200',
    airline: 'الخطوط الكويتية',
    status: 'عطل',
    lastInspection: '2024-01-16',
    image: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 29.2263, lng: 47.9681 }
  },
  {
    id: '8',
    number: 'RJ-701',
    model: 'Embraer E190',
    airline: 'الملكية الأردنية',
    status: 'سليم',
    lastInspection: '2024-01-23',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 31.7220, lng: 35.9929 }
  },
  {
    id: '9',
    number: 'LH-801',
    model: 'Airbus A350',
    airline: 'لوفتهانزا',
    status: 'سليم',
    lastInspection: '2024-01-24',
    image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 52.5200, lng: 13.4050 }
  },
  {
    id: '10',
    number: 'AF-901',
    model: 'Boeing 777-300',
    airline: 'الخطوط الفرنسية',
    status: 'تنبيه',
    lastInspection: '2024-01-17',
    image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 49.0097, lng: 2.5479 }
  },
  {
    id: '11',
    number: 'BA-101',
    model: 'Airbus A321',
    airline: 'الخطوط البريطانية',
    status: 'سليم',
    lastInspection: '2024-01-25',
    image: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 51.4700, lng: -0.4543 }
  },
  {
    id: '12',
    number: 'JL-201',
    model: 'Boeing 787-8',
    airline: 'الخطوط اليابانية',
    status: 'عطل',
    lastInspection: '2024-01-14',
    image: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 35.7647, lng: 140.3864 }
  },
  {
    id: '13',
    number: 'SQ-301',
    model: 'Airbus A380',
    airline: 'خطوط سنغافورة',
    status: 'سليم',
    lastInspection: '2024-01-26',
    image: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 1.3644, lng: 103.9915 }
  },
  {
    id: '14',
    number: 'CX-401',
    model: 'Boeing 777-300ER',
    airline: 'كاثي باسيفيك',
    status: 'تنبيه',
    lastInspection: '2024-01-16',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 22.3080, lng: 113.9185 }
  },
  {
    id: '15',
    number: 'AA-501',
    model: 'Boeing 737 MAX',
    airline: 'الخطوط الأمريكية',
    status: 'سليم',
    lastInspection: '2024-01-27',
    image: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 32.8998, lng: -97.0403 }
  },
  {
    id: '16',
    number: 'DL-601',
    model: 'Airbus A330-900',
    airline: 'دلتا',
    status: 'عطل',
    lastInspection: '2024-01-13',
    image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: { lat: 33.6407, lng: -84.4277 }
  }
];

export const techniciansData: Technician[] = [
  { id: '1', name: 'أحمد محمد', specialization: 'محركات', status: 'متاح' },
  { id: '2', name: 'فاطمة علي', specialization: 'كهرباء', status: 'مشغول', currentAssignment: 'SV-002' },
  { id: '3', name: 'محمد السعد', specialization: 'هيكل', status: 'متاح' },
  { id: '4', name: 'نورا أحمد', specialization: 'أنظمة داخلية', status: 'في إجازة' },
  { id: '5', name: 'عبدالله خالد', specialization: 'محركات', status: 'مشغول', currentAssignment: 'QR-103' },
  { id: '6', name: 'سارة محمود', specialization: 'كهرباء', status: 'متاح' }
];

export const inventoryData: InventoryItem[] = [
  { id: '1', name: 'مضخة وقود', category: 'محرك', stockLevel: 5, minStock: 10, lastRestocked: '2024-01-15' },
  { id: '2', name: 'كابل كهربائي', category: 'كهرباء', stockLevel: 25, minStock: 15, lastRestocked: '2024-01-20' },
  { id: '3', name: 'إطار هبوط', category: 'هيكل', stockLevel: 3, minStock: 8, lastRestocked: '2024-01-10' },
  { id: '4', name: 'مرشح هواء', category: 'محرك', stockLevel: 12, minStock: 20, lastRestocked: '2024-01-18' },
  { id: '5', name: 'مقعد راكب', category: 'أنظمة داخلية', stockLevel: 8, minStock: 12, lastRestocked: '2024-01-22' }
];