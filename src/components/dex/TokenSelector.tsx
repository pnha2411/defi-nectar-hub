
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { BASE_TOKENS, erc20ABI } from '@/lib/erc20contract';

export interface TokenSelectorProps {
  type: 'from' | 'to';
  selectedToken: string;
  onTokenSelect: (token: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  supportedTokens?: Array<string>;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  type,
  selectedToken,
  onTokenSelect,
  amount,
  onAmountChange,
  supportedTokens = ['ETH', 'USDC', 'USDT', 'BASE']
}) => {
  const { address, isConnected } = useAccount();
  
  const { data: balanceData } = useBalance({
    address,
  });
  
  const { data: tokenBalanceData } = useReadContract({
    abi: erc20ABI,
    address: BASE_TOKENS[selectedToken]?.address as `0x${string}`,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && selectedToken !== 'ETH' && !!address,
    }
  });

  const getDisplayBalance = () => {
    if (!isConnected) return '0';
    
    if (selectedToken === 'ETH' && balanceData) {
      return parseFloat(balanceData.formatted).toFixed(4);
    }
    
    if (tokenBalanceData) {
      const decimals = BASE_TOKENS[selectedToken]?.decimals || 18;
      return (Number(tokenBalanceData) / 10 ** decimals).toFixed(4);
    }
    
    return '0';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={`${type}-amount`}>{type === 'from' ? 'From' : 'To'}</Label>
        {type === 'from' && (
          <div className="text-sm text-muted-foreground">
            Balance: {getDisplayBalance()} {selectedToken}
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        {type === 'from' ? (
          <div className="relative flex-1">
            <Input
              id={`${type}-amount`}
              placeholder="0.0"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="pr-16"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7"
              onClick={() => {
                if (selectedToken === 'ETH' && balanceData) {
                  onAmountChange(balanceData.formatted);
                } else if (tokenBalanceData) {
                  const decimals = BASE_TOKENS[selectedToken]?.decimals || 18;
                  onAmountChange((Number(tokenBalanceData) / 10 ** decimals).toString());
                }
              }}
            >
              MAX
            </Button>
          </div>
        ) : (
          <Input
            id={`${type}-amount`}
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="flex-1"
          />
        )}
        
        <Select value={selectedToken} onValueChange={onTokenSelect}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            {supportedTokens.map((token) => (
              <SelectItem 
                key={token} 
                value={token}
              >
                {token}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
