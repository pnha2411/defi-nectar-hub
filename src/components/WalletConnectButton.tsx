
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const WalletConnectButton: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
  });

  const mockWallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '📱' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'phantom', name: 'Phantom', icon: '👻' },
  ];

  const connectWallet = (walletId: string) => {
    try {
      // Currently only supporting MetaMask
      if (walletId === 'metamask') {
        connect({ connector: injected() });
        setDialogOpen(false);
        
        toast.success('Wallet connected successfully', {
          description: address ? `Connected to ${formatAddress(address)}` : undefined,
        });
      } else {
        toast.info('Coming soon', {
          description: 'This wallet option will be supported in the future.',
        });
      }
    } catch (error) {
      toast.error('Failed to connect wallet', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setDialogOpen(false);
    
    toast.info('Wallet disconnected', {
      description: 'Your wallet has been disconnected',
    });
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <>
      {isConnected && address ? (
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-accent/50 border border-accent hover:bg-accent"
            onClick={() => setDialogOpen(true)}
          >
            <div className="w-2 h-2 rounded-full bg-defi-green mr-2 animate-pulse-soft"></div>
            <span className="hidden sm:inline mr-1">Connected:</span>
            <span className="font-mono" onClick={copyAddress}>{formatAddress(address)}</span>
          </Button>
        </div>
      ) : (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span>Connect</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Connect your wallet to access DeFi features
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {mockWallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="justify-start h-14 px-4 py-3 hover-scale"
                  onClick={() => connectWallet(wallet.id)}
                >
                  <div className="mr-3 text-xl">{wallet.icon}</div>
                  <span>{wallet.name}</span>
                </Button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              By connecting a wallet, you agree to Base DeFi's Terms of Service
            </p>
          </DialogContent>
        </Dialog>
      )}

      {/* Wallet Details Dialog */}
      {isConnected && address && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Wallet Connected</DialogTitle>
              <DialogDescription>
                Manage your connected wallet
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center justify-between px-1 py-2 rounded-lg bg-muted/50 mb-4">
                <div className="font-mono text-sm">{formatAddress(address)}</div>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  Copy
                </Button>
              </div>
              {balanceData && (
                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 mb-4">
                  <span className="text-sm font-medium">Balance:</span>
                  <span className="font-medium">
                    {parseFloat(balanceData.formatted).toFixed(0)} STT
                  </span>
                </div>
              )}
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start hover-scale"
                  onClick={() => {
                    if (address) {
                      window.open(`https://shannon-explorer.somnia.network/address/${address}`, '_blank');
                    }
                  }}
                >
                  View on Explorer
                </Button>
                <Button variant="destructive" onClick={disconnectWallet}>
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
