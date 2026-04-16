import { Link } from 'react-router-dom';
import { ArrowRight, Box, Check, History } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Landing() {
  return (
    <div className="flex flex-col min-h-full bg-background selection:bg-[#2C46EA]/20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-surface">
        <div className="absolute inset-0 bg-[#2C46EA]/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E68325]/10 text-[#E68325] mb-8 border border-[#E68325]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E68325] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E68325]"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Hardware + Dashboard Deployment</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-content mb-6 leading-[1.1]">
                Cold Intelligence.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E68325] via-[#7060A8] to-[#2C46EA]">
                  Zero Loss.
                </span>
              </h1>
              <p className="max-w-xl text-lg text-content-muted mb-10 leading-relaxed font-medium">
                The cold chain supply loses ₹89,000 Crores annually to inefficiency. We eliminate blind spots with PT100 RTD sensor networks and proactive AMC dispatches, securing a 6–12 month direct ROI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 group bg-[#2C46EA] hover:bg-[#2C46EA]/90">
                    <Box className="h-5 w-5" />
                    Enter Live Command Center
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/#hardware">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-surface text-content-muted hover:text-content">
                    View Hardware Specs
                  </Button>
                </Link>
              </div>
            </div>

            {/* The Industry Problem Block */}
            <div className="bg-surface/50 border border-surface rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-content mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-[#E68325]"/>
                Root Causes of 40% Food Wastage
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-content-muted">
                    <span>Equipment Malfunction</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-surface"><div className="bg-[#2C46EA] h-2 rounded-full" style={{ width: '35%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-content-muted">
                    <span>Power Outages</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-surface"><div className="bg-[#E68325] h-2 rounded-full" style={{ width: '28%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-content-muted">
                    <span>Thermal Fluctuations</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-surface"><div className="bg-[#7060A8] h-2 rounded-full" style={{ width: '18%' }}></div></div>
                </div>
                <div className="flex justify-between mt-4 border-t border-surface pt-4 text-xs font-bold text-content-muted">
                  <span>Additional: Doors (12%), Monitoring Gaps (7%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Measurable Impact Banner */}
      <section className="border-b border-surface bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-surface">
            <div className="flex flex-col text-center pt-4 md:pt-0">
              <span className="text-4xl font-bold text-content tracking-tight">10–25%</span>
              <span className="text-xs text-content-muted mt-2 uppercase tracking-widest font-bold">Spoilage Reduction</span>
            </div>
            <div className="flex flex-col text-center pt-4 md:pt-0">
              <span className="text-4xl font-bold text-[#E68325] tracking-tight">&lt; 5 mins</span>
              <span className="text-xs text-content-muted mt-2 uppercase tracking-widest font-bold">Alert Execution</span>
            </div>
            <div className="flex flex-col text-center pt-4 md:pt-0">
              <span className="text-4xl font-bold text-[#2C46EA] tracking-tight">8–14 mo</span>
              <span className="text-xs text-content-muted mt-2 uppercase tracking-widest font-bold">Unit Payback Period</span>
            </div>
            <div className="flex flex-col text-center pt-4 md:pt-0">
              <span className="text-4xl font-bold text-content tracking-tight">1–2 Day</span>
              <span className="text-xs text-content-muted mt-2 uppercase tracking-widest font-bold">Deployment Timeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Value Prop */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-content mb-4 tracking-tight">Operational Hardware Subscriptions</h2>
            <p className="text-content-muted text-sm font-medium">Standard unit economics require ₹40k–₹80k per warehouse hardware/installation capital setup. Hardware is available on an upfront sale or leased amortized model depending on compliance ceilings.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Tier 3: Pilot */}
            <div className="flex flex-col border border-surface bg-surface/30 rounded-lg p-8 hover:border-content-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-content uppercase tracking-wider">Pilot Deployment</h3>
                <span className="text-xs font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted">Tier 3</span>
              </div>
              <p className="text-sm font-medium text-content-muted mb-6 h-10">4-6 sensors evaluating baseline thermal footprints in single facilities.</p>
              <div className="mb-6"><span className="text-4xl font-bold tracking-tight">₹3K–₹5K</span><span className="text-xs font-bold text-content-muted uppercase ml-2 tracking-wider">/mo</span></div>
              <ul className="space-y-4 mb-8 text-xs font-semibold text-content-muted uppercase tracking-wider flex-1">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> Standard DS18B20 / DHT22</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> Single-zone tracking</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> Setup Fee: ₹5k - ₹8k</li>
              </ul>
              <Link to="/login"><Button variant="outline" className="w-full text-xs uppercase tracking-widest font-bold">Initiate Pilot Phase</Button></Link>
            </div>
            
            {/* Tier 2: Standard */}
            <div className="flex flex-col border-2 border-[#2C46EA] bg-background rounded-lg p-8 relative shadow-2xl shadow-[#2C46EA]/10 transform lg:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2C46EA] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Targeted Scale
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-content uppercase tracking-wider">Multi-Zone Ops</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted">Tier 2</span>
              </div>
              <p className="text-sm font-medium text-content-muted mb-6 h-10">Mid-size facilities requiring holistic environmental + power oversight.</p>
              <div className="mb-6"><span className="text-4xl font-bold tracking-tight">₹6K–₹10K</span><span className="text-xs font-bold text-content-muted uppercase ml-2 tracking-wider">/mo</span></div>
              <ul className="space-y-4 mb-8 text-xs font-bold text-content uppercase tracking-wider flex-1">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> 8–12 Advanced Sensors</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> Power Malfunction Alerts</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> Preventive Tech Logs</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> Setup Fee: ₹10k - ₹15k</li>
              </ul>
              <Link to="/login"><Button className="w-full bg-[#2C46EA] hover:bg-[#2C46EA]/90 text-xs uppercase tracking-widest font-bold">Deploy Hardware</Button></Link>
            </div>
            
            {/* Tier 1: Advanced Pharma */}
            <div className="flex flex-col border border-surface bg-surface/30 rounded-lg p-8 hover:border-content-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-content uppercase tracking-wider">Pharma Grade</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted">Tier 1</span>
              </div>
              <p className="text-sm font-medium text-content-muted mb-6 h-10">Compliance-grade pharmaceutical & mass dairy production.</p>
              <div className="mb-6"><span className="text-4xl font-bold tracking-tight">Custom</span></div>
              <ul className="space-y-4 mb-8 text-xs font-semibold text-content-muted uppercase tracking-wider flex-1">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> 15–25+ Node Arrays</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> PT100 RTD High Precision</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> 100% Failover Redundancy</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> Included Service AMC</li>
              </ul>
              <Link to="/login"><Button variant="outline" className="w-full border-surface text-xs uppercase tracking-widest font-bold">Request Audit</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
