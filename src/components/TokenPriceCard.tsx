
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TokenPriceCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  iconUrl: string;
  className?: string;
}

export const TokenPriceCard: React.FC<TokenPriceCardProps> = ({
  name,
  symbol,
  price,
  change,
  iconUrl,
  className
}) => {
  const isPositiveChange = change >= 0;
  
  return (
    <Card className={cn("overflow-hidden hover-scale transition-all", className)}>
      <CardContent className="p-4 flex items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-accent/50">
          <img 
            src={iconUrl} 
            alt={`${symbol} icon`} 
            className="w-6 h-6"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = "https://placehold.co/200x200/EAEAEA/6366F1?text=" + symbol.substring(0, 2);
            }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-xs text-muted-foreground">{symbol}</p>
            </div>
            
            <div className="text-right">
              <p className="font-medium">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <div className={cn(
                "flex items-center text-xs",
                isPositiveChange ? "text-defi-green" : "text-defi-red"
              )}>
                {isPositiveChange ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(change).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
