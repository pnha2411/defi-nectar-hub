
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccount, useBalance } from 'wagmi';
import { toast } from 'sonner';
import { ArrowDownUp, Plus, Minus } from 'lucide-react';
import { BASE_TOKENS } from '@/lib/erc20contract';

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  iconUrl: string;
  balance?: string;
}

export const LiquidityPoolManagement = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [token1, setToken1] = useState<string>(Object.keys(BASE_TOKENS)[0]);
  const [token2, setToken2] = useState<string>(Object.keys(BASE_TOKENS)[1]);
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');
  const [removePercent, setRemovePercent] = useState('50');
  
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });

  // List of available tokens
  const tokenList: TokenInfo[] = Object.entries(BASE_TOKENS).map(([symbol, token]) => ({
    name: token.name,
    symbol,
    address: token.address,
    iconUrl: `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`,
  }));

  const handleTokenSwap = () => {
    const temp = token1;
    setToken1(token2);
    setToken2(temp);
    
    // Also swap the amounts
    const tempAmount = token1Amount;
    setToken1Amount(token2Amount);
    setToken2Amount(tempAmount);
  };

  const calculateSecondTokenAmount = (amount: string) => {
    // For demo purposes, we'll use a simple 1:2 ratio
    if (!amount || isNaN(parseFloat(amount))) {
      return '';
    }
    
    const ratio = token1 === 'ETH' ? 2 : 0.5;
    return (parseFloat(amount) * ratio).toFixed(6).toString();
  };

  const handleToken1AmountChange = (amount: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(amount)) {
      setToken1Amount(amount);
      setToken2Amount(calculateSecondTokenAmount(amount));
    }
  };

  const handleToken2AmountChange = (amount: string) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(amount)) {
      setToken2Amount(amount);
      setToken1Amount(calculateSecondTokenAmount(amount));
    }
  };

  const handleAddLiquidity = () => {
    if (!token1Amount || !token2Amount || parseFloat(token1Amount) <= 0 || parseFloat(token2Amount) <= 0) {
      toast.error('Please enter valid amounts');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    toast.success('Liquidity provision initiated', {
      description: `Adding ${token1Amount} ${token1} and ${token2Amount} ${token2} to the pool`,
    });
    
    // Reset form
    setToken1Amount('');
    setToken2Amount('');
  };

  const handleRemoveLiquidity = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    toast.success('Liquidity removal initiated', {
      description: `Removing ${removePercent}% of your ${token1}/${token2} liquidity`,
    });
  };

  // Predefined percentages for removal slider
  const percentOptions = ['25', '50', '75', '100'];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Liquidity Pool</CardTitle>
        <CardDescription>
          Add or remove liquidity to earn fees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="add" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Liquidity
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex items-center gap-1">
              <Minus className="h-4 w-4" /> Remove Liquidity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4 mt-2">
            <div className="space-y-4">
              {/* First Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="token1-amount">First Token</Label>
                  {isConnected && (
                    <span className="text-xs text-muted-foreground">
                      Balance: {token1 === 'ETH' && balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0'} {token1}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="token1-amount"
                      placeholder="0.0"
                      value={token1Amount}
                      onChange={(e) => handleToken1AmountChange(e.target.value)}
                      className="pr-16"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 h-7 text-xs"
                      onClick={() => token1 === 'ETH' && balanceData && handleToken1AmountChange(balanceData.formatted)}
                    >
                      MAX
                    </Button>
                  </div>
                  <Select value={token1} onValueChange={setToken1}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenList.map((token) => (
                        <SelectItem 
                          key={token.symbol} 
                          value={token.symbol}
                          disabled={token.symbol === token2}
                        >
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Swap Button */}
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-muted h-8 w-8" 
                  onClick={handleTokenSwap}
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Second Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="token2-amount">Second Token</Label>
                  <span className="text-xs text-muted-foreground">
                    Balance: 0 {token2}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="token2-amount"
                      placeholder="0.0"
                      value={token2Amount}
                      onChange={(e) => handleToken2AmountChange(e.target.value)}
                      className="pr-16"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 h-7 text-xs"
                    >
                      MAX
                    </Button>
                  </div>
                  <Select value={token2} onValueChange={setToken2}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenList.map((token) => (
                        <SelectItem 
                          key={token.symbol} 
                          value={token.symbol}
                          disabled={token.symbol === token1}
                        >
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Pool Information */}
              <div className="rounded-lg border p-3 bg-muted/20 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool Rate:</span>
                  <span>1 {token1} = {token1 === 'ETH' ? '2' : '0.5'} {token2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Share of Pool:</span>
                  <span>0.01%</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleAddLiquidity}
              disabled={!isConnected || !token1Amount || !token2Amount || parseFloat(token1Amount) <= 0 || parseFloat(token2Amount) <= 0}
            >
              {isConnected ? 'Add Liquidity' : 'Connect Wallet to Add Liquidity'}
            </Button>
          </TabsContent>
          
          <TabsContent value="remove" className="space-y-4 mt-2">
            <div className="space-y-4">
              {/* Pool Selection */}
              <div className="space-y-2">
                <Label htmlFor="pool-select">Select Pool</Label>
                <Select defaultValue={`${token1}-${token2}`}>
                  <SelectTrigger id="pool-select">
                    <SelectValue placeholder="Select pool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={`${token1}-${token2}`}>{token1}/{token2}</SelectItem>
                    <SelectItem value="ETH-USDC">ETH/USDC</SelectItem>
                    <SelectItem value="USDT-USDC">USDT/USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Pool Information */}
              <div className="rounded-lg border p-3 bg-muted/20 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Pool Tokens:</span>
                  <span>0.0025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pooled {token1}:</span>
                  <span>0.01 {token1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pooled {token2}:</span>
                  <span>{token1 === 'ETH' ? '0.02' : '0.005'} {token2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Pool Share:</span>
                  <span>0.01%</span>
                </div>
              </div>
              
              {/* Removal Amount */}
              <div className="space-y-3">
                <Label>Amount to Remove</Label>
                <div className="flex gap-2">
                  {percentOptions.map((percent) => (
                    <Button
                      key={percent}
                      variant={removePercent === percent ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setRemovePercent(percent)}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You Will Receive:</span>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{(0.01 * parseInt(removePercent) / 100).toFixed(4)} {token1}</span>
                      <span className="text-xs text-muted-foreground">≈ ${(0.01 * parseInt(removePercent) / 100 * 3480.65).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{(token1 === 'ETH' ? 0.02 : 0.005) * parseInt(removePercent) / 100} {token2}</span>
                      <span className="text-xs text-muted-foreground">≈ ${(token1 === 'ETH' ? 0.02 : 0.005) * parseInt(removePercent) / 100 * (token2 === 'USDC' ? 1 : 3480.65)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full"
              onClick={handleRemoveLiquidity}
              disabled={!isConnected}
            >
              {isConnected ? `Remove ${removePercent}% Liquidity` : 'Connect Wallet to Remove Liquidity'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
