
import React from 'react';
import { Layout } from '@/components/Layout';
import { PortfolioChart } from '@/components/PortfolioChart';
import { TokenPriceCard } from '@/components/TokenPriceCard';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

const Index = () => {
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
    { 
      name: 'Base', 
      symbol: 'BASE', 
      price: 2.87, 
      change: 5.21, 
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' 
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 md:max-w-[65%]">
              <PortfolioChart className="h-full" />
            </div>
            <div className="flex-1 md:max-w-[35%]">
              <TransactionHistory className="h-full" />
            </div>
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Popular Tokens</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularTokens.map((token) => (
              <TokenPriceCard
                key={token.symbol}
                name={token.name}
                symbol={token.symbol}
                price={token.price}
                change={token.change}
                iconUrl={token.iconUrl}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
