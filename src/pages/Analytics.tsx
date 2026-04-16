import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, Activity } from 'lucide-react';

const POWER_CONSUMPTION_DATA = [
  { day: 'Mon', powerKw: 120, temp: 4.1 },
  { day: 'Tue', powerKw: 132, temp: 4.2 },
  { day: 'Wed', powerKw: 115, temp: 4.0 },
  { day: 'Thu', powerKw: 145, temp: 4.5 },
  { day: 'Fri', powerKw: 155, temp: 4.8 },
  { day: 'Sat', powerKw: 90, temp: 3.8 },
  { day: 'Sun', powerKw: 85, temp: 3.7 },
];

export function Analytics() {
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content flex items-center gap-3">
            Predictive Analytics
          </h1>
          <p className="text-sm text-content-muted mt-1">Historical data deep-dives and power efficiency matrices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 text-content">
              <Zap className="h-4 w-4 text-[#E68325]" /> Power Consumption Profile (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={POWER_CONSUMPTION_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} kW`} />
                  <RechartsTooltip cursor={{fill: 'var(--app-surface)', opacity: 0.4}} contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }} />
                  <Bar dataKey="powerKw" fill="#2C46EA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-content-muted mt-4 text-center">Spikes detected Thursday/Friday due to bulk cargo loading procedures.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 text-content">
              <Activity className="h-4 w-4 text-[#2C46EA]" /> Average Core Thermal Baseline (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={POWER_CONSUMPTION_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C46EA" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2C46EA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} domain={[2, 6]} tickFormatter={(v) => `${v}°C`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="temp" stroke="#2C46EA" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#2C46EA] mt-4 text-center">100% Compliance Maintained within 2°C - 8°C Bounds</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
