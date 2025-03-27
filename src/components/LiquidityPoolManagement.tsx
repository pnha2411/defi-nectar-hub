
import React from 'react';
import { LiquidityPool } from '@/components/dex/LiquidityPool';
import { toast } from 'sonner';

export const LiquidityPoolManagement = () => {
  const handleAddLiquidity = (tokenA: string, tokenB: string, amountA: string, amountB: string) => {
    toast.success('Liquidity added', {
      description: `Added ${amountA} ${tokenA} and ${amountB} ${tokenB} to the pool`,
    });
  };

  const handleRemoveLiquidity = (tokenA: string, tokenB: string, percent: number) => {
    toast.success('Liquidity removed', {
      description: `Removed ${percent}% of ${tokenA}-${tokenB} liquidity`,
    });
  };

  const handleCreatePool = (tokenA: string, tokenB: string, amountA: string, amountB: string, fee: number) => {
    toast.success('Pool created', {
      description: `Created ${tokenA}-${tokenB} pool with ${fee}% fee and added initial liquidity of ${amountA} ${tokenA} and ${amountB} ${tokenB}`,
    });
  };

  return (
    <LiquidityPool 
      onAddLiquidity={handleAddLiquidity}
      onRemoveLiquidity={handleRemoveLiquidity}
      onCreatePool={handleCreatePool}
    />
  );
};
