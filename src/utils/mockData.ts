export interface MetricData {
  time: string;
  temperature: number;
  humidity: number;
}

export interface Alert {
  id: string;
  zone: string;
  severity: 'success' | 'warning' | 'error';
  message: string;
  time: string;
  status: 'active' | 'resolved';
}

export interface ZoneData {
  id: string;
  name: string;
  temperature: number;
  targetTemp: number;
  humidity: number;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  sensorId: string;
  sensorType: string;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  technician: string;
  task: string;
  status: 'completed' | 'scheduled';
}

export interface FacilityProfile {
  id: string;
  name: string;
  tier: string;
  totalSensors: number;
  description: string;
}

export const FACILITY_PROFILES: FacilityProfile[] = [
  { id: 'tier-3', name: 'ColdHub Logistics (Small)', tier: 'Pilot', totalSensors: 5, description: 'Basic DS18B20/DHT22 monitoring for single warehouse.' },
  { id: 'tier-2', name: 'DairyFresh Ops (Mid-size)', tier: 'Standard', totalSensors: 12, description: 'Multi-zone + Power monitoring.' },
  { id: 'tier-1', name: 'PharmaCore Storage (Advanced)', tier: 'Enterprise', totalSensors: 24, description: 'PT100 RTD precision monitoring with redundancy.' }
];

// Realistic Cold Storage Range is 2 to 8 degrees Celsius. Base is around 4.0.
export const generateTimeSeriesData = (): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseTemp = 4.0;
    const tempNoise = (Math.random() - 0.5) * 1.8; // fluctuations between -0.9 and +0.9
    
    let temp = baseTemp + tempNoise;
    // Simulate a failure incident
    if (i === 4) temp = 7.5; 
    if (i === 3) temp = 8.8; // Spiked above 8 (Warning/Critical threshold)
    if (i === 2) temp = 5.2; // Resolution phase
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Number(temp.toFixed(1)),
      humidity: Number((65 + (Math.random() - 0.5) * 8).toFixed(1)),
    });
  }
  return data;
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-10492',
    zone: 'Zone B',
    severity: 'error',
    message: 'Compressor 1 power fault. Temp rapidly rising. Technician dispatched.',
    time: '3 hours ago',
    status: 'active'
  },
  {
    id: 'ALT-10491',
    zone: 'Zone A',
    severity: 'warning',
    message: 'Humidity exceeded 70% threshold. Dehumidifier triggered.',
    time: '8 hours ago',
    status: 'resolved'
  },
  {
    id: 'ALT-10490',
    zone: 'Zone C',
    severity: 'success',
    message: 'Scheduled defrost cycle completed normally.',
    time: '12 hours ago',
    status: 'resolved'
  }
];

export const MOCK_ZONES: ZoneData[] = [
  {
    id: 'zone-a',
    name: 'Zone A - General Cold Storage',
    temperature: 3.8,
    targetTemp: 4.0,
    humidity: 62,
    status: 'optimal',
    trend: 'stable',
    sensorId: 'SN-A221',
    sensorType: 'PT100 RTD'
  },
  {
    id: 'zone-b',
    name: 'Zone B - Pharma Vaccines',
    temperature: 8.2,
    targetTemp: 5.0,
    humidity: 55,
    status: 'critical',
    trend: 'up',
    sensorId: 'SN-B114',
    sensorType: 'PT100 RTD'
  },
  {
    id: 'zone-c',
    name: 'Zone C - Frozen Backup (Inactive)',
    temperature: 4.1,
    targetTemp: 4.0,
    humidity: 65,
    status: 'optimal',
    trend: 'down',
    sensorId: 'SN-C098',
    sensorType: 'DS18B20'
  }
];

export const MOCK_MAINTENANCE: MaintenanceLog[] = [
  { id: 'M-552', date: 'Oct 12, 2026', technician: 'Rahul S.', task: 'Recalibrated PT100 sensors in Zone B', status: 'completed' },
  { id: 'M-555', date: 'Oct 28, 2026', technician: 'Amit V.', task: 'Replace backup battery for Hub 2', status: 'scheduled' }
];
