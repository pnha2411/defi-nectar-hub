
import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCw
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: string;
  token: string;
  toToken?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  address: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'send',
    amount: '0.25',
    token: 'ETH',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: 'completed',
    address: '0x71C7...976F'
  },
  {
    id: 'tx2',
    type: 'receive',
    amount: '500',
    token: 'USDC',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'completed',
    address: '0x89B2...A45D'
  },
  {
    id: 'tx3',
    type: 'swap',
    amount: '100',
    token: 'USDT',
    toToken: 'ETH',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'completed',
    address: 'swap'
  },
  {
    id: 'tx4',
    type: 'send',
    amount: '0.5',
    token: 'ETH',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: 'failed',
    address: '0x62A1...B78C'
  }
];

interface TransactionHistoryProps {
  className?: string;
  limit?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  className,
  limit = 5
}) => {
  const transactions = mockTransactions.slice(0, limit);
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your recent transaction history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    tx.type === 'send' ? "bg-orange-100 text-orange-600" : 
                    tx.type === 'receive' ? "bg-green-100 text-green-600" : 
                    "bg-blue-100 text-blue-600"
                  )}>
                    {tx.type === 'send' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : tx.type === 'receive' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <RotateCw className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {tx.type === 'send' ? 'Sent' : 
                       tx.type === 'receive' ? 'Received' : 
                       'Swapped'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.type === 'swap' 
                        ? `${tx.amount} ${tx.token} → ${tx.toToken}`
                        : `To: ${tx.address}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "font-medium",
                    tx.type === 'send' ? "text-red-600" : 
                    tx.type === 'receive' ? "text-green-600" : 
                    ""
                  )}>
                    {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}{tx.amount} {tx.token}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <span className="text-muted-foreground">
                      {formatTime(tx.timestamp)}
                    </span>
                    <Badge 
                      variant={tx.status === 'completed' ? 'outline' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-[10px] px-1.5 py-0 h-auto font-normal"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
