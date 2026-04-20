import { useState } from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, Filter, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_ALERTS } from '../utils/mockData';
import { downloadCSV } from '../utils/csvExport';
import { cn } from '../utils/cn';

export function Alerts() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'error' | 'warning' | 'success'>('all');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filtered = MOCK_ALERTS.filter(a => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchSearch =
      !search ||
      a.message.toLowerCase().includes(search.toLowerCase()) ||
      a.zone.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSeverity && matchSearch;
  });

  const handleExport = () => {
    setIsExporting(true);
    const rows = filtered.map(a => ({
      'Alert ID': a.id,
      Zone: a.zone,
      Severity: a.severity,
      Status: a.status,
      Message: a.message,
      Time: a.time,
    }));
    downloadCSV(`kryose_alerts_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    setTimeout(() => setIsExporting(false), 600);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content">System Alerts & Incidents</h1>
          <p className="text-sm text-content-muted mt-1">
            Comprehensive audit log of all thermal anomalies and structural warnings.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting || filtered.length === 0}
          className="text-xs font-bold tracking-wider uppercase flex items-center gap-2 shrink-0"
        >
          <Download className={cn('h-4 w-4', isExporting && 'animate-bounce')} />
          {isExporting ? 'Exporting...' : `Export CSV (${filtered.length})`}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 bg-surface/30">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#2C46EA]" /> Filters
          </CardTitle>
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-content-muted" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-background border border-surface rounded-md text-content focus:outline-none focus:ring-1 focus:ring-[#2C46EA] w-44"
              />
            </div>

            {/* Status filter */}
            <div className="flex bg-surface p-1 rounded-md border border-surface shadow-inner">
              {(['all', 'active', 'resolved'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all',
                    statusFilter === s
                      ? s === 'active' ? 'bg-[#E68325] text-white shadow-sm'
                        : s === 'resolved' ? 'bg-success text-white shadow-sm'
                        : 'bg-background text-content shadow-sm'
                      : 'text-content-muted hover:text-content'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Severity filter */}
            <div className="flex bg-surface p-1 rounded-md border border-surface shadow-inner">
              {(['all', 'error', 'warning', 'success'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={cn(
                    'px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all',
                    severityFilter === s
                      ? s === 'error' ? 'bg-error text-white shadow-sm'
                        : s === 'warning' ? 'bg-[#E68325] text-white shadow-sm'
                        : s === 'success' ? 'bg-success text-white shadow-sm'
                        : 'bg-background text-content shadow-sm'
                      : 'text-content-muted hover:text-content'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-content-muted gap-3">
              <CheckCircle2 className="h-10 w-10 opacity-30" />
              <p className="font-semibold text-sm">No alerts match your filters</p>
              <button
                onClick={() => { setStatusFilter('all'); setSeverityFilter('all'); setSearch(''); }}
                className="text-xs text-[#2C46EA] font-bold uppercase tracking-wider hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
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
                  {filtered.map(alert => (
                    <tr key={alert.id} className="hover:bg-surface/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] font-bold text-[#2C46EA]">{alert.id}</td>
                      <td className="px-6 py-4 text-xs font-semibold uppercase text-content-muted whitespace-nowrap">{alert.time}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[10px] py-0">{alert.zone}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {alert.severity === 'error'
                            ? <AlertOctagon className="h-4 w-4 text-error" />
                            : alert.severity === 'warning'
                            ? <AlertTriangle className="h-4 w-4 text-[#E68325]" />
                            : <CheckCircle2 className="h-4 w-4 text-success" />}
                          <span className={cn('text-[10px] font-bold uppercase',
                            alert.severity === 'error' ? 'text-error' :
                            alert.severity === 'warning' ? 'text-[#E68325]' : 'text-success'
                          )}>
                            {alert.severity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-content max-w-xs">{alert.message}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge
                          variant={alert.status === 'active' ? 'warning' : 'success'}
                          className="text-[10px]"
                        >
                          {alert.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
