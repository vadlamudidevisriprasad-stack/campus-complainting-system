import React from 'react';
import { ComplaintStatus } from '../types.ts';
import { Clock, Loader2, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  let badgeStyle = '';
  let icon = null;

  switch (status) {
    case 'Pending':
      badgeStyle = 'bg-orange-100 text-orange-700 border border-orange-200/60 font-bold uppercase';
      icon = <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      break;
    case 'In Progress':
      badgeStyle = 'bg-blue-100 text-blue-700 border border-blue-200/60 font-bold uppercase';
      icon = <Loader2 className={`animate-spin ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />;
      break;
    case 'Resolved':
      badgeStyle = 'bg-emerald-100 text-emerald-700 border border-emerald-200/60 font-bold uppercase';
      icon = <CheckCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      break;
    default:
      badgeStyle = 'bg-slate-100 text-slate-700 border border-slate-200';
      icon = null;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1',
    md: 'text-[10px] sm:text-xs px-3 py-1 gap-1.5',
    lg: 'text-xs px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide shadow-2xs whitespace-nowrap ${badgeStyle} ${sizeClasses[size]}`}
    >
      {showIcon && icon}
      <span>{status}</span>
    </span>
  );
};
