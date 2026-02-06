export enum HealthStatus {
  Good = 'Good',
  Warning = 'Warning',
  Critical = 'Critical'
}

export type Role = 'Admin' | 'Dispatcher' | 'CSR' | 'Technician' | 'Analyst';

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  status: HealthStatus;
  trend?: 'up' | 'down' | 'stable';
  simpleEnglishLabel: string;
  technicalLabel: string;
}

export interface AIInsight {
  type: 'NUISANCE_FILTER' | 'LEAD_GEN' | 'MAINTENANCE';
  title: string;
  description: string;
  valueProp?: string;
  isUrgent: boolean;
  predictedFailureDate?: string;
}

export interface TriageCase {
  id: string;
  timestamp: string;
  source: 'Thermostat' | 'Phone' | 'Web';
  reason: string;
  suggestedOutcome: 'Dry Run' | 'Dispatch' | 'Monitor' | 'High-margin Lead';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Dispatched';
  priority: number;
  healthScore: number;
}

export interface Opportunity {
  id: string;
  customerName: string;
  address: string;
  systemAge: number;
  healthScore: number;
  estRevenue: number;
  contractStatus: 'Active' | 'None' | 'Expiring';
  nextAction: string;
}

export interface HVACSystem {
  id: string;
  address: string;
  ownerName: string;
  systemType: string;
  installDate: string;
  lastServiceDate: string;
  metrics: {
    heatingPower: Metric;
    systemBreathing: Metric;
    efficiency: Metric;
  };
  insights: AIInsight[];
  location: {
    lat: number;
    lng: number;
    neighborhood: string;
  };
  activeTriage?: TriageCase;
}