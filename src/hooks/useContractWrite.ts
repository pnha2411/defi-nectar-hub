
import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { 
  publicClient, 
  waitForTransaction, 
  saveTransaction, 
  TransactionDetails, 
  mapFunctionToType,
  getExplorerUrl
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

// Helper function to safely serialize BigInt values
const serializeBigInt = (value: any): any => {
  if (typeof value === 'bigint') {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  } else if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, serializeBigInt(v)])
    );
  }
  return value;
};

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
        action: {
          label: 'View',
          onClick: () => window.open(getExplorerUrl(hash), '_blank')
        }
      });
      
      // Save transaction details to storage
      const fromAddress = walletClient.account.address;
      
      // Serialize args to prevent BigInt JSON issues
      const serializedArgs = serializeBigInt(args);
      
      const txDetails: TransactionDetails = {
        hash: hash,
        from: fromAddress,
        to: address,
        functionName,
        args: JSON.stringify(serializedArgs),
        value: config?.value || '0',
        status: 'pending',
        timestamp: new Date().toISOString(),
        type: mapFunctionToType(functionName),
      };
      
      // Determine amount and token based on the function
      if (functionName === 'swap') {
        txDetails.amount = typeof serializedArgs[2] === 'object' ? 
          serializeBigInt(serializedArgs[2]) : 
          (serializedArgs[2] ? String(serializedArgs[2]) : '');
        
        txDetails.token = typeof serializedArgs[0] === 'object' ? 
          serializeBigInt(serializedArgs[0]) : 
          (serializedArgs[0] ? String(serializedArgs[0]) : '');
        
        txDetails.toToken = typeof serializedArgs[1] === 'object' ? 
          serializeBigInt(serializedArgs[1]) : 
          (serializedArgs[1] ? String(serializedArgs[1]) : '');
      } else if (functionName === 'addLiquidity' || functionName === 'removeLiquidity') {
        txDetails.token = typeof serializedArgs[0] === 'object' ? 
          serializeBigInt(serializedArgs[0]) : 
          (serializedArgs[0] ? String(serializedArgs[0]) : '');
        
        txDetails.toToken = typeof serializedArgs[1] === 'object' ? 
          serializeBigInt(serializedArgs[1]) : 
          (serializedArgs[1] ? String(serializedArgs[1]) : '');
        
        if (serializedArgs[2]) {
          txDetails.amount = typeof serializedArgs[2] === 'object' ? 
            serializeBigInt(serializedArgs[2]) : 
            String(serializedArgs[2]);
        }
      } else if (functionName === 'createPool') {
        txDetails.token = typeof serializedArgs[0] === 'object' ? 
          serializeBigInt(serializedArgs[0]) : 
          (serializedArgs[0] ? String(serializedArgs[0]) : '');
        
        txDetails.toToken = typeof serializedArgs[1] === 'object' ? 
          serializeBigInt(serializedArgs[1]) : 
          (serializedArgs[1] ? String(serializedArgs[1]) : '');
      }
      
      try {
        await saveTransaction(txDetails);
      } catch (error) {
        console.error('Failed to save transaction to database:', error);
        // Continue execution even if saving to database fails
      }
      
      // Wait for the transaction to be mined
      const receipt = await waitForTransaction(publicClient, hash);
      
      if (receipt.status === 'success') {
        setStatus('success');
        toast.success('Transaction successful', {
          id: toastId,
          description: 'Your transaction has been processed successfully',
          action: {
            label: 'View',
            onClick: () => window.open(getExplorerUrl(hash), '_blank')
          }
        });
        
        // Update transaction status in storage
        txDetails.status = 'success';
        try {
          await saveTransaction(txDetails);
        } catch (error) {
          console.error('Failed to update transaction status:', error);
        }
        
        if (config?.onSuccess) {
          config.onSuccess(hash);
        }
      } else {
        setStatus('error');
        toast.error('Transaction failed', {
          id: toastId,
          description: 'Your transaction has failed. Please try again.',
        });
        
        // Update transaction status in storage
        txDetails.status = 'error';
        try {
          await saveTransaction(txDetails);
        } catch (error) {
          console.error('Failed to update transaction status:', error);
        }
      }
      
      return hash;
    } catch (error) {
      console.error('Contract write error:', error);
      setStatus('error');
      
      toast.error('Transaction failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      
      if (config?.onError && error instanceof Error) {
        config.onError(error);
      }
      
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
