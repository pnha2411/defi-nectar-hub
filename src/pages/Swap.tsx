
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SwapInterface } from '@/components/SwapInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { FundCard } from '@/components/FundCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiquidityPoolManagement } from '@/components/LiquidityPoolManagement';

const Swap = () => {
  const [activeTab, setActiveTab] = useState('swap');
  
  // Sample fund data
  const funds = [
    {
      name: "Leon Growth Fund",
      description: "High-growth investment portfolio",
      apy: 12.5,
      tvl: "$2.4M",
      status: "active" as const,
      category: "growth" as const
    },
    {
      name: "Stable Yield Fund",
      description: "Low-risk stable returns",
      apy: 5.8,
      tvl: "$4.7M", 
      status: "active" as const,
      category: "stable" as const
    },
    {
      name: "Yield Maximizer",
      description: "Optimized for maximum yields",
      apy: 18.2,
      tvl: "$1.1M",
      status: "pending" as const,
      category: "yield" as const
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="flex-1 order-1 md:order-2 md:max-w-[500px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="swap">
              <SwapInterface />
            </TabsContent>
            
            <TabsContent value="liquidity">
              <LiquidityPoolManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Swap;
