
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavMenuItemProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  active: boolean;
}

export const NavMenuItem: React.FC<NavMenuItemProps> = ({ 
  title, 
  icon, 
  path, 
  active 
}) => {
  return (
    <Link
      to={path}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active 
          ? "bg-primary/10 text-primary hover:bg-primary/15" 
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="mr-2">{icon}</span>
      {title}
    </Link>
  );
};
