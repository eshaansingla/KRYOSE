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
  timestamp: Date;
  status: 'active' | 'resolved';
}

export interface ZoneData {
  id: string;
  name: string;
  temperature: number;
  targetTemp: number;
  humidity: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
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
  zoneCount: number;
  description: string;
}

export const FACILITY_PROFILES: FacilityProfile[] = [
  { id: 'tier-3', name: 'ColdHub Logistics (Small)', tier: 'Pilot', totalSensors: 5, zoneCount: 2, description: 'Basic DS18B20/DHT22 monitoring for single warehouse.' },
  { id: 'tier-2', name: 'DairyFresh Ops (Mid-size)', tier: 'Standard', totalSensors: 12, zoneCount: 3, description: 'Multi-zone + Power monitoring.' },
  { id: 'tier-1', name: 'PharmaCore Storage (Advanced)', tier: 'Enterprise', totalSensors: 24, zoneCount: 5, description: 'PT100 RTD precision monitoring with redundancy.' },
];

export const generateTimeSeriesData = (): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseTemp = 4.0;
    const tempNoise = (Math.random() - 0.5) * 1.8;
    let temp = baseTemp + tempNoise;
    if (i === 4) temp = 7.5;
    if (i === 3) temp = 8.8;
    if (i === 2) temp = 5.2;
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Number(temp.toFixed(1)),
      humidity: Number((65 + (Math.random() - 0.5) * 8).toFixed(1)),
    });
  }
  return data;
};

// Real past dates relative to now
const now = new Date();
const daysAgo = (n: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-10492', zone: 'Zone B', severity: 'error',
    message: 'Compressor 1 power fault. Temp rapidly rising. Technician dispatched.',
    time: '3 hours ago', timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), status: 'active',
  },
  {
    id: 'ALT-10491', zone: 'Zone A', severity: 'warning',
    message: 'Humidity exceeded 70% threshold. Dehumidifier triggered.',
    time: '8 hours ago', timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), status: 'resolved',
  },
  {
    id: 'ALT-10490', zone: 'Zone C', severity: 'success',
    message: 'Scheduled defrost cycle completed normally.',
    time: '12 hours ago', timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), status: 'resolved',
  },
  {
    id: 'ALT-10489', zone: 'Zone A', severity: 'warning',
    message: 'Door seal integrity check flagged. Manual inspection recommended.',
    time: '2 days ago', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), status: 'resolved',
  },
  {
    id: 'ALT-10488', zone: 'Zone B', severity: 'error',
    message: 'Thermal excursion: 9.1°C detected for >15 minutes. Cargo risk assessed.',
    time: '5 days ago', timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), status: 'resolved',
  },
];

export const MOCK_ZONES: ZoneData[] = [
  {
    id: 'zone-a', name: 'Zone A — General Cold Storage',
    temperature: 3.8, targetTemp: 4.0, humidity: 62,
    status: 'optimal', trend: 'stable', sensorId: 'SN-A221', sensorType: 'PT100 RTD',
  },
  {
    id: 'zone-b', name: 'Zone B — Pharma Vaccines',
    temperature: 8.2, targetTemp: 5.0, humidity: 55,
    status: 'critical', trend: 'up', sensorId: 'SN-B114', sensorType: 'PT100 RTD',
  },
  {
    id: 'zone-c', name: 'Zone C — Frozen Produce',
    temperature: 4.1, targetTemp: 4.0, humidity: 65,
    status: 'optimal', trend: 'down', sensorId: 'SN-C098', sensorType: 'DS18B20',
  },
  {
    id: 'zone-d', name: 'Zone D — Backup Reserve',
    temperature: 0, targetTemp: 0, humidity: 0,
    status: 'offline', trend: 'stable', sensorId: 'SN-D001', sensorType: 'DS18B20',
  },
  {
    id: 'zone-e', name: 'Zone E — Loading Bay Buffer',
    temperature: 5.9, targetTemp: 5.5, humidity: 70,
    status: 'warning', trend: 'up', sensorId: 'SN-E055', sensorType: 'DHT22',
  },
];

export const MOCK_MAINTENANCE: MaintenanceLog[] = [
  { id: 'M-558', date: daysAgo(2), technician: 'Rahul S.', task: 'Recalibrated PT100 sensors in Zone B — post-excursion audit', status: 'completed' },
  { id: 'M-557', date: daysAgo(7), technician: 'Amit V.', task: 'Replaced backup battery for Hub 2', status: 'completed' },
  { id: 'M-556', date: daysAgo(14), technician: 'Priya K.', task: 'Full sensor array inspection — annual AMC visit', status: 'completed' },
  { id: 'M-559', date: daysAgo(-5), technician: 'Pending', task: 'Quarterly compressor maintenance — Zone A & B', status: 'scheduled' },
];

export const WEEKLY_POWER_DATA = [
  { day: 'Mon', powerKw: 120, temp: 4.1 },
  { day: 'Tue', powerKw: 132, temp: 4.2 },
  { day: 'Wed', powerKw: 115, temp: 4.0 },
  { day: 'Thu', powerKw: 145, temp: 4.5 },
  { day: 'Fri', powerKw: 155, temp: 4.8 },
  { day: 'Sat', powerKw: 90, temp: 3.8 },
  { day: 'Sun', powerKw: 85, temp: 3.7 },
];

export const MONTHLY_SPOILAGE_DATA = [
  { month: 'Nov', saved: 62000, loss: 28000 },
  { month: 'Dec', saved: 71000, loss: 22000 },
  { month: 'Jan', saved: 68000, loss: 25000 },
  { month: 'Feb', saved: 79000, loss: 18000 },
  { month: 'Mar', saved: 84500, loss: 14000 },
  { month: 'Apr', saved: 91200, loss: 11000 },
];

export const ZONE_COMPLIANCE_DATA = [
  { name: 'Zone A', compliance: 99.2 },
  { name: 'Zone B', compliance: 94.7 },
  { name: 'Zone C', compliance: 99.8 },
  { name: 'Zone D', compliance: 0 },
  { name: 'Zone E', compliance: 97.1 },
];
