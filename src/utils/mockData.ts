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
  stack: string;
  thresholds: string;
}

export const FACILITY_PROFILES: FacilityProfile[] = [
  {
    id: 'tier-3',
    name: 'ColdHub Agri Room',
    tier: 'Tier 3',
    totalSensors: 5,
    zoneCount: 2,
    description: 'Food/agriculture breach detection with DS18B20, DHT22, MC-38, ZMPT101B, and SCT-013-000.',
    stack: '2x DS18B20, 1x DHT22, 1x MC-38, 1x ZMPT101B, 1x SCT-013-000',
    thresholds: 'Temp normal 0-10 C, warning >10 C, critical >14 C',
  },
  {
    id: 'tier-2',
    name: 'DairyFresh Frozen Warehouse',
    tier: 'Tier 2',
    totalSensors: 10,
    zoneCount: 3,
    description: 'Dairy/frozen zone monitoring with compressor fault visibility.',
    stack: '4-5x DS18B20, 2-3x SHT31, 2x MC-38, 1x ZMPT101B, 1x SCT-013-000, 1x SW-420',
    thresholds: 'Temp normal 2-8 C, warning >8 C, critical >10 C',
  },
  {
    id: 'tier-1',
    name: 'PharmaCore GDP Storage',
    tier: 'Tier 1',
    totalSensors: 20,
    zoneCount: 5,
    description: 'Pharma GDP monitoring with redundant PT100, pressure, airflow, vibration, and 3-phase power.',
    stack: 'PT100+MAX31865, redundant PT100, SHT35, MC-38, 3-phase ZMPT101B/SCT-013-000, AKS 32, 3-cup anemometer, ADXL345',
    thresholds: 'PT100 normal 2-8 C, warning >8 C, critical >10 C; delta critical >1 C',
  },
];

export const generateTimeSeriesData = (): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseTemp = 4.0;
    const tempNoise = (Math.random() - 0.5) * 1.2;
    let temp = baseTemp + tempNoise;
    if (i === 4) temp = 7.6;
    if (i === 3) temp = 8.4;
    if (i === 2) temp = 5.2;
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Number(temp.toFixed(1)),
      humidity: Number((65 + (Math.random() - 0.5) * 8).toFixed(1)),
    });
  }
  return data;
};

const now = new Date();
const daysAgo = (n: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-10492',
    zone: 'Zone B',
    severity: 'error',
    message: 'Historical compressor power fault. Temp exceeded 10 C; technician dispatched.',
    time: '3 hours ago',
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'ALT-10491',
    zone: 'Zone A',
    severity: 'warning',
    message: 'Humidity exceeded 85% RH for 5+ minutes. Condensation risk flagged.',
    time: '8 hours ago',
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    status: 'resolved',
  },
  {
    id: 'ALT-10490',
    zone: 'Zone C',
    severity: 'success',
    message: 'Scheduled SHT31/SHT35 heater cycle completed normally.',
    time: '12 hours ago',
    timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    status: 'resolved',
  },
  {
    id: 'ALT-10489',
    zone: 'Zone A',
    severity: 'warning',
    message: 'MC-38 door open for more than 5 minutes. Operator notified.',
    time: '2 days ago',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    status: 'resolved',
  },
  {
    id: 'ALT-10488',
    zone: 'Zone B',
    severity: 'error',
    message: 'Thermal excursion: 10.4 C detected for >15 minutes. Batch risk assessed.',
    time: '5 days ago',
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    status: 'resolved',
  },
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
    sensorType: 'DS18B20 / PT100 by tier',
  },
  {
    id: 'zone-b',
    name: 'Zone B - Pharma Vaccines',
    temperature: 4.6,
    targetTemp: 5.0,
    humidity: 55,
    status: 'optimal',
    trend: 'stable',
    sensorId: 'SN-B114',
    sensorType: 'PT100 + redundant PT100',
  },
  {
    id: 'zone-c',
    name: 'Zone C - Frozen Produce',
    temperature: 4.1,
    targetTemp: 4.0,
    humidity: 65,
    status: 'optimal',
    trend: 'down',
    sensorId: 'SN-C098',
    sensorType: 'DS18B20',
  },
  {
    id: 'zone-d',
    name: 'Zone D - Backup Reserve',
    temperature: 0,
    targetTemp: 0,
    humidity: 0,
    status: 'offline',
    trend: 'stable',
    sensorId: 'SN-D001',
    sensorType: 'DS18B20',
  },
  {
    id: 'zone-e',
    name: 'Zone E - Loading Bay Buffer',
    temperature: 5.9,
    targetTemp: 5.5,
    humidity: 70,
    status: 'warning',
    trend: 'up',
    sensorId: 'SN-E055',
    sensorType: 'SHT35 / SHT31 / DHT22',
  },
];

export const MOCK_MAINTENANCE: MaintenanceLog[] = [
  { id: 'M-558', date: daysAgo(2), technician: 'Rahul S.', task: 'Replaced suspect PT100 after redundant delta exceeded 0.5 C', status: 'completed' },
  { id: 'M-557', date: daysAgo(7), technician: 'Amit V.', task: 'Checked SCT-013-000 clamp and ZMPT101B voltage calibration', status: 'completed' },
  { id: 'M-556', date: daysAgo(14), technician: 'Priya K.', task: 'Verified MC-38 NC wiring and SHT31/SHT35 heater cycles', status: 'completed' },
  { id: 'M-559', date: daysAgo(-5), technician: 'Pending', task: 'Quarterly compressor maintenance - Zone A and B', status: 'scheduled' },
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
  { name: 'Zone B', compliance: 98.8 },
  { name: 'Zone C', compliance: 99.8 },
  { name: 'Zone D', compliance: 0 },
  { name: 'Zone E', compliance: 97.1 },
];
