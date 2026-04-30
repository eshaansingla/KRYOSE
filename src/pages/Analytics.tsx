import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, Cell,
} from 'recharts';
import { Zap, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { WEEKLY_POWER_DATA, MONTHLY_SPOILAGE_DATA, ZONE_COMPLIANCE_DATA } from '../utils/mockData';

const COMPLIANCE_COLORS = ['#22C55E', '#EF4444', '#22C55E', '#94A3B8', '#E68325'];

export function Analytics() {
  const avgTemp = (WEEKLY_POWER_DATA.reduce((s, d) => s + d.temp, 0) / WEEKLY_POWER_DATA.length).toFixed(1);
  const totalSaved = MONTHLY_SPOILAGE_DATA.reduce((s, d) => s + d.saved, 0);

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content">Predictive Analytics</h1>
          <p className="text-sm text-content-muted mt-1">Historical data deep-dives and power efficiency matrices.</p>
        </div>
        <div className="flex gap-6 shrink-0">
          <div className="text-right">
            <p className="text-xs text-content-muted font-bold uppercase tracking-wider">7-day Avg Temp</p>
            <p className="text-xl font-bold text-[#2C46EA]">{avgTemp}°C</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-content-muted font-bold uppercase tracking-wider">Total Capital Saved</p>
            <p className="text-xl font-bold text-success">₹{totalSaved.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Power consumption */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 text-content">
              <Zap className="h-4 w-4 text-[#E68325]" /> Power Consumption Profile (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_POWER_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}kW`} domain={[0, 180]} />
                  <Tooltip
                    cursor={{ fill: 'var(--app-surface)', opacity: 0.5 }}
                    contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }}
                    formatter={v => [`${Number(v)} kW`, 'Consumption']}
                  />
                  <Bar dataKey="powerKw" fill="#2C46EA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-content-muted mt-3 text-center">
              Spikes Thu/Fri — bulk cargo loading procedures
            </p>
          </CardContent>
        </Card>

        {/* Thermal baseline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 text-content">
              <Activity className="h-4 w-4 text-[#2C46EA]" /> Avg Core Thermal Baseline (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_POWER_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C46EA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2C46EA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} domain={[2, 8]} tickFormatter={v => `${v}°C`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }}
                    formatter={v => [`${Number(v).toFixed(1)} C`, 'Avg Temp']}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#2C46EA" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#2C46EA] mt-3 text-center">
              100% Compliance — within 2°C – 8°C bounds all week
            </p>
          </CardContent>
        </Card>

        {/* Spoilage savings trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 text-content">
              <TrendingUp className="h-4 w-4 text-success" /> Capital Protected vs Residual Loss (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SPOILAGE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }}
                    formatter={v => [`Rs ${Number(v).toLocaleString()}`, '']}
                  />
                  <Line type="monotone" dataKey="saved" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', r: 4 }} name="Capital Saved" />
                  <Line type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 4 }} strokeDasharray="4 4" name="Residual Loss" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-success mt-3 text-center">
              Residual loss reduced 61% over 6 months post-deployment
            </p>
          </CardContent>
        </Card>

        {/* Zone compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 text-content">
              <ShieldCheck className="h-4 w-4 text-[#7060A8]" /> Zone Compliance Score (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ZONE_COMPLIANCE_DATA} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" horizontal={false} />
                  <XAxis type="number" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={55} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }}
                    formatter={v => [`${Number(v).toFixed(1)}%`, 'Compliance']}
                  />
                  <Bar dataKey="compliance" radius={[0, 4, 4, 0]}>
                    {ZONE_COMPLIANCE_DATA.map((_, i) => (
                      <Cell key={i} fill={COMPLIANCE_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-content-muted mt-3 text-center">
              Zone D offline — excluded from compliance calculation
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
