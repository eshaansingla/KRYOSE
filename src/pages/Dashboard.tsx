import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Thermometer, Droplets, AlertTriangle, Activity, CheckCircle2, ArrowUpRight, ArrowDownRight, Wrench, IndianRupee, RefreshCw, Server, AlertOctagon, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_ALERTS, MOCK_ZONES, MOCK_MAINTENANCE, FACILITY_PROFILES, generateTimeSeriesData, type MetricData, type Alert, type MaintenanceLog, type ZoneData } from '../utils/mockData';
import { cn } from '../utils/cn';

export function Dashboard() {
  const [data, setData] = useState<MetricData[]>([]);
  const [currentTemp, setCurrentTemp] = useState(4.2);
  const [syncTime, setSyncTime] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState(FACILITY_PROFILES[1]);
  
  // Simulation State Engine
  const [simState, setSimState] = useState<'normal' | 'triggered' | 'acknowledged' | 'resolved'>('normal');
  const [savings, setSavings] = useState(84500);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [logs, setLogs] = useState<MaintenanceLog[]>(MOCK_MAINTENANCE);
  const [zones, setZones] = useState<ZoneData[]>(MOCK_ZONES);

  // Periodic subtle updates
  useEffect(() => {
    setData(generateTimeSeriesData());
    
    const interval = setInterval(() => {
      // Normal state fluctuation
      if (simState === 'normal' || simState === 'resolved') {
         setCurrentTemp(() => Number((4.1 + (Math.random() - 0.5) * 0.3).toFixed(1)));
      } else if (simState === 'triggered') {
         // Spiking Temp during outage
         setCurrentTemp(prev => {
            const next = prev + 0.3 + (Math.random() * 0.2);
            return next > 8 ? Number(next.toFixed(1)) : Number(next.toFixed(1));
         });
      } else if (simState === 'acknowledged') {
         // Recovering after tech acknowledges
         setCurrentTemp(prev => {
           const next = prev - 0.4;
           return next < 4.2 ? 4.2 : Number(next.toFixed(1));
         });
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [simState]);

  // Sync Timer
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setSyncTime(prev => (prev >= 12 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(syncInterval);
  }, []);

  // Sync Facility changes
  useEffect(() => {
     // Reset simulation when facility changes
     setSimState('normal');
     setAlerts(MOCK_ALERTS);
     setLogs(MOCK_MAINTENANCE);
     setZones([...MOCK_ZONES]);
     setCurrentTemp(4.2);
  }, [selectedFacility]);

  const triggerSimulation = () => {
    setSimState('triggered');
    // Update chart visually
    const newData = [...data];
    newData[newData.length - 1] = { ...newData[newData.length - 1], temperature: 7.8 };
    setData(newData);
    setCurrentTemp(7.8);
    
    // Morph Zone B to critical
    const newZones = [...zones];
    newZones[1] = { ...newZones[1], status: 'critical', temperature: 8.5, trend: 'up' };
    setZones(newZones);

    // Push Critical Alert
    setAlerts([
      {
        id: `ALT-${Math.floor(10000 + Math.random() * 9000)}`,
        zone: 'Zone B',
        severity: 'error',
        message: 'CRITICAL: Compressor Power Failure. Active warming detected.',
        time: 'Just now',
        status: 'active'
      },
      ...alerts
    ]);
  };

  const acknowledgeAlert = () => {
    setSimState('acknowledged');
    const newAlerts = [...alerts];
    if (newAlerts[0]) {
       newAlerts[0].message = 'Acknowledged: Technician deployed to Zone B.';
       newAlerts[0].severity = 'warning';
    }
    setAlerts(newAlerts);
    
    setLogs([
      { id: `M-${Math.floor(600+Math.random()*100)}`, date: 'Today', technician: 'Auto-Dispatch', task: 'Diagnosing Compressor Power Fault (Zone B)', status: 'scheduled' },
      ...logs
    ]);
  };

  const resolveSimulation = () => {
    setSimState('resolved');
    setSavings(prev => prev + 12400); // Measurable outcome! Action = Money Saved
    setCurrentTemp(4.2);
    
    // Morph Zone B back to normal
    const newZones = [...zones];
    newZones[1] = { ...newZones[1], status: 'optimal', temperature: 4.5, trend: 'down' };
    setZones(newZones);

    // Resolve Alert
    const newAlerts = [...alerts];
    if (newAlerts[0]) {
       newAlerts[0].status = 'resolved';
       newAlerts[0].message = 'Resolved: Compressor reset. Temp normalizing.';
       newAlerts[0].severity = 'success';
    }
    setAlerts(newAlerts);

    // Complete Maintenance
    const newLogs = [...logs];
    if (newLogs[0]) {
       newLogs[0].status = 'completed';
       newLogs[0].task = 'Compressor restarted. Target cooling achieved.';
       newLogs[0].technician = 'Amit V.';
    }
    setLogs(newLogs);
  };

  const requestTechnician = () => {
    setLogs([
      { id: `M-${Math.floor(800+Math.random()*100)}`, date: 'Just now', technician: 'Pending Dispatch', task: 'Manual Callout Requested', status: 'scheduled' },
      ...logs
    ]);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      
      {/* Simulation Control Bar */}
      <div className="bg-[#2C46EA]/10 border border-[#2C46EA]/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-[#2C46EA]" />
          <div>
            <h3 className="font-semibold text-content leading-tight">Live Simulation Mode</h3>
            <p className="text-xs text-content-muted">Demonstrating: Problem → Detection → Action → ROI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {simState === 'normal' || simState === 'resolved' ? (
             <Button onClick={triggerSimulation} className="bg-[#E68325] hover:bg-[#E68325]/90 text-white border-0 shadow text-sm">
               Simulate Outage
             </Button>
          ) : simState === 'triggered' ? (
             <Button onClick={acknowledgeAlert} className="bg-warning text-white hover:bg-warning/90 shadow text-sm">
               Acknowledge & Dispatch Tech
             </Button>
          ) : (
             <Button onClick={resolveSimulation} className="bg-success text-white hover:bg-success/90 shadow text-sm">
               Confirm Resolution
             </Button>
          )}
        </div>
      </div>

      {/* Top Header & Facility Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content flex items-center gap-3">
            Command Center
            <Badge variant={simState === 'triggered' ? 'error' : 'success'} className="animate-pulse">
              {simState === 'triggered' ? 'Critical Alert' : 'Live system'}
            </Badge>
          </h1>
          <p className="text-sm text-content-muted mt-1 flex items-center gap-2">
            <RefreshCw className={cn("h-3 w-3", syncTime === 0 && "animate-spin")} />
            Last synced {syncTime} seconds ago
          </p>
        </div>
        
        <div className="flex bg-surface p-1 rounded-lg border border-surface">
          {FACILITY_PROFILES.map(facility => (
            <button
              key={facility.id}
              onClick={() => setSelectedFacility(facility)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                selectedFacility.id === facility.id 
                  ? "bg-[#2C46EA] text-white shadow-sm" 
                  : "text-content-muted hover:text-content"
              )}
            >
              {facility.tier}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {/* ROI & Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className={cn(
              "transition-colors duration-500", 
              simState === 'resolved' ? "bg-success/10 border-success/30" : "bg-[#2C46EA]/5 border-[#2C46EA]/20"
            )}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className={cn("text-sm font-semibold", simState === 'resolved' ? "text-success" : "text-[#2C46EA]")}>Saved Capital (Est)</p>
                    <div className="flex items-baseline space-x-2">
                      <h2 className="text-3xl font-bold tracking-tight text-content transition-all duration-1000">
                        ₹{savings.toLocaleString()}
                      </h2>
                      {simState === 'resolved' && (
                        <span className="text-xs font-bold text-success animate-bounce flex items-center">+₹12k Protected</span>
                      )}
                    </div>
                  </div>
                  <div className={cn("h-10 w-10 rounded-lg text-white flex items-center justify-center transition-colors", simState === 'resolved' ? "bg-success" : "bg-[#2C46EA]")}>
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-content-muted mt-4 font-medium">Mapped to avoided thermal spoilage (10-25% baseline).</p>
              </CardContent>
            </Card>

            <Card className={cn(simState === 'triggered' && "border-[#E68325]/50 bg-[#E68325]/5 transition-colors")}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-content-muted">Avg Core Temp</p>
                    <div className="flex items-baseline space-x-2">
                      <h2 className={cn("text-3xl font-bold tracking-tight", currentTemp > 8 ? "text-error" : "text-content")}>
                        {currentTemp}°C
                      </h2>
                      <span className={cn(
                        "text-xs font-bold flex items-center", 
                        currentTemp > 8 ? "text-error animate-pulse" : "text-success"
                      )}>
                        {currentTemp > 8 ? <ArrowUpRight className="h-3 w-3 mr-1"/> : <ArrowDownRight className="h-3 w-3 mr-1"/>} 
                        {currentTemp > 8 ? "Critical Rising" : "Stable"}
                      </span>
                    </div>
                  </div>
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", currentTemp > 8 ? "bg-error/10 border-error/20" : "bg-surface border-content-muted/20")}>
                    <Thermometer className={cn("h-5 w-5", currentTemp > 8 ? "text-error" : "text-content-muted")} />
                  </div>
                </div>
                <p className="text-xs text-content-muted mt-4 font-medium">Target Envelope: 2.0°C - 8.0°C</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-content-muted">Sensor Diagnostics</p>
                    <div className="flex items-baseline space-x-2">
                      <h2 className="text-3xl font-bold tracking-tight text-success">Active</h2>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Server className="h-5 w-5 text-success" />
                  </div>
                </div>
                <p className="text-xs text-content-muted mt-4 font-medium">Reporting: {selectedFacility.totalSensors} / {selectedFacility.totalSensors} Hardware Nodes</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Thermal Trajectory (24h) - {selectedFacility.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--app-surface)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--app-text-secondary)" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis stroke="var(--app-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°C`} domain={[2, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--app-text-secondary)', borderRadius: '8px' }}
                      labelStyle={{ color: 'var(--app-text-primary)', marginBottom: '4px' }}
                      itemStyle={{ color: 'var(--app-text-primary)' }}
                    />
                    <ReferenceLine y={8} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Critical Ceiling (+8°C)', fill: '#EF4444', fontSize: 12 }} />
                    <Line type="monotone" dataKey="temperature" stroke="var(--app-primary)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: 'var(--app-primary)' }} />
                    {simState === 'triggered' && (
                       <ReferenceLine x={data[data.length - 1]?.time} stroke="#E68325" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Anomaly Triggered', fill: '#E68325', fontSize: 12 }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Zone Visualization */}
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-4 mt-2">Facility Zones ({selectedFacility.totalSensors} Sensors)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {zones.map((zone) => (
                <Card key={zone.id} className={cn("relative overflow-hidden group transition-all", zone.status==='critical' && "border-error/50 shadow-lg shadow-error/10")}>
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    zone.status === 'critical' ? 'bg-error' :
                    zone.status === 'warning' ? 'bg-[#E68325]' : 'bg-success'
                  }`} />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-semibold text-content mb-1 text-sm">{zone.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold text-content-muted bg-surface px-1.5 py-0.5 rounded border border-surface tracking-wider">
                            {zone.sensorType}
                          </span>
                        </div>
                      </div>
                      <Badge variant={zone.status === 'optimal' ? 'success' : zone.status === 'warning' ? 'warning' : 'error'}>
                        {zone.status === 'optimal' ? 'Normal' : zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={cn("text-3xl font-bold", zone.status === 'critical' && "text-error")}>{zone.temperature}°C</span>
                        <p className="text-xs font-semibold text-content-muted mt-1 uppercase tracking-wider">Target: {zone.targetTemp}°C</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-xs font-semibold text-content-muted uppercase tracking-wider">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Action Feed */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">
          {/* Actionable Alerts Feed */}
          <Card className={cn("flex flex-col transition-colors", simState === 'triggered' && "border-error/30")}>
            <CardHeader className="pb-3 border-b border-surface">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-[#E68325]"/>
                  Alert Routing
                </CardTitle>
                <span className="text-[10px] font-bold text-success uppercase tracking-wider px-2 py-1 bg-success/10 rounded-sm">
                  Resp: &lt; 5m
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-visible p-4 h-[300px]">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={cn(
                    "flex gap-3 items-start p-3 rounded-lg bg-surface/30 border transition-all",
                    alert.severity === 'error' ? 'border-error/30 bg-error/5 shadow-sm' : 'border-surface hover:border-content-muted/30'
                  )}>
                    <div className={cn("mt-0.5 rounded-full p-1.5", 
                      alert.severity === 'error' ? 'bg-error/10 text-error' :
                      alert.severity === 'warning' ? 'bg-[#E68325]/10 text-[#E68325]' :
                      'bg-success/10 text-success'
                    )}>
                      {alert.severity === 'error' ? <AlertTriangle className="h-3.5 w-3.5" /> :
                       alert.severity === 'warning' ? <AlertTriangle className="h-3.5 w-3.5" /> :
                       <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant={alert.severity} className="text-[10px] px-1.5 py-0">{alert.status.toUpperCase()}</Badge>
                        <span className="text-[10px] font-bold tracking-wider text-content-muted uppercase">{alert.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-content leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AMC & Maintenance Feed */}
          <Card className="flex flex-col flex-1">
            <CardHeader className="pb-3 border-b border-surface">
              <CardTitle className="text-base flex items-center justify-between">
                AMC Deployment Logs
                <Wrench className="h-4 w-4 text-content-muted" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-visible h-[300px]">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:to-transparent before:from-surface/80">
                {logs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-surface bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 z-[1] left-2 ml-[-4px]">
                      {log.status === 'completed' ? (
                        <Check className="h-3 w-3 text-success font-bold" />
                      ) : (
                        <Activity className="h-3 w-3 text-[#E68325] animate-pulse" />
                      )}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-surface bg-surface hover:bg-surface/80 transition-colors ml-4 md:ml-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-content">{log.technician}</span>
                        <span className="text-[10px] font-bold text-content-muted uppercase tracking-wider">{log.date}</span>
                      </div>
                      <p className="text-xs font-medium text-content-muted leading-tight">{log.task}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={requestTechnician} className="w-full mt-4 text-[10px] uppercase tracking-widest font-bold text-[#E68325] hover:text-[#E68325]/80 transition-colors text-center py-3 bg-[#E68325]/5 hover:bg-[#E68325]/10 rounded-lg border border-[#E68325]/20 shadow-sm cursor-pointer">
                Request Technician Callout
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
