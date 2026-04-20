import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Thermometer, Droplets, AlertTriangle, Activity, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Wrench, IndianRupee, RefreshCw,
  Server, AlertOctagon, Check, ChevronDown, ChevronUp, WifiOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  MOCK_ALERTS, MOCK_ZONES, MOCK_MAINTENANCE, FACILITY_PROFILES,
  generateTimeSeriesData,
  type MetricData, type Alert, type MaintenanceLog, type ZoneData,
} from '../utils/mockData';
import { cn } from '../utils/cn';

export function Dashboard() {
  const [data, setData] = useState<MetricData[]>([]);
  const [currentTemp, setCurrentTemp] = useState(4.2);
  const [syncTime, setSyncTime] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState(FACILITY_PROFILES[1]);
  const [simState, setSimState] = useState<'normal' | 'triggered' | 'acknowledged' | 'resolved'>('normal');
  const [simBarCollapsed, setSimBarCollapsed] = useState(false);
  const [savings, setSavings] = useState(84500);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [logs, setLogs] = useState<MaintenanceLog[]>(MOCK_MAINTENANCE);
  const [zones, setZones] = useState<ZoneData[]>(MOCK_ZONES);

  // Init chart data
  useEffect(() => {
    setData(generateTimeSeriesData());
  }, []);

  // Simulation ticker — updates temp AND appends to chart
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        let next = prev;
        if (simState === 'normal' || simState === 'resolved') {
          next = Number((4.1 + (Math.random() - 0.5) * 0.3).toFixed(1));
        } else if (simState === 'triggered') {
          next = Number(Math.min(prev + 0.3 + Math.random() * 0.2, 12).toFixed(1));
        } else if (simState === 'acknowledged') {
          next = Number(Math.max(prev - 0.4, 4.2).toFixed(1));
        }

        // Append live point to chart
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setData(d => {
          const updated = [...d, { time: nowTime, temperature: next, humidity: 65 }];
          return updated.length > 32 ? updated.slice(1) : updated;
        });

        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [simState]);

  // Sync timer
  useEffect(() => {
    const i = setInterval(() => setSyncTime(p => (p >= 14 ? 0 : p + 1)), 1000);
    return () => clearInterval(i);
  }, []);

  // Reset on facility change
  useEffect(() => {
    setSimState('normal');
    setAlerts(MOCK_ALERTS);
    setLogs(MOCK_MAINTENANCE);
    setZones([...MOCK_ZONES]);
    setCurrentTemp(4.2);
  }, [selectedFacility]);

  const visibleZones = zones.slice(0, selectedFacility.zoneCount);
  const isCritical = simState === 'triggered';
  const tempLabel = isCritical ? 'Critical Rising' : simState === 'acknowledged' ? 'Recovering' : 'Stable';
  const tempColor = isCritical ? 'text-error animate-pulse' : simState === 'acknowledged' ? 'text-[#E68325]' : 'text-success';

  const triggerSimulation = () => {
    setSimState('triggered');
    setCurrentTemp(7.8);
    setZones(z => z.map(zone =>
      zone.id === 'zone-b' ? { ...zone, status: 'critical', temperature: 8.5, trend: 'up' } : zone
    ));
    setAlerts(prev => [
      {
        id: `ALT-${Math.floor(10000 + Math.random() * 9000)}`,
        zone: 'Zone B', severity: 'error',
        message: 'CRITICAL: Compressor Power Failure. Active warming detected.',
        time: 'Just now', timestamp: new Date(), status: 'active',
      },
      ...prev,
    ]);
  };

  const acknowledgeAlert = () => {
    setSimState('acknowledged');
    setAlerts(prev => prev.map((a, i) =>
      i === 0 ? { ...a, message: 'Acknowledged: Technician deployed to Zone B.', severity: 'warning' } : a
    ));
    setLogs(prev => [
      {
        id: `M-${Math.floor(600 + Math.random() * 100)}`,
        date: 'Today', technician: 'Auto-Dispatch',
        task: 'Diagnosing Compressor Power Fault (Zone B)', status: 'scheduled',
      },
      ...prev,
    ]);
  };

  const resolveSimulation = () => {
    setSimState('resolved');
    setSavings(prev => prev + 12400);
    setCurrentTemp(4.2);
    setZones(z => z.map(zone =>
      zone.id === 'zone-b' ? { ...zone, status: 'optimal', temperature: 4.5, trend: 'down' } : zone
    ));
    setAlerts(prev => prev.map((a, i) =>
      i === 0 ? { ...a, status: 'resolved', message: 'Resolved: Compressor reset. Temp normalizing.', severity: 'success' } : a
    ));
    setLogs(prev => prev.map((l, i) =>
      i === 0 ? { ...l, status: 'completed', task: 'Compressor restarted. Target cooling achieved.', technician: 'Amit V.' } : l
    ));
  };

  const requestTechnician = () => {
    setLogs(prev => [
      {
        id: `M-${Math.floor(800 + Math.random() * 100)}`,
        date: 'Just now', technician: 'Pending Dispatch',
        task: 'Manual Callout Requested', status: 'scheduled',
      },
      ...prev,
    ]);
  };

  const zoneStatusBadge = (zone: ZoneData) => {
    if (zone.status === 'offline') return <Badge variant="outline" className="text-content-muted border-content-muted/30 text-[10px]">Offline</Badge>;
    if (zone.status === 'critical') return <Badge variant="error" className="text-[10px]">Critical</Badge>;
    if (zone.status === 'warning') return <Badge variant="warning" className="text-[10px]">Warning</Badge>;
    return <Badge variant="success" className="text-[10px]">Normal</Badge>;
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">

      {/* Demo Mode Bar */}
      {!simBarCollapsed ? (
        <div className="bg-[#2C46EA]/10 border border-[#2C46EA]/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#2C46EA] shrink-0" />
            <div>
              <h3 className="font-semibold text-content leading-tight text-sm">Demo Mode — Live Simulation</h3>
              <p className="text-xs text-content-muted">Walk through: Problem → Detection → Action → ROI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(simState === 'normal' || simState === 'resolved') && (
              <Button onClick={triggerSimulation} className="bg-[#E68325] hover:bg-[#E68325]/90 text-white border-0 shadow text-sm">
                Simulate Outage
              </Button>
            )}
            {simState === 'triggered' && (
              <Button onClick={acknowledgeAlert} className="bg-warning text-white hover:bg-warning/90 shadow text-sm">
                Acknowledge & Dispatch Tech
              </Button>
            )}
            {simState === 'acknowledged' && (
              <Button onClick={resolveSimulation} className="bg-success text-white hover:bg-success/90 shadow text-sm">
                Confirm Resolution
              </Button>
            )}
            <button
              onClick={() => setSimBarCollapsed(true)}
              className="p-1.5 rounded-md text-content-muted hover:bg-[#2C46EA]/10 hover:text-[#2C46EA] transition-colors"
              title="Collapse demo bar"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setSimBarCollapsed(false)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-[#2C46EA]/20 bg-[#2C46EA]/5 text-[#2C46EA] text-xs font-bold uppercase tracking-widest hover:bg-[#2C46EA]/10 transition-colors"
        >
          <ChevronDown className="h-3 w-3" /> Demo Mode
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content flex items-center gap-3">
            Command Center
            <Badge variant={isCritical ? 'error' : 'success'} className={cn('text-xs', isCritical && 'animate-pulse')}>
              {isCritical ? 'Critical Alert' : 'Live System'}
            </Badge>
          </h1>
          <p className="text-sm text-content-muted mt-1 flex items-center gap-2">
            <RefreshCw className={cn('h-3 w-3', syncTime === 0 && 'animate-spin')} />
            Last synced {syncTime}s ago
          </p>
        </div>
        <div className="flex bg-surface p-1 rounded-lg border border-surface">
          {FACILITY_PROFILES.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFacility(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                selectedFacility.id === f.id ? 'bg-[#2C46EA] text-white shadow-sm' : 'text-content-muted hover:text-content'
              )}
            >
              {f.tier}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className={cn('transition-colors duration-500', simState === 'resolved' ? 'bg-success/10 border-success/30' : 'bg-[#2C46EA]/5 border-[#2C46EA]/20')}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className={cn('text-sm font-semibold', simState === 'resolved' ? 'text-success' : 'text-[#2C46EA]')}>Saved Capital (Est)</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className="text-3xl font-bold tracking-tight text-content transition-all duration-1000">
                        ₹{savings.toLocaleString()}
                      </h2>
                      {simState === 'resolved' && (
                        <span className="text-xs font-bold text-success animate-bounce">+₹12k Protected</span>
                      )}
                    </div>
                  </div>
                  <div className={cn('h-10 w-10 rounded-lg text-white flex items-center justify-center transition-colors shrink-0', simState === 'resolved' ? 'bg-success' : 'bg-[#2C46EA]')}>
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-content-muted mt-4 font-medium">Mapped to avoided thermal spoilage (10–25% baseline).</p>
              </CardContent>
            </Card>

            <Card className={cn(isCritical && 'border-[#E68325]/50 bg-[#E68325]/5 transition-colors')}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-content-muted">Avg Core Temp</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className={cn('text-3xl font-bold tracking-tight', isCritical ? 'text-error' : 'text-content')}>
                        {currentTemp}°C
                      </h2>
                      <span className={cn('text-xs font-bold flex items-center', tempColor)}>
                        {isCritical ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                        {tempLabel}
                      </span>
                    </div>
                  </div>
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center border shrink-0', isCritical ? 'bg-error/10 border-error/20' : 'bg-surface border-content-muted/20')}>
                    <Thermometer className={cn('h-5 w-5', isCritical ? 'text-error' : 'text-content-muted')} />
                  </div>
                </div>
                <p className="text-xs text-content-muted mt-4 font-medium">Target Envelope: 2.0°C – 8.0°C</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-content-muted">Sensor Diagnostics</p>
                    <h2 className="text-3xl font-bold tracking-tight text-success">Active</h2>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <Server className="h-5 w-5 text-success" />
                  </div>
                </div>
                <p className="text-xs text-content-muted mt-4 font-medium">
                  Reporting: {selectedFacility.totalSensors} / {selectedFacility.totalSensors} Hardware Nodes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Live Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Thermal Trajectory (Live) — {selectedFacility.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis stroke="var(--app-text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}°C`} domain={[0, 12]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-surface)', borderRadius: '8px' }}
                      labelStyle={{ color: 'var(--app-text-primary)', marginBottom: '4px' }}
                      itemStyle={{ color: 'var(--app-text-primary)' }}
                      formatter={(v: number) => [`${v}°C`, 'Temperature']}
                    />
                    <ReferenceLine y={8} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Critical Ceiling (8°C)', fill: '#EF4444', fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--app-primary)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: 'var(--app-primary)' }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Zone Grid */}
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-1 mt-2">
              Facility Zones
            </h3>
            <p className="text-sm text-content-muted mb-4">
              {selectedFacility.totalSensors} sensors across {selectedFacility.zoneCount} zones — {selectedFacility.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleZones.map(zone => (
                <Card
                  key={zone.id}
                  className={cn(
                    'relative overflow-hidden transition-all',
                    zone.status === 'critical' && 'border-error/50 shadow-lg shadow-error/10',
                    zone.status === 'offline' && 'opacity-60',
                  )}
                >
                  <div className={cn('absolute top-0 left-0 w-1 h-full', {
                    'bg-error': zone.status === 'critical',
                    'bg-[#E68325]': zone.status === 'warning',
                    'bg-success': zone.status === 'optimal',
                    'bg-content-muted/30': zone.status === 'offline',
                  })} />
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-content text-sm leading-tight">{zone.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-content-muted bg-background px-1.5 py-0.5 rounded border border-surface tracking-wider mt-1.5 inline-block">
                          {zone.sensorType}
                        </span>
                      </div>
                      {zoneStatusBadge(zone)}
                    </div>
                    {zone.status === 'offline' ? (
                      <div className="flex items-center gap-2 text-content-muted mt-2">
                        <WifiOff className="h-5 w-5" />
                        <span className="text-sm font-semibold">No signal</span>
                      </div>
                    ) : (
                      <div className="flex items-end justify-between">
                        <div>
                          <span className={cn('text-3xl font-bold', zone.status === 'critical' && 'text-error')}>
                            {zone.temperature}°C
                          </span>
                          <p className="text-xs font-semibold text-content-muted mt-1 uppercase tracking-wider">
                            Target: {zone.targetTemp}°C
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 text-xs font-semibold text-content-muted uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <Activity className="h-3.5 w-3.5" />
                            <span>Power: {zone.status === 'critical' ? 'Fault' : 'OK'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3.5 w-3.5" />
                            <span>{zone.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">

          {/* Alerts Feed */}
          <Card className={cn('flex flex-col transition-colors', isCritical && 'border-error/30')}>
            <CardHeader className="pb-3 border-b border-surface">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-[#E68325]" />
                  Alert Routing
                </CardTitle>
                <span className="text-[10px] font-bold text-success uppercase tracking-wider px-2 py-1 bg-success/10 rounded-sm">
                  Resp: &lt; 5m
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto max-h-[320px] flex-1">
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={cn(
                      'flex gap-3 items-start p-3 rounded-lg border transition-all',
                      alert.severity === 'error'
                        ? 'border-error/30 bg-error/5 shadow-sm'
                        : 'border-surface hover:border-content-muted/30 bg-surface/30'
                    )}
                  >
                    <div className={cn('mt-0.5 rounded-full p-1.5 shrink-0',
                      alert.severity === 'error' ? 'bg-error/10 text-error' :
                      alert.severity === 'warning' ? 'bg-[#E68325]/10 text-[#E68325]' :
                      'bg-success/10 text-success'
                    )}>
                      {alert.severity === 'success'
                        ? <CheckCircle2 className="h-3.5 w-3.5" />
                        : <AlertTriangle className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-1">
                        <Badge variant={alert.severity} className="text-[10px] px-1.5 py-0 shrink-0">
                          {alert.status.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-bold tracking-wider text-content-muted uppercase truncate">
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-content leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Log */}
          <Card className="flex flex-col flex-1">
            <CardHeader className="pb-3 border-b border-surface">
              <CardTitle className="text-base flex items-center justify-between">
                AMC Deployment Logs
                <Wrench className="h-4 w-4 text-content-muted" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="overflow-y-auto max-h-[280px] space-y-3">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="flex gap-3 items-start p-3 rounded-lg border border-surface bg-surface/50 hover:bg-surface/80 transition-colors"
                  >
                    <div className={cn('mt-0.5 rounded-full p-1.5 shrink-0', log.status === 'completed' ? 'bg-success/10' : 'bg-[#E68325]/10')}>
                      {log.status === 'completed'
                        ? <Check className="h-3.5 w-3.5 text-success" />
                        : <Activity className="h-3.5 w-3.5 text-[#E68325] animate-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 gap-1">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-content truncate">{log.technician}</span>
                        <span className="text-[10px] font-bold text-content-muted uppercase tracking-wider shrink-0">{log.date}</span>
                      </div>
                      <p className="text-xs font-medium text-content-muted leading-tight">{log.task}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={requestTechnician}
                className="w-full mt-4 text-[10px] uppercase tracking-widest font-bold text-[#E68325] hover:text-[#E68325]/80 transition-colors text-center py-3 bg-[#E68325]/5 hover:bg-[#E68325]/10 rounded-lg border border-[#E68325]/20 cursor-pointer"
              >
                Request Technician Callout
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
