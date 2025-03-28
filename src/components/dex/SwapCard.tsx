import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenSelector } from './TokenSelector';
import { PriceInfo } from './PriceInfo';
import { SwapSettings } from './SwapSettings';
import { ArrowDown, Settings } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { useContractWrite } from '@/hooks/useContractWrite';
import { kitContractAddress } from '@/lib/contractUtils';
import { kitABI } from '@/lib/kit';
import { parseUnits } from 'viem';

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
  
  const { writeContract, isLoading: isTransactionLoading, status: transactionStatus } = useContractWrite({
    address: kitContractAddress as `0x${string}`,
    abi: kitABI,
  });

  const handleTokenSwap = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    setToAmount(calculateExchangeAmount(fromAmount, toToken, fromToken));
  };

  const calculateExchangeAmount = (amount: string, from: string, to: string) => {
    if (!amount) return '';
    
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
      const reverseAmount = calculateExchangeAmount(value, toToken, fromToken);
      setFromAmount(reverseAmount);
    }
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    const tokenAddresses: Record<string, `0x${string}`> = {
      'ETH': '0xd2135CfB216b74109775236E36d4b433F1DF507B',
      'USDC': '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
      'USDT': '0x95691fD90c9c28898912906C19BCc6569A736762',
      'BASE': '0x9a4dba72612dd5dab23dfb422dc70c3c34e98e02'
    };
    
    const tokenInAddress = tokenAddresses[fromToken];
    const tokenOutAddress = tokenAddresses[toToken];
    
    try {
      const parsedAmount = parseUnits(fromAmount, 18);
      const estimatedOutputAmount = parseUnits(toAmount, 18);
      const slippagePercent = slippage[0] / 100;
      const minAmountOut = estimatedOutputAmount * BigInt(Math.floor((1 - slippagePercent) * 100)) / BigInt(100);
      
      await writeContract('swap', [
        tokenInAddress,
        tokenOutAddress,
        parsedAmount,
        minAmountOut
      ], {
        onSuccess: (hash) => {
          toast.success('Swap transaction submitted', {
            description: `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
            action: {
              label: 'View',
              onClick: () => window.open(`https://shannon-explorer.somnia.network/tx/${hash}`, '_blank')
            }
          });
          
          if (onSwap) {
            onSwap(fromToken, toToken, fromAmount, toAmount);
          }
        },
        onError: (error) => {
          toast.error('Swap failed', {
            description: error.message || 'Transaction could not be completed'
          });
        }
      });
    } catch (error) {
      console.error('Swap error:', error);
      toast.error('Failed to initiate swap', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
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
          disabled={!isConnected || !fromAmount || parseFloat(fromAmount) <= 0 || isTransactionLoading}
          onClick={handleSwap}
        >
          {!isConnected 
            ? "Connect Wallet" 
            : !fromAmount || parseFloat(fromAmount) <= 0
              ? "Enter an amount"
              : isTransactionLoading
                ? "Swapping..."
                : "Swap"}
        </Button>
      </CardFooter>
    </Card>
  );
};
