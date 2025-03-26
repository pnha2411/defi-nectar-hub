
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FundCardProps {
  name: string;
  description: string;
  apy: number;
  tvl: string;
  status: 'active' | 'pending' | 'completed';
  category: 'yield' | 'growth' | 'stable';
  icon?: string;
  className?: string;
}

export const FundCard: React.FC<FundCardProps> = ({
  name,
  description,
  apy,
  tvl,
  status,
  category,
  icon = '/lovable-uploads/48a01385-ec70-4d00-a36e-0d477a509b59.png',
  className
}) => {
  const getStatusBadgeColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600 border-green-200 dark:border-green-500/20';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600 border-yellow-200 dark:border-yellow-500/20';
      case 'completed': return 'bg-blue-500/20 text-blue-600 border-blue-200 dark:border-blue-500/20';
      default: return '';
    }
  };

  const getCategoryBadgeColor = () => {
    switch (category) {
      case 'yield': return 'bg-leon-orange/20 text-leon-orange border-leon-orange/20';
      case 'growth': return 'bg-leon-red/20 text-leon-red border-leon-red/20';
      case 'stable': return 'bg-blue-500/20 text-blue-600 border-blue-200 dark:border-blue-500/20';
      default: return '';
    }
  };

  const handleInvest = () => {
    toast.success(`Investment initiated in ${name}`, {
      description: 'Processing your investment request...',
    });
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg hover-scale",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center bg-muted">
              <img src={icon} alt={name} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={getStatusBadgeColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="font-bold text-xl text-green-500">{apy}%</div>
            <p className="text-xs text-muted-foreground">Est. APY</p>
          </div>
          <div>
            <div className="font-medium">{tvl}</div>
            <p className="text-xs text-muted-foreground">Total Value Locked</p>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Badge variant="outline" className={getCategoryBadgeColor()}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          <p className="text-xs text-muted-foreground">Min. Investment: $100</p>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full bg-gradient-leon hover:bg-gradient-leon" onClick={handleInvest}>
          Invest Now
        </Button>
      </CardFooter>
    </Card>
  );
};
