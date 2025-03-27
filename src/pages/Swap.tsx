
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SwapCard } from '@/components/dex/SwapCard';
import { LiquidityPool } from '@/components/dex/LiquidityPool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Swap = () => {
  const [activeTab, setActiveTab] = useState('swap');
  
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
              <SwapCard />
            </TabsContent>
            
            <TabsContent value="liquidity">
              <LiquidityPool />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Swap;
