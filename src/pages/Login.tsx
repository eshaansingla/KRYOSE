import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please check your email and try again.');
    }
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
          Or{' '}
          <Link to="/" className="font-medium text-[#2C46EA] hover:text-[#2C46EA]/80 transition-colors">
            contact sales for enterprise access
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface/50 py-8 px-4 shadow-xl border border-surface sm:rounded-2xl sm:px-10 backdrop-blur-sm">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

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
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border border-surface bg-background rounded-md text-content py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#2C46EA] focus:border-[#2C46EA]"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border border-surface bg-background rounded-md text-content py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#2C46EA] focus:border-[#2C46EA]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#2C46EA] rounded bg-background border-surface"
                />
                <label htmlFor="remember-me" className="text-sm text-content-muted">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-[#2C46EA] hover:text-[#2C46EA]/80 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-bold tracking-widest uppercase',
                'bg-[#2C46EA] hover:bg-[#2C46EA]/90'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-content-muted rounded-md text-xs font-bold tracking-wider uppercase">
                  SSO Authentication
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#2C46EA]/5 border border-[#2C46EA]/20 rounded-lg text-center">
              <p className="text-xs text-content-muted font-medium">
                Demo access: enter any valid email + any password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
