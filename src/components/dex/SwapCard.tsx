import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TokenSelector } from './TokenSelector';
import { PriceInfo } from './PriceInfo';
import { SwapSettings } from './SwapSettings';
import { ArrowDown, Settings, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { useContractWrite } from '@/hooks/useContractWrite';
import { kitContractAddress } from '@/lib/contractUtils';
import { kitABI } from '@/lib/kit';
import { parseUnits, parseEther } from 'viem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  defaultFromToken = 'STT',
  defaultToToken = 'USDC',
  isLoading = false,
  supportedTokens = ['STT', 'USDC']
}) => {
  const [fromToken, setFromToken] = useState(defaultFromToken);
  const [toToken, setToToken] = useState(defaultToToken);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState([1.0]);
  const [deadline, setDeadline] = useState('30');
  const [isPoolDialogOpen, setIsPoolDialogOpen] = useState(false);
  
  const { isConnected } = useAccount();
  
  const { writeContract, isLoading: isTransactionLoading, status: transactionStatus } = useContractWrite({
    address: kitContractAddress as `0x${string}`,
    abi: kitABI,
  });

  const tokenAddresses: Record<string, `0x${string}`> = {
    'ETH': '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    'USDC': '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    'USDT': '0x95691fD90c9c28898912906C19BCc6569A736762',
    'BASE': '0x9a4dba72612dd5dab23dfb422dc70c3c34e98e02'
  };

  const handleTokenSwap = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    setToAmount(calculateExchangeAmount(fromAmount, toToken, fromToken));
  };

  const calculateExchangeAmount = (amount: string, from: string, to: string) => {
    if (!amount) return '';
    
    const rates: Record<string, Record<string, number>> = {
      'STT': { 'USDC': 240 },
      'USDC': { 'STT': 0.000286 },
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

  const handleCreatePool = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    const tokenInAddress = tokenAddresses[fromToken];
    const tokenOutAddress = tokenAddresses[toToken];
    
    if (tokenInAddress === tokenOutAddress) {
      toast.error('Cannot create pool with the same token');
      return;
    }
    
    try {
      await writeContract('buyGold', [], {
        onSuccess: (hash) => {
          toast.success('Pool creation transaction submitted', {
            description: `Creating ${fromToken}-${toToken} pool`,
            action: {
              label: 'View',
              onClick: () => window.open(`https://shannon-explorer.somnia.network/tx/${hash}`, '_blank')
            }
          });
          setIsPoolDialogOpen(false);
        },
        onError: (error) => {
          toast.error('Pool creation failed', {
            description: error.message || 'Transaction could not be completed'
          });
        }
      });
    } catch (error) {
      console.error('Pool creation error:', error);
      toast.error('Failed to create pool', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
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
      'STT': '0xA1F002bf7cAD148a639418D77b93912871901875',
      'USDC': '0x65296738D4E5edB1515e40287B6FDf8320E6eE04',
    };
    
    const tokenInAddress = tokenAddresses[fromToken];
    const tokenOutAddress = tokenAddresses[toToken];
    
    try {
      const parsedAmount = parseUnits(fromAmount, 18);
      const estimatedOutputAmount = parseUnits(toAmount, 18);
      const slippagePercent = slippage[0] / 100;
      const minAmountOut = estimatedOutputAmount * BigInt(Math.floor((1 - slippagePercent) * 100)) / BigInt(100);
      
      await writeContract('buyGold', [], {
        value: parseEther('0.00000000000000000001').toString(),
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
          <div className="flex space-x-2">
            <Dialog open={isPoolDialogOpen} onOpenChange={setIsPoolDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Pool</DialogTitle>
                  <DialogDescription>
                    Create a new liquidity pool with the selected token pair
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">First Token:</span>
                    <span>{fromToken}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Second Token:</span>
                    <span>{toToken}</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreatePool} 
                    disabled={isTransactionLoading || !isConnected || fromToken === toToken}
                  >
                    {isTransactionLoading ? 'Creating Pool...' : 'Create Pool'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
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
