import { useState } from 'react';
import { BellRing, Shield, Settings2, Smartphone, HardDrive, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export function Settings() {
  const [activeTab, setActiveTab] = useState('escalation');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content flex items-center gap-3">
            Facility Parameters
          </h1>
          <p className="text-sm text-content-muted mt-1">Configure hardware thresholds, scaling boundaries, and alert escalation chains.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('escalation')}
            className={cn("w-full text-left px-4 py-3 rounded-lg text-sm font-bold tracking-wide flex items-center gap-3 transition-colors", activeTab === 'escalation' ? "bg-[#2C46EA]/5 border border-[#2C46EA]/20 text-[#2C46EA]" : "hover:bg-surface border border-transparent text-content-muted")}>
            <BellRing className="h-4 w-4" /> Escalation Chains
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={cn("w-full text-left px-4 py-3 rounded-lg text-sm font-bold tracking-wide flex items-center gap-3 transition-colors", activeTab === 'hardware' ? "bg-[#2C46EA]/5 border border-[#2C46EA]/20 text-[#2C46EA]" : "hover:bg-surface border border-transparent text-content-muted")}>
            <HardDrive className="h-4 w-4" /> Hardware Mapping
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={cn("w-full text-left px-4 py-3 rounded-lg text-sm font-bold tracking-wide flex items-center gap-3 transition-colors", activeTab === 'security' ? "bg-[#2C46EA]/5 border border-[#2C46EA]/20 text-[#2C46EA]" : "hover:bg-surface border border-transparent text-content-muted")}>
            <Shield className="h-4 w-4" /> Security & Access
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={cn("w-full text-left px-4 py-3 rounded-lg text-sm font-bold tracking-wide flex items-center gap-3 transition-colors", activeTab === 'api' ? "bg-[#2C46EA]/5 border border-[#2C46EA]/20 text-[#2C46EA]" : "hover:bg-surface border border-transparent text-content-muted")}>
            <Settings2 className="h-4 w-4" /> Developer API
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-surface">
              <CardTitle className="text-base uppercase tracking-wider">Alert Routing & Escalation</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

              <div className="flex items-center justify-between group cursor-pointer" onClick={() => setSmsEnabled(!smsEnabled)}>
                <div>
                  <h4 className="text-sm font-bold text-content group-hover:text-[#2C46EA] transition-colors">SMS Incident Paging</h4>
                  <p className="text-[11px] text-content-muted font-medium mt-1">Immediately page technician cell phones during `CRITICAL` state.</p>
                </div>
                <div className={cn("w-11 h-6 rounded-full relative transition-colors duration-300", smsEnabled ? "bg-[#2C46EA]" : "bg-surface border border-content-muted/30")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center", smsEnabled ? "right-1 bg-white" : "left-1 bg-content-muted")}>
                    {smsEnabled && <Check className="h-3 w-3 text-[#2C46EA]" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between group cursor-pointer" onClick={() => setEmailEnabled(!emailEnabled)}>
                <div>
                  <h4 className="text-sm font-bold text-content group-hover:text-[#2C46EA] transition-colors">Automated Operations Digest</h4>
                  <p className="text-[11px] text-content-muted font-medium mt-1">Receive daily thermal compliance aggregations via Email.</p>
                </div>
                <div className={cn("w-11 h-6 rounded-full relative transition-colors duration-300", emailEnabled ? "bg-[#2C46EA]" : "bg-surface border border-content-muted/30")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center", emailEnabled ? "right-1 bg-white" : "left-1 bg-content-muted")}>
                    {emailEnabled && <Check className="h-3 w-3 text-[#2C46EA]" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between group cursor-pointer" onClick={() => setPushEnabled(!pushEnabled)}>
                <div>
                  <h4 className="text-sm font-bold text-content group-hover:text-[#2C46EA] transition-colors">Push Notifications</h4>
                  <p className="text-[11px] text-content-muted font-medium mt-1">Receive OS-level notifications for all `WARNING` states.</p>
                </div>
                <div className={cn("w-11 h-6 rounded-full relative transition-colors duration-300", pushEnabled ? "bg-[#2C46EA]" : "bg-surface border border-content-muted/30")}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center", pushEnabled ? "right-1 bg-white" : "left-1 bg-content-muted")}>
                    {pushEnabled && <Check className="h-3 w-3 text-[#2C46EA]" />}
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-surface">
              <CardTitle className="text-base uppercase tracking-wider">Primary Escalation Contacts</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-3 bg-background border border-surface rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#2C46EA]/10 p-2 rounded-md"><Smartphone className="h-4 w-4 text-[#2C46EA]" /></div>
                    <div>
                      <p className="text-xs font-bold text-content">Director of Operations</p>
                      <p className="text-[10px] text-content-muted font-mono mt-0.5">+91 98765 43210</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-wide">Edit</Button>
                </div>

                <div className="p-3 bg-background border border-surface rounded-lg flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#E68325]/10 p-2 rounded-md"><Smartphone className="h-4 w-4 text-[#E68325]" /></div>
                    <div>
                      <p className="text-xs font-bold text-content">Backup Service Technician (AMC)</p>
                      <p className="text-[10px] text-content-muted font-mono mt-0.5">+91 91234 56789</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-wide">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
