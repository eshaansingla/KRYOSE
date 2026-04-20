import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
      <p className="text-9xl font-black text-[#2C46EA]/10 mb-2 select-none">404</p>
      <h1 className="text-2xl font-bold text-content mb-3">Page Not Found</h1>
      <p className="text-content-muted text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C46EA] text-white text-sm font-bold rounded-lg hover:bg-[#2C46EA]/90 transition-colors"
      >
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
