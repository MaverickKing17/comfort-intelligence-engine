import { HVACSystem, HealthStatus } from './types';

export const MOCK_SYSTEMS: HVACSystem[] = [
  {
    id: 'sys_001',
    address: '1288 Yonge St, Toronto',
    ownerName: 'Sarah Jenkins',
    systemType: 'Lennox SLP99V',
    installDate: '2012-05-15', // > 10 years old
    lastServiceDate: '2025-11-01',
    location: { lat: 43.68, lng: -79.39, neighborhood: 'North York' },
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
  },
  {
    id: 'sys_003',
    address: '880 The Queensway, Etobicoke',
    ownerName: 'David Rossi',
    systemType: 'Ecobee Smart + Rheem',
    installDate: '2024-01-15',
    lastServiceDate: '2026-01-10',
    location: { lat: 43.62, lng: -79.51, neighborhood: 'Etobicoke' },
    metrics: {
      heatingPower: {
        label: 'Heating Power',
        technicalLabel: 'Delta-T',
        simpleEnglishLabel: 'Heating Output',
        value: 98,
        unit: '%',
        status: HealthStatus.Good,
        trend: 'stable'
      },
      systemBreathing: {
        label: 'System Breathing',
        technicalLabel: 'Static Pressure',
        simpleEnglishLabel: 'Airflow Health',
        value: 'Optimal',
        status: HealthStatus.Good
      },
      efficiency: {
        label: 'Efficiency',
        technicalLabel: 'AFUE',
        simpleEnglishLabel: 'Fuel Economy',
        value: 98,
        unit: '%',
        status: HealthStatus.Good
      }
    },
    insights: []
  }
];