import { useState, useEffect } from 'react';
import {
  BellRing, Shield, Settings2, Smartphone, HardDrive, Check,
  Copy, CheckCheck, RefreshCw, Plus, Trash2, Wifi, WifiOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ContactEntry {
  id: string;
  role: string;
  phone: string;
  color: string;
}

interface SensorRow {
  zone: string;
  sensorId: string;
  type: string;
  lastCalibration: string;
  signal: 'strong' | 'weak' | 'offline';
}

interface UserRow {
  name: string;
  email: string;
  role: 'Admin' | 'Operator' | 'Read-only';
  twoFa: boolean;
}

// ── Static data ────────────────────────────────────────────────────────────────
const SENSOR_MAP: SensorRow[] = [
  { zone: 'Zone A', sensorId: 'SN-A221', type: 'PT100 RTD',  lastCalibration: '12 Apr 2026', signal: 'strong'  },
  { zone: 'Zone B', sensorId: 'SN-B114', type: 'PT100 RTD',  lastCalibration: '18 Apr 2026', signal: 'strong'  },
  { zone: 'Zone C', sensorId: 'SN-C098', type: 'DS18B20',    lastCalibration: '02 Apr 2026', signal: 'strong'  },
  { zone: 'Zone D', sensorId: 'SN-D001', type: 'DS18B20',    lastCalibration: '—',           signal: 'offline' },
  { zone: 'Zone E', sensorId: 'SN-E055', type: 'DHT22',      lastCalibration: '08 Apr 2026', signal: 'weak'    },
];

const INITIAL_USERS: UserRow[] = [
  { name: 'Admin User',     email: 'admin@kryose.io',    role: 'Admin',     twoFa: true  },
  { name: 'Rahul Sharma',   email: 'rahul@kryose.io',    role: 'Operator',  twoFa: true  },
  { name: 'Priya Kapoor',   email: 'priya@client.com',   role: 'Read-only', twoFa: false },
];

const API_ENDPOINTS = [
  { method: 'GET',  path: '/api/sensors',              desc: 'List all sensor readings'       },
  { method: 'GET',  path: '/api/zones',                desc: 'Fetch all zone statuses'        },
  { method: 'GET',  path: '/api/alerts',               desc: 'Retrieve alert history'         },
  { method: 'POST', path: '/api/alerts/:id/resolve',   desc: 'Mark an alert as resolved'      },
  { method: 'GET',  path: '/api/maintenance',          desc: 'List AMC maintenance logs'      },
  { method: 'POST', path: '/api/maintenance/dispatch', desc: 'Dispatch technician callout'    },
];

const CONTACTS_INIT: ContactEntry[] = [
  { id: '1', role: 'Director of Operations', phone: '+91 98765 43210', color: '#2C46EA' },
  { id: '2', role: 'Backup Service Technician (AMC)', phone: '+91 91234 56789', color: '#E68325' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'w-11 h-6 rounded-full relative transition-colors duration-300 cursor-pointer shrink-0',
        enabled ? 'bg-[#2C46EA]' : 'bg-surface border border-content-muted/30'
      )}
    >
      <div className={cn(
        'absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center',
        enabled ? 'right-1 bg-white' : 'left-1 bg-content-muted'
      )}>
        {enabled && <Check className="h-2.5 w-2.5 text-[#2C46EA]" />}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function Settings() {
  const [activeTab, setActiveTab] = useState('escalation');

  // Escalation
  const [smsEnabled, setSmsEnabled]   = useState(() => localStorage.getItem('kryose_sms')   !== 'false');
  const [emailEnabled, setEmailEnabled] = useState(() => localStorage.getItem('kryose_email') !== 'false');
  const [pushEnabled, setPushEnabled]  = useState(() => localStorage.getItem('kryose_push')  === 'true');
  const [contacts, setContacts] = useState<ContactEntry[]>(CONTACTS_INIT);
  const [savingEscalation, setSavingEscalation] = useState(false);
  const [escalationSaved, setEscalationSaved] = useState(false);

  // Hardware
  const [calibrating, setCalibrating] = useState(false);
  const [calibrated, setCalibrated] = useState(false);

  // Security
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const API_KEY = 'kry_live_8f3a1b9cd72e4f05a6b2c3d4e5f67890';

  // Developer
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.example.com/kryose');
  const [webhookSaved, setWebhookSaved] = useState(false);

  // Persist notification toggles
  useEffect(() => { localStorage.setItem('kryose_sms',   smsEnabled.toString());   }, [smsEnabled]);
  useEffect(() => { localStorage.setItem('kryose_email', emailEnabled.toString()); }, [emailEnabled]);
  useEffect(() => { localStorage.setItem('kryose_push',  pushEnabled.toString());  }, [pushEnabled]);

  const saveEscalation = () => {
    setSavingEscalation(true);
    setTimeout(() => { setSavingEscalation(false); setEscalationSaved(true); setTimeout(() => setEscalationSaved(false), 2000); }, 800);
  };

  const handleCalibrateAll = () => {
    setCalibrating(true);
    setTimeout(() => { setCalibrating(false); setCalibrated(true); setTimeout(() => setCalibrated(false), 2500); }, 2000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(API_KEY).catch(() => {});
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const saveWebhook = () => {
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2000);
  };

  const toggleUserTwoFa = (idx: number) => {
    setUsers(u => u.map((usr, i) => i === idx ? { ...usr, twoFa: !usr.twoFa } : usr));
  };

  const removeContact = (id: string) => {
    setContacts(c => c.filter(x => x.id !== id));
  };

  const navItems = [
    { id: 'escalation', label: 'Escalation Chains', icon: BellRing },
    { id: 'hardware',   label: 'Hardware Mapping',  icon: HardDrive },
    { id: 'security',   label: 'Security & Access', icon: Shield     },
    { id: 'api',        label: 'Developer API',     icon: Settings2  },
  ];

  // ── Panels ──────────────────────────────────────────────────────────────────

  const EscalationPanel = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-surface">
          <CardTitle className="text-base uppercase tracking-wider">Alert Routing & Escalation</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {[
            { label: 'SMS Incident Paging', desc: 'Immediately page technician cell phones during CRITICAL state.', enabled: smsEnabled, toggle: () => setSmsEnabled(v => !v) },
            { label: 'Automated Operations Digest', desc: 'Receive daily thermal compliance aggregations via Email.', enabled: emailEnabled, toggle: () => setEmailEnabled(v => !v) },
            { label: 'Push Notifications', desc: 'Receive OS-level notifications for all WARNING states.', enabled: pushEnabled, toggle: () => setPushEnabled(v => !v) },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between group">
              <div>
                <h4 className="text-sm font-bold text-content group-hover:text-[#2C46EA] transition-colors">{item.label}</h4>
                <p className="text-[11px] text-content-muted font-medium mt-1">{item.desc}</p>
              </div>
              <ToggleSwitch enabled={item.enabled} onToggle={item.toggle} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base uppercase tracking-wider">Primary Escalation Contacts</CardTitle>
          <button
            onClick={() => setContacts(c => [...c, { id: Date.now().toString(), role: 'New Contact', phone: '+91 00000 00000', color: '#7060A8' }])}
            className="flex items-center gap-1 text-xs font-bold text-[#2C46EA] hover:text-[#2C46EA]/80 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-3 bg-background border border-surface rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-md" style={{ backgroundColor: `${c.color}18` }}>
                    <Smartphone className="h-4 w-4" style={{ color: c.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-content">{c.role}</p>
                    <p className="text-[10px] text-content-muted font-mono mt-0.5">{c.phone}</p>
                  </div>
                </div>
                <button onClick={() => removeContact(c.id)} className="p-1.5 text-content-muted hover:text-error transition-colors rounded">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={saveEscalation}
            disabled={savingEscalation}
            className="mt-4 w-full bg-[#2C46EA] hover:bg-[#2C46EA]/90 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {savingEscalation ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...</>
             : escalationSaved ? <><CheckCheck className="h-3.5 w-3.5" /> Saved!</>
             : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const HardwarePanel = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base uppercase tracking-wider">Sensor Node Registry</CardTitle>
          <Button
            variant="outline"
            onClick={handleCalibrateAll}
            disabled={calibrating}
            className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            {calibrating ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Calibrating...</>
             : calibrated ? <><CheckCheck className="h-3.5 w-3.5 text-success" /> Done!</>
             : 'Recalibrate All'}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-wider text-content-muted bg-surface/40 border-b border-surface">
                <tr>
                  <th className="px-5 py-3 font-bold">Zone</th>
                  <th className="px-5 py-3 font-bold">Sensor ID</th>
                  <th className="px-5 py-3 font-bold">Type</th>
                  <th className="px-5 py-3 font-bold">Last Calibration</th>
                  <th className="px-5 py-3 font-bold text-right">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {SENSOR_MAP.map(row => (
                  <tr key={row.sensorId} className="hover:bg-surface/20 transition-colors">
                    <td className="px-5 py-3 font-semibold text-xs text-content">{row.zone}</td>
                    <td className="px-5 py-3 font-mono text-[11px] font-bold text-[#2C46EA]">{row.sensorId}</td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] uppercase font-bold text-content-muted bg-surface px-2 py-0.5 rounded border border-surface tracking-wider">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-content-muted">{row.lastCalibration}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {row.signal === 'strong'  && <><Wifi     className="h-3.5 w-3.5 text-success" />  <span className="text-[10px] font-bold text-success uppercase">Strong</span></>}
                        {row.signal === 'weak'    && <><Wifi     className="h-3.5 w-3.5 text-[#E68325]" /><span className="text-[10px] font-bold text-[#E68325] uppercase">Weak</span></>}
                        {row.signal === 'offline' && <><WifiOff  className="h-3.5 w-3.5 text-content-muted" /><span className="text-[10px] font-bold text-content-muted uppercase">Offline</span></>}
                      </div>
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

  const SecurityPanel = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-surface">
          <CardTitle className="text-base uppercase tracking-wider">User Access Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-wider text-content-muted bg-surface/40 border-b border-surface">
                <tr>
                  <th className="px-5 py-3 font-bold">User</th>
                  <th className="px-5 py-3 font-bold">Role</th>
                  <th className="px-5 py-3 font-bold text-center">2FA</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {users.map((user, idx) => (
                  <tr key={user.email} className="hover:bg-surface/20 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-content">{user.name}</p>
                      <p className="text-[10px] text-content-muted font-mono">{user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={user.role === 'Admin' ? 'default' : user.role === 'Operator' ? 'warning' : 'outline'}
                        className="text-[10px]"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <ToggleSwitch enabled={user.twoFa} onToggle={() => toggleUserTwoFa(idx)} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-[10px] font-bold uppercase text-[#2C46EA] hover:text-[#2C46EA]/80 tracking-wider transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-surface">
          <CardTitle className="text-base uppercase tracking-wider">API Key</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-background border border-surface rounded-lg px-4 py-2.5 font-mono text-xs text-content-muted overflow-hidden">
              {apiKeyVisible ? API_KEY : '••••••••••••••••••••••••••••••••••••••••'}
            </div>
            <Button variant="outline" onClick={() => setApiKeyVisible(v => !v)} className="text-xs font-bold uppercase tracking-wider shrink-0">
              {apiKeyVisible ? 'Hide' : 'Show'}
            </Button>
            <Button variant="outline" onClick={copyApiKey} className="text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              {apiKeyCopied ? <><CheckCheck className="h-3.5 w-3.5 text-success" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
            </Button>
          </div>
          <p className="text-[11px] text-content-muted font-medium">
            This key grants full read/write access to sensor and alert endpoints. Do not expose it in client-side code.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const DeveloperPanel = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-surface">
          <CardTitle className="text-base uppercase tracking-wider">Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-muted uppercase tracking-wider mb-2">
              Webhook Endpoint URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://your-server.com/webhooks/kryose"
                className="flex-1 px-3 py-2.5 text-sm border border-surface bg-background rounded-lg text-content focus:outline-none focus:ring-2 focus:ring-[#2C46EA]"
              />
              <Button
                onClick={saveWebhook}
                className="bg-[#2C46EA] hover:bg-[#2C46EA]/90 text-xs font-bold uppercase tracking-widest shrink-0 flex items-center gap-1.5"
              >
                {webhookSaved ? <><CheckCheck className="h-3.5 w-3.5" /> Saved!</> : 'Save'}
              </Button>
            </div>
            <p className="text-[11px] text-content-muted mt-2 font-medium">
              Events sent: <code className="text-[#2C46EA]">alert.triggered</code>, <code className="text-[#2C46EA]">alert.resolved</code>, <code className="text-[#2C46EA]">sensor.offline</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-surface">
          <CardTitle className="text-base uppercase tracking-wider">REST API Reference</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-wider text-content-muted bg-surface/40 border-b border-surface">
                <tr>
                  <th className="px-5 py-3 font-bold">Method</th>
                  <th className="px-5 py-3 font-bold">Endpoint</th>
                  <th className="px-5 py-3 font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {API_ENDPOINTS.map(ep => (
                  <tr key={ep.path} className="hover:bg-surface/20 transition-colors">
                    <td className="px-5 py-3">
                      <span className={cn(
                        'text-[10px] font-bold uppercase px-2 py-0.5 rounded',
                        ep.method === 'GET' ? 'bg-success/10 text-success' : 'bg-[#E68325]/10 text-[#E68325]'
                      )}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-[#2C46EA]">{ep.path}</td>
                    <td className="px-5 py-3 text-xs text-content-muted">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-surface">
            <p className="text-[11px] text-content-muted font-medium">
              Base URL: <code className="text-[#2C46EA] font-mono">https://api.kryose.io/v1</code> — Authenticate with <code className="text-[#2C46EA]">Authorization: Bearer &lt;API_KEY&gt;</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const panelMap: Record<string, React.ReactNode> = {
    escalation: EscalationPanel,
    hardware:   HardwarePanel,
    security:   SecurityPanel,
    api:        DeveloperPanel,
  };

  return (
    <div className="p-6 md:p-8 max-w-[1100px] mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content">Facility Parameters</h1>
          <p className="text-sm text-content-muted mt-1">
            Configure hardware thresholds, scaling boundaries, and alert escalation chains.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="md:col-span-1 space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg text-sm font-bold tracking-wide flex items-center gap-3 transition-all',
                activeTab === item.id
                  ? 'bg-[#2C46EA]/5 border border-[#2C46EA]/20 text-[#2C46EA]'
                  : 'hover:bg-surface border border-transparent text-content-muted hover:text-content'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Active panel */}
        <div className="md:col-span-3">
          {panelMap[activeTab]}
        </div>
      </div>
    </div>
  );
}
