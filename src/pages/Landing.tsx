import { Link } from 'react-router-dom';
import { ArrowRight, Box, Check, History, Cpu, Thermometer, Droplets } from 'lucide-react';
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
                Cold Intelligence.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E68325] via-[#7060A8] to-[#2C46EA]">
                  Zero Loss.
                </span>
              </h1>
              <p className="max-w-xl text-lg text-content-muted mb-10 leading-relaxed font-medium">
                KRYOSE detects cold-room failures before product loss: equipment faults, power outages, temperature fluctuation, and monitoring gaps. The stack is tiered by regulatory risk, not by generic cost packaging.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 group bg-[#2C46EA] hover:bg-[#2C46EA]/90">
                    <Box className="h-5 w-5" />
                    Enter Live Command Center
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-surface text-content-muted hover:text-content">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Industry Problem Block */}
            <div className="bg-surface/50 border border-surface rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-content mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-[#E68325]" />
                Root Causes of 40% Food Wastage
              </h3>
              <div className="space-y-5">
                {[
                  { label: 'Equipment Malfunction', pct: 35, color: '#2C46EA' },
                  { label: 'Power Outages',          pct: 28, color: '#E68325' },
                  { label: 'Thermal Fluctuations',   pct: 18, color: '#7060A8' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-content-muted">
                      <span>{item.label}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-surface">
                      <div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-4 border-t border-surface pt-4 text-xs font-bold text-content-muted">
                  <span>Additional: Doors (12%), Monitoring Gaps (7%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="border-b border-surface bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-surface">
            {[
              { value: '10–25%', label: 'Spoilage Reduction',   color: 'text-content' },
              { value: '< 5 mins', label: 'Alert Execution',    color: 'text-[#E68325]' },
              { value: '160-180', label: 'Sensors Across 20 Sites', color: 'text-[#2C46EA]' },
              { value: '1–2 Day', label: 'Deployment Timeline', color: 'text-content' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col text-center pt-4 md:pt-0">
                <span className={`text-4xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-content-muted mt-2 uppercase tracking-widest font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Specs Section */}
      <section id="hardware" className="py-24 border-b border-surface bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-content mb-4 tracking-tight">
              Industrial-Grade Sensor Hardware
            </h2>
            <p className="text-content-muted text-sm font-medium">
              Every deployment uses production-hardened sensor nodes with redundant communication paths and tamper-evident housings — built for the extremes of cold storage.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Thermometer,
                color: '#2C46EA',
                name: 'PT100 + MAX31865',
                badge: 'Tier 1 Pharma',
                specs: [
                  'Class B: +/-0.32 C at 4 C',
                  '3-wire SS304 industrial probe',
                  'SPI via MAX31865',
                  'Redundant PT100 in critical zones',
                  'Open/short fault register',
                ],
                useCase: 'WHO GDP pharma rooms requiring traceable, redundant temperature evidence.',
              },
              {
                icon: Cpu,
                color: '#E68325',
                name: 'DS18B20 Digital Sensor',
                badge: 'Standard Tier',
                specs: [
                  'Range: -55 C to +125 C',
                  'Accuracy: +/-0.5 C',
                  '1-Wire bus with 64-bit ROM ID',
                  'Multiple on single bus',
                  '85 C reset and CRC fault detection',
                ],
                useCase: 'Tier 2 dairy/frozen and Tier 3 food/agriculture temperature probes.',
              },
              {
                icon: Droplets,
                color: '#7060A8',
                name: 'SHT35 / SHT31 / DHT22',
                badge: 'Humidity by Tier',
                specs: [
                  'T1 SHT35: +/-1.5% RH',
                  'T2 SHT31: +/-2% RH',
                  'T3 DHT22: +/-2-5% RH',
                  'Capacitive sensing only',
                  'SHT heater cycle prevents sticking',
                ],
                useCase: 'Humidity monitoring only; humidity-sensor temperature channels are not used for zone temperature.',
              },
            ].map(hw => (
              <div key={hw.name} className="flex flex-col border border-surface bg-background rounded-xl p-8 hover:border-content-muted/30 transition-colors shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${hw.color}18` }}>
                    <hw.icon className="h-6 w-6" style={{ color: hw.color }} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted uppercase tracking-wider">
                    {hw.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-content mb-4">{hw.name}</h3>
                <ul className="space-y-2 mb-6 flex-1">
                  {hw.specs.map(spec => (
                    <li key={spec} className="flex items-center gap-2 text-xs font-semibold text-content-muted">
                      <Check className="h-3.5 w-3.5 shrink-0" style={{ color: hw.color }} />
                      {spec}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-content-muted border-t border-surface pt-4 leading-relaxed font-medium">
                  {hw.useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-content mb-4 tracking-tight">Operational Hardware Subscriptions</h2>
            <p className="text-content-muted text-sm font-medium">
              The prototype mirrors the definitive reference: Tier 1 pharma, Tier 2 dairy/frozen, and Tier 3 food/agriculture with deployed sensors, thresholds, quantities, and categorical rejections kept explicit.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">

            {/* Tier 3: Pilot */}
            <div className="flex flex-col border border-surface bg-surface/30 rounded-lg p-8 hover:border-content-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-content uppercase tracking-wider">Pilot Deployment</h3>
                <span className="text-xs font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted">Tier 3</span>
              </div>
              <p className="text-sm font-medium text-content-muted mb-6 h-10">Basic breach detection for 500-2,000 sq ft food/agriculture rooms.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">~5</span>
                <span className="text-xs font-bold text-content-muted uppercase ml-2 tracking-wider">sensors</span>
              </div>
              <ul className="space-y-4 mb-8 text-xs font-semibold text-content-muted uppercase tracking-wider flex-1">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> 2x DS18B20 + DHT22</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> MC-38 door state</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> ZMPT101B + SCT-013-000</li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full text-xs uppercase tracking-widest font-bold">Initiate Pilot Phase</Button>
              </Link>
            </div>

            {/* Tier 2: Standard — highlighted */}
            <div className="flex flex-col border-2 border-[#2C46EA] bg-background rounded-lg p-8 relative shadow-2xl shadow-[#2C46EA]/10 transform lg:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2C46EA] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Targeted Scale
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-content uppercase tracking-wider">Multi-Zone Ops</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted">Tier 2</span>
              </div>
              <p className="text-sm font-medium text-content-muted mb-6 h-10">Dairy/frozen warehouses with zone monitoring and compressor fault detection.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">~10</span>
                <span className="text-xs font-bold text-content-muted uppercase ml-2 tracking-wider">sensors</span>
              </div>
              <ul className="space-y-4 mb-8 text-xs font-bold text-content uppercase tracking-wider flex-1">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> 4-5x DS18B20 + 2-3x SHT31</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> Single-phase voltage/current</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> SW-420 vibration switch</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#E68325] shrink-0" /> MC-38 for all door leaves</li>
              </ul>
              <Link to="/login">
                <Button className="w-full bg-[#2C46EA] hover:bg-[#2C46EA]/90 text-xs uppercase tracking-widest font-bold">Deploy Hardware</Button>
              </Link>
            </div>

            {/* Tier 1: Pharma */}
            <div className="flex flex-col border border-surface bg-surface/30 rounded-lg p-8 hover:border-content-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-content uppercase tracking-wider">Pharma Grade</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface border border-surface rounded text-content-muted">Tier 1</span>
              </div>
              <p className="text-sm font-medium text-content-muted mb-6 h-10">Compliance-grade pharmaceutical & mass dairy production.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">~20</span>
                <span className="text-xs font-bold text-content-muted uppercase ml-2 tracking-wider">sensors</span>
              </div>
              <ul className="space-y-4 mb-8 text-xs font-semibold text-content-muted uppercase tracking-wider flex-1">
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> PT100 Class B + redundant PT100</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> Danfoss AKS 32 pressure sensors</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> 3-cup airflow + ADXL345 vibration</li>
                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#2C46EA] shrink-0" /> 3-phase ZMPT101B/SCT-013-000</li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full border-surface text-xs uppercase tracking-widest font-bold">Request Audit</Button>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
