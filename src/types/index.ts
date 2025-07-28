export interface Aircraft {
  id: string;
  number: string;
  model: string;
  airline: string;
  status: 'سليم' | 'تنبيه' | 'عطل';
  lastInspection: string;
  image: string;
  location?: {
    lat: number;
    lng: number;
  };
  faults?: Fault[];
}

export interface Fault {
  id: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: string;
  reportedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  specialization: string;
  currentAssignment?: string;
  status: 'متاح' | 'مشغول' | 'في إجازة';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  minStock: number;
  lastRestocked: string;
}

export interface MaintenanceSection {
  id: string;
  name: string;
  status: 'مكتمل' | 'جاري' | 'لم يبدأ';
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  description: string;
  checked: boolean;
  notes?: string;
}