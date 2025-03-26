
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PoolProps {
  name: string;
  tokens: {
    symbol: string;
    iconUrl: string;
  }[];
  apy: number;
  tvl: number;
  featured?: boolean;
  className?: string;
}

export const LiquidityPool: React.FC<PoolProps> = ({
  name,
  tokens,
  apy,
  tvl,
  featured = false,
  className
}) => {
  const handleProvide = () => {
    toast.success('Liquidity provision initiated', {
      description: `You're now adding liquidity to ${name}`,
    });
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      featured ? "border-primary/30 bg-gradient-to-b from-primary/5 to-transparent" : "",
      "hover:shadow-lg hover:border-primary/20",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {tokens.map((token, idx) => (
                <div 
                  key={idx} 
                  className={`w-7 h-7 rounded-full bg-white flex items-center justify-center border-2 ${idx === 0 ? 'border-background' : 'border-background'}`}
                >
                  <img 
                    src={token.iconUrl} 
                    alt={token.symbol} 
                    className="w-4 h-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x200/EAEAEA/6366F1?text=" + token.symbol.substring(0, 1);
                    }}
                  />
                </div>
              ))}
            </div>
            <CardTitle className="text-base">{name}</CardTitle>
            {featured && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Featured
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-green-500">{apy}%</div>
            <p className="text-xs text-muted-foreground">APY</p>
          </div>
        </div>
        <CardDescription>
          {tokens.map(t => t.symbol).join(' / ')} Pool
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Value Locked</span>
            <span className="font-medium">${tvl.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" onClick={handleProvide}>
          Provide Liquidity
        </Button>
      </CardFooter>
    </Card>
  );
};
