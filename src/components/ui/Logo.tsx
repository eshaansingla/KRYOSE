import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps extends React.SVGProps<SVGSVGElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("w-10 h-10", className)} 
      {...props}
    >
      <defs>
        <linearGradient id="kryose-logo-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#E68325" />
          <stop offset="50%" stopColor="#7060A8" />
          <stop offset="100%" stopColor="#2C46EA" />
        </linearGradient>
      </defs>
      <g fill="url(#kryose-logo-gradient)">
        <polygon points="50,40 60,20 50,4 40,20" />
        <polygon points="50,40 60,20 50,4 40,20" transform="rotate(60 50 50)" />
        <polygon points="50,40 60,20 50,4 40,20" transform="rotate(120 50 50)" />
        <polygon points="50,40 60,20 50,4 40,20" transform="rotate(180 50 50)" />
        <polygon points="50,40 60,20 50,4 40,20" transform="rotate(240 50 50)" />
        <polygon points="50,40 60,20 50,4 40,20" transform="rotate(300 50 50)" />
      </g>
    </svg>
  );
}
