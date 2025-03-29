
import { createPublicClient, http, parseAbi, parseUnits, PublicClient, formatUnits } from 'viem';
import { kitABI } from './kit';
import { somnia_testnet } from './wagmi';
import { toast } from 'sonner';
import { saveTransaction as saveTransactionToStorage } from '@/api/transactions';

// Initialize public client
export const publicClient = createPublicClient({
  chain: somnia_testnet,
  transport: http(),
});

export interface TransactionRequest {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
  value?: bigint;
}

export interface TransactionResponse {
  hash: `0x${string}`;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export interface TransactionDetails {
  hash: string;
  from: string;
  to: string;
  functionName: string;
  args: string;
  value: string;
  status: 'pending' | 'success' | 'error';
  timestamp: string;
  type: 'send' | 'receive' | 'swap' | 'addLiquidity' | 'removeLiquidity' | 'createPool';
  amount?: string;
  token?: string;
  toToken?: string;
}

// Contract addresses
export const kitContractAddress = '0xA1F002bf7cAD148a639418D77b93912871901875';

export const saveTransaction = async (txDetails: TransactionDetails) => {
  try {
    // Use the function from api/transactions.ts
    return await saveTransactionToStorage(txDetails);
  } catch (error) {
    console.error('Error saving transaction:', error);
    return null;
  }
};

export const mapFunctionToType = (functionName: string): TransactionDetails['type'] => {
  switch (functionName) {
    case 'swap':
      return 'swap';
    case 'addLiquidity':
      return 'addLiquidity';
    case 'removeLiquidity':
      return 'removeLiquidity';
    case 'createPool':
      return 'createPool';
    case 'transfer':
    case 'transferFrom':
      return 'send';
    default:
      return 'send';
  }
};

export const getExplorerUrl = (txHash: string) => {
  return `https://shannon-explorer.somnia.network/tx/${txHash}`;
};

export const getAddressExplorerUrl = (address: string) => {
  return `https://shannon-explorer.somnia.network/address/${address}`;
};

// Wait for transaction to be mined and get receipt
export const waitForTransaction = async (
  client: PublicClient,
  hash: `0x${string}`
): Promise<{ status: 'success' | 'error'; receipt: any }> => {
  try {
    const receipt = await client.waitForTransactionReceipt({ hash });
    return {
      status: receipt.status === 'success' ? 'success' : 'error',
      receipt
    };
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    return {
      status: 'error',
      receipt: null
    };
  }
};
