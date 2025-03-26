
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

export const WalletConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const mockWallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '📱' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'phantom', name: 'Phantom', icon: '👻' },
  ];

  const connectWallet = (walletId: string) => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      // Mock wallet address 
      const mockAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setIsConnecting(false);
      setDialogOpen(false);
      
      toast.success('Wallet connected successfully', {
        description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`,
      });
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    
    toast.info('Wallet disconnected', {
      description: 'Your wallet has been disconnected',
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address copied to clipboard');
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <>
      {isConnected ? (
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-accent/50 border border-accent hover:bg-accent"
            onClick={() => setDialogOpen(true)}
          >
            <div className="w-2 h-2 rounded-full bg-defi-green mr-2 animate-pulse-soft"></div>
            <span className="hidden sm:inline mr-1">Connected:</span>
            <span className="font-mono" onClick={copyAddress}>{formatAddress(walletAddress)}</span>
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
                  disabled={isConnecting}
                >
                  <div className="mr-3 text-xl">{wallet.icon}</div>
                  <span>{wallet.name}</span>
                  {isConnecting && (
                    <div className="ml-auto">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  )}
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
      {isConnected && (
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
                <div className="font-mono text-sm">{formatAddress(walletAddress)}</div>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  Copy
                </Button>
              </div>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start hover-scale">
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
