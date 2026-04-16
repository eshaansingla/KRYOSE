import { useState } from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_ALERTS } from '../utils/mockData';
import { cn } from '../utils/cn';

export function Alerts() {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500); // Simulate export
  };

  const filteredAlerts = MOCK_ALERTS.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content flex items-center gap-3">
            System Alerts & Incidents
          </h1>
          <p className="text-sm text-content-muted mt-1">Comprehensive audit log of all thermal anomalies and structural warnings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-xs font-bold tracking-wider uppercase flex items-center gap-2" onClick={handleExport} disabled={isExporting}>
            <Download className={cn("h-4 w-4", isExporting && "animate-bounce")} /> {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4 bg-surface/30">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#2C46EA]" /> Filter view
          </CardTitle>
          <div className="flex bg-surface p-1 rounded-md border border-surface shadow-inner">
            <button
              onClick={() => setFilter('all')}
              className={cn("px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all", filter === 'all' ? "bg-background text-content shadow-sm" : "text-content-muted hover:text-content")}
            >All</button>
            <button
              onClick={() => setFilter('active')}
              className={cn("px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all", filter === 'active' ? "bg-[#E68325] text-white shadow-sm" : "text-content-muted hover:text-content")}
            >Active</button>
            <button
              onClick={() => setFilter('resolved')}
              className={cn("px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all", filter === 'resolved' ? "bg-success text-white shadow-sm" : "text-content-muted hover:text-content")}
            >Resolved</button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-wider text-content-muted bg-surface/40 border-y border-surface">
                <tr>
                  <th className="px-6 py-4 font-bold">Alert ID</th>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Severity</th>
                  <th className="px-6 py-4 font-bold">Message</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filteredAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-surface/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-[#2C46EA]">{alert.id}</td>
                    <td className="px-6 py-4 text-xs font-semibold uppercase text-content-muted">{alert.time}</td>
                    <td className="px-6 py-4"><Badge variant="outline" className="text-[10px] py-0">{alert.zone}</Badge></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {alert.severity === 'error' ? <AlertOctagon className="h-4 w-4 text-error" /> :
                         alert.severity === 'warning' ? <AlertTriangle className="h-4 w-4 text-[#E68325]" /> :
                         <CheckCircle2 className="h-4 w-4 text-success" />}
                         <span className={cn("text-[10px] font-bold uppercase", 
                          alert.severity === 'error' ? 'text-error' : alert.severity === 'warning' ? 'text-[#E68325]' : 'text-success'
                         )}>{alert.severity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-content">{alert.message}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={alert.status === 'active' ? 'warning' : 'success'} className="text-[10px]">
                        {alert.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
