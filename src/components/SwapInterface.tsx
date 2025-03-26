
import React, { useState, useEffect } from 'react';
import { ArrowDown, Settings } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAccount, useBalance, useWriteContract, useReadContract } from 'wagmi';
import { BASE_TOKENS, erc20ABI, parseTokenAmount } from '@/lib/erc20contract';
import { formatUnits, parseUnits } from 'viem';

interface Token {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  address: string;
  decimals: number;
}

export const SwapInterface: React.FC = () => {
  const { address, isConnected } = useAccount();
  
  const mockTokens: Token[] = [
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      address: BASE_TOKENS.ETH.address,
      decimals: BASE_TOKENS.ETH.decimals
    },
    { 
      id: 'base', 
      name: 'Base', 
      symbol: 'BASE', 
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      address: BASE_TOKENS.BASE.address,
      decimals: BASE_TOKENS.BASE.decimals
    },
    { 
      id: 'usdc', 
      name: 'USD Coin', 
      symbol: 'USDC', 
      iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      address: BASE_TOKENS.USDC.address,
      decimals: BASE_TOKENS.USDC.decimals
    },
    { 
      id: 'usdt', 
      name: 'Tether', 
      symbol: 'USDT', 
      iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      address: BASE_TOKENS.USDT.address,
      decimals: BASE_TOKENS.USDT.decimals
    },
  ];

  const [fromToken, setFromToken] = useState<string>(mockTokens[0].id);
  const [toToken, setToToken] = useState<string>(mockTokens[2].id);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('1750.25');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get token balance using wagmi
  const { data: fromTokenBalance } = useBalance({
    address,
    token: fromToken !== 'eth' && fromToken !== 'base' 
      ? mockTokens.find(t => t.id === fromToken)?.address as `0x${string}` 
      : undefined,
  });

  // Write contract for token transfers
  const { writeContractAsync } = useWriteContract();

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

  const handleMaxClick = () => {
    if (fromTokenBalance) {
      setFromAmount(fromTokenBalance.formatted);
      const newValue = (parseFloat(fromTokenBalance.formatted) * 1750.25).toFixed(2);
      setToAmount(newValue);
    }
  };

  const executeSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);

    try {
      // This is a simulation - in a real app, you would call a swap contract
      if (fromTokenObj && fromTokenObj.id !== 'eth' && fromTokenObj.id !== 'base') {
        // For ERC20 tokens, we need to approve and then swap
        const amount = parseTokenAmount(fromAmount, {
          name: fromTokenObj.name,
          symbol: fromTokenObj.symbol,
          decimals: fromTokenObj.decimals,
          address: fromTokenObj.address as `0x${string}`
        });

        // In a real DeFi app, you would approve a DEX router contract here
        // This is a simplified example
        await writeContractAsync({
          address: fromTokenObj.address as `0x${string}`,
          abi: erc20ABI,
          functionName: 'approve',
          args: [address, amount],
        });

        // After approval, you would call the swap method on the router
        // This is simulated for now
        setTimeout(() => {
          toast.success('Swap executed successfully', {
            description: `Swapped ${fromAmount} ${fromTokenObj?.symbol} for ${toAmount} ${toTokenObj?.symbol}`,
          });
          setIsLoading(false);
        }, 2000);
      } else {
        // For native tokens like ETH/BASE
        // Simulate API call
        setTimeout(() => {
          toast.success('Swap executed successfully', {
            description: `Swapped ${fromAmount} ${fromTokenObj?.symbol} for ${toAmount} ${toTokenObj?.symbol}`,
          });
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Swap error:', error);
      toast.error('Failed to execute swap', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      setIsLoading(false);
    }
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
              Balance: {fromTokenBalance ? parseFloat(fromTokenBalance.formatted).toFixed(4) : '0'} {fromTokenObj?.symbol}
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
              disabled={!isConnected}
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
              {/* Balance would come from wagmi in a real app */}
              Balance: {isConnected ? '0.00' : '0'} {toTokenObj?.symbol}
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
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading || !isConnected}
          onClick={executeSwap}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              Swapping...
            </>
          ) : !isConnected ? 'Connect Wallet to Swap' : 'Swap Tokens'}
        </Button>
      </CardFooter>
    </Card>
  );
};
