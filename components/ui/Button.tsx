import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white border-2 border-black shadow-neo hover:bg-primary-dark dark:border-white dark:shadow-neo-dark",
    secondary: "bg-white text-black border-2 border-black shadow-neo hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-white dark:shadow-neo-dark",
    outline: "bg-transparent text-current border-2 border-black hover:bg-black/5 dark:border-white dark:hover:bg-white/10",
    ghost: "bg-transparent text-current hover:bg-black/5 dark:hover:bg-white/10",
    danger: "bg-accent-danger text-white border-2 border-black shadow-neo hover:opacity-90 dark:border-white dark:shadow-neo-dark"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10 p-0"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
