export enum HealthStatus {
  Good = 'Good',
  Warning = 'Warning',
  Critical = 'Critical'
}

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  status: HealthStatus;
  trend?: 'up' | 'down' | 'stable';
  simpleEnglishLabel: string; // "Heating Power"
  technicalLabel: string; // "Delta-T"
}

export interface AIInsight {
  type: 'NUISANCE_FILTER' | 'LEAD_GEN' | 'MAINTENANCE';
  title: string;
  description: string;
  valueProp?: string; // "$6,500 Rebate"
  isUrgent: boolean;
  predictedFailureDate?: string;
}

export interface HVACSystem {
  id: string;
  address: string;
  ownerName: string;
  systemType: string;
  installDate: string;
  lastServiceDate: string;
  metrics: {
    heatingPower: Metric; // Delta-T
    systemBreathing: Metric; // Static Pressure
    efficiency: Metric;
  };
  insights: AIInsight[];
  location: {
    lat: number;
    lng: number;
    neighborhood: string;
  };
}