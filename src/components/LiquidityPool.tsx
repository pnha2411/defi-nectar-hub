
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
import { Progress } from '@/components/ui/progress';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

interface PoolProps {
  name: string;
  tokens: {
    symbol: string;
    iconUrl: string;
  }[];
  apy: number;
  tvl: number;
  userLiquidity?: number;
  userShare?: number;
  featured?: boolean;
  className?: string;
}

export const LiquidityPool: React.FC<PoolProps> = ({
  name,
  tokens,
  apy,
  tvl,
  userLiquidity = 0,
  userShare = 0,
  featured = false,
  className
}) => {
  const isActive = userLiquidity > 0;

  const handleProvide = () => {
    toast.success('Liquidity provision initiated', {
      description: `You're now adding liquidity to ${name}`,
    });
  };

  const handleWithdraw = () => {
    toast.success('Withdrawal initiated', {
      description: `You're now removing liquidity from ${name}`,
    });
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      featured ? "border-defi-blue/30 bg-gradient-to-b from-defi-blue/5 to-transparent" : "",
      isActive ? "border-defi-blue/20" : "",
      "hover-scale",
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
              <Badge variant="outline" className="bg-defi-blue/10 text-defi-blue border-defi-blue/20 text-xs">
                Featured
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-defi-green">{apy}%</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[180px] text-xs">Annual percentage yield based on current pool performance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
          
          {isActive && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Liquidity</span>
                <span className="font-medium">${userLiquidity.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Share</span>
                <span className="font-medium">{userShare}%</span>
              </div>
              
              <div className="pt-1">
                <Progress value={userShare} max={100} className="h-1.5" />
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {isActive ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" size="sm" onClick={handleWithdraw}>
              Withdraw
            </Button>
            <Button size="sm" onClick={handleProvide}>
              Add More
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={handleProvide}>
            Provide Liquidity
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
