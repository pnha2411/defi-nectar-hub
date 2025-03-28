
import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { 
  publicClient, 
  waitForTransaction, 
  saveTransaction, 
  TransactionDetails, 
  mapFunctionToType 
} from '@/lib/contractUtils';
import { parseEther, formatEther } from 'viem';
import { toast } from 'sonner';

interface UseContractWriteProps {
  address: `0x${string}`;
  abi: any;
}

interface WriteContractConfig {
  value?: string;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export function useContractWrite({ address, abi }: UseContractWriteProps) {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  
  const writeContract = async (
    functionName: string, 
    args: any[],
    config?: WriteContractConfig
  ) => {
    if (!walletClient) {
      toast.error('Wallet not connected');
      return null;
    }
    
    setIsLoading(true);
    setStatus('pending');
    
    try {
      // Prepare the transaction with the specified arguments
      const hash = await walletClient.writeContract({
        address,
        abi,
        functionName,
        args,
        value: config?.value ? parseEther(config.value) : undefined,
      });
      
      setHash(hash);
      
      // Show toast notification for pending transaction
      const toastId = toast.loading('Transaction pending', {
        description: 'Your transaction is being processed',
      });
      
      // Save transaction details to Supabase
      const fromAddress = walletClient.account.address;
      const txDetails: TransactionDetails = {
        hash: hash,
        from: fromAddress,
        to: address,
        functionName,
        args: JSON.stringify(args),
        value: config?.value || '0',
        status: 'pending',
        timestamp: new Date().toISOString(),
        type: mapFunctionToType(functionName),
      };
      
      // Determine amount and token based on the function
      if (functionName === 'swap') {
        txDetails.amount = String(args[2]);
        txDetails.token = String(args[0]);
        txDetails.toToken = String(args[1]);
      } else if (functionName === 'addLiquidity' || functionName === 'removeLiquidity') {
        txDetails.token = String(args[0]);
        txDetails.toToken = String(args[1]);
        if (args[2]) {
          txDetails.amount = String(args[2]);
        }
      } else if (functionName === 'createPool') {
        txDetails.token = String(args[0]);
        txDetails.toToken = String(args[1]);
      }
      
      await saveTransaction(txDetails);
      
      // Wait for the transaction to be mined
      const receipt = await waitForTransaction(publicClient, hash);
      
      if (receipt.status === 'success') {
        setStatus('success');
        toast.success('Transaction successful', {
          id: toastId,
          description: 'Your transaction has been processed successfully',
        });
        
        // Update transaction status in Supabase
        txDetails.status = 'success';
        await saveTransaction(txDetails);
        
        config?.onSuccess?.(hash);
      } else {
        setStatus('error');
        toast.error('Transaction failed', {
          id: toastId,
          description: 'Your transaction has failed. Please try again.',
        });
        
        // Update transaction status in Supabase
        txDetails.status = 'error';
        await saveTransaction(txDetails);
      }
      
      return hash;
    } catch (error) {
      console.error('Contract write error:', error);
      setStatus('error');
      
      toast.error('Transaction failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      
      config?.onError?.(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    writeContract,
    isLoading,
    hash,
    status,
  };
}
