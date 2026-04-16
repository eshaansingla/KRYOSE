import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Bell, Menu, X, ArrowRight, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Activity },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-surface bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex flex-shrink-0 items-center gap-3">
                <Logo />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E68325] via-[#7060A8] to-[#2C46EA] leading-none">KRYOSE</span>
                  <span className="text-[9px] font-bold tracking-widest text-content-muted mt-1 uppercase">Cold Intelligence. Zero Loss.</span>
                </div>
              </Link>
              {location.pathname.startsWith('/dashboard') && (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            isActive
                              ? 'bg-surface text-primary'
                              : 'text-content-muted hover:bg-surface hover:text-content',
                            'rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 gap-4">
                {location.pathname === '/' ? (
                  <>
                    <Link to="/login" className="text-sm font-bold text-content-muted hover:text-content transition-colors uppercase tracking-wider">Log in</Link>
                    <Link to="/dashboard">
                      <Button className="font-bold tracking-widest uppercase text-xs bg-[#2C46EA] hover:bg-[#2C46EA]/90">
                        Investor Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <button className="flex items-center space-x-3 p-2 bg-surface rounded-full border border-surface">
                    <img className="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=Admin+User&background=0D8BFF&color=fff" alt="" />
                    <span className="hidden leading-none md:block pr-2 text-sm font-medium">Admin View</span>
                  </button>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md bg-surface p-2 text-content-muted hover:bg-surface/80 hover:text-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 w-full z-50 backdrop-blur-md bg-background/80 border-b border-surface">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {location.pathname === '/' ? (
                <div className="flex flex-col gap-2 p-2">
                  <Link to="/login" className="text-base font-medium text-content-muted p-2">Log in</Link>
                  <Link to="/dashboard" className="text-base font-medium text-primary bg-primary/10 rounded-md p-2">Investor Demo</Link>
                </div>
              ) : (
                navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive ? 'bg-primary/10 text-primary' : 'text-content-muted hover:bg-surface hover:text-content',
                        'block rounded-md px-3 py-2 text-base font-medium transition-colors'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
