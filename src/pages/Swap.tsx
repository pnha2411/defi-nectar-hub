
import React from 'react';
import { Layout } from '@/components/Layout';
import { SwapInterface } from '@/components/SwapInterface';
import { TokenPriceCard } from '@/components/TokenPriceCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const Swap = () => {
  const popularTokens = [
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: 3478.52, 
      change: 2.34, 
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' 
    },
    { 
      name: 'USD Coin', 
      symbol: 'USDC', 
      price: 1.00, 
      change: 0.01, 
      iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' 
    },
    { 
      name: 'Tether', 
      symbol: 'USDT', 
      price: 1.00, 
      change: 0.00, 
      iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png' 
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 order-2 md:order-1">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Market Overview</CardTitle>
                <CardDescription>Latest market prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {popularTokens.map((token) => (
                    <TokenPriceCard
                      key={token.symbol}
                      name={token.name}
                      symbol={token.symbol}
                      price={token.price}
                      change={token.change}
                      iconUrl={token.iconUrl}
                      className="shadow-none border-0 hover:bg-accent/50"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Swap Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">Low Slippage:</span>
                    <span>Set lower slippage for stablecoins (0.1-0.5%) and higher for volatile tokens (1-2%).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">Gas Fees:</span>
                    <span>Transactions during high network congestion will have higher gas fees.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-foreground">Price Impact:</span>
                    <span>Large swaps may have higher price impact. Consider breaking into smaller transactions.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex-1 order-1 md:order-2 md:max-w-[500px]">
          <SwapInterface />
        </div>
      </div>
    </Layout>
  );
};

export default Swap;
