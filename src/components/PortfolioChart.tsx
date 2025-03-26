
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';
import { AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioChartProps {
  className?: string;
}

// Example data - in a real app, this would be fetched from an API
const mockPortfolioData = [
  { date: 'Jan', value: 1000 },
  { date: 'Feb', value: 1200 },
  { date: 'Mar', value: 1100 },
  { date: 'Apr', value: 1400 },
  { date: 'May', value: 1800 },
  { date: 'Jun', value: 2000 },
  { date: 'Jul', value: 2200 },
  { date: 'Aug', value: 2400 },
  { date: 'Sep', value: 2100 },
  { date: 'Oct', value: 2500 },
  { date: 'Nov', value: 2700 },
  { date: 'Dec', value: 3000 },
];

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  
  // Calculate current value and change
  const currentValue = mockPortfolioData[mockPortfolioData.length - 1].value;
  const startValue = mockPortfolioData[0].value;
  const change = ((currentValue - startValue) / startValue) * 100;
  const isPositive = change >= 0;

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border p-2 rounded-md shadow-md text-sm backdrop-blur-sm">
          <p className="font-medium">{label}</p>
          <p className="text-defi-blue font-medium">
            ${payload[0].value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Portfolio Value</CardTitle>
            <CardDescription>Your assets over time</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${currentValue.toLocaleString()}</div>
            <div className={cn(
              "flex items-center text-sm justify-end",
              isPositive ? "text-defi-green" : "text-defi-red"
            )}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {isPositive ? "+" : ""}{change.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[250px] w-full px-2 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockPortfolioData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
                dy={10}
              />
              <YAxis 
                hide={true}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#f0f0f0" 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0052FF" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center p-2 pb-4 gap-1">
          {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
            <Button 
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"} 
              size="sm"
              className={cn(
                "h-7 px-3 text-xs",
                timeRange === range ? "bg-accent" : ""
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
