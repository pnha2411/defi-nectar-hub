
import React from 'react';
import { Layout } from '@/components/Layout';
import { LiquidityPool } from '@/components/LiquidityPool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';

const Earn = () => {
  const liquidityPools = [
    {
      id: '1',
      name: 'ETH/USDC',
      tokens: [
        { symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'USDC', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }
      ],
      apy: 4.5,
      tvl: 12500000,
      userLiquidity: 5000,
      userShare: 0.04,
      featured: true
    },
    {
      id: '2',
      name: 'ETH/USDT',
      tokens: [
        { symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'USDT', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png' }
      ],
      apy: 3.8,
      tvl: 8750000
    },
    {
      id: '3',
      name: 'USDC/USDT',
      tokens: [
        { symbol: 'USDC', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
        { symbol: 'USDT', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png' }
      ],
      apy: 2.1,
      tvl: 15000000
    },
    {
      id: '4',
      name: 'ETH/DAI',
      tokens: [
        { symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'DAI', iconUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' }
      ],
      apy: 3.9,
      tvl: 9250000,
      userLiquidity: 2500,
      userShare: 0.027
    },
    {
      id: '5',
      name: 'BASE/USDC',
      tokens: [
        { symbol: 'BASE', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { symbol: 'USDC', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }
      ],
      apy: 5.2,
      tvl: 6400000,
      featured: true
    },
    {
      id: '6',
      name: 'DAI/USDC',
      tokens: [
        { symbol: 'DAI', iconUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' },
        { symbol: 'USDC', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }
      ],
      apy: 1.8,
      tvl: 11000000
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Earn with Base DeFi</h1>
          <p className="text-muted-foreground">
            Provide liquidity to earn trading fees and rewards
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Your Portfolio</CardTitle>
              <CardDescription>Current yield-generating positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Total Value</h3>
                    <p className="text-sm text-muted-foreground">Across all pools</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$7,500.00</div>
                    <div className="text-sm text-defi-green">+$25.78 (24h)</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liquidityPools
                    .filter(pool => pool.userLiquidity && pool.userLiquidity > 0)
                    .map(pool => (
                      <LiquidityPool
                        key={pool.id}
                        name={pool.name}
                        tokens={pool.tokens}
                        apy={pool.apy}
                        tvl={pool.tvl}
                        userLiquidity={pool.userLiquidity}
                        userShare={pool.userShare}
                        featured={pool.featured}
                      />
                    ))}
                </div>
                
                {liquidityPools.filter(pool => pool.userLiquidity && pool.userLiquidity > 0).length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-3">You don't have any active positions</p>
                    <Button>Get Started</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Earning Basics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">How do I earn?</h4>
                  <p className="text-muted-foreground">
                    When you provide liquidity to a pool, you earn a share of trading fees generated from swaps in that pool.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">APY Explained</h4>
                  <p className="text-muted-foreground">
                    Annual Percentage Yield shows your estimated yearly returns based on current trading volume and fees.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Impermanent Loss</h4>
                  <p className="text-muted-foreground">
                    Be aware that price changes between paired assets may lead to impermanent loss. Consider stable pairs for lower risk.
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Pools</h2>
            <TabsList>
              <TabsTrigger value="all">All Pools</TabsTrigger>
              <TabsTrigger value="stable">Stable Pairs</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {liquidityPools.map(pool => (
                <LiquidityPool
                  key={pool.id}
                  name={pool.name}
                  tokens={pool.tokens}
                  apy={pool.apy}
                  tvl={pool.tvl}
                  userLiquidity={pool.userLiquidity}
                  userShare={pool.userShare}
                  featured={pool.featured}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stable">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {liquidityPools
                .filter(pool => pool.name.includes('USDC') || pool.name.includes('USDT') || pool.name.includes('DAI'))
                .filter(pool => !(pool.name === 'ETH/USDC' || pool.name === 'ETH/USDT' || pool.name === 'ETH/DAI' || pool.name === 'BASE/USDC'))
                .map(pool => (
                  <LiquidityPool
                    key={pool.id}
                    name={pool.name}
                    tokens={pool.tokens}
                    apy={pool.apy}
                    tvl={pool.tvl}
                    userLiquidity={pool.userLiquidity}
                    userShare={pool.userShare}
                    featured={pool.featured}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {liquidityPools
                .filter(pool => pool.featured)
                .map(pool => (
                  <LiquidityPool
                    key={pool.id}
                    name={pool.name}
                    tokens={pool.tokens}
                    apy={pool.apy}
                    tvl={pool.tvl}
                    userLiquidity={pool.userLiquidity}
                    userShare={pool.userShare}
                    featured={pool.featured}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Earn;
