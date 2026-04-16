import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, KeyRound } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication processing
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-content tracking-tight">
          Sign in to Command Center
        </h2>
        <p className="mt-2 text-center text-sm text-content-muted">
          Or <Link to="/" className="font-medium text-[#2C46EA] hover:text-[#2C46EA]/80 transition-colors">contact sales for enterprise access</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface/50 py-8 px-4 shadow-xl border border-surface sm:rounded-2xl sm:px-10 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-content-muted uppercase tracking-wider">
                Email address
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-content-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@kryose.io"
                  className="block w-full pl-10 sm:text-sm border-surface bg-background rounded-md text-content py-2.5 focus:ring-[#2C46EA] focus:border-[#2C46EA]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-content-muted uppercase tracking-wider">
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-content-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="••••••••••••"
                  className="block w-full pl-10 sm:text-sm border-surface bg-background rounded-md text-content py-2.5 focus:ring-[#2C46EA] focus:border-[#2C46EA]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#2C46EA] focus:ring-[#2C46EA] border-content-muted rounded bg-background"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-content-muted">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#2C46EA] hover:text-[#2C46EA]/80 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full bg-[#2C46EA] hover:bg-[#2C46EA]/90 flex justify-center py-2.5 px-4 text-sm font-bold tracking-widest uppercase">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-content-muted rounded-md text-xs font-bold tracking-wider uppercase">SSO Authentication</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full justify-center bg-background border-surface hover:bg-surface text-content-muted transition-colors">
                <span className="sr-only">Sign in with Microsoft</span>
                Microsoft Entra
              </Button>
              <Button variant="outline" className="w-full justify-center bg-background border-surface hover:bg-surface text-content-muted transition-colors">
                <span className="sr-only">Sign in with Google</span>
                Google Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
