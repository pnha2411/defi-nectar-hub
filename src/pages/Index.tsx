
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Repeat, TrendingUp, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <section className="py-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <img 
                src="leofi.png" 
                alt="LeoFi Logo" 
                className="h-20 w-auto mb-2" 
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-leon bg-clip-text text-transparent">LeoFi</span> Defi Kit 
            </h1>
            <p className="text-muted-foreground text-lg">
              Swap, earn, and manage your assets with a simple and secure decentralized platform
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-leon hover:opacity-90 gap-2 border-0">
                <Link to="/swap">
                  Start Swapping <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-leon-orange text-leon-orange hover:bg-leon-orange/10">
                <Link to="/wallet">Connect Wallet</Link>
              </Button>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Swap" 
              description="Exchange your tokens at the best rates with minimal fees"
              icon={<Repeat className="h-10 w-10 text-leon-red" />}
              link="/swap"
            />
            <FeatureCard 
              title="Earn" 
              description="Provide liquidity and earn returns on your assets"
              icon={<TrendingUp className="h-10 w-10 text-leon-orange" />}
              link="/earn"
            />
            <FeatureCard 
              title="Wallet" 
              description="Connect and manage your crypto assets securely"
              icon={<Wallet className="h-10 w-10 text-leon-dark-orange" />}
              link="/wallet"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ title, description, icon, link }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  link: string;
}) => (
  <Card className="bg-card hover:bg-muted/50 transition-colors border-2 border-muted hover:border-leon-orange/20">
    <CardHeader>
      <div className="mb-2">{icon}</div>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild variant="ghost" className="gap-2 hover:gap-3 transition-all pl-0 hover:pl-1 text-leon-orange hover:text-leon-red">
        <Link to={link}>
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default Index;
