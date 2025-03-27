
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenSelector } from './TokenSelector';
import { PriceInfo } from './PriceInfo';
import { SwapSettings } from './SwapSettings';
import { ArrowDown, Settings } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export interface SwapCardProps {
  className?: string;
  onSwap?: (fromToken: string, toToken: string, fromAmount: string, toAmount: string) => void;
  defaultFromToken?: string;
  defaultToToken?: string;
  isLoading?: boolean;
  supportedTokens?: Array<string>;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  className,
  onSwap,
  defaultFromToken = 'ETH',
  defaultToToken = 'USDC',
  isLoading = false,
  supportedTokens = ['ETH', 'USDC', 'USDT', 'BASE']
}) => {
  const [fromToken, setFromToken] = useState(defaultFromToken);
  const [toToken, setToToken] = useState(defaultToToken);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState([1.0]);
  const [deadline, setDeadline] = useState('30');
  
  const { isConnected } = useAccount();

  const handleTokenSwap = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Recalculate amounts
    setToAmount(calculateExchangeAmount(fromAmount, toToken, fromToken));
  };

  const calculateExchangeAmount = (amount: string, from: string, to: string) => {
    if (!amount) return '';
    
    // For demo purposes, define some mock exchange rates
    const rates: Record<string, Record<string, number>> = {
      'ETH': { 'USDC': 3500, 'USDT': 3500, 'BASE': 350 },
      'USDC': { 'ETH': 0.000286, 'USDT': 1, 'BASE': 0.1 },
      'USDT': { 'ETH': 0.000286, 'USDC': 1, 'BASE': 0.1 },
      'BASE': { 'ETH': 0.00286, 'USDC': 10, 'USDT': 10 },
    };
    
    if (from === to) return amount;
    
    const rate = rates[from]?.[to] || 0;
    const result = parseFloat(amount) * rate;
    
    return isNaN(result) ? '' : result.toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setFromAmount(value);
      setToAmount(calculateExchangeAmount(value, fromToken, toToken));
    }
  };

  const handleToAmountChange = (value: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setToAmount(value);
      // Reverse calculation
      const reverseAmount = calculateExchangeAmount(value, toToken, fromToken);
      setFromAmount(reverseAmount);
    }
  };

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (onSwap) {
      onSwap(fromToken, toToken, fromAmount, toAmount);
    } else {
      toast.success('Swap initiated', {
        description: `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Swap</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Exchange tokens at the best rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings && (
          <SwapSettings 
            slippage={slippage} 
            onSlippageChange={setSlippage} 
            deadline={deadline}
            onDeadlineChange={setDeadline}
          />
        )}
        
        <TokenSelector
          type="from"
          selectedToken={fromToken}
          onTokenSelect={setFromToken}
          amount={fromAmount}
          onAmountChange={handleFromAmountChange}
          supportedTokens={supportedTokens.filter(token => token !== toToken)}
        />
        
        <div className="flex justify-center -my-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted h-8 w-8 hover:bg-muted-foreground/20"
            onClick={handleTokenSwap}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        <TokenSelector
          type="to"
          selectedToken={toToken}
          onTokenSelect={setToToken}
          amount={toAmount}
          onAmountChange={handleToAmountChange}
          supportedTokens={supportedTokens.filter(token => token !== fromToken)}
        />
        
        {fromAmount && toAmount && fromToken !== toToken && (
          <PriceInfo 
            fromToken={fromToken} 
            toToken={toToken} 
            fromAmount={fromAmount} 
            toAmount={toAmount} 
          />
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!isConnected || !fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
          onClick={handleSwap}
        >
          {!isConnected 
            ? "Connect Wallet" 
            : !fromAmount || parseFloat(fromAmount) <= 0
              ? "Enter an amount"
              : isLoading
                ? "Processing..."
                : "Swap"}
        </Button>
      </CardFooter>
    </Card>
  );
};
