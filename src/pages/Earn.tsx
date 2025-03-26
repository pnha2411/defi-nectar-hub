
import React from 'react';
import { Layout } from '@/components/Layout';
import { LiquidityPool } from '@/components/LiquidityPool';

const Earn = () => {
  const liquidityPools = [
    {
      name: 'ETH/USDC',
      tokens: [
        { symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'USDC', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }
      ],
      apy: 5.2,
      tvl: 2450000,
      featured: true
    },
    {
      name: 'BASE/USDT',
      tokens: [
        { symbol: 'BASE', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'USDT', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png' }
      ],
      apy: 7.8,
      tvl: 1350000
    },
    {
      name: 'ETH/BASE',
      tokens: [
        { symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'BASE', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' }
      ],
      apy: 3.5,
      tvl: 980000
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Earn</h1>
          <p className="text-muted-foreground">
            Provide liquidity to earn passive income
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liquidityPools.map((pool, index) => (
            <LiquidityPool
              key={index}
              name={pool.name}
              tokens={pool.tokens}
              apy={pool.apy}
              tvl={pool.tvl}
              featured={pool.featured}
            />
          ))}
        </div>
        
        <div className="bg-muted/40 p-4 rounded-lg">
          <h3 className="font-medium mb-2">How it works</h3>
          <p className="text-sm text-muted-foreground">
            Provide liquidity to pools and earn fees from trades. The APY is based on trading volume and can fluctuate.
            When you provide liquidity, you receive LP tokens that represent your share of the pool.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Earn;
