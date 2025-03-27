
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, Settings, ArrowDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { erc20ABI, BASE_TOKENS } from '@/lib/erc20contract';

export const SwapInterface = () => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState([1.0]);
  const [deadline, setDeadline] = useState('30');
  const [showSettings, setShowSettings] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });
  
  // Read ERC20 token balance if the selected token is not ETH
  const { data: tokenBalanceData } = useReadContract({
    abi: erc20ABI,
    address: BASE_TOKENS[fromToken]?.address as `0x${string}`,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && fromToken !== 'ETH' && !!address,
    }
  });

  const calculateToAmount = (amount: string) => {
    if (!amount) return '';
    
    // For demo purposes, define some mock exchange rates
    const rates: Record<string, Record<string, number>> = {
      'ETH': { 'USDC': 3500, 'USDT': 3500, 'BASE': 350 },
      'USDC': { 'ETH': 0.000286, 'USDT': 1, 'BASE': 0.1 },
      'USDT': { 'ETH': 0.000286, 'USDC': 1, 'BASE': 0.1 },
      'BASE': { 'ETH': 0.00286, 'USDC': 10, 'USDT': 10 },
    };
    
    if (fromToken === toToken) return amount;
    
    const rate = rates[fromToken]?.[toToken] || 0;
    const result = parseFloat(amount) * rate;
    
    return isNaN(result) ? '' : result.toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setFromAmount(value);
      setToAmount(calculateToAmount(value));
    }
  };

  const handleToAmountChange = (value: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setToAmount(value);
      // Reverse calculation (simplified)
      const rate = parseFloat(fromAmount) / parseFloat(toAmount);
      setFromAmount(rate ? (parseFloat(value) * rate).toFixed(6) : '');
    }
  };

  const handleTokenSwap = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Recalculate amounts
    setToAmount(calculateToAmount(fromAmount));
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
    
    toast.success('Swap initiated', {
      description: `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
    });
  };

  const getDisplayBalance = () => {
    if (!isConnected) return '0';
    
    if (fromToken === 'ETH' && balanceData) {
      return parseFloat(balanceData.formatted).toFixed(4);
    }
    
    if (tokenBalanceData) {
      const decimals = BASE_TOKENS[fromToken]?.decimals || 18;
      return (Number(tokenBalanceData) / 10 ** decimals).toFixed(4);
    }
    
    return '0';
  };

  return (
    <Card className="w-full">
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
        {/* Settings Panel */}
        {showSettings && (
          <div className="rounded-lg border p-4 mb-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="slippage">Slippage Tolerance</Label>
                <span className="text-sm font-medium">{slippage[0].toFixed(1)}%</span>
              </div>
              <Slider
                id="slippage"
                min={0.1}
                max={5}
                step={0.1}
                value={slippage}
                onValueChange={setSlippage}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Transaction Deadline</Label>
              <div className="flex space-x-2">
                <Input
                  id="deadline"
                  value={deadline}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setDeadline(e.target.value);
                    }
                  }}
                  className="w-20"
                />
                <span className="text-sm flex items-center">minutes</span>
              </div>
            </div>
          </div>
        )}
        
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="from-amount">From</Label>
            <div className="text-sm text-muted-foreground">
              Balance: {getDisplayBalance()} {fromToken}
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="from-amount"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7"
                onClick={() => {
                  if (fromToken === 'ETH' && balanceData) {
                    handleFromAmountChange(balanceData.formatted);
                  } else if (tokenBalanceData) {
                    const decimals = BASE_TOKENS[fromToken]?.decimals || 18;
                    handleFromAmountChange((Number(tokenBalanceData) / 10 ** decimals).toString());
                  }
                }}
              >
                MAX
              </Button>
            </div>
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(BASE_TOKENS).map((token) => (
                  <SelectItem 
                    key={token} 
                    value={token}
                    disabled={token === toToken}
                  >
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Swap Direction Button */}
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
        
        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="to-amount">To</Label>
            <div className="text-sm text-muted-foreground">
              {/* Could display balance of destination token */}
            </div>
          </div>
          <div className="flex space-x-2">
            <Input
              id="to-amount"
              placeholder="0.0"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              className="flex-1"
            />
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(BASE_TOKENS).map((token) => (
                  <SelectItem 
                    key={token} 
                    value={token}
                    disabled={token === fromToken}
                  >
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Exchange Rate */}
        {fromAmount && toAmount && fromToken !== toToken && (
          <div className="text-sm text-muted-foreground text-center">
            1 {fromToken} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!isConnected || !fromAmount || parseFloat(fromAmount) <= 0}
          onClick={handleSwap}
        >
          {!isConnected 
            ? "Connect Wallet" 
            : !fromAmount || parseFloat(fromAmount) <= 0
              ? "Enter an amount"
              : "Swap"}
        </Button>
      </CardFooter>
    </Card>
  );
};
