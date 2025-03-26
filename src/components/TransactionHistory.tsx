
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  timestamp: Date;
  amount: string;
  token: string;
  fromToken?: string;
  toToken?: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'swap',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    amount: '0.5',
    token: 'ETH',
    fromToken: 'ETH',
    toToken: 'USDC',
    status: 'completed',
    hash: '0x1234...5678'
  },
  {
    id: '2',
    type: 'receive',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    amount: '1200',
    token: 'USDC',
    status: 'completed',
    hash: '0x9876...5432'
  },
  {
    id: '3',
    type: 'send',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    amount: '0.15',
    token: 'ETH',
    status: 'completed',
    hash: '0xabcd...efgh'
  },
  {
    id: '4',
    type: 'swap',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    amount: '500',
    token: 'USDC',
    fromToken: 'USDC',
    toToken: 'ETH',
    status: 'completed',
    hash: '0xijkl...mnop'
  },
];

interface TransactionHistoryProps {
  className?: string;
  limit?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  className,
  limit = 5
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-4 h-4 text-defi-red" />;
      case 'receive':
        return <ArrowDownRight className="w-4 h-4 text-defi-green" />;
      case 'swap':
        return <ArrowLeftRight className="w-4 h-4 text-defi-blue" />;
    }
  };

  const getTransactionText = (tx: Transaction) => {
    switch (tx.type) {
      case 'send':
        return `Sent ${tx.amount} ${tx.token}`;
      case 'receive':
        return `Received ${tx.amount} ${tx.token}`;
      case 'swap':
        return `Swapped ${tx.amount} ${tx.fromToken} for ${tx.toToken}`;
    }
  };

  const getLinkForHash = (hash: string) => {
    return `https://basescan.org/tx/${hash}`;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest account activity</CardDescription>
      </CardHeader>
      <CardContent>
        {mockTransactions.length > 0 ? (
          <div className="space-y-4">
            {mockTransactions.slice(0, limit).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{getTransactionText(tx)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  asChild
                >
                  <a 
                    href={getLinkForHash(tx.hash)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            ))}

            {mockTransactions.length > limit && (
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                View All Transactions
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-2">No transactions yet</p>
            <Button variant="outline" size="sm">
              Make Your First Transaction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
