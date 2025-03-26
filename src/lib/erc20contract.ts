
import { Address, erc20Abi, parseUnits } from 'viem';

// ERC-20 Contract Interface
export interface IERC20 {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
}

// Define some common tokens on Base
export const BASE_TOKENS: Record<string, IERC20> = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC address
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // ETH is native, so this is a placeholder
  },
  BASE: {
    name: 'Base',
    symbol: 'BASE',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder as BASE doesn't have a standard ERC20 token
  },
  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // Base USDT address
  }
};

// Token functions
export const parseTokenAmount = (amount: string, token: IERC20) => {
  return parseUnits(amount, token.decimals);
};

// ABI and functions
export const erc20ABI = erc20Abi;
