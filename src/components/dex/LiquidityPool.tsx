
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TokenSelector } from './TokenSelector';
import { Label } from '@/components/ui/label';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export interface LiquidityPoolProps {
  className?: string;
  onAddLiquidity?: (tokenA: string, tokenB: string, amountA: string, amountB: string) => void;
  onRemoveLiquidity?: (tokenA: string, tokenB: string, percent: number) => void;
  onCreatePool?: (tokenA: string, tokenB: string, amountA: string, amountB: string, fee: number) => void;
  defaultTokenA?: string;
  defaultTokenB?: string;
  isLoading?: boolean;
  supportedTokens?: Array<string>;
}

export const LiquidityPool: React.FC<LiquidityPoolProps> = ({
  className,
  onAddLiquidity,
  onRemoveLiquidity,
  onCreatePool,
  defaultTokenA = 'ETH',
  defaultTokenB = 'USDC',
  isLoading = false,
  supportedTokens = ['ETH', 'USDC', 'USDT', 'BASE']
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [tokenA, setTokenA] = useState(defaultTokenA);
  const [tokenB, setTokenB] = useState(defaultTokenB);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [percent, setPercent] = useState(50);
  const [fee, setFee] = useState(0.3); // Default fee percentage
  
  const { isConnected } = useAccount();

  const handleAddLiquidity = () => {
    if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      toast.error('Please enter valid amounts');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (onAddLiquidity) {
      onAddLiquidity(tokenA, tokenB, amountA, amountB);
    } else {
      toast.success('Liquidity added', {
        description: `Added ${amountA} ${tokenA} and ${amountB} ${tokenB} to the pool`,
      });
    }
  };

  const handleRemoveLiquidity = () => {
    if (percent <= 0 || percent > 100) {
      toast.error('Please enter a valid percentage');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (onRemoveLiquidity) {
      onRemoveLiquidity(tokenA, tokenB, percent);
    } else {
      toast.success('Liquidity removed', {
        description: `Removed ${percent}% of ${tokenA}-${tokenB} liquidity`,
      });
    }
  };

  const handleCreatePool = () => {
    if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      toast.error('Please enter valid amounts for initial liquidity');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (onCreatePool) {
      onCreatePool(tokenA, tokenB, amountA, amountB, fee);
    } else {
      toast.success('Pool created', {
        description: `Created ${tokenA}-${tokenB} pool with ${fee}% fee and added initial liquidity of ${amountA} ${tokenA} and ${amountB} ${tokenB}`,
      });
    }
  };

  const poolExists = true; // This would be determined by querying the contract in a real implementation

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Liquidity Pool</CardTitle>
        <CardDescription>Create, add or remove liquidity to earn fees</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="create">Create Pool</TabsTrigger>
            <TabsTrigger value="add">Add Liquidity</TabsTrigger>
            <TabsTrigger value="remove">Remove Liquidity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <TokenSelector
                type="from"
                selectedToken={tokenA}
                onTokenSelect={setTokenA}
                amount={amountA}
                onAmountChange={setAmountA}
                supportedTokens={supportedTokens.filter(token => token !== tokenB)}
              />
              
              <TokenSelector
                type="from"
                selectedToken={tokenB}
                onTokenSelect={setTokenB}
                amount={amountB}
                onAmountChange={setAmountB}
                supportedTokens={supportedTokens.filter(token => token !== tokenA)}
              />
              
              <div className="space-y-2">
                <Label>Fee Tier</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.05, 0.3, 1].map((feeValue) => (
                    <Button 
                      key={feeValue} 
                      variant={fee === feeValue ? "default" : "outline"}
                      onClick={() => setFee(feeValue)}
                    >
                      {feeValue}%
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {fee === 0.05 ? "Best for stable pairs" : 
                   fee === 0.3 ? "Best for most pairs" : 
                   "Best for exotic pairs"}
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>You are creating a new {tokenA}/{tokenB} pool with {fee}% fee. You will be the first liquidity provider.</p>
              </div>
              
              <Button
                className="w-full"
                disabled={!isConnected || !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0 || isLoading}
                onClick={handleCreatePool}
              >
                {!isConnected 
                  ? "Connect Wallet" 
                  : !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0
                    ? "Enter amounts"
                    : isLoading
                      ? "Processing..."
                      : "Create Pool and Add Liquidity"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <TokenSelector
              type="from"
              selectedToken={tokenA}
              onTokenSelect={setTokenA}
              amount={amountA}
              onAmountChange={setAmountA}
              supportedTokens={supportedTokens.filter(token => token !== tokenB)}
            />
            
            <TokenSelector
              type="from"
              selectedToken={tokenB}
              onTokenSelect={setTokenB}
              amount={amountB}
              onAmountChange={setAmountB}
              supportedTokens={supportedTokens.filter(token => token !== tokenA)}
            />
            
            <div className="text-sm text-muted-foreground">
              <p>This pool will earn {poolExists ? fee : 0.3}% of all trades proportional to your share of the pool.</p>
            </div>
            
            <Button
              className="w-full"
              disabled={!isConnected || !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0 || isLoading}
              onClick={handleAddLiquidity}
            >
              {!isConnected 
                ? "Connect Wallet" 
                : !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0
                  ? "Enter amounts"
                  : isLoading
                    ? "Processing..."
                    : "Add Liquidity"}
            </Button>
          </TabsContent>
          
          <TabsContent value="remove" className="space-y-4">
            <div>
              <Label>Pool</Label>
              <div className="flex space-x-2 items-center mt-2 p-4 border rounded-md">
                <div className="font-medium">{tokenA}/{tokenB}</div>
                <div className="ml-auto text-sm text-muted-foreground">Pool share: 0.01%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Amount to remove: {percent}%</Label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((value) => (
                  <Button 
                    key={value} 
                    variant={percent === value ? "default" : "outline"}
                    onClick={() => setPercent(value)}
                  >
                    {value}%
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>You will receive {tokenA} and {tokenB} tokens based on your pool share.</p>
            </div>
            
            <Button
              className="w-full"
              disabled={!isConnected || percent <= 0 || percent > 100 || isLoading}
              onClick={handleRemoveLiquidity}
            >
              {!isConnected 
                ? "Connect Wallet" 
                : isLoading
                  ? "Processing..."
                  : "Remove Liquidity"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
