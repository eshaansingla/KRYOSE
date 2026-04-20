import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Bell, Menu, X, ArrowRight, Activity, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard',            icon: LayoutDashboard },
    { name: 'Alerts',    href: '/dashboard/alerts',     icon: Bell            },
    { name: 'Analytics', href: '/dashboard/analytics',  icon: Activity        },
    { name: 'Settings',  href: '/dashboard/settings',   icon: Settings        },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-surface bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex flex-shrink-0 items-center gap-3">
                <Logo />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E68325] via-[#7060A8] to-[#2C46EA] leading-none">
                    KRYOSE
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-content-muted mt-1 uppercase">
                    Cold Intelligence. Zero Loss.
                  </span>
                </div>
              </Link>

              {isDashboard && (
                <div className="hidden md:flex items-baseline space-x-1">
                  {navigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2',
                          isActive
                            ? 'bg-surface text-primary'
                            : 'text-content-muted hover:bg-surface hover:text-content'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: CTA / User */}
            <div className="hidden md:flex items-center gap-4">
              {location.pathname === '/' ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-content-muted hover:text-content transition-colors uppercase tracking-wider"
                  >
                    Log in
                  </Link>
                  <Link to="/dashboard">
                    <Button className="font-bold tracking-widest uppercase text-xs bg-[#2C46EA] hover:bg-[#2C46EA]/90">
                      Investor Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 p-2 bg-surface rounded-full border border-surface">
                    <img
                      className="h-7 w-7 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail ?? 'Admin')}&background=2C46EA&color=fff&size=64`}
                      alt="User avatar"
                    />
                    <span className="hidden lg:block pr-1 text-sm font-medium text-content max-w-[120px] truncate">
                      {userEmail ?? 'Admin'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-content-muted hover:bg-surface hover:text-error transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Sign out</span>
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <Button className="font-bold tracking-widest uppercase text-xs bg-[#2C46EA] hover:bg-[#2C46EA]/90">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 w-full z-50 backdrop-blur-md bg-background/95 border-b border-surface shadow-lg">
            <div className="space-y-1 px-2 pb-4 pt-2 sm:px-3">
              {isDashboard ? (
                <>
                  {navigation.map(item => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          'block rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                          isActive ? 'bg-primary/10 text-primary' : 'text-content-muted hover:bg-surface hover:text-content'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </div>
                      </Link>
                    );
                  })}
                  {isAuthenticated && (
                    <button
                      onClick={() => { closeMobileMenu(); handleLogout(); }}
                      className="w-full text-left block rounded-md px-3 py-2.5 text-base font-medium text-error hover:bg-error/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5" />
                        Sign out
                      </div>
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <Link to="/login" onClick={closeMobileMenu} className="text-base font-medium text-content-muted p-2">
                    Log in
                  </Link>
                  <Link to="/dashboard" onClick={closeMobileMenu} className="text-base font-medium text-primary bg-primary/10 rounded-md p-2">
                    Investor Demo
                  </Link>
                </div>
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
