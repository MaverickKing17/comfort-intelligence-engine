import { HVACSystem, HealthStatus, Opportunity, TriageCase } from './types';

export const MOCK_TRIAGE_QUEUE: TriageCase[] = [
  {
    id: 'tr_001',
    timestamp: '2026-02-05T08:15:00Z',
    source: 'Thermostat',
    reason: 'Rapid Short Cycling',
    suggestedOutcome: 'Dry Run',
    status: 'Open',
    priority: 1,
    healthScore: 42
  },
  {
    id: 'tr_002',
    timestamp: '2026-02-05T09:30:00Z',
    source: 'Phone',
    reason: 'No Heat Call',
    suggestedOutcome: 'Dispatch',
    status: 'In Progress',
    priority: 2,
    healthScore: 10
  },
  {
    id: 'tr_003',
    timestamp: '2026-02-05T10:00:00Z',
    source: 'Thermostat',
    reason: 'Efficiency Degradation',
    suggestedOutcome: 'High-margin Lead',
    status: 'Open',
    priority: 3,
    healthScore: 68
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_001',
    customerName: 'Sarah Jenkins',
    address: '1288 Yonge St, Toronto',
    systemAge: 13,
    healthScore: 72,
    estRevenue: 8500,
    contractStatus: 'Expiring',
    nextAction: 'Email Quote'
  },
  {
    id: 'opp_002',
    customerName: 'David Rossi',
    address: '880 The Queensway, Etobicoke',
    systemAge: 2,
    healthScore: 98,
    estRevenue: 1200,
    contractStatus: 'Active',
    nextAction: 'Schedule Annual MA'
  }
];

export const MOCK_SYSTEMS: HVACSystem[] = [
  {
    id: 'sys_001',
    address: '1288 Yonge St, Toronto',
    ownerName: 'Sarah Jenkins',
    systemType: 'Lennox SLP99V',
    installDate: '2012-05-15',
    lastServiceDate: '2025-11-01',
    location: { lat: 43.68, lng: -79.39, neighborhood: 'North York' },
    activeTriage: MOCK_TRIAGE_QUEUE[2],
    metrics: {
      heatingPower: {
        label: 'Heating Power',
        technicalLabel: 'Delta-T',
        simpleEnglishLabel: 'Heating Output',
        value: 72,
        unit: '%',
        status: HealthStatus.Warning,
        trend: 'down'
      },
      systemBreathing: {
        label: 'System Breathing',
        technicalLabel: 'Static Pressure',
        simpleEnglishLabel: 'Airflow Health',
        value: 'Restricted',
        status: HealthStatus.Warning,
        trend: 'down'
      },
      efficiency: {
        label: 'Efficiency',
        technicalLabel: 'AFUE',
        simpleEnglishLabel: 'Fuel Economy',
        value: 85,
        unit: '%',
        status: HealthStatus.Warning
      }
    },
    insights: [
      {
        type: 'LEAD_GEN',
        title: 'High-Margin Upgrade Lead',
        description: 'System is >10 years old with declining heating power.',
        valueProp: '$6,500 Rebate Qualified',
        isUrgent: true
      }
    ]
  },
  {
    id: 'sys_002',
    address: '45 Bay St, Toronto',
    ownerName: 'Michael Chen',
    systemType: 'Carrier Infinity 98',
    installDate: '2023-08-10',
    lastServiceDate: '2025-12-20',
    location: { lat: 43.64, lng: -79.37, neighborhood: 'Downtown Core' },
    activeTriage: MOCK_TRIAGE_QUEUE[1],
    metrics: {
      heatingPower: {
        label: 'Heating Power',
        technicalLabel: 'Delta-T',
        simpleEnglishLabel: 'Heating Output',
        value: 0,
        unit: '%',
        status: HealthStatus.Critical,
        trend: 'stable'
      },
      systemBreathing: {
        label: 'System Breathing',
        technicalLabel: 'Static Pressure',
        simpleEnglishLabel: 'Airflow Health',
        value: 'Normal',
        status: HealthStatus.Good
      },
      efficiency: {
        label: 'Efficiency',
        technicalLabel: 'AFUE',
        simpleEnglishLabel: 'Fuel Economy',
        value: 0,
        unit: '%',
        status: HealthStatus.Critical
      }
    },
    insights: [
      {
        type: 'NUISANCE_FILTER',
        title: 'Potential Remote Resolution',
        description: 'Thermostat calling for heat, but output is 0. Weather is mild.',
        valueProp: 'Breaker Tripped?',
        isUrgent: false
      }
    ]
  }
];