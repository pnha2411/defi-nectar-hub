
import React, { useEffect, useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCw,
  Plus,
  Minus,
  Loader2
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
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { getTransactions } from '@/api/transactions';
import { getExplorerUrl, TransactionDetails } from '@/lib/contractUtils';

interface TransactionHistoryProps {
  className?: string;
  limit?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  className,
  limit = 5
}) => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isConnected && address) {
      fetchTransactions();
    }
  }, [address, isConnected, limit]);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const txData = await getTransactions(address!, limit);
      setTransactions(txData || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
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
  
  const getTransactionIcon = (type: TransactionDetails['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'swap':
        return <RotateCw className="h-4 w-4" />;
      case 'addLiquidity':
        return <Plus className="h-4 w-4" />;
      case 'removeLiquidity':
        return <Minus className="h-4 w-4" />;
      case 'createPool':
        return <Plus className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };
  
  const getTransactionLabel = (type: TransactionDetails['type']) => {
    switch (type) {
      case 'send':
        return 'Sent';
      case 'receive':
        return 'Received';
      case 'swap':
        return 'Swapped';
      case 'addLiquidity':
        return 'Added Liquidity';
      case 'removeLiquidity':
        return 'Removed Liquidity';
      case 'createPool':
        return 'Created Pool';
      default:
        return 'Transaction';
    }
  };
  
  const getTransactionBgColor = (type: TransactionDetails['type']) => {
    switch (type) {
      case 'send':
        return "bg-orange-100 text-orange-600";
      case 'receive':
        return "bg-green-100 text-green-600";
      case 'swap':
        return "bg-blue-100 text-blue-600";
      case 'addLiquidity':
        return "bg-purple-100 text-purple-600";
      case 'removeLiquidity':
        return "bg-yellow-100 text-yellow-600";
      case 'createPool':
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  const openExplorer = (txHash: string) => {
    window.open(getExplorerUrl(txHash), '_blank');
  };
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your transaction history
            </CardDescription>
          </div>
          {isConnected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchTransactions}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-8 text-muted-foreground">
            Connect your wallet to view your transactions
          </div>
        ) : loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.hash} 
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 cursor-pointer hover:bg-accent/20 rounded-md px-2"
                onClick={() => openExplorer(tx.hash)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    getTransactionBgColor(tx.type)
                  )}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {getTransactionLabel(tx.type)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.type === 'swap' 
                        ? `${tx.amount} ${tx.token} → ${tx.toToken}`
                        : tx.type === 'addLiquidity' || tx.type === 'removeLiquidity' || tx.type === 'createPool'
                        ? `${tx.token}/${tx.toToken}`
                        : `${tx.amount} ${tx.token}`}
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
                    {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}
                    {tx.amount && tx.token ? `${tx.amount} ${tx.token}` : ''}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <span className="text-muted-foreground">
                      {formatTime(tx.timestamp)}
                    </span>
                    <Badge 
                      variant={tx.status === 'success' ? 'outline' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-[10px] px-1.5 py-0 h-auto font-normal"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
