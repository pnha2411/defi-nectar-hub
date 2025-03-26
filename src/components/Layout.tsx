
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, ArrowLeftRight, TrendingUp, LayoutDashboard } from 'lucide-react';
import { NavMenuItem } from './NavMenuItem';
import { WalletConnectButton } from './WalletConnectButton';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      path: '/',
      active: location.pathname === '/' 
    },
    { 
      title: 'Swap', 
      icon: <ArrowLeftRight className="w-5 h-5" />, 
      path: '/swap',
      active: location.pathname === '/swap' 
    },
    { 
      title: 'Earn', 
      icon: <TrendingUp className="w-5 h-5" />, 
      path: '/earn',
      active: location.pathname === '/earn' 
    },
    { 
      title: 'Wallet', 
      icon: <Wallet className="w-5 h-5" />, 
      path: '/wallet',
      active: location.pathname === '/wallet' 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container flex h-16 items-center px-6 sm:px-8">
          <Link to="/" className="flex items-center gap-2 mr-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/public/lovable-uploads/48a01385-ec70-4d00-a36e-0d477a509b59.png" alt="LeoFi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block bg-gradient-leon bg-clip-text text-transparent">LeoFi</span>
          </Link>
          
          <nav className="hidden md:flex flex-1 items-center space-x-1">
            {menuItems.map((item) => (
              <NavMenuItem 
                key={item.path}
                title={item.title}
                icon={item.icon}
                path={item.path}
                active={item.active}
              />
            ))}
          </nav>
          
          <div className="ml-auto flex items-center gap-4">
            <WalletConnectButton />
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-background border-t z-40">
        <div className="flex justify-around">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-3 px-4 text-xs font-medium transition-colors",
                item.active 
                  ? "text-leon-red" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {React.cloneElement(item.icon as React.ReactElement, {
                className: cn("w-5 h-5 mb-1", item.active ? "text-leon-red" : "text-muted-foreground")
              })}
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 container px-4 sm:px-6 py-6 mb-16 md:mb-0 animate-fade-in">
        {children}
      </main>
    </div>
  );
};
