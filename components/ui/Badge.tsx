import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: "bg-primary text-white border border-black dark:border-white",
    outline: "bg-transparent border border-black text-black dark:border-white dark:text-white",
    success: "bg-accent-success/20 text-green-800 border-green-800 dark:text-green-300 dark:border-green-300",
    warning: "bg-accent-warning/20 text-yellow-800 border-yellow-800 dark:text-yellow-300 dark:border-yellow-300",
    danger: "bg-accent-danger/20 text-red-800 border-red-800 dark:text-red-300 dark:border-red-300",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};
