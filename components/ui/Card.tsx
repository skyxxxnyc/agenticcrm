import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noShadow?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, noShadow, children, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-surface-light dark:bg-surface-dark border-2 border-black dark:border-white p-4",
        !noShadow && "shadow-neo dark:shadow-neo-dark",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("mb-4", className)} {...props}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn("text-lg font-bold leading-none tracking-tight", className)} {...props}>{children}</h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("", className)} {...props}>{children}</div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("mt-4 flex items-center pt-2 border-t-2 border-gray-100 dark:border-gray-800", className)} {...props}>{children}</div>
);
