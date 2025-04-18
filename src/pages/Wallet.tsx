
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Copy, Send, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccount, useBalance, useWalletClient } from 'wagmi';
import { TransactionHistory } from '@/components/TransactionHistory';
import { kitContractAddress } from '@/lib/contractUtils';
import { kitABI } from '@/lib/kit';
import { useContractWrite } from '@/hooks/useContractWrite';
import { BASE_TOKENS, parseTokenAmount } from '@/lib/erc20contract';

interface Asset {
  name: string;
  symbol: string;
  balance: number;
  value: number;
  iconUrl: string;
  address?: string;
}

const Wallet = () => {
  const [activeDialog, setActiveDialog] = useState<'send' | 'receive' | null>(null);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Get wallet address and balance from wagmi
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({
    address,
  });
  
  // Contract write hook
  const { writeContract, isLoading: isTransactionLoading } = useContractWrite({
    address: kitContractAddress as `0x${string}`,
    abi: kitABI,
  });
  
  const assets: Asset[] = [
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      balance: ethBalance ? parseFloat(ethBalance.formatted) : 0, 
      value: ethBalance ? parseFloat(ethBalance.formatted) * 3480.65 : 0, 
      iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      address: BASE_TOKENS.ETH.address as string
    },
    { 
      name: 'USD Coin', 
      symbol: 'USDC', 
      balance: 1235.75, 
      value: 1235.75, 
      iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      address: BASE_TOKENS.USDC.address as string
    },
    { 
      name: 'Somnia', 
      symbol: 'STT', 
      balance: 75.25, 
      value: 215.97, 
      iconUrl: 'stt.png',
      address: '0x0000000000000000000000000000000000000001' // Replace with actual STT address
    },
  ];

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Get QR code data URL for the connected wallet
  const getQRCodeUrl = () => {
    if (!isConnected || !address) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?data=${address}&size=200x200&margin=10`;
  };
  
  const copyAddress = () => {
    if (!address) {
      toast.error('No wallet connected');
      return;
    }
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  const handleSendDialog = (asset: Asset) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedAsset(asset);
    setActiveDialog('send');
  };

  const handleReceiveDialog = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setActiveDialog('receive');
  };

  const handleSendSubmit = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0) {
      toast.error('Please enter a valid amount and address');
      return;
    }
    
    if (!selectedAsset) {
      toast.error('No asset selected');
      return;
    }
    
    try {
      // For ETH, we use a different approach than ERC20 tokens
      if (selectedAsset.symbol === 'ETH') {
        // Native token transfer is handled separately
        const hash = await writeContract('earnYield', [parseTokenAmount(sendAmount, BASE_TOKENS.ETH)], {
          value: sendAmount,
          onSuccess: (hash) => {
            toast.success('Transaction submitted', {
              description: `Transaction hash: ${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
            });
            setActiveDialog(null);
            setSendAmount('');
            setSendAddress('');
          }
        });
      } else {
        // ERC20 token transfer
        // This is a mock for now - in a real implementation you'd need the ERC20 contract
        toast.success('Transaction initiated', {
          description: `Sending ${sendAmount} ${selectedAsset.symbol} to ${sendAddress.substring(0, 6)}...${sendAddress.substring(sendAddress.length - 4)}`,
        });
        
        setActiveDialog(null);
        setSendAmount('');
        setSendAddress('');
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Transaction failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Your Wallet</h1>
          <p className="text-muted-foreground">
            Manage your assets and transactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Your Assets</CardTitle>
                  <CardDescription>Total portfolio value</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <WalletIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Connect your wallet</h3>
                  <p className="text-muted-foreground mb-4">Connect your wallet to view your assets and balance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/80">
                          <img 
                            src={asset.iconUrl} 
                            alt={`${asset.symbol} icon`}
                            className="w-6 h-6"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/200x200/EAEAEA/6366F1?text=" + asset.symbol.substring(0, 2);
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">{asset.balance.toLocaleString()} {asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSendDialog(asset)}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Wallet Address</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                {!isConnected ? (
                  <div className="text-center py-3">
                    <p className="text-muted-foreground text-sm">Connect your wallet to view your address</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm overflow-hidden">
                    <span className="font-mono truncate">{address}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 ml-1 flex-shrink-0" onClick={copyAddress}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-20 px-2 py-1 hover:bg-accent hover:border-primary/30"
                  onClick={() => handleSendDialog(assets[0])}
                  disabled={!isConnected}
                >
                  <Send className="h-5 w-5 mb-1" />
                  <span className="text-xs">Send</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-20 px-2 py-1 hover:bg-accent hover:border-primary/30"
                  onClick={handleReceiveDialog}
                  disabled={!isConnected}
                >
                  <ArrowDownRight className="h-5 w-5 mb-1" />
                  <span className="text-xs">Receive</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <TransactionHistory limit={5} />
      </div>

      {/* Send Dialog */}
      <Dialog open={activeDialog === 'send'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send {selectedAsset?.symbol}</DialogTitle>
            <DialogDescription>
              Send tokens to another wallet address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input 
                id="recipient" 
                placeholder="Enter wallet address" 
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount</Label>
                <span className="text-xs text-muted-foreground">
                  Available: {selectedAsset?.balance} {selectedAsset?.symbol}
                </span>
              </div>
              <div className="flex gap-2">
                <Input 
                  id="amount" 
                  placeholder="0.00" 
                  value={sendAmount}
                  onChange={(e) => {
                    if (/^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
                      setSendAmount(e.target.value);
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  className="w-20 flex-shrink-0"
                  onClick={() => selectedAsset && setSendAmount(selectedAsset.balance.toString())}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleSendSubmit}>
              Send {selectedAsset?.symbol}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={activeDialog === 'receive'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Tokens</DialogTitle>
            <DialogDescription>
              Share your address to receive tokens.
            </DialogDescription>
          </DialogHeader>
          {isConnected && address ? (
            <div className="flex flex-col items-center py-4">
              <div className="bg-muted/50 p-6 rounded-lg mb-4">
                <div className="w-32 h-32 bg-white rounded-lg mb-3">
                  {/* Dynamic QR Code */}
                  <img 
                    src={getQRCodeUrl()} 
                    alt="Wallet QR Code" 
                    className="w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x200/EAEAEA/6366F1?text=QR";
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center space-x-2">
                <Input value={address} readOnly />
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">Please connect your wallet first</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Wallet;
