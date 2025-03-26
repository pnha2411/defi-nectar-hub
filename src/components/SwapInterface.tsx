
import React, { useState, useEffect } from 'react';
import { ArrowDown, Settings, Info } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Token {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  balance?: number;
}

const mockTokens: Token[] = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', balance: 1.245 },
  { id: 'base', name: 'Base', symbol: 'BASE', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', balance: 245.12 },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', balance: 500.75 },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png', balance: 1250.50 },
  { id: 'dai', name: 'Dai', symbol: 'DAI', iconUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', balance: 432.18 },
];

export const SwapInterface: React.FC = () => {
  const [fromToken, setFromToken] = useState<string>(mockTokens[0].id);
  const [toToken, setToToken] = useState<string>(mockTokens[2].id);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('1750.25');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate rate
  const fromTokenObj = mockTokens.find(t => t.id === fromToken);
  const toTokenObj = mockTokens.find(t => t.id === toToken);
  
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    
    // Also swap amounts
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setFromAmount(value);
      // Simulate price calculation (in real app would be based on market rates)
      if (value && !isNaN(parseFloat(value))) {
        const newValue = (parseFloat(value) * 1750.25).toFixed(2);
        setToAmount(newValue);
      } else {
        setToAmount('');
      }
    }
  };

  const handleSlippageChange = (value: number[]) => {
    setSlippage(value[0]);
  };

  const handleMaxClick = () => {
    const token = mockTokens.find(t => t.id === fromToken);
    if (token && token.balance) {
      setFromAmount(token.balance.toString());
      const newValue = (token.balance * 1750.25).toFixed(2);
      setToAmount(newValue);
    }
  };

  const executeSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Swap executed successfully', {
        description: `Swapped ${fromAmount} ${fromTokenObj?.symbol} for ${toAmount} ${toTokenObj?.symbol}`,
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Swap Tokens</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Exchange tokens at the best rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex justify-between mb-2">
            <Label htmlFor="from-amount">From</Label>
            <div className="text-xs text-muted-foreground">
              Balance: {mockTokens.find(t => t.id === fromToken)?.balance?.toFixed(4) || '0'} {mockTokens.find(t => t.id === fromToken)?.symbol}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              id="from-amount"
              type="text"
              placeholder="0.0"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            />
            <div className="flex-shrink-0">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-[130px] border-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockTokens.map((token) => (
                    <SelectItem key={token.id} value={token.id} disabled={token.id === toToken}>
                      <div className="flex items-center">
                        <img src={token.iconUrl} alt={token.symbol} className="w-5 h-5 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/200x200/EAEAEA/6366F1?text=" + token.symbol.substring(0, 2);
                          }}
                        />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs px-2 hover:bg-accent"
              onClick={handleMaxClick}
            >
              MAX
            </Button>
          </div>
        </div>
        
        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 border bg-background shadow-md"
            onClick={handleSwapTokens}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        {/* To Token */}
        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex justify-between mb-2">
            <Label htmlFor="to-amount">To (estimated)</Label>
            <div className="text-xs text-muted-foreground">
              Balance: {mockTokens.find(t => t.id === toToken)?.balance?.toFixed(4) || '0'} {mockTokens.find(t => t.id === toToken)?.symbol}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              id="to-amount"
              type="text"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            />
            <div className="flex-shrink-0">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-[130px] border-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockTokens.map((token) => (
                    <SelectItem key={token.id} value={token.id} disabled={token.id === fromToken}>
                      <div className="flex items-center">
                        <img src={token.iconUrl} alt={token.symbol} className="w-5 h-5 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/200x200/EAEAEA/6366F1?text=" + token.symbol.substring(0, 2);
                          }}
                        />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Exchange Rate */}
        <div className="px-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Exchange Rate</span>
          <span>1 {fromTokenObj?.symbol} ≈ 1750.25 {toTokenObj?.symbol}</span>
        </div>
        
        {/* Slippage Settings */}
        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Label>Slippage Tolerance</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">
                      Your transaction will revert if the price changes unfavorably by more than this percentage.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium text-sm">{slippage}%</span>
          </div>
          <Slider
            defaultValue={[0.5]}
            max={2}
            min={0.1}
            step={0.1}
            value={[slippage]}
            onValueChange={handleSlippageChange}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0.1%</span>
            <span>2%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
          onClick={executeSwap}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              Swapping...
            </>
          ) : 'Swap Tokens'}
        </Button>
      </CardFooter>
    </Card>
  );
};
